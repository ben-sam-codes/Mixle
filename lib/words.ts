let cachedWords: Set<string> | null = null;

export async function loadWords(): Promise<Set<string>> {
  if (cachedWords) return cachedWords;
  const res = await fetch("/words.json");
  const arr: string[] = await res.json();
  cachedWords = new Set(arr);
  return cachedWords;
}

export function isValidWord(word: string): boolean {
  if (!cachedWords) return false;
  return cachedWords.has(word.toLowerCase());
}

/** Check if a word can be formed from the available letters */
export function canFormWord(letters: string[], word: string): boolean {
  const available = [...letters];
  for (const ch of word.toLowerCase()) {
    const idx = available.indexOf(ch);
    if (idx === -1) return false;
    available.splice(idx, 1);
  }
  return true;
}

/** Check if at least one valid 3+ letter word can be formed from the letters */
export function hasAnyValidWord(letters: string[]): boolean {
  if (!cachedWords) return false;
  const wordArray = Array.from(cachedWords);
  for (let i = 0; i < wordArray.length; i++) {
    const word = wordArray[i];
    if (word.length >= 3 && canFormWord(letters, word)) return true;
  }
  return false;
}

/** Get all 9-letter words from the dictionary */
export function getNineLetterWords(): string[] {
  if (!cachedWords) return [];
  const result: string[] = [];
  const wordArray = Array.from(cachedWords);
  for (let i = 0; i < wordArray.length; i++) {
    if (wordArray[i].length === 9) result.push(wordArray[i]);
  }
  return result;
}

export function getWordSet(): Set<string> | null {
  return cachedWords;
}
