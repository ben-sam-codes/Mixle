"use client";

import { LETTER_VALUES } from "@/lib/scoring";

interface Props {
  draws: string[];
  step: number;
  onPick: (letter: string) => void;
}

export default function PickPhase({ draws, step, onPick }: Props) {
  return (
    <div className="choices-area">
      <div className="choices-label">Pick a letter ({step + 1} of 5)</div>
      <div className="choices">
        {draws.map((l, i) => (
          <div className="choice-wrapper" key={i}>
            <button className="choice-btn" onClick={() => onPick(l)}>
              {l}
            </button>
            <span className="point-badge">{LETTER_VALUES[l]}pt</span>
          </div>
        ))}
      </div>
    </div>
  );
}
