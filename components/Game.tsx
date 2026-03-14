"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getDailySeed, getDayNumber, seededRandom } from "@/lib/rng";
import { generateAllDraws, pickWeightedLetter } from "@/lib/draws";
import { scoreWord, setWordSet } from "@/lib/scoring";
import { loadWords } from "@/lib/words";
import {
  saveGameState,
  loadGameState,
  clearOldStates,
  type RoundResult,
} from "@/lib/storage";
import { loadStats, updateStats, type MixleStats } from "@/lib/stats";
import RoundIndicator from "./RoundIndicator";
import LetterSlot from "./LetterSlot";
import PickPhase from "./PickPhase";
import ArrangePhase from "./ArrangePhase";
import ScoreCard from "./ScoreCard";
import GameOver from "./GameOver";
import HelpModal from "./HelpModal";

export default function Game() {
  const seed = getDailySeed();
  const dayNum = getDayNumber();
  const allDraws = useRef(generateAllDraws(seed)).current;

  const [round, setRound] = useState(0);
  const [step, setStep] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [roundScored, setRoundScored] = useState(false);
  const [arranging, setArranging] = useState(false);
  const [swapsLeft, setSwapsLeft] = useState(1);
  const [swappedIndex, setSwappedIndex] = useState<number | null>(null);
  const [wordsLoaded, setWordsLoaded] = useState(false);
  const [stats, setStats] = useState<MixleStats | null>(null);

  // Drag state
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const isDragging = useRef(false);
  const dragFromRef = useRef<number | null>(null);
  const dragOverRef = useRef<number | null>(null);
  const lettersRef = useRef(letters);
  lettersRef.current = letters;

  const swapRng = useRef(seededRandom(seed + 99999)).current;
  const slotsContainerRef = useRef<HTMLDivElement>(null);
  const restoredRef = useRef(false);

  // Load words on mount
  useEffect(() => {
    loadWords().then((ws) => {
      setWordSet(ws);
      setWordsLoaded(true);
    });
  }, []);

  // Restore state on mount
  useEffect(() => {
    if (!wordsLoaded || restoredRef.current) return;
    restoredRef.current = true;
    clearOldStates();
    const saved = loadGameState();
    if (saved) {
      setRound(saved.round);
      setStep(saved.step);
      setLetters(saved.letters);
      setRoundResults(saved.roundResults);
      setGameOver(saved.gameOver);
      setArranging(saved.arranging);
      if (saved.swapsUsed) setSwapsLeft(0);
      if (saved.gameOver) {
        const best = Math.max(
          ...saved.roundResults.map((r) => r.score.total),
          0
        );
        setStats(updateStats(best));
      }
    }
  }, [wordsLoaded]);

  const currentDraws = allDraws[round];
  const pickingDone = step >= 5;
  const isRoundDone = pickingDone && !arranging;
  const currentWord = letters.join("");

  const getReorderedLetters = useCallback(() => {
    if (dragFrom === null || dragOver === null || dragFrom === dragOver)
      return letters;
    const arr = [...letters];
    const [item] = arr.splice(dragFrom, 1);
    arr.splice(dragOver, 0, item);
    return arr;
  }, [letters, dragFrom, dragOver]);

  const previewWord = arranging
    ? getReorderedLetters().join("")
    : currentWord;
  const wordScore = isRoundDone ? scoreWord(currentWord) : null;
  const arrangePreview = arranging ? scoreWord(previewWord) : null;

  // Save state on changes
  useEffect(() => {
    if (!wordsLoaded || !restoredRef.current) return;
    saveGameState({
      round,
      step,
      letters,
      roundResults,
      gameOver,
      swapsUsed: swapsLeft === 0,
      arranging,
    });
  }, [round, step, letters, roundResults, gameOver, swapsLeft, arranging, wordsLoaded]);

  const getSlotWidth = () => {
    const c = slotsContainerRef.current;
    if (!c) return 66;
    return c.getBoundingClientRect().width / 5;
  };

  const getSlotTransform = (i: number): string => {
    if (dragFrom === null || dragOver === null || dragFrom === dragOver)
      return "";
    if (i === dragFrom) return "";
    const sw = getSlotWidth();
    if (dragFrom < dragOver) {
      if (i > dragFrom && i <= dragOver) return `translateX(${-sw}px)`;
    } else {
      if (i >= dragOver && i < dragFrom) return `translateX(${sw}px)`;
    }
    return "";
  };

  const getSlotIndexFromX = (clientX: number): number | null => {
    const c = slotsContainerRef.current;
    if (!c) return null;
    const rect = c.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(4, Math.floor(x / (rect.width / 5))));
  };

  const handlePick = useCallback(
    (letter: string) => {
      if (pickingDone || gameOver) return;
      const newLetters = [...letters, letter];
      setLetters(newLetters);
      const newStep = step + 1;
      setStep(newStep);
      if (newStep >= 5) setArranging(true);
    },
    [pickingDone, gameOver, letters, step]
  );

  const handlePointerDown = (e: React.PointerEvent, index: number) => {
    if (!arranging) return;
    if (e.button && e.button !== 0) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDragging.current = true;
    dragFromRef.current = index;
    dragOverRef.current = index;
    setDragFrom(index);
    setDragOver(index);
    setGhostPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    setGhostPos({ x: e.clientX, y: e.clientY });
    const idx = getSlotIndexFromX(e.clientX);
    if (idx !== null) {
      dragOverRef.current = idx;
      setDragOver(idx);
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const from = dragFromRef.current;
    const to = dragOverRef.current;
    if (from !== null && to !== null && from !== to) {
      const arr = [...lettersRef.current];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      setLetters(arr);
    }
    dragFromRef.current = null;
    dragOverRef.current = null;
    setDragFrom(null);
    setDragOver(null);
    setGhostPos(null);
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  const handleLockIn = () => {
    setArranging(false);
    setDragFrom(null);
    setDragOver(null);
    setGhostPos(null);
  };

  const handleSwapOut = (index: number) => {
    if (swapsLeft <= 0 || !arranging) return;
    const oldLetter = letters[index];
    let newLetter = oldLetter;
    let attempts = 0;
    while (newLetter === oldLetter && attempts < 20) {
      newLetter = pickWeightedLetter(swapRng);
      attempts++;
    }
    const newLetters = [...letters];
    newLetters[index] = newLetter;
    setLetters(newLetters);
    setSwapsLeft(0);
    setSwappedIndex(index);
    setTimeout(() => setSwappedIndex(null), 600);
  };

  const handleNextRound = () => {
    const result: RoundResult = {
      word: currentWord,
      score: wordScore!,
      usedSwap: swapsLeft === 0,
    };
    const newResults = [...roundResults, result];
    setRoundResults(newResults);
    setRoundScored(false);
    if (round >= 2) {
      setGameOver(true);
      const best = Math.max(...newResults.map((r) => r.score.total), 0);
      setStats(updateStats(best));
    } else {
      setRound(round + 1);
      setStep(0);
      setLetters([]);
      setArranging(false);
      setDragFrom(null);
      setDragOver(null);
      setGhostPos(null);
      setSwapsLeft(1);
      setSwappedIndex(null);
    }
  };

  useEffect(() => {
    if (isRoundDone && !roundScored) setRoundScored(true);
  }, [isRoundDone, roundScored]);

  const bestResult = gameOver
    ? roundResults.reduce<RoundResult | null>(
        (best, r) =>
          r.score.total > (best?.score?.total || 0) ? r : best,
        null
      )
    : null;

  const generateShareText = () => {
    const bestScore = Math.max(...roundResults.map((r) => r.score.total));
    const lines = [`MIXLE #${dayNum}`];
    roundResults.forEach((r, i) => {
      const pts = `${r.score.total}pts`;
      const isBest = r.score.valid && r.score.total === bestScore && bestScore > 0;
      const bestMarker = isBest ? " 🔥" : "";
      const swap = r.usedSwap ? " 🔄" : "";
      if (r.score.valid) {
        lines.push(`R${i + 1}: 🟩🟩🟩🟩🟩 ${pts}${bestMarker}${swap}`);
      } else {
        lines.push(`R${i + 1}: 🟨🟨⬜⬜⬜ ${pts}${swap}`);
      }
    });
    lines.push(`Best: ${bestScore}pts`);
    lines.push("mixle.fun");
    return lines.join("\n");
  };

  if (!wordsLoaded) {
    return (
      <div className="app">
        <div className="header">
          <div className="logo">Mixle</div>
          <div className="subhead">Loading…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <div className="logo">Mixle</div>
        <div className="subhead">Mix your letters. Make your word.</div>
      </div>

      {!gameOver ? (
        <>
          <RoundIndicator currentRound={round} />

          <div className="word-slots" ref={slotsContainerRef}>
            {[0, 1, 2, 3, 4].map((i) => (
              <LetterSlot
                key={i}
                letter={letters[i] || ""}
                index={i}
                filled={i < letters.length}
                current={i === step && !pickingDone}
                validWord={isRoundDone && !!wordScore?.valid}
                invalidWord={isRoundDone && !wordScore?.valid}
                arrangeMode={arranging}
                draggingSrc={dragFrom === i}
                validPreview={
                  arranging &&
                  dragFrom === null &&
                  !!arrangePreview?.valid
                }
                justSwapped={swappedIndex === i}
                showSwap={arranging && swapsLeft > 0 && dragFrom === null}
                onPointerDown={(e) => handlePointerDown(e, i)}
                onSwapOut={() => handleSwapOut(i)}
                style={{
                  transform: getSlotTransform(i),
                  transition:
                    dragFrom !== null
                      ? "transform 0.2s cubic-bezier(0.2,0,0,1)"
                      : "none",
                }}
              />
            ))}
          </div>

          {ghostPos && dragFrom !== null && (
            <div
              className="ghost-tile"
              style={{ left: ghostPos.x, top: ghostPos.y }}
            >
              {letters[dragFrom]}
            </div>
          )}

          {!pickingDone ? (
            <PickPhase
              draws={currentDraws[step]}
              step={step}
              onPick={handlePick}
            />
          ) : arranging ? (
            <ArrangePhase
              previewWord={previewWord}
              arrangePreview={arrangePreview}
              swapsLeft={swapsLeft}
              onLockIn={handleLockIn}
            />
          ) : (
            <ScoreCard
              wordScore={wordScore!}
              currentWord={currentWord}
              round={round}
              onNextRound={handleNextRound}
            />
          )}

          {roundResults.length > 0 && (
            <div className="round-scores">
              {roundResults.map((r, i) => (
                <div key={i} className="round-score-card">
                  <div className="rd-label">Round {i + 1}</div>
                  <div className="rd-word">{r.word}</div>
                  {r.score.valid ? (
                    <div className="rd-score">{r.score.total}pts</div>
                  ) : (
                    <div className="rd-invalid">No word</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <GameOver
          roundResults={roundResults}
          bestResult={bestResult}
          dayNum={dayNum}
          shareText={generateShareText()}
          stats={stats || loadStats()}
        />
      )}

      <div className="how-to-play">
        <button className="how-btn" onClick={() => setShowHelp(true)}>
          How to Play
        </button>
      </div>

      <HelpModal open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
