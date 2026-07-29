import type { LetterState, SubmittedGuess } from "./types";

export const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
] as const;

const STATE_PRIORITY: Record<LetterState, number> = {
  absent: 1,
  present: 2,
  correct: 3,
};

export function getKeyboardStates(
  guesses: SubmittedGuess[],
): Partial<Record<string, LetterState>> {
  const states: Partial<Record<string, LetterState>> = {};

  for (const guess of guesses) {
    guess.word.split("").forEach((letter, index) => {
      const nextState = guess.result[index];
      const currentState = states[letter];

      if (
        currentState === undefined ||
        STATE_PRIORITY[nextState] > STATE_PRIORITY[currentState]
      ) {
        states[letter] = nextState;
      }
    });
  }

  return states;
}
