import { useCallback, useEffect, useMemo, useState } from "react";
import { evaluateGuess } from "../game/evaluateGuess";
import { getKeyboardStates } from "../game/keyboard";
import type {
  GameStatus,
  LetterState,
  SubmittedGuess,
} from "../game/types";
import { MAX_GUESSES, WORD_LENGTH } from "../game/types";
import { chooseAnswer, isValidWord } from "../game/words";

interface WordleGame {
  answer: string;
  currentGuess: string;
  guesses: SubmittedGuess[];
  keyboardStates: Partial<Record<string, LetterState>>;
  message: string;
  status: GameStatus;
  giveUp: () => void;
  inputKey: (key: string) => void;
  restart: () => void;
}

const EMPTY_GUESS = " ".repeat(WORD_LENGTH);

function createGuessTemplate(guesses: SubmittedGuess[]): string {
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

export function useWordle(): WordleGame {
  const [answer, setAnswer] = useState(chooseAnswer);
  const [currentGuess, setCurrentGuess] = useState(EMPTY_GUESS);
  const [guesses, setGuesses] = useState<SubmittedGuess[]>([]);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [message, setMessage] = useState("");

  const keyboardStates = useMemo(
    () => getKeyboardStates(guesses),
    [guesses],
  );

  const submitGuess = useCallback((guess: string) => {
    if (guess.includes(" ")) {
      setMessage("Enter five letters.");
      return;
    }

    if (!isValidWord(guess)) {
      setMessage("We don't recognize that word. Try another five-letter word.");
      return;
    }

    const submittedGuess: SubmittedGuess = {
      word: guess,
      result: evaluateGuess(guess, answer),
    };
    const nextGuesses = [...guesses, submittedGuess];

    setGuesses(nextGuesses);
    setCurrentGuess(createGuessTemplate(nextGuesses));

    if (guess === answer) {
      setStatus("won");
      setMessage(`Solved in ${nextGuesses.length}!`);
    } else if (nextGuesses.length === MAX_GUESSES) {
      setStatus("lost");
      setMessage(`The word was ${answer}.`);
    } else {
      setMessage("");
    }
  }, [answer, guesses]);

  const inputKey = useCallback(
    (key: string) => {
      if (status !== "playing") {
        return;
      }

      const normalizedKey = key.toUpperCase();

      if (normalizedKey === "ENTER") {
        submitGuess(currentGuess);
        return;
      }

      if (normalizedKey === "BACKSPACE") {
        setCurrentGuess((guess) => {
          const template = createGuessTemplate(guesses);
          const letters = guess.split("");

          for (let index = WORD_LENGTH - 1; index >= 0; index -= 1) {
            if (template[index] === " " && letters[index] !== " ") {
              letters[index] = " ";
              break;
            }
          }

          return letters.join("");
        });
        setMessage("");
        return;
      }

      if (/^[A-Z]$/.test(normalizedKey)) {
        if (keyboardStates[normalizedKey] === "absent") {
          return;
        }

        const emptyPosition = currentGuess.indexOf(" ");

        if (emptyPosition === -1) {
          return;
        }

        const nextGuessLetters = currentGuess.split("");
        nextGuessLetters[emptyPosition] = normalizedKey;
        const nextGuess = nextGuessLetters.join("");

        setCurrentGuess(nextGuess);
        setMessage("");

        if (!nextGuess.includes(" ")) {
          submitGuess(nextGuess);
        }
      }
    },
    [currentGuess, guesses, keyboardStates, status, submitGuess],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const key = event.key.toUpperCase();
      const isGameKey =
        /^[A-Z]$/.test(key) || key === "ENTER" || key === "BACKSPACE";

      if (event.target instanceof HTMLButtonElement && key === "ENTER") {
        return;
      }

      if (isGameKey) {
        event.preventDefault();
        inputKey(key);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputKey]);

  const restart = useCallback(() => {
    setAnswer(chooseAnswer());
    setCurrentGuess(EMPTY_GUESS);
    setGuesses([]);
    setStatus("playing");
    setMessage("");
  }, []);

  const giveUp = useCallback(() => {
    setCurrentGuess(EMPTY_GUESS);
    setStatus("lost");
    setMessage(`The word was ${answer}.`);
  }, [answer]);

  return {
    answer,
    currentGuess,
    guesses,
    keyboardStates,
    message,
    status,
    giveUp,
    inputKey,
    restart,
  };
}
