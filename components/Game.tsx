"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getDailySeed, getDayNumber } from "@/lib/rng";
import { generateRoundLetters } from "@/lib/draws";
import { scoreWord } from "@/lib/scoring";
import { loadWords, isValidWord, hasAnyValidWord } from "@/lib/words";
import {
  saveGameState,
  loadGameState,
  clearOldStates,
  type RoundResult,
} from "@/lib/storage";
import { loadStats, updateStats, type MixleStats } from "@/lib/stats";
import {
  getNickname,
  setNickname,
  generateNickname,
} from "@/lib/nickname";
import RoundIndicator from "./RoundIndicator";
import LetterSlot from "./LetterSlot";
import WordZone from "./WordZone";
import GameOver from "./GameOver";
import HelpModal from "./HelpModal";
import NicknameModal from "./NicknameModal";

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
  const [showNickname, setShowNickname] = useState(false);
  const [defaultNickname, setDefaultNickname] = useState("");
  const [wordsLoaded, setWordsLoaded] = useState(false);
  const [stats, setStats] = useState<MixleStats | null>(null);

  const restoredRef = useRef(false);
  const scoreSubmittedRef = useRef(false);

  // Load words on mount
  useEffect(() => {
    loadWords().then(() => setWordsLoaded(true));
  }, []);

  // Load nickname on mount (don't prompt — wait until game ends)
  const hasNicknameRef = useRef(!!getNickname());

  // Generate initial letters once words are loaded
  useEffect(() => {
    if (!wordsLoaded || restoredRef.current) return;
    restoredRef.current = true;
    clearOldStates();

    const saved = loadGameState();
    if (saved && Array.isArray(saved.letters) && saved.letters.length > 0) {
      setRound(saved.round);
      setLetters(saved.letters);
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
  }, [wordsLoaded, seed]);

  // Save state on changes
  useEffect(() => {
    if (!wordsLoaded || !restoredRef.current) return;
    saveGameState({
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

  // When game ends, prompt for nickname if not set
  useEffect(() => {
    if (!gameOver || scoreSubmittedRef.current) return;

    const existing = getNickname();
    if (existing) {
      scoreSubmittedRef.current = true;
    } else {
      setDefaultNickname(generateNickname());
      setShowNickname(true);
    }
  }, [gameOver]);

  const selectedLetters = selectedIndices.map((i) => letters[i]);
  const currentWord = selectedLetters.join("");

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

  const advanceRound = useCallback(
    (carryOver: string[], newTotal: number, currentRound: number) => {
      if (currentRound >= 2) {
        setGameOver(true);
        setGameOverReason("completed");
        setStats(updateStats(newTotal));
        return;
      }

      const nextRound = currentRound + 1;
      const nextLetters = generateRoundLetters(seed, nextRound, carryOver);

      if (!hasAnyValidWord(nextLetters)) {
        setGameOver(true);
        setGameOverReason("no-word");
        setStats(updateStats(newTotal));
        setLetters(nextLetters);
        setRound(nextRound);
        return;
      }

      setRound(nextRound);
      setLetters(nextLetters);
    },
    [seed]
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

  const handleNicknameConfirm = (name: string) => {
    setNickname(name);
    setShowNickname(false);
    hasNicknameRef.current = true;
    scoreSubmittedRef.current = true;
  };

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

      {showNickname && (
        <NicknameModal
          defaultName={defaultNickname}
          onConfirm={handleNicknameConfirm}
        />
      )}

      {!gameOver ? (
        <>
          <RoundIndicator
            currentRound={round}
            totalScore={totalScore}
            completedRounds={roundResults.length}
          />

          <div className="word-slots">
            {letters.map((letter, i) => (
              <LetterSlot
                key={`${round}-${i}`}
                letter={letter}
                selected={selectedIndices.includes(i)}
                selectionOrder={
                  selectedIndices.includes(i)
                    ? selectedIndices.indexOf(i)
                    : undefined
                }
                onClick={() => handleLetterTap(i)}
              />
            ))}
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
      </div>

      <HelpModal open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
