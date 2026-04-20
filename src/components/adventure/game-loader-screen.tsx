"use client";

import { motion } from "framer-motion";

interface GameLoaderScreenProps {
  progress: number; // 0–1
}

/**
 * Full-screen loading overlay.
 * Wrapped in motion.div so AnimatePresence in AdventureShell
 * can fade it out smoothly when the game becomes ready.
 */
export function GameLoaderScreen({ progress }: GameLoaderScreenProps) {
  const pct = Math.round(progress * 100);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black select-none"
    >
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 text-xs text-white tracking-widest uppercase"
        style={{ fontFamily: "var(--font-press-start-2p, 'Press Start 2P'), monospace" }}
      >
        AZIZ&apos;S ADVENTURE
      </motion.p>

      {/* Pixel-style loading bar */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.8 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative w-48 h-4 border-2 border-white"
        style={{ imageRendering: "pixelated" }}
      >
        <div
          className="absolute inset-0 bg-white origin-left transition-transform duration-200"
          style={{ transform: `scaleX(${progress})` }}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="mt-4 text-[10px] text-white/60"
        style={{ fontFamily: "var(--font-press-start-2p, 'Press Start 2P'), monospace" }}
      >
        LOADING... {pct}%
      </motion.p>
    </motion.div>
  );
}
