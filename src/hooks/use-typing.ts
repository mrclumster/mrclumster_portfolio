"use client";

import { useState, useEffect } from "react";

interface UseTypingOptions {
  speed?: number;
  startDelay?: number;
}

export function useTyping(text: string, options: UseTypingOptions = {}) {
  const { speed = 50, startDelay = 500 } = options;
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    let timeout: NodeJS.Timeout;

    const startTyping = () => {
      timeout = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timeout);
          setIsComplete(true);
        }
      }, speed);
    };

    const delay = setTimeout(startTyping, startDelay);

    return () => {
      clearTimeout(delay);
      clearInterval(timeout);
    };
  }, [text, speed, startDelay]);

  return { displayText, isComplete };
}

interface UseTypingLoopOptions {
  typeSpeed?: number;
  deleteSpeed?: number;
  holdAfterType?: number;
  holdAfterDelete?: number;
  startDelay?: number;
}

/**
 * Cycles through an array of strings: types one, holds, deletes, types next.
 * Loops forever. Designed for hero headlines / role tickers.
 */
export function useTypingLoop(strings: string[], options: UseTypingLoopOptions = {}) {
  const {
    typeSpeed = 60,
    deleteSpeed = 35,
    holdAfterType = 1500,
    holdAfterDelete = 300,
    startDelay = 400,
  } = options;
  const [displayText, setDisplayText] = useState("");
  const [stringIndex, setStringIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (strings.length === 0) return;
    let timeout: NodeJS.Timeout;
    let started = false;

    const tick = () => {
      const current = strings[stringIndex];

      if (!isDeleting) {
        // typing
        if (displayText.length < current.length) {
          timeout = setTimeout(() => {
            setDisplayText(current.slice(0, displayText.length + 1));
          }, typeSpeed);
        } else {
          // finished typing — hold, then start deleting
          timeout = setTimeout(() => setIsDeleting(true), holdAfterType);
        }
      } else {
        // deleting
        if (displayText.length > 0) {
          timeout = setTimeout(() => {
            setDisplayText(current.slice(0, displayText.length - 1));
          }, deleteSpeed);
        } else {
          // finished deleting — pause briefly, then advance to next string
          timeout = setTimeout(() => {
            setIsDeleting(false);
            setStringIndex((i) => (i + 1) % strings.length);
          }, holdAfterDelete);
        }
      }
    };

    if (!started && displayText === "" && stringIndex === 0 && !isDeleting) {
      // initial start delay only on first run
      timeout = setTimeout(tick, startDelay);
      started = true;
    } else {
      tick();
    }

    return () => clearTimeout(timeout);
  }, [displayText, stringIndex, isDeleting, strings, typeSpeed, deleteSpeed, holdAfterType, holdAfterDelete, startDelay]);

  return { displayText };
}
