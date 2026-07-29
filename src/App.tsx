import { Board } from "./components/Board";
import { GameOverModal } from "./components/GameOverModal";
import { Keyboard } from "./components/Keyboard";
import { useWordle } from "./hooks/useWordle";
import "./styles.css";

export default function App() {
  const {
    currentGuess,
    giveUp,
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
        </header>

        {status === "playing" &&
          (guesses.length > 0 || !currentGuess.includes(" ")) && (
            <button className="give-up" onClick={giveUp} type="button">
              Give up
            </button>
          )}

        <Board currentGuess={currentGuess} guesses={guesses} />

        <div className="message-area">
          {status === "playing" && message && (
            <p className="message warning" aria-live="polite">
              {message}
            </p>
          )}
        </div>

        <Keyboard
          disabled={status !== "playing"}
          onKey={inputKey}
          states={keyboardStates}
        />
      </main>

      {status !== "playing" && (
        <GameOverModal
          message={message}
          onRestart={restart}
          won={status === "won"}
        />
      )}
    </div>
  );
}
