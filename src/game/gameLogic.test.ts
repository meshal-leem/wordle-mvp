import { describe, expect, it } from "vitest";
import {
  chooseAnswer,
  createGuessTemplate,
  EMPTY_GUESS,
  evaluateGuess,
  getKeyboardStates,
  insertLetter,
  isCompleteGuess,
  isValidWord,
  removeLastEditableLetter,
} from "./gameLogic";
import type { SubmittedGuess } from "./types";
import { VALID_WORDS } from "./wordData";

describe("guess evaluation", () => {
  it("marks an exact answer as correct", () => {
    expect(evaluateGuess("APPLE", "APPLE")).toEqual([
      "correct",
      "correct",
      "correct",
      "correct",
      "correct",
    ]);
  });

  it("does not reuse an answer letter when the guess has duplicates", () => {
    expect(evaluateGuess("PAPAL", "APPLE")).toEqual([
      "present",
      "present",
      "correct",
      "absent",
      "present",
    ]);
  });

  it("rejects words that are not five letters", () => {
    expect(() => evaluateGuess("FOUR", "APPLE")).toThrow(
      "Guess and answer must both contain five letters.",
    );
  });
});

describe("draft editing", () => {
  const submittedGuess: SubmittedGuess = {
    word: "ROUND",
    result: ["absent", "absent", "absent", "absent", "correct"],
  };

  it("starts with five editable positions", () => {
    expect(EMPTY_GUESS).toBe("     ");
    expect(isCompleteGuess(EMPTY_GUESS)).toBe(false);
  });

  it("recognizes only filled five-letter guesses as complete", () => {
    expect(isCompleteGuess("SHORT")).toBe(true);
    expect(isCompleteGuess("FOUR")).toBe(false);
  });

  it("carries confirmed letters into the next row", () => {
    expect(createGuessTemplate([submittedGuess])).toBe("    D");
  });

  it("inserts a letter into the first unresolved position", () => {
    expect(insertLetter("  A E", "R")).toBe("R A E");
  });

  it("does not overwrite a full guess", () => {
    expect(insertLetter("CRANE", "S")).toBe("CRANE");
  });

  it("removes only player-entered letters", () => {
    const template = "A   E";

    expect(removeLastEditableLetter("ARISE", template)).toBe("ARI E");
    expect(removeLastEditableLetter("A   E", template)).toBe("A   E");
  });
});

describe("keyboard state", () => {
  it("keeps the strongest known state for each letter", () => {
    const guesses: SubmittedGuess[] = [
      {
        word: "APPLE",
        result: ["absent", "absent", "absent", "absent", "present"],
      },
      {
        word: "EARTH",
        result: ["correct", "absent", "absent", "absent", "absent"],
      },
    ];

    expect(getKeyboardStates(guesses)).toMatchObject({
      A: "absent",
      E: "correct",
      P: "absent",
    });
  });
});

describe("word selection and validation", () => {
  it("uses the documented 14,855-word predefined dictionary", () => {
    expect(VALID_WORDS.size).toBe(14_855);
  });

  it("accepts dictionary words regardless of letter case", () => {
    expect(isValidWord("apple")).toBe(true);
    expect(isValidWord("12345")).toBe(false);
  });

  it("selects answers that are accepted by the dictionary", () => {
    expect(isValidWord(chooseAnswer())).toBe(true);
  });
});
