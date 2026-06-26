export type Difficulty = "easy" | "medium" | "hard";
export type Unit = "imperial" | "metric";

export interface Variant {
  stem: string;
  options: string[];
  answer: number; // index 0-3
  explanation: string;
  distractors: string[]; // aligned to options; "" for the correct one
}

export interface AngleBeamDiagram {
  type: "angle_beam";
  angle: number; // refracted angle in degrees
  thickness?: string; // e.g. "1 in" or "25 mm"; omitted shows "T" with no value
}

export interface AScanDiagram {
  type: "a_scan";
}

export interface BeamProfileDiagram {
  type: "beam_profile";
}

export interface SnellDiagram {
  type: "snell";
}

export interface IIWBlockDiagram {
  type: "iiw_block";
}

export interface ReferenceReflectorsDiagram {
  type: "reference_reflectors";
}

export interface V2BlockDiagram {
  type: "v2_block";
}

export interface StepWedgeDiagram {
  type: "step_wedge";
}

export type DiagramSpec =
  | AngleBeamDiagram
  | AScanDiagram
  | BeamProfileDiagram
  | SnellDiagram
  | IIWBlockDiagram
  | ReferenceReflectorsDiagram
  | V2BlockDiagram
  | StepWedgeDiagram;

export interface Question {
  id: string;
  tier: string;
  topic: string;
  subtopic: string;
  difficulty: Difficulty;
  requiresUnits: boolean;
  diagram: null | DiagramSpec;
  content?: Variant; // present when requiresUnits === false
  variants?: { imperial: Variant; metric: Variant }; // present when requiresUnits === true
}

export interface Block {
  block: string;
  count: number;
  questions: Question[];
}

export interface Bank {
  bank: string;
  tier: string;
  status: string;
  total_questions: number;
  block_order: string[];
  blocks: Block[];
}

export type AnswerResult = "correct" | "incorrect";

export interface QuestionProgress {
  seen: number;
  correct: number;
  incorrect: number;
  last: AnswerResult | null;
  box: number; // Leitner box, higher = better known
}

export interface ExamMiss {
  id: string;
  picked: number | null; // canonical (pre-shuffle) option index, or null if skipped
}

export interface ExamRecord {
  id: string;
  dateISO: string;
  module?: string; // owning module id; absent on legacy (pre-MT) records
  blockKey: string; // "all" or a block name
  score: number;
  total: number;
  byBlock: Record<string, { correct: number; total: number }>;
  missed: ExamMiss[];
}
