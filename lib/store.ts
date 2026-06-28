import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AnswerResult, ExamRecord, QuestionProgress, ThemeMode, Unit } from "./types";

const MAX_BOX = 5;

interface AppState {
  unit: Unit;
  themeMode: ThemeMode;
  progress: Record<string, QuestionProgress>;
  bookmarks: string[];
  reported: string[];
  exams: ExamRecord[];
  targetDates: Record<string, string>; // moduleId -> "YYYY-MM-DD"

  setUnit: (u: Unit) => void;
  setThemeMode: (m: ThemeMode) => void;
  recordAnswer: (id: string, result: AnswerResult) => void;
  toggleBookmark: (id: string) => void;
  toggleReport: (id: string) => void;
  addExam: (rec: ExamRecord) => void;
  setTargetDate: (moduleId: string, iso: string | null) => void;
  resetStudy: () => void;
  resetProgress: () => void;
}

function blankProgress(): QuestionProgress {
  return { seen: 0, correct: 0, incorrect: 0, last: null, box: 0 };
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      unit: "imperial",
      themeMode: "system",
      progress: {},
      bookmarks: [],
      reported: [],
      exams: [],
      targetDates: {},

      setUnit: (u) => set({ unit: u }),

      setThemeMode: (m) => set({ themeMode: m }),

      recordAnswer: (id, result) =>
        set((state) => {
          const prev = state.progress[id] ?? blankProgress();
          const next: QuestionProgress = {
            seen: prev.seen + 1,
            correct: prev.correct + (result === "correct" ? 1 : 0),
            incorrect: prev.incorrect + (result === "incorrect" ? 1 : 0),
            last: result,
            box:
              result === "correct"
                ? Math.min(prev.box + 1, MAX_BOX)
                : 0,
          };
          return { progress: { ...state.progress, [id]: next } };
        }),

      toggleBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.includes(id)
            ? state.bookmarks.filter((x) => x !== id)
            : [...state.bookmarks, id],
        })),

      toggleReport: (id) =>
        set((state) => ({
          reported: state.reported.includes(id)
            ? state.reported.filter((x) => x !== id)
            : [...state.reported, id],
        })),

      addExam: (rec) => set((state) => ({ exams: [rec, ...state.exams] })),

      setTargetDate: (moduleId, iso) =>
        set((state) => {
          const next = { ...state.targetDates };
          if (iso) next[moduleId] = iso;
          else delete next[moduleId];
          return { targetDates: next };
        }),

      // Clears study progress, exam history, and reports but keeps saved questions.
      resetStudy: () => set({ progress: {}, reported: [], exams: [] }),

      resetProgress: () =>
        set({ progress: {}, bookmarks: [], reported: [], exams: [], targetDates: {} }),
    }),
    {
      name: "ut2-prep-store-v1",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// ---- derived helpers (pure, take state slices) ----

// Readiness for a block: fraction of its questions answered correctly at least once.
export function blockReadiness(
  progress: Record<string, QuestionProgress>,
  ids: string[]
): number {
  if (ids.length === 0) return 0;
  const known = ids.filter((id) => (progress[id]?.correct ?? 0) > 0).length;
  return Math.round((known / ids.length) * 100);
}

// Order questions for smart practice. Priority, highest first:
//   1. questions whose last answer was wrong (review these first)
//   2. questions never seen
//   3. everything else, by Leitner box (weaker first)
// Equal-priority questions are shuffled so the order varies between sessions.
export function weakFirstOrder(
  progress: Record<string, QuestionProgress>,
  ids: string[]
): string[] {
  function rank(id: string): number {
    const p = progress[id];
    if (p && p.last === "incorrect") return 0; // recently wrong: top priority
    if (!p || p.seen === 0) return 1; // unseen next
    return 2 + (p.box ?? 0); // then by mastery (lower box = weaker = sooner)
  }
  // Shuffle first, then stable-sort by priority so equal-priority questions
  // appear in a fresh order each session while priority is preserved.
  const shuffled = [...ids];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.sort((a, b) => {
    const ra = rank(a);
    const rb = rank(b);
    if (ra !== rb) return ra - rb;
    // tie-break within a tier: more-missed first
    return (progress[b]?.incorrect ?? 0) - (progress[a]?.incorrect ?? 0);
  });
}
