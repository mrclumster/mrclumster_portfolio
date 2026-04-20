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
  const gameRef      = useRef<Phaser.Game | null>(null);
  // Guards against React StrictMode double-invoking the async import
  const creatingRef  = useRef(false);

  useEffect(() => {
    if (!containerRef.current || gameRef.current || creatingRef.current) return;
    creatingRef.current = true;

    import("@/game/index").then(({ createGame }) => {
      // Abort if cleanup already ran (StrictMode unmount between import start and resolve)
      if (!creatingRef.current || !containerRef.current) return;

      gameRef.current = createGame(containerRef.current, onProgress, onReady, muted);
    });

    return () => {
      creatingRef.current = false;
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="adventure-canvas-container absolute inset-0"
    />
  );
}
