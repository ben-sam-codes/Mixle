"use client";

import type { RoundResult } from "@/lib/storage";
import type { MixleStats } from "@/lib/stats";
import ShareButton from "./ShareButton";
import StatsDisplay from "./StatsDisplay";

interface Props {
  roundResults: RoundResult[];
  bestResult: RoundResult | null;
  dayNum: number;
  shareText: string;
  stats: MixleStats;
}

export default function GameOver({
  roundResults,
  bestResult,
  dayNum,
  shareText,
  stats,
}: Props) {
  return (
    <>
      <div className="result-title">
        {bestResult?.score?.valid ? "Nice Build!" : "Tough Letters!"}
      </div>
      <div className="result-sub">MIXLE #{dayNum}</div>
      <StatsDisplay stats={stats} />
      <div className="round-scores">
        {roundResults.map((r, i) => {
          const isBest =
            bestResult &&
            r.word === bestResult.word &&
            r.score.total === bestResult.score.total;
          return (
            <div
              key={i}
              className={`round-score-card ${isBest ? "best" : ""}`}
            >
              <div className="rd-label">Round {i + 1}</div>
              <div className="rd-word">
                {r.word.toUpperCase()}
                {r.usedSwap ? " 🔄" : ""}
              </div>
              {r.score.valid ? (
                <div className="rd-score">{r.score.total}pts</div>
              ) : (
                <div className="rd-invalid">No word</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="share-preview">{shareText}</div>
      <ShareButton shareText={shareText} />
    </>
  );
}
