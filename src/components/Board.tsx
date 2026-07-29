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
        const activeWord =
          rowIndex === guesses.length ? currentGuess : submittedGuess?.word;

        return (
          <div className="board-row" key={rowIndex} role="row">
            {Array.from({ length: WORD_LENGTH }, (_, columnIndex) => {
              const letter = activeWord?.[columnIndex] ?? "";
              const letterState = submittedGuess?.result[columnIndex];
              const stateLabel = letterState
                ? `, ${letterState}`
                : "";

              return (
                <div
                  aria-label={`Row ${rowIndex + 1}, column ${columnIndex + 1}: ${letter || "empty"}${stateLabel}`}
                  className={`tile ${letterState ?? ""}`}
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
