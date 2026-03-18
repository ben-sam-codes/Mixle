import { getWordSet, canFormWord } from "./words";
import { scoreWord, type Score } from "./scoring";

export interface BestWordResult {
  word: string;
  score: Score;
}

/** Find the highest-scoring valid word that can be formed from the given letters. */
export function findBestWord(letters: string[]): BestWordResult | null {
  const wordSet = getWordSet();
  if (!wordSet) return null;

  let best: BestWordResult | null = null;
  const words = Array.from(wordSet);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word.length < 3 || word.length > letters.length) continue;
    if (!canFormWord(letters, word)) continue;

    const usedAll = word.length === letters.length;
    const score = scoreWord(word, usedAll);
    if (!score.valid) continue;

    if (
      !best ||
      score.total > best.score.total ||
      (score.total === best.score.total && word.length > best.word.length)
    ) {
      best = { word, score };
    }
  }

  return best;
}
