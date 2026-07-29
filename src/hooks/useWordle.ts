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
  inputKey: (key: string) => void;
  restart: () => void;
}

export function useWordle(): WordleGame {
  const [answer, setAnswer] = useState(chooseAnswer);
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState<SubmittedGuess[]>([]);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [message, setMessage] = useState("");

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) {
      setMessage("Enter five letters.");
      return;
    }

    if (!isValidWord(currentGuess)) {
      setMessage("We don't recognize that word. Try another five-letter word.");
      return;
    }

    const submittedGuess: SubmittedGuess = {
      word: currentGuess,
      result: evaluateGuess(currentGuess, answer),
    };
    const nextGuesses = [...guesses, submittedGuess];

    setGuesses(nextGuesses);
    setCurrentGuess("");

    if (currentGuess === answer) {
      setStatus("won");
      setMessage(`Solved in ${nextGuesses.length}!`);
    } else if (nextGuesses.length === MAX_GUESSES) {
      setStatus("lost");
      setMessage(`The word was ${answer}.`);
    } else {
      setMessage("");
    }
  }, [answer, currentGuess, guesses]);

  const inputKey = useCallback(
    (key: string) => {
      if (status !== "playing") {
        return;
      }

      const normalizedKey = key.toUpperCase();

      if (normalizedKey === "ENTER") {
        submitGuess();
        return;
      }

      if (normalizedKey === "BACKSPACE") {
        setCurrentGuess((guess) => guess.slice(0, -1));
        setMessage("");
        return;
      }

      if (/^[A-Z]$/.test(normalizedKey)) {
        setCurrentGuess((guess) =>
          guess.length < WORD_LENGTH ? `${guess}${normalizedKey}` : guess,
        );
        setMessage("");
      }
    },
    [status, submitGuess],
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

  const keyboardStates = useMemo(
    () => getKeyboardStates(guesses),
    [guesses],
  );

  const restart = useCallback(() => {
    setAnswer(chooseAnswer());
    setCurrentGuess("");
    setGuesses([]);
    setStatus("playing");
    setMessage("");
  }, []);

  return {
    answer,
    currentGuess,
    guesses,
    keyboardStates,
    message,
    status,
    inputKey,
    restart,
  };
}
