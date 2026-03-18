"use client";

import { useState, useEffect } from "react";
import { track } from "@vercel/analytics";
import type { RoundResult } from "@/lib/storage";
import type { MixleStats } from "@/lib/stats";
import type { BestWordResult } from "@/lib/bestWord";
interface Props {
  roundResults: RoundResult[];
  bestWords: (BestWordResult | null)[];
  totalScore: number;
  dayNum: number;
  shareText: string;
  stats: MixleStats;
  gameOverReason: "completed" | "no-word";
}

export default function GameOver({
  roundResults,
  bestWords,
  totalScore,
  dayNum,
  shareText,
  stats,
  gameOverReason,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(!!navigator.share);
  }, []);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      track("share", { score: totalScore, dayNum });
    } catch {}
  };

  return (
    <>
      <div className="result-title">
        {gameOverReason === "no-word" ? "No Words Left!" : "Well Played!"}
      </div>
      <div className="result-sub">MIXLE #{dayNum}</div>

      <div className="final-score-display">
        <div className="final-score-label">Total Score</div>
        <div className="final-score-value">{totalScore}</div>
      </div>

      <div className="stats-display">
        {[
          { label: "Played", value: stats.gamesPlayed },
          { label: "Best", value: stats.highScore },
          { label: "Streak", value: stats.currentStreak },
          { label: "Max Streak", value: stats.maxStreak },
        ].map((item) => (
          <div
            key={item.label}
            className={`stat-box ${
              item.label === "Streak" && stats.currentStreak > 0
                ? "streak-active"
                : ""
            }`}
          >
            <div className="stat-label">{item.label}</div>
            <div className="stat-value">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="round-scores">
        {roundResults.map((r, i) => {
          const best = bestWords[i];
          const playerFoundBest =
            best && r.word.toLowerCase() === best.word.toLowerCase();

          return (
            <div key={i} className="round-score-card">
              <div className="rd-label">Round {i + 1}</div>
              <div className="rd-word">{r.word.toUpperCase()}</div>
              <div className="rd-score">{r.score.total}pts</div>
              {best && (
                <div className="rd-best">
                  {playerFoundBest ? (
                    <span className="rd-best-match">Best!</span>
                  ) : (
                    <>
                      <span className="rd-best-label">Best: </span>
                      <span className="rd-best-word">
                        {best.word.toUpperCase()}
                      </span>
                      <span className="rd-best-score">
                        {" "}
                        {best.score.total}pts
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="share-preview">{shareText}</div>
      <button className="share-btn" onClick={handleShare}>
        {canNativeShare ? "Share Results" : "Copy Results to Share"}
      </button>
      {copied && <div className="copied-toast">Copied to clipboard!</div>}
      <a
        href="https://buymeacoffee.com/papernapkinprojects?new=1"
        target="_blank"
        rel="noopener noreferrer"
        className="bmc-link"
      >
        ☕ Buy me a coffee
      </a>
    </>
  );
}
