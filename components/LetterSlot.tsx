"use client";

import React from "react";

interface Props {
  letter: string;
  index: number;
  filled: boolean;
  current: boolean;
  validWord: boolean;
  invalidWord: boolean;
  arrangeMode: boolean;
  draggingSrc: boolean;
  validPreview: boolean;
  justSwapped: boolean;
  showSwap: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onSwapOut: () => void;
  style?: React.CSSProperties;
}

export default function LetterSlot({
  letter,
  filled,
  current,
  validWord,
  invalidWord,
  arrangeMode,
  draggingSrc,
  validPreview,
  justSwapped,
  showSwap,
  onPointerDown,
  onSwapOut,
  style,
}: Props) {
  const classes = [
    "slot",
    filled && "filled",
    current && "current",
    validWord && "valid-word",
    invalidWord && "invalid-word",
    arrangeMode && "arrange-mode",
    draggingSrc && "dragging-src",
    validPreview && "valid-preview",
    justSwapped && "just-swapped",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="slot-column" style={style}>
      <div
        className={classes}
        onPointerDown={onPointerDown}
        style={arrangeMode ? { touchAction: "none" } : {}}
      >
        {letter || ""}
      </div>
      {showSwap && (
        <button
          className="swap-out-btn"
          onClick={(e) => {
            e.stopPropagation();
            onSwapOut();
          }}
        >
          ↻
        </button>
      )}
    </div>
  );
}
