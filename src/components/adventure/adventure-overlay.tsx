"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// PORTFOLIO + music toggle now live inside the ConsoleFrame bar. This overlay
// only owns the top-right controls-hint popover + its "?" toggle.

const BTN =
  "pointer-events-auto rounded border-2 border-white/80 bg-black/80 " +
  "px-3 py-2 text-[10px] text-white " +
  "hover:bg-white/20 transition-colors cursor-pointer";

export function AdventureOverlay() {
  // Controls hint auto-hides 4s after first mount; a "?" button brings it back
  const [helpOpen, setHelpOpen] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setHelpOpen(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9000]"
      style={{ fontFamily: "var(--font-press-start-2p, 'Press Start 2P'), monospace" }}
    >
      {/* Controls hint — top right. Auto-hides after 4s, toggled by the ? button */}
      <AnimatePresence>
        {helpOpen && (
          <motion.div
            key="help"
            initial={{ opacity: 0, y: -8, x: 8 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -8, x: 8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-4 right-14 rounded border border-white/30
                       bg-black/80 px-2 py-1.5 text-[8px] text-white/60
                       leading-relaxed"
          >
            WASD / ↑↓←→&nbsp;&nbsp;MOVE
            <br />
            A / Z / ENTER&nbsp;&nbsp;INTERACT
            <br />
            TAB&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ALL PHOTOS
            <br />
            ESC / B&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BACK
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help toggle — top right */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        onClick={() => setHelpOpen((v) => !v)}
        className={`${BTN} absolute top-4 right-4 w-9 h-9 flex items-center justify-center p-0`}
        aria-label={helpOpen ? "Hide controls" : "Show controls"}
      >
        {helpOpen ? "×" : "?"}
      </motion.button>
    </div>
  );
}
