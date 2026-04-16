"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MobileFallback } from "./mobile-fallback";
import { AdventureOverlay } from "./adventure-overlay";
import { GameLoaderScreen } from "./game-loader-screen";

// Phaser is browser-only — never SSR
const PhaserGame = dynamic(() => import("./phaser-game"), { ssr: false });

function isMobileOrTouch() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || "ontouchstart" in window;
}

export function AdventureShell() {
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [locationName, setLocationName] = useState<string | undefined>();
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    setMounted(true);
    setMobile(isMobileOrTouch());

    // Listen for zone-enter events from the Phaser game
    const handleZoneEnter = (e: CustomEvent<{ name: string }>) => {
      setLocationName(e.detail.name);
    };
    window.addEventListener("adventure-zone-enter", handleZoneEnter as EventListener);
    return () => window.removeEventListener("adventure-zone-enter", handleZoneEnter as EventListener);
  }, []);

  // Server render: nothing (avoids hydration mismatch)
  if (!mounted) return <div className="fixed inset-0 bg-black" />;

  if (mobile) return <MobileFallback />;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Loading bar — hidden once game reports ready */}
      {!ready && <GameLoaderScreen progress={progress} />}

      {/* Phaser canvas */}
      <PhaserGame
        onProgress={setProgress}
        onReady={() => setReady(true)}
        muted={muted}
      />

      {/* Overlay controls — shown after game is ready */}
      {ready && (
        <AdventureOverlay
          locationName={locationName}
          muted={muted}
          onMuteToggle={() => setMuted((m) => !m)}
        />
      )}
    </div>
  );
}
