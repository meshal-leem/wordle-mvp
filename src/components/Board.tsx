import { content, formatText } from "../config/content";
import { createGuessTemplate } from "../game/gameLogic";
import type { SubmittedGuess } from "../game/types";
import { MAX_GUESSES, WORD_LENGTH } from "../game/types";

interface BoardProps {
  currentGuess: string;
  guesses: SubmittedGuess[];
}

export function Board({ currentGuess, guesses }: BoardProps) {
  const confirmedLetters = createGuessTemplate(guesses);

  return (
    <section className="board" aria-label={content.board.ariaLabel} role="grid">
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
                confirmedLetters[columnIndex] !== " ";
              const letterState =
                submittedGuess?.result[columnIndex] ??
                (isLocked ? "correct" : undefined);
              const isNextPosition = columnIndex === nextPosition;
              const stateLabel = letterState
                ? formatText(content.board.stateSuffix, {
                    state: content.letterStates[letterState],
                  })
                : "";
              const positionLabel = isNextPosition
                ? content.board.nextPositionSuffix
                : "";

              return (
                <div
                  aria-label={formatText(content.board.cellAria, {
                    row: rowIndex + 1,
                    column: columnIndex + 1,
                    letter: letter || content.board.empty,
                    state: stateLabel,
                    position: positionLabel,
                  })}
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
