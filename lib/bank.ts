import utJson from "../assets/bank.json";
import mtJson from "../assets/bank_mpi.json";
import ptJson from "../assets/bank_pt.json";
import rtJson from "../assets/bank_rt.json";
import pt1Json from "../assets/bank_pt1.json";
import mt1Json from "../assets/bank_mt1.json";
import ut1Json from "../assets/bank_ut1.json";
import rt1Json from "../assets/bank_rt1.json";
import { Bank, Block, Question, Unit, Variant } from "./types";

export interface ModuleDef {
  id: string;
  title: string;
  subtitle: string;
  method: string; // short tag, e.g. "UT" / "MT"
  bank: Bank;
}

// The owned-module registry. The shelf, module screen, and sessions are all
// scoped through these. Question ids are globally unique across modules, so
// progress/bookmarks/exams (keyed by id) work without per-module namespacing.
export const MODULES: ModuleDef[] = [
  {
    id: "mti",
    title: "MT Level I",
    subtitle: "Magnetic Particle",
    method: "MT",
    bank: mt1Json as unknown as Bank,
  },
  {
    id: "mtii",
    title: "MT Level II",
    subtitle: "Magnetic Particle",
    method: "MT",
    bank: mtJson as unknown as Bank,
  },
  {
    id: "pti",
    title: "PT Level I",
    subtitle: "Liquid Penetrant",
    method: "PT",
    bank: pt1Json as unknown as Bank,
  },
  {
    id: "ptii",
    title: "PT Level II",
    subtitle: "Liquid Penetrant",
    method: "PT",
    bank: ptJson as unknown as Bank,
  },
  {
    id: "rti",
    title: "RT Level I",
    subtitle: "Radiographic",
    method: "RT",
    bank: rt1Json as unknown as Bank,
  },
  {
    id: "rtii",
    title: "RT Level II",
    subtitle: "Radiographic",
    method: "RT",
    bank: rtJson as unknown as Bank,
  },
  {
    id: "uti",
    title: "UT Level I",
    subtitle: "Conventional",
    method: "UT",
    bank: ut1Json as unknown as Bank,
  },
  {
    id: "utii-conventional",
    title: "UT Level II",
    subtitle: "Conventional",
    method: "UT",
    bank: utJson as unknown as Bank,
  },
];

const DEFAULT_MODULE = MODULES[0];

export function getModule(id?: string): ModuleDef {
  return MODULES.find((m) => m.id === id) ?? DEFAULT_MODULE;
}

export function getBlocks(moduleId?: string): Block[] {
  return getModule(moduleId).bank.blocks;
}

export function getAllQuestions(moduleId?: string): Question[] {
  return getBlocks(moduleId).flatMap((b) => b.questions);
}

export function getQuestionsForBlock(moduleId: string, blockName: string): Question[] {
  if (blockName === "all") return getAllQuestions(moduleId);
  return getBlocks(moduleId).find((b) => b.block === blockName)?.questions ?? [];
}

// Every question across every module (ids are unique). Used by global,
// id-keyed views: saved questions, exam review, and settings totals.
export function getEveryQuestion(): Question[] {
  return MODULES.flatMap((m) => m.bank.blocks.flatMap((b) => b.questions));
}

export function getQuestionById(id: string): Question | undefined {
  return getEveryQuestion().find((q) => q.id === id);
}

// Which module owns a given block key (for back-navigation from results).
export function moduleForBlockKey(blockKey: string): ModuleDef | undefined {
  if (!blockKey || blockKey === "all") return undefined;
  return MODULES.find((m) => m.bank.blocks.some((b) => b.block === blockKey));
}

// Returns the active variant for the chosen unit system.
export function activeVariant(q: Question, unit: Unit): Variant {
  if (q.requiresUnits && q.variants) return q.variants[unit];
  // content is always present when requiresUnits is false
  return q.content as Variant;
}
