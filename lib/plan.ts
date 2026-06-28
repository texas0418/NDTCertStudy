import { QuestionProgress } from "./types";
import { blockReadiness } from "./store";

export interface ExamPlan {
  dateISO: string;
  daysLeft: number; // calendar days from today; negative if the date has passed
  isToday: boolean;
  isPast: boolean;
  totalQ: number;
  seenQ: number;
  unseenQ: number;
  perDay: number; // new (unseen) questions per day to cover the bank by the date
  readiness: number; // percent answered correctly at least once
}

// Whole-day difference between today and a "YYYY-MM-DD" date, in local time.
export function daysUntil(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(y, (m ?? 1) - 1, d ?? 1);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const MS = 24 * 60 * 60 * 1000;
  return Math.round((target.getTime() - today.getTime()) / MS);
}

export function buildExamPlan(
  dateISO: string | undefined,
  ids: string[],
  progress: Record<string, QuestionProgress>
): ExamPlan | null {
  if (!dateISO) return null;
  const daysLeft = daysUntil(dateISO);
  const totalQ = ids.length;
  const seenQ = ids.filter((id) => (progress[id]?.seen ?? 0) > 0).length;
  const unseenQ = totalQ - seenQ;
  const perDay = daysLeft > 0 ? Math.ceil(unseenQ / daysLeft) : unseenQ;
  return {
    dateISO,
    daysLeft,
    isToday: daysLeft === 0,
    isPast: daysLeft < 0,
    totalQ,
    seenQ,
    unseenQ,
    perDay,
    readiness: blockReadiness(progress, ids),
  };
}

// A short human label for a "YYYY-MM-DD" date, e.g. "Aug 14, 2026".
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const MN = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${MN[(m ?? 1) - 1]} ${d}, ${y}`;
}
