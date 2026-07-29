import { Board } from "./components/Board";
import { Keyboard } from "./components/Keyboard";
import { useWordle } from "./hooks/useWordle";
import "./styles.css";

export default function App() {
  const {
    currentGuess,
    guesses,
    inputKey,
    keyboardStates,
    message,
    restart,
    status,
  } = useWordle();

  return (
    <div className="app">
      <main className="game">
        <header className="header">
          <h1>Wordle</h1>
          <button
            aria-label="Start a new game"
            className="restart"
            onClick={restart}
            title="Start a new game"
            type="button"
          >
            <span aria-hidden="true">↻</span>
          </button>
        </header>

        <div className="message-area">
          {message && (
            <p className="message" aria-live="polite">
              {message}
            </p>
          )}
        </div>

        <Board currentGuess={currentGuess} guesses={guesses} />

        <Keyboard
          disabled={status !== "playing"}
          onKey={inputKey}
          states={keyboardStates}
        />
      </main>
    </div>
  );
}
