import utJson from "../assets/bank.json";
import mtJson from "../assets/bank_mpi.json";
import ptJson from "../assets/bank_pt.json";
import rtJson from "../assets/bank_rt.json";
import pt1Json from "../assets/bank_pt1.json";
import mt1Json from "../assets/bank_mt1.json";
import ut1Json from "../assets/bank_ut1.json";
import rt1Json from "../assets/bank_rt1.json";
import paut1Json from "../assets/bank_paut1.json";
import paut2Json from "../assets/bank_paut2.json";
import { Bank, Block, Question, Unit, Variant } from "./types";

// ---- certification schemes ------------------------------------------------

export type SchemeId = "api" | "asnt" | "pcn" | "cswip";

export interface SchemeDef {
  id: SchemeId;
  name: string; // short code
  body: string; // certifying body
  standard: string; // governing standard family
}

export const SCHEMES: SchemeDef[] = [
  { id: "api", name: "API", body: "American Petroleum Institute", standard: "API 1104 / ASME" },
  { id: "asnt", name: "ASNT", body: "American Society for NDT", standard: "SNT-TC-1A / ASME" },
  { id: "pcn", name: "PCN", body: "BINDT", standard: "ISO 9712 / ISO-EN" },
  { id: "cswip", name: "CSWIP", body: "TWI", standard: "ISO 9712 / ISO-EN" },
];

const ALL_SCHEMES: SchemeId[] = ["api", "asnt", "pcn", "cswip"];

// ---- base method x level banks (raw content, scheme-agnostic) -------------

interface BaseDef {
  key: string;
  title: string;
  subtitle: string;
  method: string;
  bank: Bank;
}

// Order: MT, PT, RT, UT, PAUT (each I then II). PAUT groups under UT.
const BASE: BaseDef[] = [
  { key: "mti", title: "MT Level I", subtitle: "Magnetic Particle", method: "MT", bank: mt1Json as unknown as Bank },
  { key: "mtii", title: "MT Level II", subtitle: "Magnetic Particle", method: "MT", bank: mtJson as unknown as Bank },
  { key: "pti", title: "PT Level I", subtitle: "Liquid Penetrant", method: "PT", bank: pt1Json as unknown as Bank },
  { key: "ptii", title: "PT Level II", subtitle: "Liquid Penetrant", method: "PT", bank: ptJson as unknown as Bank },
  { key: "rti", title: "RT Level I", subtitle: "Radiographic", method: "RT", bank: rt1Json as unknown as Bank },
  { key: "rtii", title: "RT Level II", subtitle: "Radiographic", method: "RT", bank: rtJson as unknown as Bank },
  { key: "uti", title: "UT Level I", subtitle: "Conventional", method: "UT", bank: ut1Json as unknown as Bank },
  { key: "utii-conventional", title: "UT Level II", subtitle: "Conventional", method: "UT", bank: utJson as unknown as Bank },
  { key: "pauti", title: "PAUT Level I", subtitle: "Phased Array", method: "PAUT", bank: paut1Json as unknown as Bank },
  { key: "pautii", title: "PAUT Level II", subtitle: "Phased Array", method: "PAUT", bank: paut2Json as unknown as Bank },
];

function baseByKey(key: string): BaseDef | undefined {
  return BASE.find((b) => b.key === key);
}

// ---- block -> scheme scoping (the core / overlay split) -------------------
//
// Method fundamentals are shared by every scheme. Certification rules, codes,
// and acceptance criteria are scheme-bound. Block keys already encode this, so
// blocks are scoped by name. The current code/safety/records/responsibilities
// blocks are API/ASME-flavored, so they start on API; author ISO 9712 and
// SNT-TC-1A overlay blocks for the other schemes over time.
//
// To pin a specific block to specific schemes, add it to BLOCK_SCHEME_OVERRIDES.

const OVERLAY_KEYWORDS = ["codes", "safety", "records", "responsibilit", "general_practice"];

export const BLOCK_SCHEME_OVERRIDES: Record<string, SchemeId[]> = {
  // e.g. pin a future ISO overlay block to PCN + CSWIP:
  // "ut_iso17640": ["pcn", "cswip"],
};

