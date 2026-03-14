export interface MixleStats {
  gamesPlayed: number;
  highScore: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate: string;
}

const STATS_KEY = "mixle-stats";

function getTodayDate(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function isYesterday(dateStr: string): boolean {
  const last = new Date(dateStr + "T00:00:00");
  const today = new Date(getTodayDate() + "T00:00:00");
  const diff = today.getTime() - last.getTime();
  return diff === 86400000;
}

export function loadStats(): MixleStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw) as MixleStats;
  } catch {}
  return {
    gamesPlayed: 0,
    highScore: 0,
    currentStreak: 0,
    maxStreak: 0,
    lastPlayedDate: "",
  };
}

export function updateStats(totalScore: number): MixleStats {
  const stats = loadStats();
  const today = getTodayDate();

  if (stats.lastPlayedDate === today) return stats;

  stats.gamesPlayed++;
  if (totalScore > stats.highScore) stats.highScore = totalScore;

  if (stats.lastPlayedDate && isYesterday(stats.lastPlayedDate)) {
    stats.currentStreak++;
  } else {
    stats.currentStreak = 1;
  }

  if (stats.currentStreak > stats.maxStreak) {
    stats.maxStreak = stats.currentStreak;
  }

  stats.lastPlayedDate = today;

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}

  return stats;
}
