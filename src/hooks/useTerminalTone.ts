import { useEffect, useState } from "react";
import type { TerminalColorOption } from "@utils";

export type TerminalTone = TerminalColorOption["tone"];

const resolveTone = (fallback: TerminalTone): TerminalTone => {
  if (typeof document === "undefined") return fallback;
  const attr = document.documentElement?.dataset?.terminalTone;
  return attr === "light" || attr === "dark" ? attr : fallback;
};

export function useTerminalTone(fallback: TerminalTone = "dark"): TerminalTone {
  const [tone, setTone] = useState<TerminalTone>(() => resolveTone(fallback));

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const updateTone = () => setTone(resolveTone(fallback));

    updateTone();

    if (typeof MutationObserver === "undefined") {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      const changed = mutations.some(
        (mutation) => mutation.type === "attributes" && mutation.attributeName === "data-terminal-tone",
      );
      if (changed) updateTone();
    });

    observer.observe(root, { attributes: true });

    return () => observer.disconnect();
  }, [fallback]);

  return tone;
}
