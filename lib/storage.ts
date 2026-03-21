import type { Score } from "./scoring";

export interface RoundResult {
  word: string;
  score: Score;
  lettersUsed: string[];
  carryOverLetters: string[];
}

export interface GameState {
  seed: number;
  round: number;
  letters: string[];
  selectedIndices: number[];
  roundResults: RoundResult[];
  gameOver: boolean;
  gameOverReason?: "no-word" | "completed";
  totalScore: number;
}

function getTodayKey(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `mixle-${yyyy}-${mm}-${dd}`;
}

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(getTodayKey(), JSON.stringify(state));
  } catch {}
}

export function loadGameState(seed: number): GameState | null {
  try {
    const raw = localStorage.getItem(getTodayKey());
    if (!raw) return null;
    const state = JSON.parse(raw) as GameState;
    if (state.seed !== seed) return null;
    return state;
  } catch {
    return null;
  }
}

export function clearOldStates(): void {
  try {
    const todayKey = getTodayKey();
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (
        key &&
        key.startsWith("mixle-") &&
        key !== todayKey &&
        key !== "mixle-stats" &&
        key !== "mixle-nickname" &&
        key !== "mixle-player-id" &&
        key !== "mixle-wordlist" &&
        key !== "mixle-wordlist-version"
      ) {
        localStorage.removeItem(key);
      }
    }
  } catch {}
}
