"use client";

import type { Score } from "@/lib/scoring";

interface Props {
  wordScore: Score;
  currentWord: string;
  round: number;
  onNextRound: () => void;
}

export default function ScoreCard({
  wordScore,
  currentWord,
  round,
  onNextRound,
}: Props) {
  return (
    <div className="score-area">
      <div className="score-row">
        <span className="label">Word</span>
        <span
          className="value"
          style={{
            textTransform: "uppercase",
            fontFamily: "'Space Mono', monospace",
          }}
        >
          {currentWord} {wordScore.valid ? "✓" : "✗"}
        </span>
      </div>
      {wordScore.valid ? (
        <>
          <div className="score-row">
            <span className="label">Letter points</span>
            <span className="value">{wordScore.letterScore}</span>
          </div>
          <div className="score-row">
            <span className="label">Word bonus</span>
            <span className="value">+{wordScore.wordBonus}</span>
          </div>
          <div
            className="score-row"
            style={{
              borderTop: "1px solid var(--surface)",
              paddingTop: 10,
              marginTop: 4,
            }}
          >
            <span className="label">Total</span>
            <span className="value big">{wordScore.total}</span>
          </div>
        </>
      ) : (
        <div className="score-row">
          <span className="label" style={{ color: "var(--accent)" }}>
            Not a valid word — 0 pts
          </span>
        </div>
      )}
      <button
        className="next-btn"
        onClick={onNextRound}
        style={{ marginTop: 16 }}
      >
        {round < 2 ? "Next Round →" : "See Results"}
      </button>
    </div>
  );
}
