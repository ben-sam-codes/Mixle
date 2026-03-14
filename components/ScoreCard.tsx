"use client";

import type { Score } from "@/lib/scoring";

interface Props {
  wordScore: Score;
  currentWord: string;
  round: number;
  totalScore: number;
  carryOverLetters: string[];
  onNextRound: () => void;
}

export default function ScoreCard({
  wordScore,
  currentWord,
  round,
  totalScore,
  carryOverLetters,
  onNextRound,
}: Props) {
  return (
    <div className="score-area">
      <div className="score-row">
        <span className="label">Word</span>
        <span className="value" style={{ textTransform: "uppercase" }}>
          {currentWord} ✓
        </span>
      </div>
      <div className="score-row">
        <span className="label">Letter points</span>
        <span className="value">{wordScore.letterScore}</span>
      </div>
      {wordScore.allUsedBonus > 0 && (
        <div className="score-row">
          <span className="label">All letters bonus</span>
          <span className="value" style={{ color: "var(--accent2)" }}>
            +{wordScore.allUsedBonus}
          </span>
        </div>
      )}
      <div
        className="score-row"
        style={{
          borderTop: "1px solid var(--surface)",
          paddingTop: 10,
          marginTop: 4,
        }}
      >
        <span className="label">Round total</span>
        <span className="value big">{wordScore.total}</span>
      </div>
      <div className="score-row">
        <span className="label">Running total</span>
        <span className="value">{totalScore}</span>
      </div>

      {carryOverLetters.length > 0 && round < 2 && (
        <div className="carry-over-preview">
          <span className="label">Carrying over: </span>
          <span className="carry-letters">
            {carryOverLetters.map((l) => l.toUpperCase()).join(" ")}
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
