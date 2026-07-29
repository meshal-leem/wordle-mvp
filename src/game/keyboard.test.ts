import { describe, expect, it } from "vitest";
import { getKeyboardStates } from "./keyboard";
import type { SubmittedGuess } from "./types";

describe("getKeyboardStates", () => {
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
