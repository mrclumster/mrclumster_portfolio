"use client";

import { useEffect, useRef } from "react";

const KONAMI = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];

/**
 * Listens globally for the Konami code sequence and fires `onActivate` once
 * when matched. Buffer resets after 3 seconds of inactivity.
 */
export function useKonami(onActivate: () => void) {
  const bufferRef = useRef<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(onActivate);
  callbackRef.current = onActivate;

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const key = e.key;
      bufferRef.current.push(key);

      // Keep only the last N keys
      if (bufferRef.current.length > KONAMI.length) {
        bufferRef.current.shift();
      }

      // Reset inactivity timer
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        bufferRef.current = [];
      }, 3000);

      // Check match
      if (bufferRef.current.join(",") === KONAMI.join(",")) {
        bufferRef.current = [];
        callbackRef.current();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
}
