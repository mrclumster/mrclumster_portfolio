"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ZoneDetail {
  name: string;
  dayLabel: string;
  day: number;
}

interface BannerEntry {
  name: string;
  uid: number; // unique key per entry so AnimatePresence re-animates on every change
}

/**
 * Zone name banner — slides in from the left whenever the player enters
 * a new photo-frame stop. Auto-dismisses after 2.5 s.
 */
export function ZoneBanner() {
  const [entry, setEntry] = useState<BannerEntry | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handle = (e: Event) => {
      const { name } = (e as CustomEvent<ZoneDetail>).detail;

      // Clear any pending auto-dismiss from the previous entry
      if (dismissTimer.current) clearTimeout(dismissTimer.current);

      if (name) {
        setEntry({ name, uid: Date.now() });
        dismissTimer.current = setTimeout(() => setEntry(null), 2500);
      } else {
        setEntry(null);
      }
    };

    window.addEventListener("adventure-zone-enter", handle);
    return () => {
      window.removeEventListener("adventure-zone-enter", handle);
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {entry && (
        <motion.div
          key={entry.uid}
          initial={{ x: -56, opacity: 0 }}
          animate={{ x: 0,   opacity: 1 }}
          exit={{   x: -56, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="pointer-events-none absolute left-4 top-4 flex items-center gap-2
                     rounded border-2 border-white/60 bg-black/85 px-3 py-2
                     text-[9px] text-white/90 leading-none"
          style={{ fontFamily: "var(--font-press-start-2p, 'Press Start 2P'), monospace" }}
        >
          <span className="text-yellow-300">▶</span>
          {entry.name}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
