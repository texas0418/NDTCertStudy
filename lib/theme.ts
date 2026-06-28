import { Platform, useColorScheme } from "react-native";
import { useStore } from "./store";
import { ThemeMode } from "./types";

// Sepia & Forest: warm paper case, dark ink, forest-green accent.
// One brand green (accent + correct + high readiness); gold = mid readiness; terracotta = wrong / low.
type ThemeColors = {
  bg: string; bgPanel: string; bgPanelHi: string; bgInput: string;
  border: string; borderHi: string; track: string;
  ink: string; inkSoft: string; muted: string;
  amber: string; amberDim: string; amberText: string; amberBg: string;
  green: string; greenDim: string; greenText: string; greenBg: string;
  gold: string; goldDim: string; goldText: string; goldBg: string;
  red: string; redDim: string; redText: string; redBg: string;
  onAccent: string;
};

function withSemantics(c: ThemeColors) {
  return {
    ...c,
    get paper(): string { return this.bg; },
    get card(): string { return this.bgPanel; },
    get correct(): string { return this.green; },
    get correctDeep(): string { return this.greenDim; },
    get correctText(): string { return this.greenText; },
    get correctBg(): string { return this.greenBg; },
    get wrong(): string { return this.red; },
    get wrongDeep(): string { return this.redDim; },
    get wrongText(): string { return this.redText; },
    get wrongBg(): string { return this.redBg; },
    get amberDeep(): string { return this.amberDim; },
  };
}

// Sepia & Forest (light): warm paper case, dark ink, forest-green accent.
export const lightTheme = withSemantics({
  bg: "#F4EFE4", bgPanel: "#FBF7EE", bgPanelHi: "#FFFFFF", bgInput: "#EDE7D8",
  border: "#E0D8C6", borderHi: "#CFC5AE", track: "#E8E1D2",
  ink: "#211E18", inkSoft: "#5C564A", muted: "#8A8070",
  amber: "#2C6E49", amberDim: "#21543A", amberText: "#1F5235", amberBg: "rgba(44,110,73,0.12)",
  green: "#2C6E49", greenDim: "#21543A", greenText: "#1F5235", greenBg: "rgba(44,110,73,0.13)",
  gold: "#B8862F", goldDim: "#8A6420", goldText: "#7A5612", goldBg: "rgba(184,134,47,0.13)",
  red: "#B23A2E", redDim: "#8C2C22", redText: "#8C2C22", redBg: "rgba(178,58,46,0.12)",
  onAccent: "#FBF7EE",
});

// Sepia & Forest (dark): warm charcoal case, light ink, brightened forest accent.
export const darkTheme = withSemantics({
  bg: "#1B1813", bgPanel: "#232019", bgPanelHi: "#2B271E", bgInput: "#2A2620",
  border: "#39342A", borderHi: "#4C4538", track: "#322E25",
  ink: "#F2ECDE", inkSoft: "#C5BDAB", muted: "#908875",
  amber: "#3F8F63", amberDim: "#2F6E4A", amberText: "#82C79E", amberBg: "rgba(63,143,99,0.18)",
  green: "#3F8F63", greenDim: "#2F6E4A", greenText: "#82C79E", greenBg: "rgba(63,143,99,0.18)",
  gold: "#CFA044", goldDim: "#A87E2C", goldText: "#E2C079", goldBg: "rgba(207,160,68,0.18)",
  red: "#CD6557", redDim: "#A8453A", redText: "#E8978A", redBg: "rgba(205,101,87,0.18)",
  onAccent: "#F2ECDE",
});

export type Theme = typeof lightTheme;

