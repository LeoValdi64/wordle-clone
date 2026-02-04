"use client";

import { BarChart3, HelpCircle, RefreshCw } from "lucide-react";
import { useWordle } from "@/hooks/useWordle";
import { GameBoard } from "@/components/GameBoard";
import { Keyboard } from "@/components/Keyboard";
import { StatsModal } from "@/components/StatsModal";

export default function Home() {
  const {
    gameState,
    stats,
    showStats,
    setShowStats,
    handleKeyPress,
    resetGame,
    MAX_GUESSES,
    WORD_LENGTH,
  } = useWordle();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-zinc-700 p-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => setShowStats(true)}
            className="p-2 hover:bg-zinc-800 rounded transition-colors"
            title="Statistics"
          >
            <BarChart3 className="w-6 h-6" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wider">
            WORDLE
          </h1>
          <div className="flex gap-1">
            {gameState.gameStatus !== "playing" && (
              <button
                onClick={resetGame}
                className="p-2 hover:bg-zinc-800 rounded transition-colors"
                title="New Game"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
            )}
            <button
              className="p-2 hover:bg-zinc-800 rounded transition-colors"
              title="How to Play"
            >
              <HelpCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Toast Message */}
      {gameState.message && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40">
          <div className="bg-white text-black px-6 py-3 rounded font-bold text-sm animate-fade-in">
            {gameState.message}
          </div>
        </div>
      )}

      {/* Game Board */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <GameBoard
          gameState={gameState}
          maxGuesses={MAX_GUESSES}
          wordLength={WORD_LENGTH}
        />
      </main>

      {/* Keyboard */}
      <footer className="p-2 pb-4">
        <Keyboard
          letterStatuses={gameState.letterStatuses}
          onKeyPress={handleKeyPress}
        />
      </footer>

      {/* Stats Modal */}
      <StatsModal
        stats={stats}
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        onNewGame={resetGame}
        gameStatus={gameState.gameStatus}
      />
    </div>
  );
}
