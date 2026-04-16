"use client";

interface GameLoaderScreenProps {
  progress: number; // 0–1
}

export function GameLoaderScreen({ progress }: GameLoaderScreenProps) {
  const pct = Math.round(progress * 100);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black select-none">
      <p
        className="mb-8 text-xs text-white tracking-widest uppercase"
        style={{ fontFamily: "var(--font-press-start-2p, 'Press Start 2P'), monospace" }}
      >
        AZIZ&apos;S ADVENTURE
      </p>

      {/* Pixel-style loading bar */}
      <div
        className="relative w-48 h-4 border-2 border-white"
        style={{ imageRendering: "pixelated" }}
      >
        <div
          className="absolute inset-0 bg-white origin-left transition-transform duration-200"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <p
        className="mt-4 text-[10px] text-white/60"
        style={{ fontFamily: "var(--font-press-start-2p, 'Press Start 2P'), monospace" }}
      >
        LOADING... {pct}%
      </p>
    </div>
  );
}
