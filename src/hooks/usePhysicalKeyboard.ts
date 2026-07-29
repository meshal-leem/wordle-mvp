import { useEffect } from "react";

const LETTER_KEY = /^[A-Z]$/;
const CONTROL_KEYS = new Set(["ENTER", "BACKSPACE"]);

function isGameKey(key: string): boolean {
  return LETTER_KEY.test(key) || CONTROL_KEYS.has(key);
}

export function usePhysicalKeyboard(onKey: (key: string) => void): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const key = event.key.toUpperCase();

      // Let focused buttons handle Enter themselves instead of firing twice.
      if (event.target instanceof HTMLButtonElement && key === "ENTER") {
        return;
      }

      if (isGameKey(key)) {
        event.preventDefault();
        onKey(key);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onKey]);
}
