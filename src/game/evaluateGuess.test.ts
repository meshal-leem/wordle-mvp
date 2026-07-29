import { describe, expect, it } from "vitest";
import { evaluateGuess } from "./evaluateGuess";

describe("evaluateGuess", () => {
  it("marks a solved word as correct", () => {
    expect(evaluateGuess("APPLE", "APPLE")).toEqual([
      "correct",
      "correct",
      "correct",
      "correct",
      "correct",
    ]);
  });

  it("prioritizes exact matches when letters repeat", () => {
    expect(evaluateGuess("PAPAL", "APPLE")).toEqual([
      "present",
      "present",
      "correct",
      "absent",
      "present",
    ]);
  });

  it("does not match more copies than the answer contains", () => {
    expect(evaluateGuess("SHEEP", "THOSE")).toEqual([
      "present",
      "correct",
      "present",
      "absent",
      "absent",
    ]);
  });

  it("rejects words with the wrong length", () => {
    expect(() => evaluateGuess("CAT", "APPLE")).toThrow(
      "Guess and answer must both contain five letters.",
    );
  });
});
