"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MobileFallback } from "./mobile-fallback";
import { AdventureOverlay } from "./adventure-overlay";
import { GameLoaderScreen } from "./game-loader-screen";
import { ZoneBanner } from "./zone-banner";
import { DayBanner } from "./day-banner";
import { PhotoViewerOverlay } from "./photo-viewer-overlay";
import { ConsoleFrame } from "./console-frame";
import { DaySelectMenu, DayOverworld } from "./adventure-screens";
import { StarterSelect } from "./starter-select";
import { BattleScene } from "./battle-scene";
import { ArenaScreen } from "./arena-screen";
import { PassportBoot } from "./boot-sequence";
import { getCreature, CREATURES, assignDayBosses } from "./creatures";
import { prewarmCreatureCache } from "./poke-api";
import { audio } from "./audio";

type Screen = "boot" | "title" | "starter" | "menu" | "world" | "arena" | "battle";
const BOOTED_KEY = "adventure-booted"; // sessionStorage — skip boot after first time
type BattleReturn = "arena" | "world";

const STARTER_KEY     = "adventure-starter";
const DEFEATED_KEY    = "adventure-defeated-wilds";

function isMobileOrTouch() {
  // Only block devices narrower than a modern phone — everything 360+ can play
  if (typeof window === "undefined") return false;
  return window.innerWidth < 360;
}

