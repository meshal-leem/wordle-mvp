import { describe, expect, it } from "vitest";
import { evaluateGuess } from "./evaluateGuess";

describe("evaluateGuess", () => {
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
