"use client";

import { TileState } from "@/hooks/useWordle";

interface TileProps {
  letter: string;
  state: TileState;
  isRevealing?: boolean;
  revealDelay?: number;
  isWinBounce?: boolean;
  bounceDelay?: number;
}

const stateStyles: Record<TileState, string> = {
  empty: "border-2 border-zinc-700 bg-transparent",
  tbd: "border-2 border-zinc-500 bg-transparent",
  correct: "bg-tile-correct border-tile-correct",
  present: "bg-tile-present border-tile-present",
  absent: "bg-tile-absent border-tile-absent",
};

export function Tile({
  letter,
  state,
  isRevealing = false,
  revealDelay = 0,
  isWinBounce = false,
  bounceDelay = 0,
}: TileProps) {
  const baseStyles =
    "w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl font-bold uppercase select-none";

  const getAnimationStyle = () => {
    if (isRevealing) {
      return {
        animation: `flip 0.5s ease-in-out ${revealDelay}ms forwards`,
      };
    }
    if (isWinBounce) {
      return {
        animation: `bounce 1s ease ${bounceDelay}ms forwards`,
      };
    }
    return {};
  };

  return (
    <div
      className={`${baseStyles} ${stateStyles[state]} ${
        state === "tbd" && letter ? "animate-pop" : ""
      }`}
      style={getAnimationStyle()}
    >
      {letter}
    </div>
  );
}
