import type { LetterState } from "./types";
import { WORD_LENGTH } from "./types";

/**
 * Evaluates a guess in two passes so duplicate letters are handled correctly.
 *
 * The first pass reserves exact matches. The second pass can mark a letter as
 * present only while an unmatched copy of that letter remains in the answer.
 */
export function evaluateGuess(guess: string, answer: string): LetterState[] {
  if (guess.length !== WORD_LENGTH || answer.length !== WORD_LENGTH) {
    throw new Error("Guess and answer must both contain five letters.");
  }

  const result = Array<LetterState>(WORD_LENGTH).fill("absent");
  const remainingLetters = new Map<string, number>();

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    if (guess[index] === answer[index]) {
      result[index] = "correct";
    } else {
      const answerLetter = answer[index];
      remainingLetters.set(
        answerLetter,
        (remainingLetters.get(answerLetter) ?? 0) + 1,
      );
    }
  }

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    if (result[index] === "correct") {
      continue;
    }

    const guessLetter = guess[index];
    const copiesRemaining = remainingLetters.get(guessLetter) ?? 0;

    if (copiesRemaining > 0) {
      result[index] = "present";
      remainingLetters.set(guessLetter, copiesRemaining - 1);
    }
  }

  return result;
}
