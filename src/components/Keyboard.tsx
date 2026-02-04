"use client";

import { Delete, CornerDownLeft } from "lucide-react";
import { TileState } from "@/hooks/useWordle";

interface KeyboardProps {
  letterStatuses: Record<string, TileState>;
  onKeyPress: (key: string) => void;
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

const stateStyles: Record<TileState | "default", string> = {
  default: "bg-key-bg hover:bg-zinc-500",
  empty: "bg-key-bg hover:bg-zinc-500",
  tbd: "bg-key-bg hover:bg-zinc-500",
  correct: "bg-tile-correct hover:bg-tile-correct",
  present: "bg-tile-present hover:bg-tile-present",
  absent: "bg-zinc-800 hover:bg-zinc-700",
};

export function Keyboard({ letterStatuses, onKeyPress }: KeyboardProps) {
  const getKeyStyle = (key: string): string => {
    if (key === "ENTER" || key === "BACKSPACE") {
      return stateStyles.default;
    }
    const status = letterStatuses[key];
    return stateStyles[status || "default"];
  };

  return (
    <div className="flex flex-col gap-1.5 w-full max-w-lg mx-auto px-1">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1.5">
          {row.map((key) => {
            const isWide = key === "ENTER" || key === "BACKSPACE";
            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`
                  ${getKeyStyle(key)}
                  ${isWide ? "px-3 sm:px-4" : "w-8 sm:w-11"}
                  h-14 rounded font-bold text-sm sm:text-base
                  flex items-center justify-center
                  transition-colors text-key-text
                  active:scale-95
                `}
              >
                {key === "BACKSPACE" ? (
                  <Delete className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : key === "ENTER" ? (
                  <CornerDownLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
