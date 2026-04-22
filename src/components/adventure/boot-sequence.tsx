"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { allFxUrls } from "./move-fx";
import { CREATURES } from "./creatures";
import { useIsMobile } from "./use-is-mobile";

// ───────────────────────────────────────────────────────────────────────────
// PassportBoot — a single cinematic boot sequence themed around a passport
// stamping journey. Sells the game's "6 days, 16 checkpoints" premise before
// the title screen even appears.
//
// Beats (total ~2.6s, skippable on any key):
//   0.0s  black → cream paper background fades in, paper plane flies
//   0.3s  passport cover drops in, centered, closed
//   0.7s  passport flips open to inner pages
//   1.0s  stamp 1 (MANILA)   slams down with ink thud + particles
//   1.4s  stamp 2 (BAGUIO)   slams down
//   1.8s  stamp 3 (TAGAYTAY) slams down
//   2.2s  whole passport lifts off top
//   2.3s  @mrclumster reveals large, divider draws in, PRESS ANY KEY blinks
//
// Assets preload silently throughout the sequence so by the time PRESS ANY KEY
// fires the move FX + creature sprites are cached.
// ───────────────────────────────────────────────────────────────────────────

const HANDLE = "@mrclumster";

const STAMPS = [
  { label: "MANILA",   color: "#d03030", angle: -12, delay: 1.0 },
  { label: "BAGUIO",   color: "#2060c0", angle:   8, delay: 1.4 },
  { label: "TAGAYTAY", color: "#3a8a40", angle:  -5, delay: 1.8 },
];

