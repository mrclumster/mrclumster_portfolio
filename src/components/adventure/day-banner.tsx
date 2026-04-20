"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ZoneDetail {
  name: string;
  dayLabel: string;
  day: number;
}

interface DayEntry {
  label: string;
  uid: number;
}

/**
 * Day arrival banner — shown the first time the player steps into each day's
 * zone. Scales + fades in from the centre of the screen, holds for 2.2 s,
 * then fades out. Day 1 is skipped (player spawns there).
 */
export function DayBanner() {
  const [entry, setEntry] = useState<DayEntry | null>(null);
  const seenDays = useRef(new Set<number>([1])); // skip Day 1 on first load
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handle = (e: Event) => {
      const { dayLabel, day } = (e as CustomEvent<ZoneDetail>).detail;
      if (!day || seenDays.current.has(day)) return;

      seenDays.current.add(day);
      if (dismissTimer.current) clearTimeout(dismissTimer.current);

      setEntry({ label: dayLabel, uid: Date.now() });
      dismissTimer.current = setTimeout(() => setEntry(null), 2200);
    };

    window.addEventListener("adventure-zone-enter", handle);
    return () => {
      window.removeEventListener("adventure-zone-enter", handle);
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {entry && (
        <motion.div
          key={entry.uid}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{   opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0 flex flex-col
                     items-center justify-center gap-3 z-10"
        >
          {/* Dark scrim behind the text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
          />

          {/* Day label card */}
          <div
            className="relative z-10 flex flex-col items-center gap-2
                       border-2 border-white/70 bg-black/90
                       px-8 py-5"
            style={{ fontFamily: "var(--font-press-start-2p, 'Press Start 2P'), monospace" }}
          >
            <span className="text-[8px] tracking-[0.25em] text-white/50 uppercase">
              now entering
            </span>
            <span className="text-[18px] text-white leading-none tracking-wide">
              {entry.label}
            </span>
            <div className="mt-1 h-px w-full bg-white/30" />
            <span className="text-[7px] text-white/40 tracking-widest">
              AZIZ&apos;S MANILA TOUR
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
