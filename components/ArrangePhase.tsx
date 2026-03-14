"use client";

import type { Score } from "@/lib/scoring";

interface Props {
  previewWord: string;
  arrangePreview: Score | null;
  swapsLeft: number;
  onLockIn: () => void;
}

export default function ArrangePhase({
  previewWord,
  arrangePreview,
  swapsLeft,
  onLockIn,
}: Props) {
  return (
    <div className="arrange-area">
      <div className="arrange-label">Drag letters to rearrange</div>
      <div className="arrange-status">
        {arrangePreview?.valid ? (
          <span className="arrange-valid">
            ✓ {previewWord.toUpperCase()} is a word! ({arrangePreview.total}pts)
          </span>
        ) : (
          <span className="arrange-invalid">
            ✗ {previewWord.toUpperCase()} — not a word yet
          </span>
        )}
      </div>
      {swapsLeft > 0 && (
        <div className="lifeline-hint">
          ↻ 1 letter swap available — tap ↻ under a letter to replace it
        </div>
      )}
      <button
        className="next-btn"
        onClick={onLockIn}
        style={{ marginTop: 12 }}
      >
        Lock It In
      </button>
    </div>
  );
}
