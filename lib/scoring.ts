export const LETTER_VALUES: Record<string, number> = {
  a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8, k: 5,
  l: 1, m: 3, n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1, u: 1, v: 4,
  w: 4, x: 8, y: 4, z: 10,
};

export interface Score {
  valid: boolean;
  total: number;
  letterScore: number;
  wordBonus: number;
}

let wordSet: Set<string> | null = null;

export function setWordSet(words: Set<string>) {
  wordSet = words;
}

export function scoreWord(word: string): Score {
  const w = word.toLowerCase();
  if (!wordSet || !wordSet.has(w))
    return { valid: false, total: 0, letterScore: 0, wordBonus: 0 };
  const letterScore = w
    .split("")
    .reduce((sum, ch) => sum + (LETTER_VALUES[ch] || 0), 0);
  const avgValue = letterScore / 5;
  const wordBonus = Math.round(avgValue * 3);
  return { valid: true, total: letterScore + wordBonus, letterScore, wordBonus };
}
