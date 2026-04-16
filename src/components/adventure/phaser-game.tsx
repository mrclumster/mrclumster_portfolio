"use client";

import { useEffect, useRef } from "react";
import type Phaser from "phaser";

interface PhaserGameProps {
  onProgress: (v: number) => void;
  onReady: () => void;
  muted: boolean;
}

export default function PhaserGame({ onProgress, onReady, muted }: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    // Dynamically import the game factory (Phaser uses browser APIs)
    import("@/game/index").then(({ createGame }) => {
      if (!containerRef.current) return;
      gameRef.current = createGame(containerRef.current, onProgress, onReady, muted);
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-black"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
