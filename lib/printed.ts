import { Linking } from "react-native";

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
}

const PACKS: Record<string, PrintedPack> = {
  mti: { asin: "B0HJN9VNYG", title: "ASNT MT Level I Practice Question Pack", questions: 285 },
  mtii: { asin: "B0HJNG8VK1", title: "ASNT MT Level II Practice Question Pack", questions: 333 },
  pti: { asin: "B0HJNCPRHT", title: "ASNT PT Level I Practice Question Pack", questions: 285 },
  ptii: { asin: "B0HJN9MKBB", title: "ASNT PT Level II Practice Question Pack", questions: 337 },
  rti: { asin: "B0HKGTMPWY", title: "ASNT RT Level I Practice Question Pack", questions: 287 },
  rtii: { asin: "B0HJYVYBBN", title: "ASNT RT Level II Practice Question Pack", questions: 347 },
  uti: { asin: "B0HJNC59DW", title: "ASNT UT Level I Practice Question Pack", questions: 289 },
  "utii-conventional": { asin: "B0HJNJYXHD", title: "ASNT UT Level II Practice Question Pack", questions: 355 },
  pauti: { asin: "B0HKGX8PNG", title: "ASNT PAUT Level I Practice Question Pack", questions: 287 },
  pautii: { asin: "B0HKH3XXPM", title: "ASNT PAUT Level II Practice Question Pack", questions: 289 },
};

export function printedPackFor(baseKey: string): PrintedPack | undefined {
  return PACKS[baseKey];
}

export async function openPrintedPack(pack: PrintedPack): Promise<void> {
  const url = `https://www.amazon.com/dp/${pack.asin}`;
  try {
    await Linking.openURL(url);
  } catch {
    // A missing browser is not worth an alert; the row simply does nothing.
  }
}
