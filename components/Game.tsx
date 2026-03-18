"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { track } from "@vercel/analytics";
import { getDailySeed, getDayNumber } from "@/lib/rng";
import { generateRoundLetters } from "@/lib/draws";
import { scoreWord } from "@/lib/scoring";
import { findBestWord, type BestWordResult } from "@/lib/bestWord";
import { loadWords, isValidWord, hasAnyValidWord } from "@/lib/words";
import {
  saveGameState,
  loadGameState,
  clearOldStates,
  type RoundResult,
} from "@/lib/storage";
import { loadStats, updateStats, type MixleStats } from "@/lib/stats";
import RoundIndicator from "./RoundIndicator";
import { LayoutGroup } from "framer-motion";
import LetterSlot from "./LetterSlot";
import WordZone from "./WordZone";
import GameOver from "./GameOver";
import HelpModal from "./HelpModal";

export default function Game() {
  const seed = getDailySeed();
  const dayNum = getDayNumber();

  const [round, setRound] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<
    "completed" | "no-word"
  >("completed");
  const [totalScore, setTotalScore] = useState(0);
  const [scoreToast, setScoreToast] = useState<{
    word: string;
    total: number;
    allUsedBonus: number;
  } | null>(null);

  const [showHelp, setShowHelp] = useState(false);
  const [wordsLoaded, setWordsLoaded] = useState(false);
  const [stats, setStats] = useState<MixleStats | null>(null);
  const [letterKeys, setLetterKeys] = useState<string[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const keyCounterRef = useRef(0);

  const restoredRef = useRef(false);

  const generateKeys = useCallback((count: number) => {
    const keys: string[] = [];
    for (let i = 0; i < count; i++) {
      keys.push(`k-${keyCounterRef.current++}`);
    }
    return keys;
  }, []);

  // Load words on mount
  useEffect(() => {
    loadWords().then(() => setWordsLoaded(true));
  }, []);

  // Generate initial letters once words are loaded
  useEffect(() => {
    if (!wordsLoaded || restoredRef.current) return;
    restoredRef.current = true;
    clearOldStates();

    const saved = loadGameState(seed);
    if (saved && Array.isArray(saved.letters) && saved.letters.length > 0) {
      setRound(saved.round);
      setLetters(saved.letters);
      setLetterKeys(generateKeys(saved.letters.length));
      setSelectedIndices(saved.selectedIndices || []);
      setRoundResults(saved.roundResults || []);
      setGameOver(saved.gameOver);
      setGameOverReason(saved.gameOverReason || "completed");
      setTotalScore(saved.totalScore);
      if (saved.gameOver) {
        setStats(updateStats(saved.totalScore));
      }
      return;
    }

    // Fresh game: generate round 1 letters
    const firstLetters = generateRoundLetters(seed, 0, []);
    setLetters(firstLetters);
    setLetterKeys(generateKeys(firstLetters.length));
  }, [wordsLoaded, seed, generateKeys]);

  // Save state on changes
  useEffect(() => {
    if (!wordsLoaded || !restoredRef.current) return;
    saveGameState({
      seed,
      round,
      letters,
      selectedIndices,
      roundResults,
      gameOver,
      gameOverReason,
      totalScore,
    });
  }, [
    round,
    letters,
    selectedIndices,
    roundResults,
    gameOver,
    gameOverReason,
    totalScore,
    wordsLoaded,
  ]);

  const selectedLetters = selectedIndices.map((i) => letters[i]);
  const currentWord = selectedLetters.join("");

  const bestWords: (BestWordResult | null)[] = useMemo(() => {
    if (!gameOver) return [];
    return roundResults.map((r) => {
      const available = [...r.lettersUsed, ...r.carryOverLetters];
      return findBestWord(available);
    });
  }, [gameOver, roundResults]);

  const handleLetterTap = useCallback(
    (index: number) => {
      if (gameOver || scoreToast) return;
      setSelectedIndices((prev) => {
        const existingPos = prev.indexOf(index);
        if (existingPos !== -1) {
          // Deselect
          return prev.filter((i) => i !== index);
        }
        // Select
        return [...prev, index];
      });
    },
    [gameOver, scoreToast]
  );

  const handleClear = useCallback(() => {
    setSelectedIndices([]);
  }, []);

  const handleShuffle = useCallback(() => {
    if (gameOver || scoreToast || isShuffling) return;

    setIsShuffling(true);

    // After a brief "lift" delay, perform the shuffle
    setTimeout(() => {
      // Fisher-Yates shuffle
      const indices = letters.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      // Remap letters and keys
      const newLetters = indices.map((i) => letters[i]);
      const newKeys = indices.map((i) => letterKeys[i]);

      // Remap selectedIndices to follow their letters
      const oldToNew = new Map<number, number>();
      indices.forEach((oldIdx, newIdx) => oldToNew.set(oldIdx, newIdx));
      const newSelectedIndices = selectedIndices.map(
        (old) => oldToNew.get(old)!
      );

      setLetters(newLetters);
      setLetterKeys(newKeys);
      setSelectedIndices(newSelectedIndices);

      // Let tiles "land" after layout animation
      setTimeout(() => {
        setIsShuffling(false);
      }, 350);
    }, 200);
  }, [gameOver, scoreToast, isShuffling, letters, letterKeys, selectedIndices]);

  const advanceRound = useCallback(
    (carryOver: string[], newTotal: number, currentRound: number) => {
      if (currentRound >= 2) {
        setGameOver(true);
        setGameOverReason("completed");
        setStats(updateStats(newTotal));
        track("game_completed", { reason: "completed", score: newTotal, rounds: currentRound + 1 });
        return;
      }

      const nextRound = currentRound + 1;
      const nextLetters = generateRoundLetters(seed, nextRound, carryOver);

      if (!hasAnyValidWord(nextLetters)) {
        setGameOver(true);
        setGameOverReason("no-word");
        setStats(updateStats(newTotal));
        track("game_completed", { reason: "no-word", score: newTotal, rounds: nextRound });
        setLetters(nextLetters);
        setLetterKeys(generateKeys(nextLetters.length));
        setRound(nextRound);
        return;
      }

      setRound(nextRound);
      setLetters(nextLetters);
      setLetterKeys(generateKeys(nextLetters.length));
    },
    [seed, generateKeys]
  );

  const handleSubmit = useCallback(() => {
    if (currentWord.length < 3 || !isValidWord(currentWord)) return;

    const usedAll = selectedIndices.length === letters.length;
    const score = scoreWord(currentWord, usedAll);

    const usedSet = new Set(selectedIndices);
    const carryOver = letters.filter((_, i) => !usedSet.has(i));

    const result: RoundResult = {
      word: currentWord,
      score,
      lettersUsed: selectedLetters,
      carryOverLetters: carryOver,
    };

    const newTotal = totalScore + score.total;
    setTotalScore(newTotal);
    setRoundResults((prev) => [...prev, result]);
    setSelectedIndices([]);

    // Show score toast and auto-advance after delay
    setScoreToast({
      word: currentWord,
      total: score.total,
      allUsedBonus: score.allUsedBonus,
    });

    const currentRound = round;
    setTimeout(() => {
      setScoreToast(null);
      advanceRound(carryOver, newTotal, currentRound);
    }, 1000);
  }, [currentWord, selectedIndices, letters, selectedLetters, totalScore, round, advanceRound]);

  const generateShareText = () => {
    const lines = [`Mixle ${dayNum} \u2022 ${totalScore}pts`];
    roundResults.forEach((r) => {
      const used = r.lettersUsed.length;
      const unused = 9 - used;
      const dots = "\uD83D\uDFE2".repeat(used) + "\u26AA\uFE0F".repeat(unused);
      const allUsed = r.score.allUsedBonus > 0;
      lines.push(
        `${dots} +${r.score.total}pts${allUsed ? " \u2B50\uFE0F" : ""}`
      );
    });
    if (gameOverReason === "no-word") {
      lines.push("\u274C Game over!");
    }
    lines.push("");
    lines.push("www.mixle.fun");
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
        <div className="subhead">Make your best word</div>
      </div>

      {!gameOver ? (
        <>
          <RoundIndicator
            currentRound={round}
            totalScore={totalScore}
            completedRounds={roundResults.length}
          />

          <LayoutGroup>
            <div className="word-slots">
              {letters.map((letter, i) => (
                <LetterSlot
                  key={letterKeys[i] || `${round}-${i}`}
                  layoutId={letterKeys[i] || `${round}-${i}`}
                  letter={letter}
                  selected={selectedIndices.includes(i)}
                  selectionOrder={
                    selectedIndices.includes(i)
                      ? selectedIndices.indexOf(i)
                      : undefined
                  }
                  onClick={() => handleLetterTap(i)}
                  isShuffling={isShuffling}
                />
              ))}
            </div>
          </LayoutGroup>

          <div className="shuffle-row">
            <button
              className="shuffle-btn"
              onClick={handleShuffle}
              disabled={isShuffling || !!scoreToast}
            >
              &#8645; Shuffle
            </button>
          </div>

          {scoreToast && (
            <div className="score-toast">
              <span className="score-toast-word">
                {scoreToast.word.toUpperCase()}
              </span>
              <span className="score-toast-pts">
                +{scoreToast.total}pts
                {scoreToast.allUsedBonus > 0 && " (all letters!)"}
              </span>
            </div>
          )}

          {!scoreToast && (
            <WordZone
              selectedLetters={selectedLetters}
              totalLetters={letters.length}
              onSubmit={handleSubmit}
              onClear={handleClear}
            />
          )}

          {roundResults.length > 0 && !scoreToast && (
            <div className="round-scores">
              {roundResults.map((r, i) => (
                <div key={i} className="round-score-card">
                  <div className="rd-label">Round {i + 1}</div>
                  <div className="rd-word">{r.word.toUpperCase()}</div>
                  <div className="rd-score">{r.score.total}pts</div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <GameOver
          roundResults={roundResults}
          bestWords={bestWords}
          totalScore={totalScore}
          dayNum={dayNum}
          shareText={generateShareText()}
          stats={stats || loadStats()}
          gameOverReason={gameOverReason}
        />
      )}

      <div className="how-to-play">
        <button className="how-btn" onClick={() => setShowHelp(true)}>
          How to Play
        </button>
        <a href="/about" className="how-btn about-link">
          About Mixle
        </a>
      </div>

      <HelpModal open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
