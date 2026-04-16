"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface AdventureOverlayProps {
  locationName?: string;
  onMuteToggle?: () => void;
  muted?: boolean;
}

export function AdventureOverlay({
  locationName,
  onMuteToggle,
  muted = true,
}: AdventureOverlayProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  // Fade in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9000]"
      style={{ fontFamily: "var(--font-press-start-2p, 'Press Start 2P'), monospace" }}
    >
      {/* Return button — bottom left */}
      <button
        onClick={() => router.push("/")}
        className="pointer-events-auto absolute bottom-4 left-4 flex items-center gap-2 rounded border-2 border-white/80 bg-black/70 px-3 py-2 text-[10px] text-white backdrop-blur-sm transition-opacity duration-300 hover:bg-white/20 cursor-pointer"
        style={{ opacity: visible ? 1 : 0 }}
        aria-label="Return to portfolio"
      >
        ← PORTFOLIO
      </button>

      {/* Sound toggle — bottom right */}
      {onMuteToggle && (
        <button
          onClick={onMuteToggle}
          className="pointer-events-auto absolute bottom-4 right-4 rounded border-2 border-white/80 bg-black/70 px-3 py-2 text-[10px] text-white backdrop-blur-sm transition-opacity duration-300 hover:bg-white/20 cursor-pointer"
          style={{ opacity: visible ? 1 : 0 }}
          aria-label={muted ? "Unmute music" : "Mute music"}
        >
          {muted ? "♪ OFF" : "♪ ON"}
        </button>
      )}

      {/* Location name — top left, fades in when zone entered */}
      {locationName && (
        <div
          className="absolute top-4 left-4 rounded border-2 border-white/60 bg-black/70 px-3 py-2 text-[9px] text-white/90 backdrop-blur-sm"
          style={{ opacity: visible ? 1 : 0 }}
        >
          📍 {locationName}
        </div>
      )}

      {/* Controls hint — top right */}
      <div
        className="absolute top-4 right-4 rounded border border-white/30 bg-black/50 px-2 py-1.5 text-[8px] text-white/50 backdrop-blur-sm leading-relaxed"
        style={{ opacity: visible ? 0.7 : 0 }}
      >
        WASD / ↑↓←→ MOVE
        <br />
        Z / ENTER INTERACT
      </div>
    </div>
  );
}
