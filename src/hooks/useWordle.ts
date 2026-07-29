import { useCallback, useMemo, useState } from "react";
import { content, formatText } from "../config/content";
import {
  createGuessTemplate,
  EMPTY_GUESS,
  insertLetter,
  isCompleteGuess,
  removeLastEditableLetter,
} from "../game/draftGuess";
import { evaluateGuess } from "../game/evaluateGuess";
import { getKeyboardStates } from "../game/keyboard";
import type {
  GameStatus,
  LetterState,
  SubmittedGuess,
} from "../game/types";
import { MAX_GUESSES } from "../game/types";
import { chooseAnswer, isValidWord } from "../game/words";
import { usePhysicalKeyboard } from "./usePhysicalKeyboard";

interface WordleGame {
  canGiveUp: boolean;
  currentGuess: string;
  guesses: SubmittedGuess[];
  keyboardStates: Partial<Record<string, LetterState>>;
  message: string;
  status: GameStatus;
  giveUp: () => void;
  inputKey: (key: string) => void;
  restart: () => void;
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
  const canGiveUp =
    status === "playing" &&
    (guesses.length > 0 || isCompleteGuess(currentGuess));

  const submitGuess = useCallback((guess: string) => {
    if (!isCompleteGuess(guess)) {
      setMessage(content.messages.incompleteGuess);
      return;
    }

    if (!isValidWord(guess)) {
      setMessage(content.messages.invalidWord);
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
      setMessage(
        formatText(content.messages.solved, {
          attempts: nextGuesses.length,
        }),
      );
    } else if (nextGuesses.length === MAX_GUESSES) {
      setStatus("lost");
      setMessage(formatText(content.messages.answerReveal, { answer }));
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
        const template = createGuessTemplate(guesses);
        setCurrentGuess((guess) =>
          removeLastEditableLetter(guess, template),
        );
        setMessage("");
        return;
      }

      if (/^[A-Z]$/.test(normalizedKey)) {
        if (keyboardStates[normalizedKey] === "absent") {
          return;
        }

        const nextGuess = insertLetter(currentGuess, normalizedKey);

        if (nextGuess === currentGuess) {
          return;
        }

        setCurrentGuess(nextGuess);
        setMessage("");

        if (isCompleteGuess(nextGuess)) {
          submitGuess(nextGuess);
        }
      }
    },
    [currentGuess, guesses, keyboardStates, status, submitGuess],
  );

  usePhysicalKeyboard(inputKey);

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
    setMessage(formatText(content.messages.answerReveal, { answer }));
  }, [answer]);

  return {
    canGiveUp,
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
