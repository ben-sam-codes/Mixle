import { seededRandom } from "./rng";

export const LETTER_FREQ: Record<string, number> = {
  a: 8.2, b: 1.5, c: 2.8, d: 4.3, e: 12.7, f: 2.2, g: 2.0, h: 6.1,
  i: 7.0, j: 0.15, k: 0.77, l: 4.0, m: 2.4, n: 6.7, o: 7.5, p: 1.9,
  q: 0.095, r: 6.0, s: 6.3, t: 9.1, u: 2.8, v: 0.98, w: 2.4, x: 0.15,
  y: 2.0, z: 0.074,
};

export function pickWeightedLetter(rng: () => number): string {
  const letters = Object.keys(LETTER_FREQ);
  const weights = letters.map((l) => LETTER_FREQ[l]);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < letters.length; i++) {
    r -= weights[i];
    if (r <= 0) return letters[i];
  }
  return letters[letters.length - 1];
}

export function pickWeightedVowel(rng: () => number): string {
  const vowels = ["a", "e", "i", "o", "u"];
  const weights = vowels.map((v) => LETTER_FREQ[v]);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < vowels.length; i++) {
    r -= weights[i];
    if (r <= 0) return vowels[i];
  }
  return vowels[vowels.length - 1];
}

export function generateAllDraws(seed: number): string[][][] {
  const rng = seededRandom(seed);
  const rounds: string[][][] = [];
  for (let r = 0; r < 3; r++) {
    const draws: string[][] = [];
    for (let step = 0; step < 5; step++) {
      const pool = new Set<string>();
      pool.add(pickWeightedVowel(rng));
      while (pool.size < 4) {
        pool.add(pickWeightedLetter(rng));
      }
      const arr = Array.from(pool);
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      draws.push(arr);
    }
    rounds.push(draws);
  }
  return rounds;
}