// ── Props ────────────────────────────────────────────────────────────────
// cinematic=true  → full boot sequence (passport drops, flips, stamps slam, passport lifts, text reveals)
// cinematic=false → skip straight to the final resting state (used when we come back to the
//                   title screen from the menu — the user has already seen the intro once)
export function PassportBoot({
  onDone,
  cinematic = true,
}: { onDone: () => void; cinematic?: boolean }) {
  const { isMobile } = useIsMobile();
  const [canFinish, setCanFinish] = useState(!cinematic);
  const [finished,  setFinished]  = useState(false);

  // Preload assets silently in the background
  useEffect(() => {
    const manifest = [
      ...allFxUrls(),
      ...CREATURES.slice(0, 4).map(
        (c) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${c.dexId}.png`
      ),
    ];
    for (const url of manifest) {
      const img = new Image();
      img.src = url;
    }
  }, []);

  // Unlock "PRESS START" after the cinematic settles (or immediately if skipped)
  useEffect(() => {
    if (!cinematic) return;
    const t = setTimeout(() => setCanFinish(true), 2600);
    return () => clearTimeout(t);
  }, [cinematic]);

  // Any keypress / click skips or completes
  useEffect(() => {
    const advance = () => {
      if (finished) return;
      setFinished(true);
      setTimeout(onDone, 320);
    };
    const onKey = (e: KeyboardEvent) => {
      // Only the Enter key (or the on-screen START button which dispatches Enter)
      // advances from the title. Everything else is ignored so random typing /
      // Alt-Tab / etc. don't accidentally start the game.
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key !== "Enter") return;
      advance();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [finished, onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: finished ? 0 : 1 }}
      transition={{ duration: 0.32 }}
      className="absolute inset-0 overflow-hidden"
      /* intentionally no onClick — only the START button (Enter) advances */
      style={{
        // Warm paper-cream background with subtle grid so it feels like a passport page backdrop
        background:
          "radial-gradient(ellipse at center, #faf3df 0%, #e8dbb8 55%, #c9b98a 100%)",
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      {/* Subtle paper texture lines */}
      <PaperGrid />

      {/* Cinematic-only plane sweep */}
      {cinematic && <PaperPlane />}

      {/* Full interactive title scrapbook — only on the resting title screen */}
      {!cinematic && <TitleScrapbook />}

      {/* Passport — only rendered during the boot cinematic. When we come back
          to this screen from the menu, the passport stays "gone" and only the
          title text remains on the cream background */}
      {cinematic && (() => {
        const passportScale = isMobile ? 0.6 : 1;
        return (
          <AnimatePresence>
            <motion.div
              key="passport"
              initial={{ y: -400, scale: 0.85 * passportScale, opacity: 0, rotate: -4 }}
              animate={{
                y:       [-400, 0,    0,   0,   0,   0,   -800],
                scale:   [0.85 * passportScale, passportScale, passportScale, passportScale, passportScale, passportScale, 1.1 * passportScale],
                opacity: [0,     1,    1,   1,   1,   1,    0  ],
                rotate:  [-4,    0,    0,   0,   0,   0,    3  ],
              }}
              transition={{
                duration: 2.5,
                times:    [0, 0.12, 0.28, 0.44, 0.6, 0.88, 1],
                ease: "easeInOut",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <PassportOpen />
            </motion.div>
          </AnimatePresence>
        );
      })()}

      {/* "@mrclumster" reveal — with mouse parallax tilt on title screen */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={canFinish ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      >
        <TitleFrame show={canFinish && !cinematic}>
          <LogoWithParallax cinematic={cinematic} />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={canFinish ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{ width: 160, height: 4, background: "#d03030", marginTop: 12 }}
          />
          <TaglineLines />
        </TitleFrame>
      </motion.div>

      {/* Blinking "PRESS START" once cinematic is done */}
      <AnimatePresence>
        {canFinish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.3, 1] }}
            transition={{
              duration: 1.2,
              delay: cinematic ? 0.8 : 0,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute bottom-12 left-0 right-0 flex justify-center text-[12px] pointer-events-none"
            style={{ color: "#1a2550", letterSpacing: "3px", textShadow: "2px 2px 0 #d0303044" }}
          >
            PRESS START
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Decorative journal frame around the title block ────────────────────
// `show` controls only the frame decorations — the wrapped title text
// (children) is always rendered so the boot cinematic's own reveal still works.
function TitleFrame({ show, children }: { show: boolean; children: React.ReactNode }) {
  const { isMobile } = useIsMobile();
  return (
    <div
      className="relative flex flex-col items-center"
      style={{
        padding: isMobile ? "22px 18px 20px" : "34px 60px 32px",
        maxWidth: isMobile ? "calc(100vw - 24px)" : undefined,
      }}
    >
      {/* Decorations — fade in after the cinematic ends */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.5, delay: show ? 0.4 : 0 }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Outer frame — navy, subtle */}
        <div
          className="absolute inset-0"
          style={{ border: "2px solid #1a2550", opacity: 0.22 }}
        />
        {/* Inner frame — 1px hairline offset inward */}
        <div
          className="absolute"
          style={{ inset: 6, border: "1px solid #1a2550", opacity: 0.14 }}
        />
        {/* 4 red corner flourish dots */}
        {[
          { top: -4, left: -4 },
          { top: -4, right: -4 },
          { bottom: -4, left: -4 },
          { bottom: -4, right: -4 },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: 8, height: 8,
              background: "#d03030",
              ...pos,
              boxShadow: "0 0 0 1.5px #fdfaed",
            }}
          />
        ))}
        {/* Small green jacket accents between outer/inner corners */}
        {[
          { top: 10, left: 10 },
          { top: 10, right: 10 },
          { bottom: 10, left: 10 },
          { bottom: 10, right: 10 },
        ].map((pos, i) => (
          <div
            key={`g-${i}`}
            className="absolute"
            style={{ width: 3, height: 3, background: "#2a6c40", ...pos }}
          />
        ))}
      </motion.div>
      {/* Title text — always rendered */}
      <div className="relative flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}

// ── Tagline text lines — responsive sizes + tighter letterspacing on mobile
function TaglineLines() {
  const { isMobile } = useIsMobile();
  const base = {
    color: "#6a5a30",
    letterSpacing: isMobile ? "1px" : "2px",
    whiteSpace: "nowrap" as const,
    textAlign: "center" as const,
  };
  return (
    <>
      <div className="mt-2" style={{ ...base, fontSize: isMobile ? 8 : 10 }}>
        OJT ADVENTURE BLOG
      </div>
      <div className="mt-2" style={{ ...base, fontSize: isMobile ? 7 : 9 }}>
        A PIXELATED GAME EDITION
      </div>
      <div className="mt-2" style={{ ...base, fontSize: isMobile ? 7 : 9 }}>
        6 DAYS · 16 CHECKPOINTS
      </div>
    </>
  );
}

// ── Logo with mouse-parallax tilt ───────────────────────────────────────
function LogoWithParallax({ cinematic }: { cinematic: boolean }) {
  const { isMobile, isTouch } = useIsMobile();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (cinematic || isTouch) return;
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      setOffset({ x: nx, y: ny });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [cinematic, isTouch]);
  return (
    <motion.div
      animate={{
        rotate:     offset.x * 2.5,
        x:          offset.x * 8,
        y:          offset.y * 4,
      }}
      transition={{ type: "spring", stiffness: 60, damping: 18 }}
      style={{
        color: "#1a2550",
        fontSize: isMobile ? 22 : 34,
        letterSpacing: isMobile ? "2px" : "3px",
        textShadow: "3px 3px 0 #d03030, 6px 6px 0 rgba(0,0,0,0.15)",
      }}
    >
      {HANDLE}
    </motion.div>
  );
}

// ── Shared mouse position hook for parallax ─────────────────────────────
function useMouseNormalized() {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const { isTouch } = useIsMobile();
  useEffect(() => {
    if (isTouch) return; // no hover on phones; keep static centre
    const onMove = (e: MouseEvent) => {
      setPos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isTouch]);
  return pos;
}

// ── The full interactive title scrapbook ─────────────────────────────────
function TitleScrapbook() {
  const m = useMouseNormalized();
  return (
    <>
      {/* Ambient motion layer */}
      <CloudDrift y="8%"  speed={45} delay={0}  />
      <CloudDrift y="15%" speed={60} delay={12} />
      <BirdFlock y="18%" delay={3}  />
      <BirdFlock y="26%" delay={17} />
      <DriftingPlane />
      <JeepneyDrive />

      {/* Faint pokemon silhouettes drifting across the page */}
      <PokemonSilhouettes />

      {/* Corner stamps (retained from before) */}
      <CornerStampsMark />

      {/* Scrapbook props — polaroids, tickets, postcards, sticky notes, etc. */}
      <ScrapbookProps mouseX={m.x} mouseY={m.y} />
    </>
  );
}

// ── Corner stamps (renamed to avoid collision) ──────────────────────────
function CornerStampsMark() {
  // Four faded passport-style corner marks to fill the empty cream space.
  const corners = [
    { label: "APPROVED",  color: "#2a6c40", angle: -8,  pos: "top-left"     },
    { label: "VISA",      color: "#1a2550", angle:  6,  pos: "top-right"    },
    { label: "ENTRY",     color: "#d03030", angle:  4,  pos: "bottom-left"  },
    { label: "CLEARED",   color: "#2a6c40", angle: -6,  pos: "bottom-right" },
  ] as const;
  return (
    <>
      {corners.map((c) => {
        const style: React.CSSProperties = {
          border: `2px solid ${c.color}`,
          color: c.color,
          padding: "5px 10px",
          fontSize: 8,
          letterSpacing: "2px",
          fontFamily: "'Press Start 2P', monospace",
          opacity: 0.28,
          transform: `rotate(${c.angle}deg)`,
          background: "transparent",
          boxShadow: `inset 0 0 0 1px ${c.color}22`,
        };
        const pos: React.CSSProperties =
          c.pos === "top-left"     ? { top: 36,    left: 36   } :
          c.pos === "top-right"    ? { top: 44,    right: 36  } :
          c.pos === "bottom-left"  ? { bottom: 80, left: 44   } :
                                     { bottom: 72, right: 32  };
        return (
          <div key={c.label} className="absolute" style={{ ...style, ...pos }}>
            {c.label}
          </div>
        );
      })}
    </>
  );
}

function DriftingPlane() {
  return (
    <motion.svg
      initial={{ x: "-15%" }}
      animate={{ x: "115%" }}
      transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      width={36}
      height={36}
      viewBox="0 0 24 24"
      className="absolute pointer-events-none"
      style={{
        top: "18%",
        opacity: 0.28,
        filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.1))",
      }}
    >
      <polygon points="1,12 22,2 16,13 22,14 9,22" fill="#1a2550" stroke="#1a2550" strokeWidth="1" />
      <polygon points="16,13 9,22 11,15" fill="#3a4a80" stroke="#1a2550" strokeWidth="1" />
    </motion.svg>
  );
}

// ── Ambient clouds — slow horizontal parallax drift ─────────────────────
function CloudDrift({ y, speed, delay }: { y: string; speed: number; delay: number }) {
  return (
    <motion.div
      initial={{ x: "-20%" }}
      animate={{ x: "120%" }}
      transition={{ duration: speed, delay, ease: "linear", repeat: Infinity }}
      className="absolute pointer-events-none"
      style={{
        top: y,
        width: 90, height: 32,
        opacity: 0.22,
      }}
    >
      <svg viewBox="0 0 90 32" width="100%" height="100%" shapeRendering="crispEdges">
        <ellipse cx="28" cy="20" rx="20" ry="10" fill="#ffffff" />
        <ellipse cx="50" cy="16" rx="24" ry="12" fill="#ffffff" />
        <ellipse cx="70" cy="22" rx="16" ry="8"  fill="#ffffff" />
        <ellipse cx="50" cy="22" rx="30" ry="9"  fill="#f0e8c8" opacity="0.5" />
      </svg>
    </motion.div>
  );
}

// ── Bird flock — small pixel birds flapping across ──────────────────────
function BirdFlock({ y, delay }: { y: string; delay: number }) {
  return (
    <motion.div
      initial={{ x: "-12%" }}
      animate={{ x: "115%" }}
      transition={{ duration: 26, delay, ease: "linear", repeat: Infinity }}
      className="absolute pointer-events-none flex gap-5"
      style={{ top: y, opacity: 0.35 }}
    >
      <Bird />
      <Bird />
      <Bird />
    </motion.div>
  );
}
function Bird() {
  return (
    <motion.svg
      width={14} height={10} viewBox="0 0 14 10"
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
      shapeRendering="crispEdges"
    >
      {/* Simple "M"-shaped silhouette for a flying bird */}
      <path d="M1 6 L4 3 L7 6 L10 3 L13 6" stroke="#1a2550" strokeWidth="1.5" fill="none" />
    </motion.svg>
  );
}

// ── Jeepney drives across the bottom every 30s ──────────────────────────
function JeepneyDrive() {
  return (
    <motion.div
      initial={{ x: "-20%" }}
      animate={{ x: "120%" }}
      transition={{ duration: 14, delay: 8, ease: "linear", repeat: Infinity, repeatDelay: 16 }}
      className="absolute pointer-events-none"
      style={{ bottom: "18%", opacity: 0.4 }}
    >
      <svg width={72} height={32} viewBox="0 0 72 32" shapeRendering="crispEdges">
        {/* Body */}
        <rect x="6"  y="10" width="54" height="14" fill="#d9632a" stroke="#5a2a0f" strokeWidth="1.5" />
        {/* Roof */}
        <rect x="10" y="4"  width="46" height="8"  fill="#e87a3a" stroke="#5a2a0f" strokeWidth="1.5" />
        {/* Windows */}
        <rect x="14" y="12" width="6"  height="6"  fill="#d0e8f0" />
        <rect x="22" y="12" width="6"  height="6"  fill="#d0e8f0" />
        <rect x="30" y="12" width="6"  height="6"  fill="#d0e8f0" />
        <rect x="38" y="12" width="6"  height="6"  fill="#d0e8f0" />
        <rect x="46" y="12" width="10" height="6"  fill="#d0e8f0" />
        {/* Wheels */}
        <circle cx="16" cy="26" r="4" fill="#1a1a1a" />
        <circle cx="50" cy="26" r="4" fill="#1a1a1a" />
        <circle cx="16" cy="26" r="1.5" fill="#888" />
        <circle cx="50" cy="26" r="1.5" fill="#888" />
        {/* Front bumper */}
        <rect x="60" y="16" width="6" height="6" fill="#d9632a" stroke="#5a2a0f" strokeWidth="1.5" />
      </svg>
    </motion.div>
  );
}

// ── Pokémon silhouettes drifting through the background ─────────────────
function PokemonSilhouettes() {
  const { isMobile } = useIsMobile();
  // Fewer silhouettes on phones so the narrow screen isn't swarmed
  const DEX   = isMobile ? [25, 6, 94]                        : [25, 6, 1, 54, 94, 7, 143];
  const NAMES = isMobile ? ["PIKACHU", "CHARIZARD", "GENGAR"] : ["PIKACHU", "CHARIZARD", "BULBASAUR", "PSYDUCK", "GENGAR", "SQUIRTLE", "SNORLAX"];
  return (
    <>
      {DEX.map((id, i) => (
        <SilhouetteDrift key={id} dexId={id} name={NAMES[i]} lane={i} />
      ))}
    </>
  );
}
function SilhouetteDrift({ dexId, name, lane }: { dexId: number; name: string; lane: number }) {
  const [hover, setHover] = useState(false);
  // Distribute lanes across height + stagger delays so they don't clump
  const yOptions = ["30%", "42%", "54%", "66%", "48%", "38%", "62%"];
  const y = yOptions[lane % yOptions.length];
  const duration = 32 + (lane % 3) * 8;
  const delay    = (lane * 4) % 28;
  const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dexId}.png`;
  return (
    <motion.div
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      initial={{ x: "-12%" }}
      animate={{ x: "115%" }}
      transition={{ duration, delay, ease: "linear", repeat: Infinity, repeatDelay: 6 }}
      className="absolute"
      style={{
        top: y,
        pointerEvents: "auto",
        cursor: "pointer",
      }}
    >
      <motion.img
        src={sprite}
        alt=""
        width={56}
        height={56}
        animate={{
          filter: hover ? "brightness(1) saturate(1)" : "brightness(0) saturate(0)",
          opacity: hover ? 0.95 : 0.18,
          scale: hover ? 1.25 : 1,
        }}
        transition={{ duration: 0.25 }}
        style={{ imageRendering: "pixelated" }}
      />
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 text-[8px] whitespace-nowrap"
            style={{
              top: -14,
              color: "#1a2550",
              background: "#fff8d8",
              padding: "2px 6px",
              border: "1.5px solid #1a2550",
              letterSpacing: "1px",
              textShadow: "1px 1px 0 #d0303044",
            }}
          >
            {name}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Scrapbook props — polaroids, tickets, postcards, stickies, map ──────
type PropOffsets = Record<string, { x: number; y: number }>;
const SCRAPBOOK_KEY = "adventure-scrapbook-positions";

function useScrapbookOffsets() {
  const [offsets, setOffsets] = useState<PropOffsets>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SCRAPBOOK_KEY);
      if (raw) setOffsets(JSON.parse(raw));
    } catch {}
  }, []);
  const setOffset = (id: string, pos: { x: number; y: number }) => {
    setOffsets((prev) => {
      const next = { ...prev, [id]: pos };
      try { localStorage.setItem(SCRAPBOOK_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const reset = () => {
    try { localStorage.removeItem(SCRAPBOOK_KEY); } catch {}
    setOffsets({});
  };
  return { offsets, setOffset, reset };
}

function ScrapbookProps({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const { offsets, setOffset, reset } = useScrapbookOffsets();
  const { isMobile } = useIsMobile();
  const hasMoved = Object.keys(offsets).length > 0;

  // Props flagged `mobile: false` are hidden on narrow phones so the title
  // block doesn't get buried. Everything else stays.
  const props: Array<{
    id: string;
    node: React.ReactNode;
    top?: string; left?: string; right?: string; bottom?: string;
    angle: number;
    depth: number;
    mobile?: boolean;
  }> = [
    { id: "pol-d1",        node: <Polaroid     scene="palm"     caption="MANILA · D1" videoSrc="/adventure/scrapbook/mnl.MOV" />, top: "8%",   left: "4%",   angle: -9,  depth: 0.8, mobile: true  },
    { id: "pol-d6",        node: <Polaroid     scene="mountain" caption="BAGUIO · D6" imageSrc="/adventure/scrapbook/baguio.JPG" />, bottom: "8%",  left: "4%",   angle: 8,   depth: 0.8, mobile: true  },
    { id: "tk-zam-mnl",    node: <Ticket       from="ZAM" to="MNL" />,                      top: "24%",  left: "22%",  angle: 5,   depth: 0.5, mobile: true  },
    { id: "tk-mnl-zam",    node: <Ticket       from="MNL" to="ZAM" />,                      top: "45%",  left: "3%",   angle: 12,  depth: 0.6, mobile: true  },
    { id: "postcard",      node: <Postcard     />,                                          top: "6%",   right: "4%",  angle: 7,   depth: 0.7, mobile: true  },
    { id: "sn-day3",       node: <StickyNote   text="DAY 3!"                    />,         top: "36%",  right: "4%",  angle: -6,  depth: 0.9, mobile: true  },
    { id: "sn-salute",     node: <StickyNote   text="SALUTE"                    />,         top: "18%",  right: "28%", angle: 4,   depth: 0.8, mobile: false },
    { id: "sn-roi",        node: <StickyNote   text={"ROI\nMEANS\nLUNCH"}       />,         top: "56%",  right: "28%", angle: -7,  depth: 0.9, mobile: true  },
    { id: "sn-ifykyk",     node: <StickyNote   text={"IFYKYK"}                   />,         top: "38%",  left: "24%",  angle: 6,   depth: 0.8, mobile: true  },
    { id: "sn-sauna",      node: <StickyNote   text="SAUNA"                     />,         bottom: "30%", left: "30%",  angle: 6,   depth: 0.8, mobile: false },
    { id: "sn-tapos",      node: <StickyNote   text="TAPOS NA!"                 />,         bottom: "8%",  right: "30%", angle: -10, depth: 0.9, mobile: false },
    { id: "sn-money",      node: <StickyNote   size="md"
                                   text={"₱700 → ₱6K\n→ ₱150 → ₱6K\n→ NOTHING"} />,         bottom: "8%",  left: "40%",  angle: -3,  depth: 0.7, mobile: false },
    { id: "id-card",       node: <PassportPhoto imageSrc="/adventure/scrapbook/id.jpg" />, bottom: "22%", right: "4%",  angle: 6,   depth: 0.6, mobile: true  },
    { id: "kuya-paeng",    node: <KuyaPaeng />,                                             bottom: "36%", right: "26%", angle: -4,  depth: 0.7, mobile: true  },
    { id: "ph-map",        node: <PhilippinesMap />,                                        bottom: "26%", left: "4%",   angle: -4,  depth: 0.4, mobile: false },
  ].filter((p) => !isMobile || p.mobile !== false);

  return (
    <>
      {props.map((p) => {
        const stored = offsets[p.id];
        const px = (mouseX - 0.5) * 14 * p.depth;
        const py = (mouseY - 0.5) * 10 * p.depth;
        return (
          <HoverableProp
            key={p.id}
            id={p.id}
            parallaxX={px}
            parallaxY={py}
            stored={stored}
            angle={p.angle}
            anchor={{ top: p.top, left: p.left, right: p.right, bottom: p.bottom }}
            onDragEnd={(newPos) => setOffset(p.id, newPos)}
          >
            {p.node}
          </HoverableProp>
        );
      })}
      {/* RESET LAYOUT — only appears once the user has moved something */}
      {hasMoved && (
        <button
          onClick={reset}
          className="absolute text-[8px] tracking-widest cursor-pointer pointer-events-auto"
          style={{
            bottom: 18, left: "50%",
            transform: "translateX(-50%)",
            color: "#1a2550",
            background: "#fff8d8",
            border: "1.5px solid #1a2550",
            padding: "4px 10px",
            fontFamily: "'Press Start 2P', monospace",
            boxShadow: "2px 2px 0 rgba(0,0,0,0.15)",
          }}
        >
          RESET LAYOUT
        </button>
      )}
    </>
  );
}

function HoverableProp({
  id, children, parallaxX, parallaxY, stored, angle, anchor, onDragEnd,
}: {
  id: string;
  children: React.ReactNode;
  parallaxX: number;
  parallaxY: number;
  stored?: { x: number; y: number };
  angle: number;
  anchor: { top?: string; left?: string; right?: string; bottom?: string };
  onDragEnd: (pos: { x: number; y: number }) => void;
}) {
  const [hover, setHover] = useState(false);
  // If the prop has been dragged before, use that stored offset (and skip
  // parallax — once the user places it, it stays put). Otherwise parallax.
  const baseX = stored ? stored.x : parallaxX;
  const baseY = stored ? stored.y : parallaxY;
  return (
    <motion.div
      // Remount when switching between stored/parallax modes so drag starts clean
      key={`${id}-${stored ? "p" : "f"}`}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setHover(true)}
      onDragEnd={(_e, info) => {
        setHover(false);
        onDragEnd({ x: baseX + info.offset.x, y: baseY + info.offset.y });
      }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      initial={{ x: baseX, y: baseY, rotate: angle, scale: 1 }}
      animate={{
        x: baseX,
        y: baseY,
        rotate: hover ? 0 : angle,
        scale: hover ? 1.08 : 1,
        filter: hover ? "drop-shadow(4px 6px 0 rgba(0,0,0,0.25))"
                      : "drop-shadow(2px 3px 0 rgba(0,0,0,0.15))",
      }}
      whileDrag={{
        scale: 1.15,
        rotate: angle + 10,
        zIndex: 100,
        filter: "drop-shadow(8px 12px 0 rgba(0,0,0,0.35))",
        cursor: "grabbing",
      }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="absolute"
      style={{
        ...anchor,
        pointerEvents: "auto",
        cursor: "grab",
        zIndex: hover ? 5 : 1,
        touchAction: "none",
      }}
    >
      {children}
    </motion.div>
  );
}

// ── Individual scrapbook pieces ─────────────────────────────────────────
function Polaroid({
  scene, caption, imageSrc, videoSrc,
}: { scene: "palm" | "mountain"; caption: string; imageSrc?: string; videoSrc?: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [vidFailed, setVidFailed] = useState(false);
  const showVideo = videoSrc && !vidFailed;
  const showImage = !showVideo && imageSrc && !imgFailed;
  return (
    <div
      style={{
        width: 110, height: 130,
        background: "#fdfaed",
        border: "2px solid #1a1a2a",
        padding: 6,
        boxShadow: "inset 0 0 0 1px #e0d8b8",
      }}
    >
      {showVideo ? (
        <video
          src={videoSrc}
          autoPlay muted loop playsInline
          onError={() => setVidFailed(true)}
          draggable={false}
          style={{
            width: 94, height: 82,
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : showImage ? (
        <img
          src={imageSrc}
          alt={caption}
          onError={() => setImgFailed(true)}
          draggable={false}
          style={{
            width: 94, height: 82,
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
      <svg width={94} height={82} viewBox="0 0 94 82" shapeRendering="crispEdges">
        {scene === "palm" ? (
          <>
            <rect x="0" y="0" width="94" height="56" fill="#8cc4e8" />
            <rect x="0" y="56" width="94" height="26" fill="#e8c888" />
            {/* palm */}
            <rect x="46" y="24" width="4" height="32" fill="#6a4020" />
            <path d="M48 24 L58 14 L62 18 L48 24 Z" fill="#3a7a40" />
            <path d="M48 24 L38 14 L34 18 L48 24 Z" fill="#3a7a40" />
            <path d="M48 24 L58 28 L62 24 L48 22 Z" fill="#3a7a40" />
            <circle cx="78" cy="12" r="6" fill="#ffd84a" />
          </>
        ) : (
          <>
            <rect x="0" y="0" width="94" height="50" fill="#c8d8f0" />
            <rect x="0" y="50" width="94" height="32" fill="#8aa068" />
            {/* mountains */}
            <polygon points="0,50 24,22 46,50" fill="#5a7858" />
            <polygon points="30,50 54,16 80,50" fill="#6a8868" />
            <polygon points="64,50 84,28 94,50" fill="#5a7858" />
            <circle cx="18" cy="10" r="4" fill="#ffffff" />
            <circle cx="78" cy="8" r="3" fill="#ffffff" />
          </>
        )}
      </svg>
      )}
      <div style={{ fontSize: 7, color: "#1a1a2a", letterSpacing: 1, marginTop: 4, textAlign: "center" }}>
        {caption}
      </div>
      {/* Tape strips */}
      <div style={{
        position: "absolute", top: -6, left: 14,
        width: 26, height: 12,
        background: "rgba(240, 220, 160, 0.75)",
        transform: "rotate(-18deg)",
        border: "1px solid rgba(160, 130, 60, 0.5)",
      }} />
      <div style={{
        position: "absolute", top: -6, right: 12,
        width: 24, height: 10,
        background: "rgba(240, 220, 160, 0.75)",
        transform: "rotate(14deg)",
        border: "1px solid rgba(160, 130, 60, 0.5)",
      }} />
    </div>
  );
}

function Ticket({ from, to }: { from: string; to: string }) {
  return (
    <div
      style={{
        width: 128, height: 52,
        background: "linear-gradient(90deg, #fef7d8 0%, #fef7d8 70%, #e8ddb0 70%, #e8ddb0 100%)",
        border: "2px solid #1a2550",
        padding: "6px 8px",
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "'Press Start 2P', monospace",
        color: "#1a2550",
      }}
    >
      <div style={{ fontSize: 9, letterSpacing: 1 }}>{from}</div>
      <div style={{ fontSize: 14 }}>✈</div>
      <div style={{ fontSize: 9, letterSpacing: 1 }}>{to}</div>
      <div style={{ flex: 1 }} />
      {/* Barcode */}
      <div style={{ display: "flex", gap: 1 }}>
        {[2, 1, 3, 1, 2, 1, 3, 2, 1, 2].map((w, i) => (
          <div key={i} style={{ width: w, height: 24, background: "#1a2550" }} />
        ))}
      </div>
    </div>
  );
}

function Postcard() {
  return (
    <div
      style={{
        width: 128, height: 82,
        background: "#f0e4b8",
        border: "2px solid #1a2550",
        padding: 6,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        fontSize: 9, color: "#d03030",
        letterSpacing: 2, textAlign: "center", marginBottom: 4,
        fontFamily: "'Press Start 2P', monospace",
      }}>
        GREETINGS FROM
      </div>
      <div style={{
        fontSize: 14, color: "#1a2550",
        letterSpacing: 3, textAlign: "center", marginBottom: 4,
        fontFamily: "'Press Start 2P', monospace",
      }}>
        MANILA
      </div>
      {/* Stamp corner */}
      <div style={{
        position: "absolute", top: 6, right: 6,
        width: 22, height: 24,
        background: "#ffffff",
        border: "2px solid #1a2550",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 8,
        color: "#d03030",
      }}>PH</div>
      {/* Wavy postmark */}
      <svg width={40} height={14} viewBox="0 0 40 14" style={{ position: "absolute", bottom: 6, right: 10 }}>
        <path d="M0 7 Q 5 2 10 7 T 20 7 T 30 7 T 40 7" stroke="#1a2550" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}

function StickyNote({ text, size = "sm" }: { text: string; size?: "sm" | "md" }) {
  const dim =
    size === "md" ? { w: 114, h: 94, fs: 9 } : { w: 78, h: 78, fs: 10 };
  return (
    <div
      style={{
        width: dim.w, height: dim.h,
        background: "#ffe066",
        border: "1.5px solid #c0a040",
        padding: 6,
        fontFamily: "'Press Start 2P', monospace",
        fontSize: dim.fs,
        color: "#5a4010",
        textAlign: "center",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.12)",
        lineHeight: 1.4,
        whiteSpace: "pre-line",
      }}
    >
      {text}
    </div>
  );
}

function KuyaPaeng() {
  return (
    <div
      style={{
        width: 78, height: 102,
        background: "#fdfaed",
        border: "2px solid #1a2550",
        padding: 4,
      }}
    >
      <svg width={68} height={66} viewBox="0 0 68 66" shapeRendering="crispEdges">
        {/* Warm studio-portrait backdrop */}
        <rect x="0" y="0" width="68" height="66" fill="#b89060" />
        <rect x="0" y="44" width="68" height="22" fill="#8a6848" />
        {/* Head */}
        <rect x="24" y="14" width="22" height="26" fill="#d8b090" />
        {/* Slicked-back hair — dark, lying flat with a subtle fade to gray */}
        <rect x="22" y="10" width="26" height="4" fill="#1a1a2a" />
        <rect x="22" y="10" width="3"  height="10" fill="#1a1a2a" />
        <rect x="43" y="10" width="3"  height="10" fill="#1a1a2a" />
        <rect x="25" y="12" width="18" height="2" fill="#2a2a3a" />
        {/* Gray streak (late 50s) */}
        <rect x="22" y="12" width="3" height="4" fill="#8080a0" />
        {/* Glasses — rectangular frames */}
        <rect x="25" y="22" width="8" height="5" fill="none" stroke="#1a1a2a" strokeWidth="1" />
        <rect x="37" y="22" width="8" height="5" fill="none" stroke="#1a1a2a" strokeWidth="1" />
        <rect x="33" y="24" width="4" height="1" fill="#1a1a2a" />
        {/* Pale reflection on lenses */}
        <rect x="26" y="23" width="2" height="1" fill="#ffffff" opacity="0.6" />
        <rect x="38" y="23" width="2" height="1" fill="#ffffff" opacity="0.6" />
        {/* Mustache */}
        <rect x="28" y="32" width="12" height="2" fill="#1a1a2a" />
        {/* Subtle smile */}
        <rect x="30" y="36" width="8" height="1" fill="#5a3a2a" />
        {/* Dark business-casual polo, open collar */}
        <rect x="14" y="44" width="40" height="22" fill="#2a2a40" />
        <polygon points="26,44 34,52 42,44" fill="#fdfaed" />
      </svg>
      <div style={{ fontSize: 7, color: "#1a2550", letterSpacing: 1, marginTop: 4, textAlign: "center" }}>
        KUYA PAENG
      </div>
    </div>
  );
}

function PassportPhoto({ imageSrc }: { imageSrc?: string } = {}) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div
      style={{
        width: 76, height: 100,
        background: "#fdfaed",
        border: "2px solid #1a2550",
        padding: 4,
      }}
    >
      {imageSrc && !imgFailed ? (
        <img
          src={imageSrc}
          alt="ID photo"
          onError={() => setImgFailed(true)}
          draggable={false}
          style={{
            width: 66, height: 64,
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
      <svg width={66} height={64} viewBox="0 0 66 64" shapeRendering="crispEdges">
        <rect x="0" y="0" width="66" height="64" fill="#8ab4d8" />
        {/* Head */}
        <rect x="24" y="16" width="18" height="22" fill="#e8c8a0" />
        {/* Hair */}
        <rect x="22" y="12" width="22" height="8" fill="#2a1a0a" />
        <rect x="22" y="10" width="4" height="6" fill="#2a1a0a" />
        <rect x="40" y="10" width="4" height="6" fill="#2a1a0a" />
        {/* Eyes */}
        <rect x="28" y="24" width="2" height="2" fill="#1a1a2a" />
        <rect x="36" y="24" width="2" height="2" fill="#1a1a2a" />
        {/* Shoulders — green jacket */}
        <rect x="14" y="40" width="38" height="24" fill="#2a6c40" />
        <rect x="30" y="40" width="6" height="24" fill="#ffffff" />
      </svg>
      )}
      <div style={{ fontSize: 7, color: "#1a2550", letterSpacing: 1, marginTop: 4, textAlign: "center" }}>
        ID CARD
      </div>
    </div>
  );
}

function PhilippinesMap() {
  return (
    <div
      style={{
        width: 120, height: 130,
        background: "#fdfaed",
        border: "2px solid #1a2550",
        padding: 6,
      }}
    >
      <svg width={104} height={104} viewBox="0 0 104 104" shapeRendering="crispEdges">
        {/* Stylised PH archipelago */}
        <path d="M48 6 L56 14 L54 28 L58 36 L50 46 L54 56 L48 62 L50 70 L42 74 L46 84 L38 88"
              stroke="#1a2550" strokeWidth="2" fill="none" />
        <circle cx="50" cy="20" r="10" fill="#2a6c40" opacity="0.4" />
        <circle cx="54" cy="48" r="8"  fill="#2a6c40" opacity="0.4" />
        <circle cx="46" cy="80" r="8"  fill="#2a6c40" opacity="0.4" />
        {/* Pins */}
        <circle cx="50" cy="22" r="2.5" fill="#d03030" />
        <circle cx="56" cy="18" r="2"   fill="#d03030" />
        <circle cx="54" cy="48" r="2.5" fill="#d03030" />
        <circle cx="48" cy="58" r="2"   fill="#d03030" />
      </svg>
      <div style={{ fontSize: 7, color: "#1a2550", letterSpacing: 1, marginTop: 4, textAlign: "center" }}>
        PHILIPPINES
      </div>
    </div>
  );
}

// ── Paper background grid for "passport page" feel ─────────────────────
function PaperGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent 0 39px, rgba(120, 90, 40, 0.08) 39px 40px), " +
          "repeating-linear-gradient(90deg, transparent 0 39px, rgba(120, 90, 40, 0.05) 39px 40px)",
      }}
    />
  );
}

// ── Paper plane sweep ──────────────────────────────────────────────────
function PaperPlane() {
  return (
    <motion.svg
      initial={{ x: "-30%", y: "40vh", opacity: 0, rotate: -8 }}
      animate={{ x: "130%",  y: "10vh", opacity: [0, 0.85, 0.9, 0], rotate: 8 }}
      transition={{ duration: 2.2, delay: 0.2, ease: "easeInOut" }}
      width={60}
      height={60}
      viewBox="0 0 24 24"
      className="absolute pointer-events-none"
      style={{ filter: "drop-shadow(0 3px 0 rgba(0,0,0,0.18))" }}
    >
      {/* pixel paper plane */}
      <polygon points="1,12 22,2 16,13 22,14 9,22" fill="#ffffff" stroke="#1a2550" strokeWidth="1" />
      <polygon points="16,13 9,22 11,15" fill="#d9d9e0" stroke="#1a2550" strokeWidth="1" />
    </motion.svg>
  );
}

// ── The opened passport: inner pages + stamps ───────────────────────────
function PassportOpen() {
  return (
    <div className="relative" style={{ width: 520, height: 340 }}>
      {/* Shadow beneath */}
      <div
        className="absolute"
        style={{
          left: 20, right: 20, bottom: -14, height: 18,
          background: "rgba(0,0,0,0.25)",
          filter: "blur(10px)",
          borderRadius: "50%",
        }}
      />

      {/* Book spine — dark centre seam */}
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 4,
          background: "linear-gradient(to bottom, #8a7040, #5c4a28, #8a7040)",
          zIndex: 3,
        }}
      />

      {/* Left page */}
      <PassportPage side="left" />
      {/* Right page */}
      <PassportPage side="right" />

      {/* Stamps land on top of pages */}
      {STAMPS.map((s, i) => (
        <InkStamp key={s.label} {...s} index={i} />
      ))}

      {/* Outer border of the open passport */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: "4px solid #1a2550",
          borderRadius: 6,
          boxShadow: "inset 0 0 0 2px #faf3df, 0 4px 0 rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );
}

function PassportPage({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div
      className="absolute top-0 bottom-0"
      style={{
        left:  isLeft ? 0   : "50%",
        right: isLeft ? "50%" : 0,
        background:
          "linear-gradient(135deg, #fbf3d9 0%, #f3e5bd 100%)",
        boxShadow: isLeft
          ? "inset -14px 0 18px rgba(0,0,0,0.2)"
          : "inset 14px 0 18px rgba(0,0,0,0.2)",
        overflow: "hidden",
      }}
    >
      {/* Decorative header line */}
      <div
        className="absolute top-4 left-4 right-4 text-[7px]"
        style={{ color: "#6a5a30", letterSpacing: "2px" }}
      >
        {isLeft ? "REPUBLIKA NG PILIPINAS" : "PASSPORT · PASAPORTE"}
      </div>
      <div
        className="absolute"
        style={{
          top: 18, left: 14, right: 14,
          height: 2, background: "#c8a850",
        }}
      />

      {/* Form-like lines */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: 18, right: 18,
            bottom: 30 + i * 22,
            height: 1,
            background: "rgba(120,90,40,0.25)",
          }}
        />
      ))}

      {/* Tiny seal — only on left page */}
      {isLeft && (
        <div
          className="absolute"
          style={{
            top: 36, left: 16,
            width: 58, height: 58,
            borderRadius: "50%",
            border: "2px solid #c8a850",
            background:
              "radial-gradient(circle, rgba(200,168,80,0.2) 0%, transparent 70%)",
          }}
        >
          <div
            className="absolute inset-2 text-[6px] flex items-center justify-center"
            style={{ color: "#6a5a30", letterSpacing: "1px", textAlign: "center" }}
          >
            PH<br/>SEAL
          </div>
        </div>
      )}
    </div>
  );
}

// ── Stamp slam with ink burst ───────────────────────────────────────────
function InkStamp({
  label, color, angle, delay, index,
}: { label: string; color: string; angle: number; delay: number; index: number }) {
  // Alternate left/right page for visual balance
  const left  = index === 0 ? "22%" : index === 1 ? "60%" : "30%";
  const top   = index === 0 ? "38%" : index === 1 ? "52%" : "64%";

  return (
    <>
      {/* Ink spatter particles — small dots scattering on slam */}
      {[...Array(6)].map((_, p) => (
        <motion.div
          key={p}
          initial={{ opacity: 0, x: 0, y: 0, scale: 1 }}
          animate={{
            opacity: [0, 0.9, 0],
            x: (Math.random() - 0.5) * 80,
            y: (Math.random() - 0.5) * 80,
            scale: [0.8, 0.4],
          }}
          transition={{ duration: 0.5, delay, ease: "easeOut" }}
          className="absolute rounded-full"
          style={{
            left, top,
            width: 5, height: 5,
            background: color,
            translate: "-50% -50%",
          }}
        />
      ))}

      {/* The stamp itself — slams with a scale punch */}
      <motion.div
        initial={{ opacity: 0, scale: 3, rotate: angle }}
        animate={{ opacity: [0, 1, 1], scale: [3, 0.9, 1.05, 1], rotate: angle }}
        transition={{ duration: 0.35, delay, ease: "easeOut", times: [0, 0.4, 0.7, 1] }}
        className="absolute"
        style={{
          left, top,
          translate: "-50% -50%",
          border: `3px solid ${color}`,
          color,
          padding: "8px 18px",
          fontSize: 14,
          letterSpacing: "3px",
          fontFamily: "'Press Start 2P', monospace",
          background: "rgba(255,255,240,0.0)",
          // Slightly imperfect rubber-stamp ink look
          boxShadow: `inset 0 0 0 2px ${color}22, 0 0 0 1px ${color}44`,
          opacity: 0.92,
          textShadow: `1px 1px 0 ${color}66`,
        }}
      >
        {label}
      </motion.div>
    </>
  );
}
