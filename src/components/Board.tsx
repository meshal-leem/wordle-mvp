import type { SubmittedGuess } from "../game/types";
import { MAX_GUESSES, WORD_LENGTH } from "../game/types";

interface BoardProps {
  currentGuess: string;
  guesses: SubmittedGuess[];
}

export function Board({ currentGuess, guesses }: BoardProps) {
  return (
    <section className="board" aria-label="Word grid" role="grid">
      {Array.from({ length: MAX_GUESSES }, (_, rowIndex) => {
        const submittedGuess = guesses[rowIndex];
        const isActiveRow = rowIndex === guesses.length;
        const activeWord = isActiveRow ? currentGuess : submittedGuess?.word;
        const nextPosition = isActiveRow ? currentGuess.indexOf(" ") : -1;

        return (
          <div className="board-row" key={rowIndex} role="row">
            {Array.from({ length: WORD_LENGTH }, (_, columnIndex) => {
              const letter = activeWord?.[columnIndex]?.trim() ?? "";
              const isLocked =
                isActiveRow &&
                guesses.some(
                  (guess) => guess.result[columnIndex] === "correct",
                );
              const letterState =
                submittedGuess?.result[columnIndex] ??
                (isLocked ? "correct" : undefined);
              const isNextPosition = columnIndex === nextPosition;
              const stateLabel = letterState
                ? `, ${letterState}`
                : "";
              const positionLabel = isNextPosition ? ", next letter" : "";

              return (
                <div
                  aria-label={`Row ${rowIndex + 1}, column ${columnIndex + 1}: ${letter || "empty"}${stateLabel}${positionLabel}`}
                  className={`tile ${letterState ?? ""} ${isNextPosition ? "next-position" : ""}`}
                  key={columnIndex}
                  role="gridcell"
                >
                  {letter}
                </div>
              );
            })}
          </div>
        );
      })}
    </section>
  );
}