export function schemesForBlock(blockKey: string): SchemeId[] {
  if (BLOCK_SCHEME_OVERRIDES[blockKey]) return BLOCK_SCHEME_OVERRIDES[blockKey];
  const isOverlay = OVERLAY_KEYWORDS.some((k) => blockKey.includes(k));
  return isOverlay ? ["api"] : ALL_SCHEMES;
}

function filterBankForScheme(bank: Bank, scheme: SchemeId): Bank {
  const blocks = bank.blocks.filter((b) => schemesForBlock(b.block).includes(scheme));
  const total = blocks.reduce((n, b) => n + b.questions.length, 0);
  return { ...bank, total_questions: total, block_order: blocks.map((b) => b.block), blocks };
}

// ---- modules: scheme x method x level -------------------------------------

export interface ModuleDef {
  id: string; // `${scheme}-${baseKey}`
  scheme: SchemeId;
  baseKey: string;
  title: string;
  subtitle: string;
  method: string;
  bank: Bank; // filtered to this scheme
}

export const MODULES: ModuleDef[] = (() => {
  const out: ModuleDef[] = [];
  for (const s of SCHEMES) {
    for (const base of BASE) {
      const bank = filterBankForScheme(base.bank, s.id);
      if (bank.blocks.length === 0) continue;
      out.push({
        id: `${s.id}-${base.key}`,
        scheme: s.id,
        baseKey: base.key,
        title: base.title,
        subtitle: base.subtitle,
        method: base.method,
        bank,
      });
    }
  }
  return out;
})();

const DEFAULT_MODULE = MODULES[0];

export function getModule(id?: string): ModuleDef {
  return MODULES.find((m) => m.id === id) ?? DEFAULT_MODULE;
}

export function getScheme(id?: string): SchemeDef {
  return SCHEMES.find((s) => s.id === id) ?? SCHEMES[0];
}

export function modulesForScheme(scheme: SchemeId): ModuleDef[] {
  return MODULES.filter((m) => m.scheme === scheme);
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

// Every unique question (from the base banks; scheme modules reuse these ids).
export function getEveryQuestion(): Question[] {
  return BASE.flatMap((b) => b.bank.blocks.flatMap((bl) => bl.questions));
}

export function getQuestionById(id: string): Question | undefined {
  return getEveryQuestion().find((q) => q.id === id);
}

export function moduleForBlockKey(blockKey: string): ModuleDef | undefined {
  if (!blockKey || blockKey === "all") return undefined;
  return MODULES.find((m) => m.bank.blocks.some((b) => b.block === blockKey));
}

export function activeVariant(q: Question, unit: Unit): Variant {
  if (q.requiresUnits && q.variants) return q.variants[unit];
  return q.content as Variant;
}

// ---- Free tier (scheme-agnostic, sampled from the base method banks) ------

export const FREE_PREVIEW_COUNT = 10;

// What unlocking the full version adds, beyond the free sample. Single source
// of truth for the shelf Free card and the end-of-sample screen.
export const PAID_FEATURES: string[] = [
  "The complete bank for every module, 270 to 355 questions each",
  "Timed mock exams, scored with a topic breakdown",
  "Progress and readiness tracking across all topics",
  "Saved questions and exam history",
];

export interface FreeSet {
  baseKey: string;
  title: string;
  subtitle: string;
  method: string;
  questionIds: string[];
}

export function getFreeSets(): FreeSet[] {
  return BASE.map((b) => {
    const qs = b.bank.blocks.flatMap((bl) => bl.questions);
    return {
      baseKey: b.key,
      title: b.title,
      subtitle: b.subtitle,
      method: b.method,
      questionIds: qs.slice(0, FREE_PREVIEW_COUNT).map((q) => q.id),
    };
  });
}

export function getFreeQuestions(baseKey: string): Question[] {
  const b = baseByKey(baseKey);
  if (!b) return [];
  return b.bank.blocks.flatMap((bl) => bl.questions).slice(0, FREE_PREVIEW_COUNT);
}

export function getFreeBase(baseKey: string): { title: string; method: string } | undefined {
  const b = baseByKey(baseKey);
  return b ? { title: b.title, method: b.method } : undefined;
}
