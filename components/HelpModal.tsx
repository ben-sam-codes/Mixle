"use client";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function HelpModal({ open, onClose }: Props) {
  if (!open) return null;

  const steps = [
    "You get <strong>9 random letters</strong> each round. Tap them in order to spell a word (3–9 letters).",
    "Valid words score points based on <strong>letter rarity</strong> (like Scrabble tiles). Rarer letters = more points!",
    "Use all 9 letters? <strong>+5 bonus points!</strong>",
    "Unused letters <strong>carry over</strong> to the next round. New letters fill up to 9 again.",
    "If you can't make any word from your letters — <strong>game over!</strong> Only the first round is guaranteed solvable.",
    "Complete <strong>3 rounds</strong> and your total score goes on the daily leaderboard. Everyone gets the same letters!",
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>How to Play</h2>
        {steps.map((text, i) => (
          <div className="step-row" key={i}>
            <span className="step-num">{i + 1}</span>
            <p dangerouslySetInnerHTML={{ __html: text }} />
          </div>
        ))}
        <button className="close-btn" onClick={onClose}>
          Got it!
        </button>
      </div>
    </div>
  );
}
