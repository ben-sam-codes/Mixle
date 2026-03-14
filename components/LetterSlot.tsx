"use client";

import React from "react";

interface Props {
  letter: string;
  selected: boolean;
  selectionOrder?: number;
  onClick: () => void;
}

export default function LetterSlot({
  letter,
  selected,
  selectionOrder,
  onClick,
}: Props) {
  const classes = [
    "slot",
    "filled",
    selected && "selected",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="slot-column">
      <div className={classes} onClick={onClick}>
        {letter.toUpperCase()}
        {selected && selectionOrder !== undefined && (
          <span className="selection-order">{selectionOrder + 1}</span>
        )}
      </div>
    </div>
  );
}
