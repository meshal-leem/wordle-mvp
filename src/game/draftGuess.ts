import type { SubmittedGuess } from "./types";
import { WORD_LENGTH } from "./types";

export const EMPTY_GUESS = " ".repeat(WORD_LENGTH);

export function isCompleteGuess(guess: string): boolean {
  return guess.length === WORD_LENGTH && !guess.includes(" ");
}

/**
 * Builds the next row with every previously confirmed letter locked in place.
 */
export function createGuessTemplate(guesses: SubmittedGuess[]): string {
  const template = Array<string>(WORD_LENGTH).fill(" ");

  for (const guess of guesses) {
    guess.result.forEach((state, index) => {
      if (state === "correct") {
        template[index] = guess.word[index];
      }
    });
  }

  return template.join("");
}

export function insertLetter(guess: string, letter: string): string {
  const emptyPosition = guess.indexOf(" ");

  if (emptyPosition === -1) {
    return guess;
  }

  const letters = guess.split("");
  letters[emptyPosition] = letter;
  return letters.join("");
}

/**
 * Removes the last player-entered letter without deleting confirmed letters.
 */
export function removeLastEditableLetter(
  guess: string,
  template: string,
): string {
  const letters = guess.split("");

  for (let index = WORD_LENGTH - 1; index >= 0; index -= 1) {
    const isEditable = template[index] === " ";
    const hasLetter = letters[index] !== " ";

    if (isEditable && hasLetter) {
      letters[index] = " ";
      break;
    }
  }

  return letters.join("");
}
