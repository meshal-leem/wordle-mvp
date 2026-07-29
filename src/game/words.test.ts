import { describe, expect, it } from "vitest";
import { isValidWord } from "./words";

describe("isValidWord", () => {
  it("accepts ordinary five-letter words from the full guess list", () => {
    expect(isValidWord("SLATE")).toBe(true);
    expect(isValidWord("COURT")).toBe(true);
  });

  it("rejects letter combinations that are not words", () => {
    expect(isValidWord("ZZZZZ")).toBe(false);
  });
});
