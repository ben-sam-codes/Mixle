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
  getPlayerId,
} from "@/lib/nickname";
import { submitScore } from "@/lib/leaderboard";
import RoundIndicator from "./RoundIndicator";
import LetterSlot from "./LetterSlot";
import WordZone from "./WordZone";
import ScoreCard from "./ScoreCard";
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
  const [showingScore, setShowingScore] = useState(false);
  const [currentRoundScore, setCurrentRoundScore] = useState<ReturnType<
    typeof scoreWord
  > | null>(null);

  const [showHelp, setShowHelp] = useState(false);
  const [showNickname, setShowNickname] = useState(false);
  const [nickname, setNicknameState] = useState("");
  const [defaultNickname, setDefaultNickname] = useState("");
  const [wordsLoaded, setWordsLoaded] = useState(false);
  const [stats, setStats] = useState<MixleStats | null>(null);

  const restoredRef = useRef(false);
  const scoreSubmittedRef = useRef(false);

  // Load words on mount
  useEffect(() => {
    loadWords().then(() => setWordsLoaded(true));
  }, []);

  // Check nickname on mount
  useEffect(() => {
    const existing = getNickname();
    if (existing) {
      setNicknameState(existing);
    } else {
      const generated = generateNickname();
      setDefaultNickname(generated);
      setShowNickname(true);
    }
  }, []);

  // Generate initial letters once words are loaded
  useEffect(() => {
    if (!wordsLoaded || restoredRef.current) return;
    restoredRef.current = true;
    clearOldStates();

    const saved = loadGameState();
    if (saved) {
      setRound(saved.round);
      setLetters(saved.letters);
      setSelectedIndices(saved.selectedIndices);
      setRoundResults(saved.roundResults);
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

  // Submit score to leaderboard when game ends
  useEffect(() => {
    if (gameOver && !scoreSubmittedRef.current && nickname) {
      scoreSubmittedRef.current = true;
      const playerId = getPlayerId();
      submitScore(
        playerId,
        nickname,
        totalScore,
        dayNum,
        roundResults.length
      );
    }
  }, [gameOver, nickname, totalScore, dayNum, roundResults.length]);

  const selectedLetters = selectedIndices.map((i) => letters[i]);
  const currentWord = selectedLetters.join("");

  const handleLetterTap = useCallback(
    (index: number) => {
      if (gameOver || showingScore) return;
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
    [gameOver, showingScore]
  );

  const handleClear = useCallback(() => {
    setSelectedIndices([]);
  }, []);

  const handleSubmit = useCallback(() => {
    if (currentWord.length < 3 || !isValidWord(currentWord)) return;

    const usedAll = selectedIndices.length === letters.length;
    const score = scoreWord(currentWord, usedAll);

    // Calculate carry-over letters
    const usedSet = new Set(selectedIndices);
    const carryOver = letters.filter((_, i) => !usedSet.has(i));

    const result: RoundResult = {
      word: currentWord,
      score,
      lettersUsed: selectedLetters,
      carryOverLetters: carryOver,
    };

    setCurrentRoundScore(score);
    setShowingScore(true);

    const newTotal = totalScore + score.total;
    setTotalScore(newTotal);
    setRoundResults((prev) => [...prev, result]);
    setSelectedIndices([]);
  }, [currentWord, selectedIndices, letters, selectedLetters, totalScore]);

  const handleNextRound = useCallback(() => {
    setShowingScore(false);
    setCurrentRoundScore(null);

    const lastResult = roundResults[roundResults.length - 1];
    const carryOver = lastResult?.carryOverLetters || [];

    if (round >= 2) {
      // Game complete
      setGameOver(true);
      setGameOverReason("completed");
      setStats(updateStats(totalScore));
      return;
    }

    const nextRound = round + 1;
    const nextLetters = generateRoundLetters(seed, nextRound, carryOver);

    // Check if any valid word can be formed
    if (!hasAnyValidWord(nextLetters)) {
      setGameOver(true);
      setGameOverReason("no-word");
      setStats(updateStats(totalScore));
      setLetters(nextLetters);
      setRound(nextRound);
      return;
    }

    setRound(nextRound);
    setLetters(nextLetters);
  }, [round, roundResults, seed, totalScore]);

  const handleNicknameConfirm = (name: string) => {
    setNickname(name);
    setNicknameState(name);
    setShowNickname(false);
  };

  const generateShareText = () => {
    const lines = [`MIXLE #${dayNum}`];
    roundResults.forEach((r, i) => {
      const usedAll = r.score.allUsedBonus > 0;
      lines.push(
        `R${i + 1}: ${r.word.toUpperCase()} ${r.score.total}pts${
          usedAll ? " ⭐" : ""
        }`
      );
    });
    if (gameOverReason === "no-word") {
      lines.push(`Game Over! (${roundResults.length}/3 rounds)`);
    }
    lines.push(`Total: ${totalScore}pts`);
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

          {!showingScore ? (
            <WordZone
              selectedLetters={selectedLetters}
              totalLetters={letters.length}
              onSubmit={handleSubmit}
              onClear={handleClear}
            />
          ) : (
            currentRoundScore && (
              <ScoreCard
                wordScore={currentRoundScore}
                currentWord={
                  roundResults[roundResults.length - 1]?.word || ""
                }
                round={round}
                totalScore={totalScore}
                carryOverLetters={
                  roundResults[roundResults.length - 1]
                    ?.carryOverLetters || []
                }
                onNextRound={handleNextRound}
              />
            )
          )}

          {roundResults.length > 0 && !showingScore && (
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
