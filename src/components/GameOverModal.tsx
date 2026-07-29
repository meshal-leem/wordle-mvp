import { content } from "../config/content";

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
          {won ? content.modal.winEmoji : content.modal.lossEmoji}
        </div>
        <h2 id="game-result-title">
          {won ? content.modal.winTitle : content.modal.lossTitle}
        </h2>
        <p>{message}</p>
        {!won && (
          <p className="encouragement">{content.modal.encouragement}</p>
        )}
        <button autoFocus className="new-game" onClick={onRestart} type="button">
          {content.modal.restart}
        </button>
      </section>
    </div>
  );
}
