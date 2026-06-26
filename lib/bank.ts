import bankJson from "../assets/bank.json";
import { Bank, Block, Question, Unit, Variant } from "./types";

export const bank = bankJson as unknown as Bank;

export function getBlocks(): Block[] {
  return bank.blocks;
}

export function getBlock(blockName: string): Block | undefined {
  return bank.blocks.find((b) => b.block === blockName);
}

export function getAllQuestions(): Question[] {
  return bank.blocks.flatMap((b) => b.questions);
}

export function getQuestionsForBlock(blockName: string): Question[] {
  if (blockName === "all") return getAllQuestions();
  return getBlock(blockName)?.questions ?? [];
}

export function getQuestionById(id: string): Question | undefined {
  return getAllQuestions().find((q) => q.id === id);
}

// Returns the active variant for the chosen unit system.
export function activeVariant(q: Question, unit: Unit): Variant {
  if (q.requiresUnits && q.variants) return q.variants[unit];
  // content is always present when requiresUnits is false
  return q.content as Variant;
}

// Map a block name to the count of its questions.
export function blockCount(blockName: string): number {
  return getBlock(blockName)?.count ?? 0;
}