// Back-compat static export (light). Diagram components keep importing this so
// technical figures always render dark-on-light and stay legible in dark mode.
export const theme = lightTheme;

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
  cert_iso9712_core: "Certification: General (ISO 9712)",
  cert_snttc1a_core: "Certification: General (SNT-TC-1A)",
  cert_iso9712_rt: "Certification: RT (ISO 9712)",
  cert_snttc1a_rt: "Certification: RT (SNT-TC-1A)",
  cert_iso9712_mt: "Certification: MT (ISO 9712)",
  cert_snttc1a_mt: "Certification: MT (SNT-TC-1A)",
  cert_iso9712_pt: "Certification: PT (ISO 9712)",
  cert_snttc1a_pt: "Certification: PT (SNT-TC-1A)",
  cert_iso9712_ut: "Certification: UT (ISO 9712)",
  cert_snttc1a_ut: "Certification: UT (SNT-TC-1A)",
  cert_iso9712_paut: "Certification: PAUT (ISO 9712)",
  cert_snttc1a_paut: "Certification: PAUT (SNT-TC-1A)",
  // MT Level II
  mt_principles: "Principles of Magnetism",
  mt_methods: "Magnetization Methods",
  mt_current: "Current & Penetration",
  mt_equipment: "Equipment",
  mt_particles: "Particles & Media",
  mt_field: "Field Strength & Indicators",
  mt_indications: "Indications & Interpretation",
  mt_process: "Process, Lighting & Codes",
  // PT Level II
  pt_principles: "Principles & Physical Concepts",
  pt_materials: "Materials & Classification",
  pt_process: "Process Sequence & Steps",
  pt_removal: "Removal & Emulsification",
  pt_developers: "Developers",
  pt_equipment: "Equipment, Lighting & Control",
  pt_indications: "Indications & Interpretation",
  pt_safety: "Safety, Codes & Applications",
  // RT Level II
  rt_physics: "Radiation Physics & Sources",
  rt_attenuation: "Interaction & Attenuation",
  rt_equipment: "Radiographic Equipment",
  rt_exposure: "Exposure & Image Formation",
  rt_film: "Film Processing & Quality",
  rt_technique: "IQIs & Technique",
  rt_interpretation: "Discontinuities & Interpretation",
  rt_safety: "Radiation Safety & Codes",
  // PT Level I
  pt1_fundamentals: "Fundamentals & Principles",
  pt1_materials: "Materials & Classification",
  pt1_prep: "Surface Preparation & Pre-Cleaning",
  pt1_application: "Application & Dwell",
  pt1_removal: "Excess Removal & Emulsification",
  pt1_developers: "Developers & Development",
  pt1_inspection: "Inspection, Lighting & Indications",
  pt1_safety: "Equipment, Process Control & Safety",
  // MT Level I
  mt1_fundamentals: "Fundamentals & Principles of Magnetism",
  mt1_methods: "Magnetization Methods & Directions",
  mt1_current: "Magnetizing Current & Field",
  mt1_equipment: "Equipment",
  mt1_particles: "Particles & Media",
  mt1_process: "Process & Application Sequence",
  mt1_inspection: "Inspection, Lighting & Indications",
  mt1_safety: "Demagnetization, Equipment Checks & Safety",
  // UT Level I
  ut1_fundamentals: "Fundamentals & Sound Waves",
  ut1_wave: "Wave Behavior & Material Effects",
  ut1_equipment: "Equipment & Transducers",
  ut1_display: "Display, Controls & Couplant",
  ut1_calibration: "Calibration & Reference Standards",
  ut1_straightbeam: "Straight-Beam & Thickness",
  ut1_anglebeam: "Angle-Beam & Scanning",
  ut1_records: "Recording, Process Control & Safety",
  // RT Level I
  rt1_fundamentals: "Fundamentals & Radiation Physics",
  rt1_sources: "Radiation Sources & Equipment",
  rt1_film: "Film & Image Media",
  rt1_exposure: "Exposure & Image Formation",
  rt1_technique: "Geometry, Technique & IQIs",
  rt1_processing: "Film Processing & Image Quality",
  rt1_safety: "Radiation Safety & Protection",
  rt1_records: "Recording, Process Control & Responsibilities",
  // PAUT Level I
  paut1_fundamentals: "Fundamentals & Principles",
  paut1_probes: "Array Probes & Equipment",
  paut1_focallaws: "Focal Laws & Beam Forming",
  paut1_display: "Scan Types & Display",
  paut1_calibration: "Calibration & Setup Verification",
  paut1_scanning: "Scanning Techniques & Coverage",
  paut1_data: "Data Acquisition & Quality",
  paut1_safety: "Safety, Process Control & Responsibilities",
  // PAUT Level II
  paut2_beam: "Beam Behavior & Image Formation",
  paut2_plan: "Scan Plan Design & Coverage",
  paut2_calibration: "Calibration & Sensitivity for Sizing",
  paut2_discontinuities: "Discontinuity Types & PAUT Response",
  paut2_sizing: "Flaw Sizing & Characterization",
  paut2_evaluation: "Evaluation & Acceptance Criteria",
  paut2_data: "Data Analysis, Software & Reporting",
  paut2_responsibilities: "Standards, Procedures & Responsibilities",
};

