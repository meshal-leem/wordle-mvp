export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

export type LetterState = "correct" | "present" | "absent";
export type GameStatus = "playing" | "won" | "lost";

export interface SubmittedGuess {
  word: string;
  result: LetterState[];
}
