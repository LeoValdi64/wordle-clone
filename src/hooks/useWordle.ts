"use client";

import { useState, useEffect, useCallback } from "react";
import { getRandomWord, isValidWord } from "@/data/words";

export type TileState = "empty" | "tbd" | "correct" | "present" | "absent";

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
}

export interface GameState {
  guesses: string[];
  currentGuess: string;
  targetWord: string;
  gameStatus: "playing" | "won" | "lost";
  currentRow: number;
  evaluations: TileState[][];
  letterStatuses: Record<string, TileState>;
  shakeRow: boolean;
  message: string | null;
  revealingRow: number | null;
}

const INITIAL_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
};

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

function loadStats(): GameStats {
  if (typeof window === "undefined") return INITIAL_STATS;
  const saved = localStorage.getItem("wordle-stats");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_STATS;
    }
  }
  return INITIAL_STATS;
}

function saveStats(stats: GameStats) {
  if (typeof window === "undefined") return;
  localStorage.setItem("wordle-stats", JSON.stringify(stats));
}

export function useWordle() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    guesses: [],
    currentGuess: "",
    targetWord: "",
    gameStatus: "playing",
    currentRow: 0,
    evaluations: Array(MAX_GUESSES).fill([]),
    letterStatuses: {},
    shakeRow: false,
    message: null,
    revealingRow: null,
  }));

  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [showStats, setShowStats] = useState(false);

  // Initialize game on mount
  useEffect(() => {
    setStats(loadStats());
    setGameState((prev) => ({
      ...prev,
      targetWord: getRandomWord().toUpperCase(),
    }));
  }, []);

  const evaluateGuess = useCallback(
    (guess: string, target: string): TileState[] => {
      const result: TileState[] = Array(WORD_LENGTH).fill("absent");
      const targetChars = target.split("");
      const guessChars = guess.split("");
      const usedIndices = new Set<number>();

      // First pass: find correct letters
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessChars[i] === targetChars[i]) {
          result[i] = "correct";
          usedIndices.add(i);
        }
      }

      // Second pass: find present letters
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (result[i] === "correct") continue;

        for (let j = 0; j < WORD_LENGTH; j++) {
          if (usedIndices.has(j)) continue;
          if (guessChars[i] === targetChars[j]) {
            result[i] = "present";
            usedIndices.add(j);
            break;
          }
        }
      }

      return result;
    },
    []
  );

  const updateLetterStatuses = useCallback(
    (guess: string, evaluation: TileState[]) => {
      setGameState((prev) => {
        const newStatuses = { ...prev.letterStatuses };
        for (let i = 0; i < guess.length; i++) {
          const letter = guess[i];
          const currentStatus = newStatuses[letter];
          const newStatus = evaluation[i];

          // Only upgrade status: absent -> present -> correct
          if (
            currentStatus === "correct" ||
            (currentStatus === "present" && newStatus === "absent")
          ) {
            continue;
          }
          newStatuses[letter] = newStatus;
        }
        return { ...prev, letterStatuses: newStatuses };
      });
    },
    []
  );

  const showMessage = useCallback((msg: string, duration: number = 1500) => {
    setGameState((prev) => ({ ...prev, message: msg }));
    setTimeout(() => {
      setGameState((prev) => ({ ...prev, message: null }));
    }, duration);
  }, []);

  const submitGuess = useCallback(() => {
    const { currentGuess, targetWord, currentRow, gameStatus } = gameState;

    if (gameStatus !== "playing") return;
    if (currentGuess.length !== WORD_LENGTH) {
      setGameState((prev) => ({ ...prev, shakeRow: true }));
      showMessage("Not enough letters");
      setTimeout(() => {
        setGameState((prev) => ({ ...prev, shakeRow: false }));
      }, 500);
      return;
    }

    if (!isValidWord(currentGuess)) {
      setGameState((prev) => ({ ...prev, shakeRow: true }));
      showMessage("Not in word list");
      setTimeout(() => {
        setGameState((prev) => ({ ...prev, shakeRow: false }));
      }, 500);
      return;
    }

    const evaluation = evaluateGuess(currentGuess, targetWord);

    // Set revealing row to trigger flip animation
    setGameState((prev) => ({
      ...prev,
      revealingRow: currentRow,
    }));

    // After animation, update state
    setTimeout(() => {
      setGameState((prev) => {
        const newGuesses = [...prev.guesses, currentGuess];
        const newEvaluations = [...prev.evaluations];
        newEvaluations[currentRow] = evaluation;

        const won = currentGuess === targetWord;
        const lost = !won && currentRow === MAX_GUESSES - 1;

        return {
          ...prev,
          guesses: newGuesses,
          currentGuess: "",
          currentRow: currentRow + 1,
          evaluations: newEvaluations,
          gameStatus: won ? "won" : lost ? "lost" : "playing",
          revealingRow: null,
        };
      });

      updateLetterStatuses(currentGuess, evaluation);

      const won = currentGuess === targetWord;
      const lost = !won && currentRow === MAX_GUESSES - 1;

      if (won) {
        const messages = [
          "Genius!",
          "Magnificent!",
          "Impressive!",
          "Splendid!",
          "Great!",
          "Phew!",
        ];
        showMessage(messages[currentRow] || "You won!");

        setStats((prev) => {
          const newStats = {
            ...prev,
            gamesPlayed: prev.gamesPlayed + 1,
            gamesWon: prev.gamesWon + 1,
            currentStreak: prev.currentStreak + 1,
            maxStreak: Math.max(prev.maxStreak, prev.currentStreak + 1),
            guessDistribution: [...prev.guessDistribution],
          };
          newStats.guessDistribution[currentRow]++;
          saveStats(newStats);
          return newStats;
        });

        setTimeout(() => setShowStats(true), 2000);
      } else if (lost) {
        showMessage(targetWord, 3000);

        setStats((prev) => {
          const newStats = {
            ...prev,
            gamesPlayed: prev.gamesPlayed + 1,
            currentStreak: 0,
          };
          saveStats(newStats);
          return newStats;
        });

        setTimeout(() => setShowStats(true), 3000);
      }
    }, WORD_LENGTH * 300 + 100);
  }, [
    gameState,
    evaluateGuess,
    updateLetterStatuses,
    showMessage,
  ]);

  const addLetter = useCallback(
    (letter: string) => {
      if (gameState.gameStatus !== "playing") return;
      if (gameState.currentGuess.length >= WORD_LENGTH) return;

      setGameState((prev) => ({
        ...prev,
        currentGuess: prev.currentGuess + letter.toUpperCase(),
      }));
    },
    [gameState.gameStatus, gameState.currentGuess.length]
  );

  const removeLetter = useCallback(() => {
    if (gameState.gameStatus !== "playing") return;

    setGameState((prev) => ({
      ...prev,
      currentGuess: prev.currentGuess.slice(0, -1),
    }));
  }, [gameState.gameStatus]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (key === "ENTER") {
        submitGuess();
      } else if (key === "BACKSPACE" || key === "DELETE") {
        removeLetter();
      } else if (/^[A-Z]$/.test(key.toUpperCase())) {
        addLetter(key.toUpperCase());
      }
    },
    [submitGuess, removeLetter, addLetter]
  );

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toUpperCase();
      handleKeyPress(key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  const resetGame = useCallback(() => {
    setGameState({
      guesses: [],
      currentGuess: "",
      targetWord: getRandomWord().toUpperCase(),
      gameStatus: "playing",
      currentRow: 0,
      evaluations: Array(MAX_GUESSES).fill([]),
      letterStatuses: {},
      shakeRow: false,
      message: null,
      revealingRow: null,
    });
    setShowStats(false);
  }, []);

  return {
    gameState,
    stats,
    showStats,
    setShowStats,
    handleKeyPress,
    resetGame,
    MAX_GUESSES,
    WORD_LENGTH,
  };
}
