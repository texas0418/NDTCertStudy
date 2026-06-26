import { Variant } from "./types";

// Regenerated each app launch, so option positions re-randomize between sessions
// but stay stable within a session (no reshuffle on re-render).
const SESSION_SALT = Math.random().toString(36).slice(2);

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Deterministic permutation of [0..n-1] for a given question id.
function permFor(qid: string, n: number): number[] {
  const rng = mulberry32(hashStr(qid + SESSION_SALT));
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

// Returns a display variant with options and distractors shuffled together
// and the answer index remapped to the new position of the correct option.
export function shuffledVariant(qid: string, v: Variant): Variant {
  const perm = permFor(qid, v.options.length);
  return {
    stem: v.stem,
    options: perm.map((i) => v.options[i]),
    distractors: perm.map((i) => v.distractors[i]),
    answer: perm.indexOf(v.answer),
    explanation: v.explanation,
  };
}
