"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/components/adventure/use-is-mobile";

const Pokeball3D = dynamic(
  () => import("./pokeball-3d").then((m) => m.Pokeball3D),
  { ssr: false }
);

const LottieBurst = dynamic(
  () => import("./lottie-burst").then((m) => m.LottieBurst),
  { ssr: false }
);

interface AdventureTransitionProps {
  active: boolean;
  /** Optional callback when user presses ESC to skip — should fast-forward navigation. */
  onSkip?: () => void;
}

/**
 * Master timeline (ms). The 3D scene receives `t` and renders a deterministic
 * frame for that timestamp — every effect is a pure function of t.
 */
const BEAT = {
  anticipation: 250,
  collapse: 700,        // page-side: cards collapse into center
  threeStart: 700,      // 3D scene mounts
  // 3D internal beats live inside pokeball-3d.tsx, offset from threeStart:
  //   spawn 0..600, idle 600..1200, charge 1200..2000,
  //   open 2000..3000, dolly 3000..3800
  burstFire: 700 + 2000,    // Lottie burst lights up at "open" start
  whiteoutStart: 700 + 3200, // dolly mostly done → whiteout begins
  end: 700 + 3800,           // total ≈ 4500 ms
} as const;

const SKIP_HINT_AFTER = 2000;

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

export function AdventureTransition({ active, onSkip }: AdventureTransitionProps) {
  const { isMobile } = useIsMobile();
  const [t, setT] = useState(0);

  // Timeline ticker
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      setT(elapsed);
      if (elapsed < BEAT.end) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      setT(0);
    };
  }, [active]);

  // ESC to skip
  useEffect(() => {
    if (!active || !onSkip) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSkip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onSkip]);

  // Derived flags from t
  const showThree = t >= BEAT.threeStart - 100 && t < BEAT.end;
  const burstActive = t >= BEAT.burstFire && t < BEAT.whiteoutStart + 400;
  const whiteoutActive = t >= BEAT.whiteoutStart;
  const showSkipHint = active && t >= SKIP_HINT_AFTER && t < BEAT.whiteoutStart;

  // Time elapsed inside the 3D scene (used to drive every effect inside the canvas)
  const tInThree = Math.max(0, t - BEAT.threeStart);

  // Mobile fallback flat-pokéball spawn progress (0..1)
  const mobileSpawn = Math.min(1, Math.max(0, (t - BEAT.threeStart) / 600));

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[9998]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Background that intensifies through anticipation + collapse */}
          <motion.div
            className="absolute inset-0 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: t < BEAT.collapse ? 0.5 + (t / BEAT.collapse) * 0.5 : 1 }}
            transition={{ duration: 0 }}
          />

          {/* Vignette — darkens the edges */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.78) 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: t < BEAT.collapse ? Math.min(1, t / BEAT.anticipation) : 1 }}
            transition={{ duration: 0 }}
          />

          {/* Cinematic letterbox bars — slide in fast, retract during whiteout */}
          {(() => {
            const slideIn = clamp01(t / BEAT.collapse);
            const retract = t < BEAT.whiteoutStart ? 0 : clamp01((t - BEAT.whiteoutStart) / 400);
            const barHeight = (slideIn * 9 - retract * 9); // up to 9% of viewport
            return (
              <>
                <div
                  className="absolute top-0 inset-x-0 bg-black z-[1]"
                  style={{ height: `${Math.max(0, barHeight)}vh` }}
                />
                <div
                  className="absolute bottom-0 inset-x-0 bg-black z-[1]"
                  style={{ height: `${Math.max(0, barHeight)}vh` }}
                />
              </>
            );
          })()}

          {/* 3D scene — desktop, fills the viewport */}
          {!isMobile && showThree && (
            <div className="absolute inset-0">
              <Pokeball3D t={tInThree} />
            </div>
          )}

          {/* Mobile fallback — beefed-up flat pokéball with extra layered effects */}
          {isMobile && showThree && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative"
                initial={{ scale: 0 }}
                animate={{
                  scale: mobileSpawn,
                  rotate: tInThree > 1200 ? (tInThree - 1200) * 0.3 : 0,
                }}
                transition={{ duration: 0 }}
              >
                {/* Halo */}
                <div
                  className="absolute -inset-8 rounded-full bg-yellow-300/30 blur-2xl"
                  style={{
                    opacity: tInThree > 1200 ? Math.min(1, (tInThree - 1200) / 800) : 0,
                  }}
                />
                <div className="h-48 w-48 rounded-full overflow-hidden shadow-2xl relative">
                  <div className="h-1/2 w-full bg-[#e63946]" />
                  <div className="h-1/2 w-full bg-[#f4f4f4]" />
                </div>
                <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 bg-black" />
                <div
                  className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-4 ring-black"
                  style={{
                    boxShadow:
                      tInThree > 1200
                        ? `0 0 ${Math.min(40, (tInThree - 1200) / 20)}px rgba(255,238,170,1)`
                        : "none",
                  }}
                />
              </motion.div>
            </div>
          )}

          {/* Lottie light burst — full-screen, rays reach the corners */}
          {burstActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[120vmax] w-[120vmax]">
                <LottieBurst className="h-full w-full" />
              </div>
            </div>
          )}

          {/* Skip hint — also clickable to skip */}
          {showSkipHint && onSkip && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 0.4 }}
              onClick={onSkip}
              type="button"
              className="pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/80 tracking-wide font-mono select-none cursor-pointer hover:opacity-100"
            >
              press <kbd className="px-1.5 py-0.5 rounded border border-white/40 bg-white/10">ESC</kbd> to skip
            </motion.button>
          )}

          {/* Whiteout */}
          {whiteoutActive && (
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{
                opacity: Math.min(
                  1,
                  (t - BEAT.whiteoutStart) / (BEAT.end - BEAT.whiteoutStart)
                ),
              }}
              transition={{ duration: 0 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Total transition duration in ms — exported so the trigger hook stays in sync. */
export const ADVENTURE_TRANSITION_DURATION = BEAT.end;

/** Imperatively warm the dynamic chunks. Call on hover/focus of the trigger. */
export function preloadAdventureTransition() {
  void import("./pokeball-3d");
  void import("./lottie-burst");
}
