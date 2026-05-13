"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPEECH_BUBBLES = [
  "Meow!",
  "Cloud is watching the code!",
  "Ready for adventure!",
  "I hope you're having a great day!",
  "Is that a bug I see?",
];

export function SidePet() {
  const [x, setX] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const [isJumping, setIsJumping] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isJumping) {
        setX((prev) => {
          const next = prev + direction * 2;
          if (next > 100 || next < -100) {
            setDirection((d) => -d);
            return prev;
          }
          return next;
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, [direction, isJumping]);

  const handleClick = () => {
    setIsJumping(true);
    setBubble(SPEECH_BUBBLES[Math.floor(Math.random() * SPEECH_BUBBLES.length)]);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setIsJumping(false);
      setBubble(null);
      timeoutRef.current = null;
    }, 2000);
  };

  return (
    <div className="relative h-12 mt-8 border-b border-[color:var(--ink)] border-dashed overflow-visible">
      <motion.div
        className="absolute bottom-0 cursor-pointer"
        animate={{ x: `${x}%`, scaleX: direction }}
        style={{ left: "50%" }}
        onClick={handleClick}
      >
        <AnimatePresence>
          {bubble && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -40 }}
              exit={{ opacity: 0 }}
              className="absolute left-1/2 -translate-x-1/2 bg-[color:var(--ink)] text-[color:var(--paper)] text-[10px] px-2 py-1 whitespace-nowrap font-mono"
            >
              {bubble}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[color:var(--ink)] rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.img
          src="cloud.svg"
          alt="Cloud the Cat"
          className="w-10 h-10"
          style={{ imageRendering: "pixelated" }}
          animate={isJumping ? { y: [0, -20, 0], rotate: [0, 360] } : {}}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </div>
  );
}
