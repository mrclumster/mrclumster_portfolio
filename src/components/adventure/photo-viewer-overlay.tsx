"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { TripLocation, TripPhoto } from "@/game/data/trip-locations";
import { dayGalleries, PLACEHOLDER_PHOTO } from "@/game/data/trip-locations";

type Mode = "highlights" | "all";

interface OpenDetail {
  location: TripLocation;
  photos: TripPhoto[];
}

export function PhotoViewerOverlay({ onVideoPlay }: { onVideoPlay: (src: string) => void }) {
  const [open, setOpen]         = useState<OpenDetail | null>(null);
  const [index, setIndex]       = useState(0);
  const [mode, setMode]         = useState<Mode>("highlights");

  const allPhotos = useMemo(
    () => (open ? dayGalleries[open.location.day] ?? [] : []),
    [open]
  );
  const active = mode === "highlights" ? open?.photos ?? [] : allPhotos;
  const photo: TripPhoto | undefined = active[index];

  const close = useCallback(() => {
    setOpen(null);
    setIndex(0);
    setMode("highlights");
    window.dispatchEvent(new CustomEvent("adventure-photo-viewer-close"));
  }, []);

  const nav = useCallback(
    (dir: -1 | 1) => {
      if (!active.length) return;
      setIndex((i) => (i + dir + active.length) % active.length);
    },
    [active.length]
  );

  const toggleMode = useCallback(() => {
    if (!open) return;
    const next: Mode = mode === "highlights" ? "all" : "highlights";
    if (next === "highlights" && open.photos.length === 0) return;
    if (next === "all" && allPhotos.length === 0) return;
    setMode(next);
    setIndex(0);
  }, [open, mode, allPhotos.length]);

  // Event wiring: Phaser dispatches open events, we handle the UI.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<OpenDetail>).detail;
      setOpen(d);
      setIndex(0);
      setMode(d.photos.length === 0 ? "all" : "highlights");
    };
    window.addEventListener("adventure-photo-viewer-open", onOpen);
    return () => window.removeEventListener("adventure-photo-viewer-open", onOpen);
  }, []);

  // Keyboard controls
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":  nav(-1); e.preventDefault(); break;
        case "ArrowRight": nav(1);  e.preventDefault(); break;
        case "Tab":        toggleMode(); e.preventDefault(); break;
        case "Escape":
        case "b":
        case "B":          close(); e.preventDefault(); break;
        case "z":
        case "Z":
        case "Enter":
          if (photo?.type === "video") {
            onVideoPlay(photo.src);
            e.preventDefault();
          }
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, nav, toggleMode, close, photo, onVideoPlay]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="photo-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9500] bg-black/92 flex flex-col items-center justify-center p-6"
          style={{ fontFamily: "var(--font-press-start-2p, 'Press Start 2P'), monospace" }}
        >
          {/* Top bar: mode label + current location + counter */}
          <div className="flex justify-between items-center w-full max-w-4xl mb-3 gap-3">
            <button
              onClick={toggleMode}
              className="px-3 py-2 bg-black/80 text-amber-400 text-[10px] border border-amber-400/50
                         hover:bg-amber-400/20 transition-colors flex-shrink-0"
            >
              {mode === "highlights" ? "★ HIGHLIGHTS" : "ALL PHOTOS"}
            </button>
            <div
              className="flex-1 text-center text-[10px] text-white/90 tracking-widest truncate px-2"
              title={`${open.location.dayLabel} — ${open.location.name}`}
            >
              <span className="text-amber-300">{open.location.dayLabel}</span>
              <span className="text-white/40 mx-2">·</span>
              <span>{open.location.name.toUpperCase()}</span>
            </div>
            <span className="px-3 py-2 bg-black/80 text-white/80 text-[10px] border border-white/30 flex-shrink-0">
              {active.length ? `${index + 1} / ${active.length}` : "0 / 0"}
            </span>
          </div>

          {/* Photo */}
          <motion.div
            key={`${open.location.id}-${mode}-${index}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-4xl w-full border-2 border-white bg-black"
            style={{ aspectRatio: "16 / 9" }}
          >
            {photo ? (
              photo.type === "video" ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-900">
                  <div className="text-indigo-400 text-5xl">▶</div>
                  <div className="text-neutral-400 text-xs">PRESS Z TO PLAY</div>
                </div>
              ) : (
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-contain bg-neutral-900"
                  onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_PHOTO; }}
                />
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/60 text-xs">
                NO PHOTOS YET
              </div>
            )}

            {/* Caption strip */}
            {photo?.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] px-3 py-2">
                {photo.caption}
              </div>
            )}

            {/* Prev / Next click zones */}
            {active.length > 1 && (
              <>
                <button
                  onClick={() => nav(-1)}
                  className="absolute left-0 top-0 bottom-0 w-1/5 hover:bg-white/5 transition-colors
                             flex items-center justify-start pl-3 text-white/70 hover:text-white text-2xl"
                  aria-label="Previous"
                >
                  ◄
                </button>
                <button
                  onClick={() => nav(1)}
                  className="absolute right-0 top-0 bottom-0 w-1/5 hover:bg-white/5 transition-colors
                             flex items-center justify-end pr-3 text-white/70 hover:text-white text-2xl"
                  aria-label="Next"
                >
                  ►
                </button>
              </>
            )}
          </motion.div>

          {/* Info box */}
          <div className="max-w-4xl w-full mt-4 border-2 border-white bg-black/90 p-4">
            <div className="text-indigo-400 text-[11px] mb-2">
              {open.location.dayLabel} — {open.location.name.toUpperCase()}
            </div>
            <div className="text-neutral-300 text-[10px] leading-relaxed">
              {open.location.description}
            </div>
          </div>

          {/* Bottom nav hint */}
          <div className="mt-3 text-neutral-500 text-[9px] flex gap-6">
            <span>◄ ► PHOTOS</span>
            <span>TAB MODE</span>
            <span>B CLOSE</span>
            {photo?.type === "video" && <span className="text-indigo-400">Z PLAY</span>}
          </div>

          {/* Close button (top-right, always accessible) */}
          <button
            onClick={close}
            className="absolute top-4 right-4 px-3 py-2 border border-white/60 bg-black/70
                       text-white text-[10px] hover:bg-white/20 transition-colors cursor-pointer"
          >
            ✕ CLOSE
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
