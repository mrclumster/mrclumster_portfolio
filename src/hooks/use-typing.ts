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
