let cachedWords: Set<string> | null = null;

export async function loadWords(): Promise<Set<string>> {
  if (cachedWords) return cachedWords;
  const res = await fetch("/words.json");
  const arr: string[] = await res.json();
  cachedWords = new Set(arr.filter((w) => w.length === 5));
  return cachedWords;
}

export function isValidWord(word: string): boolean {
  if (!cachedWords) return false;
  return cachedWords.has(word.toLowerCase());
}
