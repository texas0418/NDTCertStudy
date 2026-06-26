import { Platform } from "react-native";

// Instrument panel aesthetic: dark steel case, amber + phosphor-green readouts.
export const theme = {
  bg: "#14161A",        // instrument case
  bgPanel: "#1B1F25",   // card / panel surface
  bgPanelHi: "#222831", // raised surface
  bgInput: "#1E232A",

  border: "#2B323B",    // steel hairline
  borderHi: "#3A4350",
  track: "#262D36",     // progress track

  ink: "#EEF2F6",       // bright readout
  inkSoft: "#B7BFC9",
  muted: "#79828D",

  amber: "#FFB020",     // primary accent / readout
  amberDim: "#C8841A",
  amberText: "#FFC961",
  amberBg: "rgba(255,176,32,0.13)",

  green: "#2FE0A0",     // good / ready (phosphor)
  greenDim: "#1E9C70",
  greenText: "#6BF0C2",
  greenBg: "rgba(47,224,160,0.13)",

  red: "#FF5B52",       // low / alarm
  redDim: "#C23A33",
  redText: "#FF9089",
  redBg: "rgba(255,91,82,0.13)",

  // semantic aliases used by option/feedback components
  get paper() { return this.bg; },
  get card() { return this.bgPanel; },
  get correct() { return this.green; },
  get correctDeep() { return this.greenDim; },
  get correctText() { return this.greenText; },
  get correctBg() { return this.greenBg; },
  get wrong() { return this.red; },
  get wrongDeep() { return this.redDim; },
  get wrongText() { return this.redText; },
  get wrongBg() { return this.redBg; },
  get amberDeep() { return this.amberDim; },
};

export const mono = Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }) as string;

export const blockLabels: Record<string, string> = {
  calculations: "Calculations",
  physics: "Physics & Fundamentals",
  equipment: "Equipment",
  calibration: "Calibration",
  techniques: "Techniques",
  flaw_detection: "Flaw Detection & Sizing",
  codes_api1104: "Codes (API 1104)",
  general_practice_safety: "General Practice & Safety",
};

// Untouched topics read neutral grey; color only appears once attempted.
export function readinessColor(pct: number, attempted: boolean = true): string {
  if (!attempted) return theme.muted;
  if (pct >= 75) return theme.green;
  if (pct >= 40) return theme.amber;
  return theme.red;
}
