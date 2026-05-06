"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface AnimatedNameProps {
  name: string;
  className?: string;
}

export function AnimatedName({ name, className }: AnimatedNameProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, -72]);

  // Trigger char animation only once on mount
  useEffect(() => {
    if (!ref.current || reduced) return;
    const spans = ref.current.querySelectorAll<HTMLSpanElement>("[data-char]");
    spans.forEach((s, i) => {
      s.style.animationDelay = `${i * 25}ms`;
      s.classList.add("hero-char-play");
    });
  }, [reduced]);

  return (
    <motion.h1
      ref={ref}
      className={className}
      style={reduced ? undefined : { y }}
      aria-label={name}
    >
      {Array.from(name).map((ch, i) => (
        <span
          key={i}
          data-char
          className="inline-block opacity-0"
          style={
            reduced
              ? { opacity: 1 }
              : { willChange: "transform, opacity" }
          }
          aria-hidden
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </motion.h1>
  );
}
