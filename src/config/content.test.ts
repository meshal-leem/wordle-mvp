import { describe, expect, it } from "vitest";
import { formatText } from "./content";

describe("formatText", () => {
  it("replaces named placeholders", () => {
    expect(
      formatText("Solved in {attempts}!", {
        attempts: 3,
      }),
    ).toBe("Solved in 3!");
  });

  it("leaves unknown placeholders visible", () => {
    expect(formatText("Hello {name}", {})).toBe("Hello {name}");
  });
});
