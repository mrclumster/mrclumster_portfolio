"use client";

import { useState } from "react";
import { useKonami } from "@/hooks/use-konami";

const SEA_CREATURES = ["🐟", "🐠", "🐡", "🦈", "🐙", "🦑", "🦐", "🐬", "🐳", "🐚"];

interface Creature {
  id: number;
  emoji: string;
  left: number;       // vw %
  delay: number;      // s
  duration: number;   // s
  size: number;       // rem
  wobble: number;     // horizontal drift px
  rotate: number;     // final rotation deg
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function spawnCreatures(count: number): Creature[] {
  return Array.from({ length: count }, (_, i) => ({
    id: Date.now() + i,
    emoji: randomItem(SEA_CREATURES),
    left: randomBetween(1, 95),
    delay: randomBetween(0, 2.5),
    duration: randomBetween(3, 6),
    size: randomBetween(1.4, 2.8),
    wobble: randomBetween(-40, 40),
    rotate: randomBetween(-30, 30),
  }));
}

export function FishRain() {
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [toast, setToast] = useState(false);

  const activate = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setCreatures(spawnCreatures(45));
    setToast(true);

    setTimeout(() => setCreatures([]), 9000);
    setTimeout(() => setToast(false), 4000);
  };

  useKonami(activate);

  if (creatures.length === 0 && !toast) return null;

  return (
    <>
      {creatures.map((c) => (
        <span
          key={c.id}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 z-[9999] select-none"
          style={{
            left: `${c.left}vw`,
            fontSize: `${c.size}rem`,
            "--wobble": `${c.wobble}px`,
            "--rotate": `${c.rotate}deg`,
            animationName: "fish-fall",
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
            animationTimingFunction: "cubic-bezier(0.4, 0, 0.6, 1)",
            animationFillMode: "both",
          } as React.CSSProperties}
        >
          {c.emoji}
        </span>
      ))}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] rounded-full bg-card ring-1 ring-foreground/10 px-5 py-2.5 text-sm font-medium shadow-xl backdrop-blur-sm"
          style={{ animation: "fish-toast 4s ease forwards" }}
        >
          🎣 FishFresh activated
        </div>
      )}
    </>
  );
}
