import { content, formatText } from "../config/content";
import { KEYBOARD_ROWS } from "../game/keyboard";
import type { LetterState } from "../game/types";

interface KeyboardProps {
  disabled: boolean;
  onKey: (key: string) => void;
  states: Partial<Record<string, LetterState>>;
}

export function Keyboard({ disabled, onKey, states }: KeyboardProps) {
  return (
    <section className="keyboard" aria-label={content.keyboard.ariaLabel}>
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div className="keyboard-row" key={rowIndex}>
          {rowIndex === 2 && (
            <button
              className="key key-wide"
              disabled={disabled}
              onClick={() => onKey("ENTER")}
              type="button"
            >
              {content.keyboard.enter}
            </button>
          )}

          {row.map((letter) => (
            <button
              aria-label={formatText(content.keyboard.letterAria, {
                letter,
                state: states[letter]
                  ? formatText(content.keyboard.stateSuffix, {
                      state: content.letterStates[states[letter]],
                    })
                  : "",
              })}
              className={`key ${states[letter] ?? ""}`}
              disabled={disabled || states[letter] === "absent"}
              key={letter}
              onClick={() => onKey(letter)}
              type="button"
            >
              {letter}
            </button>
          ))}

          {rowIndex === 2 && (
            <button
              aria-label={content.keyboard.backspaceAria}
              className="key key-wide"
              disabled={disabled}
              onClick={() => onKey("BACKSPACE")}
              type="button"
            >
              <span aria-hidden="true">{content.keyboard.backspace}</span>
            </button>
          )}
        </div>
      ))}
    </section>
  );
}
