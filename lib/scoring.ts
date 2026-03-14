import { isValidWord } from "./words";

export const LETTER_VALUES: Record<string, number> = {
  a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8, k: 5,
  l: 1, m: 3, n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1, u: 1, v: 4,
  w: 4, x: 8, y: 4, z: 10,
};

export interface Score {
  valid: boolean;
  letterScore: number;
  allUsedBonus: number;
  total: number;
}

export function scoreWord(word: string, usedAllLetters: boolean): Score {
  const w = word.toLowerCase();
  if (!isValidWord(w)) {
    return { valid: false, letterScore: 0, allUsedBonus: 0, total: 0 };
  }
  const letterScore = w
    .split("")
    .reduce((sum, ch) => sum + (LETTER_VALUES[ch] || 0), 0);
  const allUsedBonus = usedAllLetters ? 5 : 0;
  return {
    valid: true,
    letterScore,
    allUsedBonus,
    total: letterScore + allUsedBonus,
  };
}
