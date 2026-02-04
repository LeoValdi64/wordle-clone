"use client";

import { X, BarChart3, Trophy, Flame, RefreshCw } from "lucide-react";
import { GameStats } from "@/hooks/useWordle";

interface StatsModalProps {
  stats: GameStats;
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  gameStatus: "playing" | "won" | "lost";
}

export function StatsModal({
  stats,
  isOpen,
  onClose,
  onNewGame,
  gameStatus,
}: StatsModalProps) {
  if (!isOpen) return null;

  const winPercentage =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  const maxDistribution = Math.max(...stats.guessDistribution, 1);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-lg max-w-md w-full p-6 animate-fade-in relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Statistics
        </h2>

        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.gamesPlayed}</div>
            <div className="text-xs text-zinc-400">Played</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{winPercentage}</div>
            <div className="text-xs text-zinc-400">Win %</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold flex items-center justify-center gap-1">
              {stats.currentStreak}
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-xs text-zinc-400">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold flex items-center justify-center gap-1">
              {stats.maxStreak}
              <Trophy className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="text-xs text-zinc-400">Max Streak</div>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">Guess Distribution</h3>
        <div className="space-y-1 mb-6">
          {stats.guessDistribution.map((count, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-4 text-sm font-medium">{index + 1}</span>
              <div
                className="bg-tile-correct h-5 flex items-center justify-end px-2 text-sm font-bold transition-all"
                style={{
                  width: `${Math.max((count / maxDistribution) * 100, count > 0 ? 8 : 4)}%`,
                  minWidth: count > 0 ? "24px" : "8px",
                }}
              >
                {count > 0 && count}
              </div>
            </div>
          ))}
        </div>

        {gameStatus !== "playing" && (
          <button
            onClick={onNewGame}
            className="w-full bg-tile-correct hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            New Game
          </button>
        )}
      </div>
    </div>
  );
}
