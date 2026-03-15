"use client";

import React from "react";
import { motion } from "framer-motion";
import { LETTER_VALUES } from "../lib/scoring";

interface Props {
  letter: string;
  selected: boolean;
  selectionOrder?: number;
  onClick: () => void;
  layoutId?: string;
  isShuffling?: boolean;
}

export default function LetterSlot({
  letter,
  selected,
  selectionOrder,
  onClick,
  layoutId,
  isShuffling,
}: Props) {
  const classes = [
    "slot",
    "filled",
    selected && "selected",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      className="slot-column"
      layoutId={layoutId}
      layout
      animate={{
        scale: isShuffling ? 1.15 : 1,
        y: isShuffling ? -8 : 0,
      }}
      transition={{
        layout: {
          type: "spring",
          stiffness: 200,
          damping: 22,
        },
        scale: { duration: 0.2 },
        y: { duration: 0.2 },
      }}
      style={{
        zIndex: isShuffling ? 10 : 0,
        filter: isShuffling
          ? "drop-shadow(0 8px 16px rgba(233, 69, 96, 0.4))"
          : "none",
      }}
    >
      <div className={classes} onClick={onClick}>
        {letter.toUpperCase()}
        <span className="point-value">{LETTER_VALUES[letter.toLowerCase()] || 0}</span>
        {selected && selectionOrder !== undefined && (
          <span className="selection-order">{selectionOrder + 1}</span>
        )}
      </div>
    </motion.div>
  );
}
