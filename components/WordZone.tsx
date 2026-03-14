"use client";

import { scoreWord } from "@/lib/scoring";
import { isValidWord } from "@/lib/words";

interface Props {
  selectedLetters: string[];
  totalLetters: number;
  onSubmit: () => void;
  onClear: () => void;
}

export default function WordZone({
  selectedLetters,
  totalLetters,
  onSubmit,
  onClear,
}: Props) {
  const word = selectedLetters.join("");
  const isValid = word.length >= 3 && isValidWord(word);
  const usedAll = selectedLetters.length === totalLetters;
  const preview = word.length >= 3 ? scoreWord(word, usedAll) : null;

  return (
    <div className="word-zone">
      <div className="word-zone-label">Your Word</div>
      <div className="word-zone-display">
        {word.length > 0 ? (
          <span className={`word-text ${isValid ? "valid" : word.length >= 3 ? "invalid" : "partial"}`}>
            {word.toUpperCase()}
          </span>
        ) : (
          <span className="word-placeholder">Tap letters to spell</span>
        )}
      </div>

      {word.length > 0 && word.length < 3 && (
        <div className="word-hint">Need at least 3 letters</div>
      )}

      {preview && (
        <div className="word-preview-score">
          {preview.valid ? (
            <span className="arrange-valid">
              {preview.letterScore}pts
              {preview.allUsedBonus > 0 && " + 5 bonus!"}
              {" = "}
              {preview.total}pts
            </span>
          ) : (
            <span className="arrange-invalid">Not a valid word</span>
          )}
        </div>
      )}

      <div className="word-zone-actions">
        {word.length > 0 && (
          <button className="clear-btn" onClick={onClear}>
            Clear
          </button>
        )}
        <button
          className="next-btn submit-btn"
          onClick={onSubmit}
          disabled={!isValid}
        >
          Submit Word
        </button>
      </div>
    </div>
  );
}
