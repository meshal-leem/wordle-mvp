interface GameOverModalProps {
  message: string;
  onRestart: () => void;
  won: boolean;
}

export function GameOverModal({
  message,
  onRestart,
  won,
}: GameOverModalProps) {
  return (
    <div className="modal-backdrop">
      <section
        aria-labelledby="game-result-title"
        aria-modal="true"
        className="game-over-modal"
        role="dialog"
      >
        <h2 id="game-result-title">{won ? "You won!" : "Game over"}</h2>
        <p>{message}</p>
        <button autoFocus className="new-game" onClick={onRestart} type="button">
          Restart game
        </button>
      </section>
    </div>
  );
}