export function AdventureShell() {
  const [mounted, setMounted]     = useState(false);
  const [mobile, setMobile]       = useState(false);
  const [ready, setReady]         = useState(false);
  const [screen, setScreen]       = useState<Screen>(() => {
    // Skip boot+splash on subsequent screens within the same tab session
    if (typeof window !== "undefined" && sessionStorage.getItem(BOOTED_KEY)) return "title";
    return "boot";
  });
  const [activeDay, setActiveDay] = useState<number>(1);
  const [visited, setVisited]     = useState<Set<number>>(new Set());
  const [starterId, setStarterId]     = useState<string | null>(null);
  const [battleOpponent, setBattleOpponent] = useState<string | null>(null);
  const [battleReturnTo, setBattleReturnTo] = useState<BattleReturn>("arena");
  const [defeatedWilds, setDefeatedWilds]   = useState<Set<number>>(new Set());
  const [muted, setMuted]         = useState(true);
  const [videoSrc, setVideoSrc]   = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setMobile(isMobileOrTouch());

    // Restore previously-picked starter so the user doesn't pick on every refresh
    const saved = typeof window !== "undefined" ? localStorage.getItem(STARTER_KEY) : null;
    if (saved && CREATURES.some((c) => c.id === saved)) setStarterId(saved);
    else if (saved) localStorage.removeItem(STARTER_KEY);

    // Restore defeated wilds — sessionStorage so state resets on tab close
    if (typeof window !== "undefined") {
      const raw = sessionStorage.getItem(DEFEATED_KEY);
      if (raw) {
        try {
          const arr: number[] = JSON.parse(raw);
          setDefeatedWilds(new Set(arr));
        } catch {}
      }
      // Clear any legacy localStorage entry from older builds
      localStorage.removeItem(DEFEATED_KEY);
    }

    // Pre-warm PokéAPI data in the background so the first battle has live data
    prewarmCreatureCache(CREATURES.map((c) => c.dexId));

    // Boot animation ends quickly — show the console immediately
    const t = setTimeout(() => setReady(true), 500);

    const handleVideoPlay = (e: Event) =>
      setVideoSrc((e as CustomEvent<{ src: string }>).detail.src);

    window.addEventListener("adventure-video-play", handleVideoPlay);
    return () => {
      clearTimeout(t);
      window.removeEventListener("adventure-video-play", handleVideoPlay);
    };
  }, []);

  // Sync BGM with current screen
  useEffect(() => {
    if (screen === "title" || screen === "starter" || screen === "menu" || screen === "arena") {
      audio.playBgm("menu");
    } else if (screen === "world") {
      audio.playBgm("overworld");
    } else if (screen === "battle") {
      audio.playBgm("battle");
    }
  }, [screen]);

  // Sync mute toggle with audio manager
  useEffect(() => {
    audio.setMuted(muted);
  }, [muted]);

  // ESC / B = back one level
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (screen === "world")  setScreen("menu");
      else if (screen === "arena") setScreen("menu");
      else if (screen === "menu")  setScreen("title");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen]);

  const closeVideo = () => {
    setVideoSrc(null);
    window.dispatchEvent(new CustomEvent("adventure-video-close"));
  };

  const pickDay = (day: number) => {
    setActiveDay(day);
    setScreen("world");
  };

  if (!mounted) return <div className="fixed inset-0 bg-black" />;
  if (mobile)   return <MobileFallback />;

  return (
    <>
      <ConsoleFrame muted={muted} onMuteToggle={() => setMuted((m) => !m)}>
        <AnimatePresence mode="wait">
          {screen === "boot" && (
            <motion.div key="boot" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}>
              <PassportBoot
                cinematic
                onDone={() => {
                  if (typeof window !== "undefined") sessionStorage.setItem(BOOTED_KEY, "1");
                  setScreen(starterId ? "menu" : "starter");
                }}
              />
            </motion.div>
          )}
          {screen === "title" && (
            <motion.div key="title" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}>
              <PassportBoot
                cinematic={false}
                onDone={() => setScreen(starterId ? "menu" : "starter")}
              />
            </motion.div>
          )}
          {screen === "starter" && (
            <motion.div key="starter" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}>
              <StarterSelect
                onPick={(id) => {
                  setStarterId(id);
                  if (typeof window !== "undefined") localStorage.setItem(STARTER_KEY, id);
                  setScreen("menu");
                }}
              />
            </motion.div>
          )}
          {screen === "menu" && (
            <motion.div key="menu" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}>
              <DaySelectMenu
                onPickDay={pickDay}
                onOpenArena={() => setScreen("arena")}
                onChangePartner={() => {
                  setStarterId(null);
                  if (typeof window !== "undefined") localStorage.removeItem(STARTER_KEY);
                  setScreen("starter");
                }}
                visited={visited}
              />
            </motion.div>
          )}
          {screen === "arena" && (
            <motion.div key="arena" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}>
              <ArenaScreen
                excludeId={starterId}
                onBack={() => setScreen("menu")}
                onPick={(id) => { setBattleOpponent(id); setBattleReturnTo("arena"); setScreen("battle"); }}
              />
            </motion.div>
          )}
          {screen === "world" && (
            <motion.div key={`world-${activeDay}`} className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}>
              <DayOverworld
                day={activeDay}
                starterId={starterId}
                wildCreatureId={starterId ? assignDayBosses(starterId)[activeDay] : null}
                wildDefeated={defeatedWilds.has(activeDay)}
                onBack={() => setScreen("menu")}
                onVisit={() => setVisited((v) => new Set(v).add(activeDay))}
                onEncounterWild={() => {
                  if (!starterId) return;
                  const wildId = assignDayBosses(starterId)[activeDay];
                  setBattleOpponent(wildId);
                  setBattleReturnTo("world");
                  setScreen("battle");
                }}
              />
            </motion.div>
          )}
          {screen === "battle" && starterId && battleOpponent && (
            <motion.div key={`battle-${battleOpponent}`} className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}>
              <BattleScene
                player={getCreature(starterId)}
                opponent={getCreature(battleOpponent)}
                onExit={(result) => {
                  // Mark wild defeated if victory happened in a world-launched battle
                  if (battleReturnTo === "world" && result === "victory") {
                    setDefeatedWilds((prev) => {
                      const next = new Set(prev).add(activeDay);
                      if (typeof window !== "undefined") {
                        sessionStorage.setItem(DEFEATED_KEY, JSON.stringify(Array.from(next)));
                      }
                      return next;
                    });
                  }
                  setBattleOpponent(null);
                  setScreen(battleReturnTo);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </ConsoleFrame>

      {/* Loading screen — fades out when the boot is done */}
      <AnimatePresence>
        {!ready && <GameLoaderScreen key="loader" progress={0.8} />}
      </AnimatePresence>

      {ready && (
        <>
          <AdventureOverlay />

          <div className="pointer-events-none fixed inset-0 z-[9001]">
            <ZoneBanner />
          </div>
          <div className="pointer-events-none fixed inset-0 z-[9002]">
            <DayBanner />
          </div>

          <PhotoViewerOverlay onVideoPlay={setVideoSrc} />
        </>
      )}

      {/* Fullscreen video overlay */}
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
    </>
  );
}
