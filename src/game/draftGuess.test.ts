import { describe, expect, it } from "vitest";
import {
  createGuessTemplate,
  EMPTY_GUESS,
  insertLetter,
  isCompleteGuess,
  removeLastEditableLetter,
} from "./draftGuess";
import type { SubmittedGuess } from "./types";

const submittedGuess: SubmittedGuess = {
  word: "ROUND",
  result: ["absent", "absent", "absent", "absent", "correct"],
};

describe("draftGuess", () => {
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
