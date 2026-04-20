"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface AdventureOverlayProps {
  onMuteToggle?: () => void;
  muted?: boolean;
}

// Shared button class — no backdrop-blur (it blurs the pixel-art canvas behind it)
const BTN =
  "pointer-events-auto rounded border-2 border-white/80 bg-black/80 " +
  "px-3 py-2 text-[10px] text-white " +
  "hover:bg-white/20 transition-colors cursor-pointer";

export function AdventureOverlay({ onMuteToggle, muted = true }: AdventureOverlayProps) {
  const router = useRouter();

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9000]"
      style={{ fontFamily: "var(--font-press-start-2p, 'Press Start 2P'), monospace" }}
    >
      {/* ← Portfolio — bottom left */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.45, ease: "easeOut" as const }}
        onClick={() => router.push("/")}
        className={`${BTN} absolute bottom-4 left-4 flex items-center gap-2`}
        aria-label="Return to portfolio"
      >
        ← PORTFOLIO
      </motion.button>

      {/* Sound toggle — bottom right */}
      {onMuteToggle && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.45, ease: "easeOut" as const }}
          onClick={onMuteToggle}
          className={`${BTN} absolute bottom-4 right-4`}
          aria-label={muted ? "Unmute music" : "Mute music"}
        >
          {muted ? "♪ OFF" : "♪ ON"}
        </motion.button>
      )}

      {/* Controls hint — top right */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.45, ease: "easeOut" as const }}
        className="absolute top-4 right-4 rounded border border-white/30
                   bg-black/75 px-2 py-1.5 text-[8px] text-white/50
                   leading-relaxed"
      >
        WASD / ↑↓←→&nbsp;&nbsp;MOVE
        <br />
        Z / ENTER&nbsp;&nbsp;&nbsp;&nbsp;INTERACT
        <br />
        TAB&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ALL PHOTOS
      </motion.div>
    </div>
  );
}
