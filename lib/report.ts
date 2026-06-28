import Constants from "expo-constants";
import * as MailComposer from "expo-mail-composer";
import { Linking } from "react-native";
import { getModule } from "./bank";
import { Variant } from "./types";

// Where question corrections are sent. A single inbox, no backend.
export const REPORT_EMAIL = "ndt-issues@simonbuilds.app";

export type ReportResult = "composed" | "mailto" | "unavailable";

export interface ReportArgs {
  questionId: string;
  moduleId: string;
  blockKey: string;
  variant: Variant; // the variant as shown (already unit-resolved and shuffled)
  selectedIndex: number | null; // displayed option the user picked, or null
}

function buildReport(args: ReportArgs): { subject: string; body: string } {
  const { questionId, moduleId, blockKey, variant, selectedIndex } = args;
  const m = getModule(moduleId);
  const version = Constants.expoConfig?.version ?? "unknown";
  const correctText = variant.options[variant.answer];
  const pickedText =
    selectedIndex != null && selectedIndex >= 0 ? variant.options[selectedIndex] : "(not answered)";

  const subject = `NDT question report: ${questionId}`;
  // Option text, not letters, since options are shuffled per device.
  const body =
    "What looks wrong? (the keyed answer, an option, or the explanation)\n\n\n" +
    "----- details below identify the question, please leave intact -----\n" +
    `Question ID: ${questionId}\n` +
    `Scheme / module: ${m.scheme.toUpperCase()} ${m.title} (${moduleId})\n` +
    `Block: ${blockKey}\n` +
    `Stem: ${variant.stem}\n` +
    `Keyed answer: ${correctText}\n` +
    `Answer chosen: ${pickedText}\n` +
    `App version: ${version}\n`;
  return { subject, body };
}

// Opens the native mail composer prefilled; falls back to a mailto: link, and
// reports "unavailable" only if neither path can open.
export async function reportQuestion(args: ReportArgs): Promise<ReportResult> {
  const { subject, body } = buildReport(args);

  let available = false;
  try {
    available = await MailComposer.isAvailableAsync();
  } catch {
    available = false;
  }
  if (available) {
    try {
      await MailComposer.composeAsync({ recipients: [REPORT_EMAIL], subject, body });
      return "composed";
    } catch {
      // fall through to mailto
    }
  }

  const url = `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  try {
    await Linking.openURL(url);
    return "mailto";
  } catch {
    return "unavailable";
  }
}