// Per-method card identity: tint = card surface, accent = badge + action button.
// Readiness colors (green/gold/red) stay method-independent so the gauge reads the same everywhere.
export const lightMethodColors: Record<string, { tint: string; accent: string }> = {
  UT: { tint: "#E4ECF4", accent: "#3A6B92" }, // blue
  MT: { tint: "#E7EFE1", accent: "#5E7E3A" }, // green
  PT: { tint: "#F5E5E1", accent: "#BC5648" }, // coral / penetrant red
  RT: { tint: "#EAE6F2", accent: "#6A4E96" }, // violet
  PAUT: { tint: "#DCEBE8", accent: "#2E7D74" }, // teal
};

export const darkMethodColors: Record<string, { tint: string; accent: string }> = {
  UT: { tint: "#1F2A35", accent: "#4E86B4" },
  MT: { tint: "#232C1D", accent: "#7BA254" },
  PT: { tint: "#34211D", accent: "#CF6E61" },
  RT: { tint: "#272237", accent: "#8E72C0" },
  PAUT: { tint: "#1B2F2C", accent: "#46A89C" },
};

// Back-compat (light).
export const methodColors = lightMethodColors;

// Per-scheme accent (mid-tones that read on light and dark with light label text).
export const schemeAccent: Record<string, string> = {
  api: "#2C6E49", // forest
  asnt: "#3A6B92", // blue
  pcn: "#6A4E96", // violet
  cswip: "#2E7D74", // teal
  cgsb: "#A8472E", // clay
};

// Untouched topics read neutral grey; color only appears once attempted.
// Pass the active theme so the neutral grey matches light/dark.
export function readinessColor(pct: number, attempted: boolean = true, t: Theme = lightTheme): string {
  if (!attempted) return t.muted;
  if (pct >= 75) return t.green;
  if (pct >= 40) return t.gold;
  return t.red;
}

// ---- runtime theming hooks ----

function resolveMode(mode: ThemeMode, sys: "light" | "dark" | null | undefined): "light" | "dark" {
  if (mode === "system") return sys === "dark" ? "dark" : "light";
  return mode;
}

export function useTheme(): Theme {
  const mode = useStore((s) => s.themeMode);
  const sys = useColorScheme();
  return resolveMode(mode, sys) === "dark" ? darkTheme : lightTheme;
}

export function useIsDark(): boolean {
  const mode = useStore((s) => s.themeMode);
  const sys = useColorScheme();
  return resolveMode(mode, sys) === "dark";
}

export function useMethodColors() {
  const mode = useStore((s) => s.themeMode);
  const sys = useColorScheme();
  return resolveMode(mode, sys) === "dark" ? darkMethodColors : lightMethodColors;
}

export function useReadinessColor() {
  const t = useTheme();
  return (pct: number, attempted: boolean = true) => readinessColor(pct, attempted, t);
}
