"use client";

import type { MixleStats } from "@/lib/stats";

interface Props {
  stats: MixleStats;
}

export default function StatsDisplay({ stats }: Props) {
  const items = [
    { label: "Games Played", value: stats.gamesPlayed },
    { label: "High Score", value: stats.highScore },
    { label: "Current Streak", value: stats.currentStreak },
    { label: "Max Streak", value: stats.maxStreak },
  ];

  return (
    <div className="stats-display">
      {items.map((item) => (
        <div
          key={item.label}
          className={`stat-box ${item.label === "Current Streak" && stats.currentStreak > 0 ? "streak-active" : ""}`}
        >
          <div className="stat-label">{item.label}</div>
          <div className="stat-value">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
