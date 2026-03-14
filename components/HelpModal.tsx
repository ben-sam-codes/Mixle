"use client";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function HelpModal({ open, onClose }: Props) {
  if (!open) return null;

  const steps = [
    "Each turn, pick one letter from 4 options. Every draw has at least one vowel.",
    "After picking all 5 letters, <strong>drag to rearrange</strong> them into the best word you can.",
    "<strong>Stuck?</strong> You get 1 letter swap per round — tap ↻ under any letter to replace it with a new random one.",
    "You get <strong>3 rounds</strong> with different letter draws. Your best round is your score.",
    "Valid words score points based on letter rarity (like Scrabble tiles). Rarer letters = more points!",
    "Everyone gets the same draws each day. Share your score and compare!",
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
