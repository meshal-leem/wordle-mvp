import { KEYBOARD_ROWS } from "../game/keyboard";
import type { LetterState } from "../game/types";

interface KeyboardProps {
  disabled: boolean;
  onKey: (key: string) => void;
  states: Partial<Record<string, LetterState>>;
}

export function Keyboard({ disabled, onKey, states }: KeyboardProps) {
  return (
    <section className="keyboard" aria-label="On-screen keyboard">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div className="keyboard-row" key={rowIndex}>
          {rowIndex === 2 && (
            <button
              className="key key-wide"
              disabled={disabled}
              onClick={() => onKey("ENTER")}
              type="button"
            >
              ENTER
            </button>
          )}

          {row.map((letter) => (
            <button
              aria-label={`Letter ${letter}`}
              className={`key ${states[letter] ?? ""}`}
              disabled={disabled}
              key={letter}
              onClick={() => onKey(letter)}
              type="button"
            >
              {letter}
            </button>
          ))}

          {rowIndex === 2 && (
            <button
              aria-label="Backspace"
              className="key key-wide"
              disabled={disabled}
              onClick={() => onKey("BACKSPACE")}
              type="button"
            >
              <span aria-hidden="true">⌫</span>
            </button>
          )}
        </div>
      ))}
    </section>
  );
}
