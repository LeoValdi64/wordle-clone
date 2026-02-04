"use client";

import { Tile } from "./Tile";
import { TileState, GameState } from "@/hooks/useWordle";

interface GameBoardProps {
  gameState: GameState;
  maxGuesses: number;
  wordLength: number;
}

export function GameBoard({ gameState, maxGuesses, wordLength }: GameBoardProps) {
  const { guesses, currentGuess, currentRow, evaluations, shakeRow, revealingRow, gameStatus } =
    gameState;

  const getTileState = (
    rowIndex: number,
    colIndex: number,
    letter: string
  ): TileState => {
    // Submitted rows
    if (rowIndex < currentRow) {
      return evaluations[rowIndex]?.[colIndex] || "empty";
    }
    // Current row being typed
    if (rowIndex === currentRow && letter) {
      return "tbd";
    }
    return "empty";
  };

  const getRowLetters = (rowIndex: number): string[] => {
    if (rowIndex < guesses.length) {
      return guesses[rowIndex].split("");
    }
    if (rowIndex === currentRow) {
      const letters = currentGuess.split("");
      return [...letters, ...Array(wordLength - letters.length).fill("")];
    }
    return Array(wordLength).fill("");
  };

  return (
    <div className="flex flex-col gap-1.5">
      {Array.from({ length: maxGuesses }).map((_, rowIndex) => {
        const letters = getRowLetters(rowIndex);
        const isRevealing = revealingRow === rowIndex;
        const isWinRow = gameStatus === "won" && rowIndex === currentRow - 1;

        return (
          <div
            key={rowIndex}
            className={`flex gap-1.5 justify-center ${
              shakeRow && rowIndex === currentRow ? "animate-shake" : ""
            }`}
          >
            {letters.map((letter, colIndex) => (
              <Tile
                key={colIndex}
                letter={letter}
                state={getTileState(rowIndex, colIndex, letter)}
                isRevealing={isRevealing}
                revealDelay={colIndex * 300}
                isWinBounce={isWinRow}
                bounceDelay={colIndex * 100}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
