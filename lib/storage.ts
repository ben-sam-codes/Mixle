import type { Score } from "./scoring";

export interface RoundResult {
  word: string;
  score: Score;
  usedSwap: boolean;
}

export interface GameState {
  round: number;
  step: number;
  letters: string[];
  roundResults: RoundResult[];
  gameOver: boolean;
  swapsUsed: boolean;
  arranging: boolean;
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

export function loadGameState(): GameState | null {
  try {
    const raw = localStorage.getItem(getTodayKey());
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

export function clearOldStates(): void {
  try {
    const todayKey = getTodayKey();
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith("mixle-") && key !== todayKey && key !== "mixle-stats") {
        localStorage.removeItem(key);
      }
    }
  } catch {}
}
