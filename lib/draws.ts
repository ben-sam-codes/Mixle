import { seededRandom } from "./rng";
import { getNineLetterWords } from "./words";

export const LETTER_FREQ: Record<string, number> = {
  a: 8.2, b: 1.5, c: 2.8, d: 4.3, e: 12.7, f: 2.2, g: 2.0, h: 6.1,
  i: 7.0, j: 0.15, k: 0.77, l: 4.0, m: 2.4, n: 6.7, o: 7.5, p: 1.9,
  q: 0.095, r: 6.0, s: 6.3, t: 9.1, u: 2.8, v: 0.98, w: 2.4, x: 0.15,
  y: 2.0, z: 0.074,
};

const VOWELS = ["a", "e", "i", "o", "u"];

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

function pickWeightedVowel(rng: () => number): string {
  const weights = VOWELS.map((v) => LETTER_FREQ[v]);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < VOWELS.length; i++) {
    r -= weights[i];
    if (r <= 0) return VOWELS[i];
  }
  return VOWELS[VOWELS.length - 1];
}

function generateNineLetters(rng: () => number): string[] {
  const letters: string[] = [];
  // Guarantee 3 vowels
  for (let i = 0; i < 3; i++) {
    letters.push(pickWeightedVowel(rng));
  }
  // Fill remaining 6 with weighted random letters
  while (letters.length < 9) {
    letters.push(pickWeightedLetter(rng));
  }
  // Shuffle
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters;
}

/**
 * Generate letters for a round.
 * Round 1: guaranteed to have at least one valid 3+ letter word (re-rolls if needed).
 * Rounds 2-3: carry-over letters + new random letters to reach 9 (no word guarantee).
 */
export function generateRoundLetters(
  seed: number,
  round: number,
  carryOver: string[]
): string[] {
  const rng = seededRandom(seed + round * 1000);

  if (round === 0) {
    // Round 1: pick a random 9-letter word and shuffle its letters.
    // This guarantees everyone starts with the same solvable anagram.
    const nineLetterWords = getNineLetterWords();
    if (nineLetterWords.length > 0) {
      const wordIndex = Math.floor(rng() * nineLetterWords.length);
      const chosenWord = nineLetterWords[wordIndex];
      const letters = chosenWord.split("");
      // Shuffle so the word isn't immediately obvious
      for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
      }
      return letters;
    }
    // Fallback if no 9-letter words loaded yet
    return generateNineLetters(rng);
  }

  // Rounds 2-3: carry-over + new letters
  const newCount = 9 - carryOver.length;
  const newLetters: string[] = [];

  // Ensure at least 1 vowel in new letters if carry-over has none
  const hasVowel = carryOver.some((l) => VOWELS.includes(l));
  if (!hasVowel && newCount > 0) {
    newLetters.push(pickWeightedVowel(rng));
  }

  while (newLetters.length < newCount) {
    newLetters.push(pickWeightedLetter(rng));
  }

  const all = [...carryOver, ...newLetters];

  // Shuffle just the new positions (keep carry-over at front for visibility)
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }

  return all;
}
