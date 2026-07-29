import { Board } from "./components/Board";
import { GameOverModal } from "./components/GameOverModal";
import { Keyboard } from "./components/Keyboard";
import { content } from "./config/content";
import { useWordle } from "./hooks/useWordle";
import "./styles.css";

export default function App() {
  const {
    canGiveUp,
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
      <div className="game-shell">
        <main className="game">
          <header className="header">
            <h1>{content.game.title}</h1>
          </header>

          {canGiveUp && (
            <button className="give-up" onClick={giveUp} type="button">
              {content.game.giveUp}
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

          <a
            aria-label={content.game.howToPlayAria}
            className="how-to-play"
            href={content.game.howToPlayUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {content.game.howToPlay}
          </a>
        </main>
      </div>

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
