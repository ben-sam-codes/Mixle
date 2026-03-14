"use client";

interface Props {
  currentRound: number;
}

export default function RoundIndicator({ currentRound }: Props) {
  return (
    <>
      <div className="round-indicator">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`round-dot ${i === currentRound ? "active" : ""} ${i < currentRound ? "done" : ""}`}
          />
        ))}
      </div>
      <div className="round-label">Round {currentRound + 1} of 3</div>
    </>
  );
}
