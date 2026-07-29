import type { LetterState, SubmittedGuess } from "./types";
import { WORD_LENGTH } from "./types";
import { ANSWER_WORDS, VALID_WORDS } from "./wordData";

export const EMPTY_GUESS = " ".repeat(WORD_LENGTH);

const STATE_PRIORITY: Record<LetterState, number> = {
  absent: 1,
  present: 2,
  correct: 3,
};

// Answer selection and dictionary validation
export function chooseAnswer(): string {
  return ANSWER_WORDS[Math.floor(Math.random() * ANSWER_WORDS.length)];
}

export function isValidWord(word: string): boolean {
  return word.length === WORD_LENGTH && VALID_WORDS.has(word.toUpperCase());
}

// Active-guess editing
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

// Submitted-guess scoring
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

// On-screen keyboard feedback
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
