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
        <div aria-hidden="true" className="result-emoji">
          {won ? "🎉" : "💪"}
        </div>
        <h2 id="game-result-title">
          {won ? "Great job!" : "Nice try!"}
        </h2>
        <p>{message}</p>
        {!won && <p className="encouragement">Ready for another round?</p>}
        <button autoFocus className="new-game" onClick={onRestart} type="button">
          Restart game
        </button>
      </section>
    </div>
  );
}
