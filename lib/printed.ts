import { Linking } from "react-native";
import { SchemeId } from "./bank";

// Printed practice packs on Amazon, one per method and level. These are
// physical paperbacks, so linking out is fine: App Store rules only restrict
// external purchase links for digital content.
//
// Keys are ModuleDef.baseKey (see lib/bank.ts). Same question style as this
// app, published under the pen name R. J. Calder.
export interface PrintedPack {
  asin: string;
  title: string;
  questions: number;
  // "method" packs mirror a single module. "scheme" packs cover the
  // certification scheme and its acceptance standards across every method,
  // so they sit alongside a module rather than duplicating it.
  kind: "method" | "scheme";
}

const PACKS: Record<string, PrintedPack> = {
  mti: { asin: "B0HJN9VNYG", title: "ASNT MT Level I Practice Question Pack", questions: 285, kind: "method" },
  mtii: { asin: "B0HJNG8VK1", title: "ASNT MT Level II Practice Question Pack", questions: 333, kind: "method" },
  pti: { asin: "B0HJNCPRHT", title: "ASNT PT Level I Practice Question Pack", questions: 285, kind: "method" },
  ptii: { asin: "B0HJN9MKBB", title: "ASNT PT Level II Practice Question Pack", questions: 337, kind: "method" },
  rti: { asin: "B0HKGTMPWY", title: "ASNT RT Level I Practice Question Pack", questions: 287, kind: "method" },
  rtii: { asin: "B0HJYVYBBN", title: "ASNT RT Level II Practice Question Pack", questions: 347, kind: "method" },
  uti: { asin: "B0HJNC59DW", title: "ASNT UT Level I Practice Question Pack", questions: 289, kind: "method" },
  "utii-conventional": { asin: "B0HJNJYXHD", title: "ASNT UT Level II Practice Question Pack", questions: 355, kind: "method" },
  pauti: { asin: "B0HKGX8PNG", title: "ASNT PAUT Level I Practice Question Pack", questions: 287, kind: "method" },
  pautii: { asin: "B0HKH3XXPM", title: "ASNT PAUT Level II Practice Question Pack", questions: 289, kind: "method" },
};

// One volume covers the whole ISO 9712 family, because the scheme rules and
// the EN ISO acceptance standards are identical across PCN, CSWIP and CGSB and
// only the certifying body differs. It deliberately holds no method
// fundamentals, so it complements a method pack instead of replacing one.
const ISO_9712_PACK: PrintedPack = {
  asin: "B0HKLNHHHJ",
  title: "ISO 9712 NDT Certification Practice Question Pack",
  questions: 371,
  kind: "scheme",
};

const SCHEME_PACKS: Partial<Record<SchemeId, PrintedPack>> = {
  pcn: ISO_9712_PACK,
  cswip: ISO_9712_PACK,
  cgsb: ISO_9712_PACK,
};

export function printedPackFor(baseKey: string): PrintedPack | undefined {
  return PACKS[baseKey];
}

export function schemePackFor(scheme: SchemeId): PrintedPack | undefined {
  return SCHEME_PACKS[scheme];
}

export async function openPrintedPack(pack: PrintedPack): Promise<void> {
  const url = `https://www.amazon.com/dp/${pack.asin}`;
  try {
    await Linking.openURL(url);
  } catch {
    // A missing browser is not worth an alert; the row simply does nothing.
  }
}
