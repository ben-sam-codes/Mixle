"use client";

import { useState, useEffect } from "react";
import {
  getLeaderboard,
  getPlayerRank,
  type LeaderboardEntry,
} from "@/lib/leaderboard";
import { getPlayerId } from "@/lib/nickname";

interface Props {
  dayNumber: number;
}

export default function Leaderboard({ dayNumber }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [playerRank, setPlayerRank] = useState<{
    rank: number;
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [playerNickname, setPlayerNickname] = useState<string>("");

  useEffect(() => {
    const playerId = getPlayerId();
    const nick =
      typeof window !== "undefined"
        ? localStorage.getItem("mixle-nickname") || ""
        : "";
    setPlayerNickname(nick);

    Promise.all([getLeaderboard(dayNumber), getPlayerRank(playerId, dayNumber)])
      .then(([lb, rank]) => {
        setEntries(lb);
        setPlayerRank(rank);
      })
      .finally(() => setLoading(false));
  }, [dayNumber]);

  if (loading) {
    return (
      <div className="leaderboard">
        <div className="leaderboard-title">Leaderboard</div>
        <div className="leaderboard-loading">Loading...</div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="leaderboard">
        <div className="leaderboard-title">Leaderboard</div>
        <div className="leaderboard-empty">
          No scores yet today. You could be first!
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-title">Today&apos;s Leaderboard</div>

      {playerRank && (
        <div className="player-rank">
          You are #{playerRank.rank} of {playerRank.total} players
        </div>
      )}

      <div className="leaderboard-table">
        {entries.map((entry, i) => {
          const isPlayer = entry.nickname === playerNickname;
          return (
            <div
              key={i}
              className={`leaderboard-row ${isPlayer ? "is-player" : ""}`}
            >
              <span className="lb-rank">#{i + 1}</span>
              <span className="lb-name">{entry.nickname}</span>
              <span className="lb-score">{entry.score}pts</span>
              <span className="lb-rounds">
                {entry.rounds_completed}/3
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
