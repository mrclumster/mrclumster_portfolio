"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { MobileFallback } from "./mobile-fallback";
import { AdventureOverlay } from "./adventure-overlay";
import { GameLoaderScreen } from "./game-loader-screen";
import { ZoneBanner } from "./zone-banner";
import { DayBanner } from "./day-banner";

// Phaser is browser-only — never SSR
const PhaserGame = dynamic(() => import("./phaser-game"), { ssr: false });

function isMobileOrTouch() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || "ontouchstart" in window;
}

export function AdventureShell() {
  const [mounted, setMounted]   = useState(false);
  const [mobile, setMobile]     = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady]       = useState(false);
  const [muted, setMuted]       = useState(true);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setMobile(isMobileOrTouch());

    const handleVideoPlay = (e: Event) =>
      setVideoSrc((e as CustomEvent<{ src: string }>).detail.src);

    window.addEventListener("adventure-video-play", handleVideoPlay);
    return () => window.removeEventListener("adventure-video-play", handleVideoPlay);
  }, []);

  const closeVideo = () => {
    setVideoSrc(null);
    window.dispatchEvent(new CustomEvent("adventure-video-close"));
  };

  if (!mounted) return <div className="fixed inset-0 bg-black" />;
  if (mobile)   return <MobileFallback />;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Phaser canvas — always rendered so the game loads immediately */}
      <PhaserGame
        onProgress={setProgress}
        onReady={() => setReady(true)}
        muted={muted}
      />

      {/* Loading screen — fades out when ready */}
      <AnimatePresence>
        {!ready && <GameLoaderScreen key="loader" progress={progress} />}
      </AnimatePresence>

      {/* Game HUD + banner layer — only shown after game is ready */}
      {ready && (
        <>
          {/* Fixed control buttons (← Portfolio, ♪ toggle, WASD hint) */}
          <AdventureOverlay
            muted={muted}
            onMuteToggle={() => setMuted((m) => !m)}
          />

          {/* Zone name slide-in (top-left, auto-dismisses) */}
          <div className="pointer-events-none fixed inset-0 z-[9001]">
            <ZoneBanner />
          </div>

          {/* Day arrival announcement (centred, first visit only) */}
          <div className="pointer-events-none fixed inset-0 z-[9002]">
            <DayBanner />
          </div>
        </>
      )}

      {/* Fullscreen video overlay — triggered from PhotoViewerScene */}
      <AnimatePresence>
        {videoSrc && (
          <motion.div
            key="video-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          >
            <motion.video
              src={videoSrc}
              autoPlay
              controls
              className="max-h-screen max-w-full"
              onEnded={closeVideo}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
            <button
              onClick={closeVideo}
              className="absolute top-4 right-4 border border-white/60 bg-black/70
                         px-3 py-2 text-white hover:bg-white/20 transition-colors cursor-pointer"
              style={{
                fontFamily: "var(--font-press-start-2p, 'Press Start 2P'), monospace",
                fontSize: "9px",
              }}
            >
              ✕ CLOSE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
