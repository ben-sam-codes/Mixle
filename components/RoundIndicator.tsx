"use client";

interface Props {
  currentRound: number;
  totalScore: number;
  completedRounds: number;
}

export default function RoundIndicator({
  currentRound,
  totalScore,
  completedRounds,
}: Props) {
  return (
    <>
      <div className="round-indicator">
        {[0, 1, 2].map((r) => (
          <div
            key={r}
            className={`round-dot ${r === currentRound ? "active" : ""} ${
              r < completedRounds ? "done" : ""
            }`}
          />
        ))}
      </div>
      <div className="round-label">
        Round {currentRound + 1} of 3
        {totalScore > 0 && ` · ${totalScore}pts`}
      </div>
    </>
  );
}
