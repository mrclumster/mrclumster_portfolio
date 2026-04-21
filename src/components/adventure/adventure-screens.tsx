"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { tripLocations } from "@/game/data/trip-locations";

// ─── Pokémon palette ─────────────────────────────────────────────────────
export const POKE = {
  grass:      "#7cc97c",
  grassDark:  "#3c8c3c",
  grassTuft:  "#5cb050",
  water:      "#6ca8e8",
  waterDark:  "#2a5ac8",
  sand:       "#f0d888",
  path:       "#c8a878",
  pathShadow: "#8c6c44",
  tree:       "#205c28",
  treeLight:  "#4ca04c",
  rock:       "#9898a0",
  flower:     "#f84040",
  flowerY:    "#f8cc28",
  // UI
  dialogBg:   "#f8f8e8",
  dialogBorderOuter: "#202020",
  dialogBorderInner: "#5880c8",
  text:       "#181818",
  textBlue:   "#3048a8",
  textShadow: "#a8a8a8",
  accent:     "#f8cc28", // Pokémon yellow
  red:        "#e03030",
};

export const DAY_COLORS: Record<number, string> = {
  1: "#ff2e4d",
  2: "#ffb000",
  3: "#a855ff",
  4: "#00ff9c",
  5: "#00e0ff",
  6: "#ff2ec8",
};

export const DAY_META: Record<number, { title: string; tagline: string }> = {
  1: { title: "ARRIVAL",   tagline: "Manila — first steps." },
  2: { title: "URBAN",     tagline: "QC & Makati industry." },
  3: { title: "NIGHTFALL", tagline: "BGC after dark." },
  4: { title: "NATURE",    tagline: "Carmona countryside." },
  5: { title: "SUMMIT",    tagline: "Tagaytay & Taal." },
  6: { title: "HIGHLAND",  tagline: "Baguio pines." },
};

// ──────────────────────────────────────────────────────────────────────────
// TITLE SCREEN — Pokémon logo style
// ──────────────────────────────────────────────────────────────────────────
export function TitleScreen({ onStart }: { onStart: () => void }) {
  useEffect(() => {
    const go = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "z" || e.key === "Z") onStart();
    };
    window.addEventListener("keydown", go);
    return () => window.removeEventListener("keydown", go);
  }, [onStart]);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center text-center select-none cursor-pointer"
      onClick={onStart}
      style={{ background: "linear-gradient(to bottom, #4c8ce8 0%, #7cc9e8 50%, #7cc97c 50%, #3c8c3c 100%)" }}
    >
      {/* Sky → grass split (Pokémon title card classic) */}

      {/* Clouds */}
      <div className="absolute top-4 left-8 w-10 h-4 rounded-full bg-white/80" />
      <div className="absolute top-8 right-10 w-14 h-4 rounded-full bg-white/80" />
      <div className="absolute top-2 right-24 w-8 h-3 rounded-full bg-white/70" />

      {/* Title logo */}
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative z-10 mb-1"
      >
        <div
          className="inline-block px-6 py-3 rounded-sm"
          style={{
            background: "linear-gradient(to bottom, #fff13c 0%, #ffcc00 60%, #cc8800 100%)",
            border: "4px solid #1a1a1a",
            boxShadow: "6px 6px 0 #1a1a1a, inset 0 0 0 3px #fff",
            fontFamily: "'Press Start 2P', monospace",
            color: "#1040a8",
            textShadow: "3px 3px 0 #000",
            fontSize: "36px",
            letterSpacing: "4px",
          }}
        >
          MANILA
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
        className="relative z-10 mb-2"
      >
        <div
          className="inline-block px-5 py-2 rounded-sm"
          style={{
            background: "linear-gradient(to bottom, #fff13c 0%, #ffcc00 60%, #cc8800 100%)",
            border: "4px solid #1a1a1a",
            boxShadow: "6px 6px 0 #1a1a1a, inset 0 0 0 3px #fff",
            fontFamily: "'Press Start 2P', monospace",
            color: "#c82020",
            textShadow: "3px 3px 0 #000",
            fontSize: "26px",
            letterSpacing: "4px",
          }}
        >
          VERSION
        </div>
      </motion.div>

      {/* Trainer silhouette */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="relative z-10 mb-1"
      >
        <TrainerSprite />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="relative z-10 text-[12px] text-white mt-3"
        style={{ fontFamily: "'Press Start 2P', monospace", textShadow: "1px 1px 0 #000" }}
      >
        6 DAYS · 16 CHECKPOINTS
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="relative z-10 mt-4"
      >
        <BlinkText>
          <span className="text-white text-[16px]" style={{ fontFamily: "'Press Start 2P', monospace", textShadow: "2px 2px 0 #000" }}>
            PRESS START
          </span>
        </BlinkText>
      </motion.div>

      <div className="absolute bottom-1 text-[5px] text-white/70" style={{ fontFamily: "'Press Start 2P', monospace" }}>
        ©2026 AZIZ
      </div>
    </div>
  );
}

function TrainerSprite() {
  // Simple 16×24 "Red trainer" silhouette in SVG
  return (
    <svg width="80" height="120" viewBox="0 0 16 24">
      {/* Hat */}
      <rect x="4" y="2" width="8" height="2" fill="#e03030" />
      <rect x="3" y="3" width="10" height="2" fill="#e03030" />
      <rect x="6" y="1" width="4" height="1" fill="#fff" />
      {/* Face */}
      <rect x="5" y="5" width="6" height="3" fill="#f0c090" />
      <rect x="6" y="6" width="1" height="1" fill="#000" />
      <rect x="9" y="6" width="1" height="1" fill="#000" />
      {/* Body / shirt */}
      <rect x="4" y="8" width="8" height="6" fill="#ffffff" />
      <rect x="4" y="8" width="8" height="1" fill="#e03030" />
      <rect x="4" y="13" width="8" height="1" fill="#e03030" />
      {/* Arms */}
      <rect x="3" y="9" width="1" height="4" fill="#f0c090" />
      <rect x="12" y="9" width="1" height="4" fill="#f0c090" />
      {/* Legs */}
      <rect x="5" y="14" width="2" height="6" fill="#1040a8" />
      <rect x="9" y="14" width="2" height="6" fill="#1040a8" />
      {/* Shoes */}
      <rect x="4" y="20" width="3" height="2" fill="#c82020" />
      <rect x="9" y="20" width="3" height="2" fill="#c82020" />
    </svg>
  );
}

function BlinkText({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn((s) => !s), 600);
    return () => clearInterval(id);
  }, []);
  return <span style={{ opacity: on ? 1 : 0.2 }}>{children}</span>;
}

// ──────────────────────────────────────────────────────────────────────────
// DAY SELECT MENU — classic Pokémon white dialog box
// ──────────────────────────────────────────────────────────────────────────
export function DaySelectMenu({
  onPickDay,
  onOpenArena,
  onChangePartner,
  visited,
}: {
  onPickDay: (day: number) => void;
  onOpenArena: () => void;
  onChangePartner: () => void;
  visited: Set<number>;
}) {
  const [selected, setSelected] = useState(0);
  const days = [1, 2, 3, 4, 5, 6];
  const TOTAL = days.length + 2; // +1 arena, +1 change partner

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown": case "s": case "S":
          setSelected((s) => (s + 1) % TOTAL); break;
        case "ArrowUp": case "w": case "W":
          setSelected((s) => (s - 1 + TOTAL) % TOTAL); break;
        case "Enter": case "z": case "Z": case " ":
          if (selected < days.length) onPickDay(days[selected]);
          else if (selected === days.length) onOpenArena();
          else onChangePartner();
          e.preventDefault();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, days, TOTAL, onPickDay, onOpenArena, onChangePartner]);

  return (
    <div className="absolute inset-0 flex flex-col p-2" style={{
      background: "linear-gradient(to bottom, #4c8ce8 0%, #7cc9e8 60%, #7cc97c 60%, #3c8c3c 100%)",
    }}>
      {/* Header bubble */}
      <div style={dialogBoxStyle("small")} className="mb-2 text-center py-2">
        <span style={{ color: POKE.textBlue, fontFamily: "'Press Start 2P', monospace", fontSize: "12px" }}>
          SELECT A DAY
        </span>
      </div>

      {/* Main menu dialog */}
      <div style={dialogBoxStyle()} className="flex-1 p-4">
        <div className="flex flex-col gap-1">
          {days.map((day, i) => {
            const color = DAY_COLORS[day];
            const meta  = DAY_META[day];
            const isSel = i === selected;
            const done  = visited.has(day);
            return (
              <button
                key={day}
                onClick={() => { setSelected(i); onPickDay(day); }}
                onMouseEnter={() => setSelected(i)}
                className="flex items-center gap-3 text-left px-2 py-2 hover:bg-black/5"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                <span className="text-[14px]" style={{ color: isSel ? POKE.text : "transparent", minWidth: "14px" }}>
                  ▶
                </span>
                <span
                  className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: color, boxShadow: isSel ? `0 0 6px ${color}` : "none" }}
                />
                <span className="text-[11px]" style={{ color: POKE.text }}>DAY {day}</span>
                <span className="text-[11px] flex-1" style={{ color: POKE.textBlue }}>
                  {meta.title}
                </span>
                {done && <span className="text-[11px]" style={{ color: POKE.red }}>✓</span>}
              </button>
            );
          })}

          {/* Arena entry */}
          <button
            onClick={() => { setSelected(days.length); onOpenArena(); }}
            onMouseEnter={() => setSelected(days.length)}
            className="flex items-center gap-3 text-left px-2 py-2 mt-2 border-t hover:bg-black/5"
            style={{ fontFamily: "'Press Start 2P', monospace", borderColor: "#00000033" }}
          >
            <span className="text-[14px]" style={{ color: selected === days.length ? POKE.text : "transparent", minWidth: "14px" }}>
              ▶
            </span>
            <span className="text-[14px]" style={{ color: POKE.red }}>★</span>
            <span className="text-[11px]" style={{ color: POKE.red }}>BATTLE ARENA</span>
            <span className="text-[10px] flex-1" style={{ color: POKE.textShadow }}>fight any mon</span>
          </button>

          {/* Change partner */}
          <button
            onClick={() => { setSelected(days.length + 1); onChangePartner(); }}
            onMouseEnter={() => setSelected(days.length + 1)}
            className="flex items-center gap-3 text-left px-2 py-2 hover:bg-black/5"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            <span className="text-[14px]" style={{ color: selected === days.length + 1 ? POKE.text : "transparent", minWidth: "14px" }}>
              ▶
            </span>
            <span className="text-[14px]" style={{ color: POKE.textBlue }}>↻</span>
            <span className="text-[11px]" style={{ color: POKE.textBlue }}>CHANGE PARTNER</span>
            <span className="text-[10px] flex-1" style={{ color: POKE.textShadow }}>re-pick starter</span>
          </button>
        </div>
      </div>

      {/* Tagline dialog below — with bouncing ▼ cursor */}
      <div style={dialogBoxStyle()} className="mt-1 p-2 relative">
        <div className="text-[11px] leading-relaxed" style={{ color: POKE.text, fontFamily: "'Press Start 2P', monospace" }}>
          {selected < days.length ? (
            <>
              <span style={{ color: DAY_COLORS[days[selected]] }}>
                {DAY_META[days[selected]].title}:
              </span>{" "}
              {DAY_META[days[selected]].tagline}
            </>
          ) : selected === days.length ? (
            <>
              <span style={{ color: POKE.red }}>ARENA:</span> Pick any mon and battle. Just for fun!
            </>
          ) : (
            <>
              <span style={{ color: POKE.textBlue }}>CHANGE PARTNER:</span> Pick a different Pokémon.
            </>
          )}
        </div>
        <BouncingArrow />
      </div>
    </div>
  );
}

// Classic Pokémon dialog box — white fill, thick black border, blue inner border
function dialogBoxStyle(size: "normal" | "small" = "normal"): React.CSSProperties {
  const pad = size === "small" ? 6 : 4;
  return {
    background: POKE.dialogBg,
    border: `2px solid ${POKE.dialogBorderOuter}`,
    borderRadius: "3px",
    boxShadow: `inset 0 0 0 2px ${POKE.dialogBorderInner}, 2px 2px 0 rgba(0,0,0,0.3)`,
    padding: pad,
  };
}

// ──────────────────────────────────────────────────────────────────────────
// PER-DAY OVERWORLD — Pokémon-bright palette
// ──────────────────────────────────────────────────────────────────────────
const WORLD_W = 900;
const WORLD_H = 700;
const PLAYER_SPEED = 5;
const INTERACT_RADIUS = 55;

import { getCreature } from "./creatures";
import {
  PalmTree, Lighthouse, Plane, MOAGlobe,
  OfficeTower, Factory, ApartmentBuilding, StreetLamp, Car,
  Skyscraper, NeonBillboard, TrafficLight,
  LogBridge, MushroomCluster, Pond, WoodenFence,
  Volcano, FerrisWheel, Gazebo,
  PineTree, StrawberryPatch, Pagoda, Flagpole,
  Cloud, Sun, Moon, Stars, Seagull, Butterfly, FallingLeaves, FogLayer,
  HorizonMountains, HorizonCity, HorizonPines,
} from "./scene-sprites";

// Wild Pokémon position per day (hidden-ish spots)
const WILD_POS: Record<number, [number, number]> = {
  1: [780, 460],
  2: [420, 260],
  3: [450, 370],
  4: [700, 500],
  5: [500, 480],
  6: [260, 540],
};

const DAY_LAYOUTS: Record<number, {
  theme: "grass" | "urban" | "night" | "nature" | "mountain" | "coast";
  pins: Array<{ id: string; x: number; y: number }>;
  spawn: [number, number];
}> = {
  1: { theme: "coast",   spawn: [150, 550], pins: [
    { id: "airport",    x: 200, y: 500 },
    { id: "intramuros", x: 450, y: 380 },
    { id: "moa",        x: 700, y: 500 },
  ]},
  2: { theme: "urban",   spawn: [180, 450], pins: [
    { id: "djm-dorm", x: 250, y: 340 },
    { id: "hytec",    x: 500, y: 320 },
    { id: "opentext", x: 700, y: 440 },
  ]},
  3: { theme: "night",   spawn: [180, 480], pins: [
    { id: "mmda", x: 300, y: 380 },
    { id: "bgc",  x: 650, y: 470 },
  ]},
  4: { theme: "grass",   spawn: [250, 450], pins: [
    { id: "day4-dump", x: 500, y: 400 },
  ]},
  5: { theme: "nature",  spawn: [200, 500], pins: [
    { id: "tagaytay", x: 350, y: 420 },
    { id: "skyranch", x: 650, y: 380 },
  ]},
  6: { theme: "mountain", spawn: [150, 440], pins: [
    { id: "baguio",          x: 200, y: 380 },
    { id: "strawberry-farm", x: 370, y: 300 },
    { id: "bell-church",     x: 530, y: 270 },
    { id: "pma",             x: 690, y: 340 },
    { id: "day6-dump",       x: 560, y: 460 },
  ]},
};

const THEME_BG: Record<string, { sky: string; ground: string; zone: string; accent: string }> = {
  coast:    { sky: "#7cc9e8", ground: "#f0d888", zone: "#6ca8e8", accent: "#4c8ce8" },
  urban:    { sky: "#a8b8c8", ground: "#c8c8a8", zone: "#8898a8", accent: "#686878" },
  night:    { sky: "#202848", ground: "#305080", zone: "#4060a0", accent: "#d86cff" },
  grass:    { sky: "#7cc9e8", ground: "#7cc97c", zone: "#3c8c3c", accent: "#5cb050" },
  nature:   { sky: "#88c8e0", ground: "#60b860", zone: "#408040", accent: "#3ca04c" },
  mountain: { sky: "#c8b8d8", ground: "#88a878", zone: "#605880", accent: "#a098b0" },
};

export function DayOverworld({
  day,
  starterId,
  wildCreatureId,
  wildDefeated,
  onBack,
  onVisit,
  onEncounterWild,
}: {
  day: number;
  starterId: string | null;
  wildCreatureId: string | null;
  wildDefeated: boolean;
  onBack: () => void;
  onVisit: () => void;
  onEncounterWild: () => void;
}) {
  const layout = DAY_LAYOUTS[day];
  const theme  = THEME_BG[layout.theme];
  const [pos, setPos] = useState<[number, number]>(layout.spawn);
  const [nearestId, setNearestId] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [lastDir, setLastDir] = useState<"up" | "down" | "left" | "right">("down");
  const keys = useRef<Record<string, boolean>>({});

  // Wild encounter state
  const wildPos = WILD_POS[day];
  const [fightDialog, setFightDialog] = useState(false);
  const [fightChoice, setFightChoice] = useState<"yes" | "no">("yes");
  const [nearWild, setNearWild] = useState(false);
  const heroCreature = starterId ? getCreature(starterId) : null;
  const wildCreature = wildCreatureId ? getCreature(wildCreatureId) : null;

  useEffect(() => { setPos(layout.spawn); setNearestId(null); }, [day, layout.spawn]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      if (viewerOpen) return;

      // Fight dialog takes priority over other inputs
      if (fightDialog) {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "a" || e.key === "d" || e.key === "A" || e.key === "D") {
          setFightChoice((c) => (c === "yes" ? "no" : "yes"));
          e.preventDefault();
        } else if (e.key === "Enter" || e.key === "z" || e.key === "Z" || e.key === " ") {
          setFightDialog(false);
          if (fightChoice === "yes") onEncounterWild();
          e.preventDefault();
        } else if (e.key === "Escape" || e.key === "b" || e.key === "B") {
          setFightDialog(false);
          e.preventDefault();
        }
        return;
      }

      if (e.key === "Escape") { onBack(); return; }

      // Near wild? → fight dialog on A
      if (nearWild && (e.key === "Enter" || e.key === "z" || e.key === "Z" || e.key === " ")) {
        setFightDialog(true);
        setFightChoice("yes");
        e.preventDefault();
        return;
      }

      if (e.key === "Enter" || e.key === "z" || e.key === "Z" || e.key === " ") {
        if (nearestId) {
          const loc = tripLocations.find((l) => l.id === nearestId);
          if (loc) {
            setViewerOpen(true);
            onVisit();
            window.dispatchEvent(new CustomEvent("adventure-photo-viewer-open", {
              detail: { location: loc, photos: loc.photos },
            }));
            window.dispatchEvent(new CustomEvent("adventure-zone-enter", {
              detail: { name: loc.name, dayLabel: loc.dayLabel, day: loc.day },
            }));
          }
        }
      }
    };
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    const onViewerClose = () => setViewerOpen(false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("adventure-photo-viewer-close", onViewerClose);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("adventure-photo-viewer-close", onViewerClose);
    };
  }, [nearestId, viewerOpen, onBack, onVisit, nearWild, fightDialog, fightChoice, onEncounterWild]);

  useEffect(() => {
    let raf = 0;
    const step = () => {
      if (!viewerOpen) {
        const k = keys.current;
        let dx = 0, dy = 0;
        if (k["w"] || k["arrowup"])    dy -= 1;
        if (k["s"] || k["arrowdown"])  dy += 1;
        if (k["a"] || k["arrowleft"])  dx -= 1;
        if (k["d"] || k["arrowright"]) dx += 1;
        if (dx !== 0 || dy !== 0) {
          const len = Math.hypot(dx, dy);
          dx = (dx / len) * PLAYER_SPEED;
          dy = (dy / len) * PLAYER_SPEED;
          setPos(([x, y]) => [
            Math.max(50, Math.min(WORLD_W - 50, x + dx)),
            Math.max(50, Math.min(WORLD_H - 50, y + dy)),
          ]);
          if (Math.abs(dx) > Math.abs(dy)) setLastDir(dx > 0 ? "right" : "left");
          else                              setLastDir(dy > 0 ? "down"  : "up");
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [viewerOpen]);

  useEffect(() => {
    let nearest: { id: string; dist: number } | null = null;
    for (const pin of layout.pins) {
      const d = Math.hypot(pos[0] - pin.x, pos[1] - pin.y);
      if (d < INTERACT_RADIUS && (!nearest || d < nearest.dist)) {
        nearest = { id: pin.id, dist: d };
      }
    }
    setNearestId(nearest?.id ?? null);

    // Wild proximity
    if (wildCreature) {
      const dw = Math.hypot(pos[0] - wildPos[0], pos[1] - wildPos[1]);
      setNearWild(dw < INTERACT_RADIUS + 10);
    } else {
      setNearWild(false);
    }
  }, [pos, layout.pins, wildCreature, wildPos]);

  const routePath = useMemo(
    () => layout.pins.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" "),
    [layout.pins]
  );

  // Seeded random for decor (stable across re-renders within a day)
  const decor = useMemo(() => {
    const rand = mulberry32(day * 1000 + 7);
    const items: Array<{ type: "tree" | "bush" | "rock" | "flower"; x: number; y: number }> = [];
    const n = layout.theme === "mountain" || layout.theme === "nature" ? 30 : 18;
    for (let i = 0; i < n; i++) {
      const x = 60 + rand() * (WORLD_W - 120);
      const y = 60 + rand() * (WORLD_H - 120);
      // Don't place on top of pins
      const tooClose = layout.pins.some((p) => Math.hypot(p.x - x, p.y - y) < 60);
      if (tooClose) continue;
      const r = rand();
      items.push({
        type: r < 0.45 ? "tree" : r < 0.7 ? "bush" : r < 0.88 ? "flower" : "rock",
        x, y,
      });
    }
    return items;
  }, [day, layout.pins, layout.theme]);

  // Per-day accent colour for screen-edge glow
  const accent = DAY_COLORS[day];

  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(to bottom, ${theme.sky} 0%, ${theme.sky} 30%, ${theme.ground} 30%, ${theme.accent} 100%)`,
        boxShadow: `inset 0 0 30px ${accent}55, inset 0 0 6px ${accent}`,
      }}
    >
      <svg viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Per-day sky layer */}
        <DaySky day={day} />

        {/* Per-day horizon silhouette */}
        <DayHorizon day={day} />

        {/* Zone puddle — organic blob tint */}
        <path
          d="M 80 280 Q 300 240 550 270 Q 800 320 820 470 Q 780 600 500 620 Q 220 600 80 500 Z"
          fill={theme.zone}
          opacity="0.65"
        />

        {/* Decorations */}
        {decor.map((d, i) => (
          <DecorSprite key={i} type={d.type} x={d.x} y={d.y} theme={layout.theme} />
        ))}

        {/* Per-day landmarks */}
        <DayLandmarks day={day} />

        {/* Path connecting pins — wider to match bigger sprites */}
        {layout.pins.length > 1 && (
          <>
            <path d={routePath} fill="none" stroke={POKE.pathShadow} strokeWidth="22" strokeLinecap="round" />
            <path d={routePath} fill="none" stroke={POKE.path} strokeWidth="16" strokeLinecap="round" />
          </>
        )}

        {/* Pins — Poké Ball style markers (BIG) */}
        {layout.pins.map((pin) => {
          const loc = tripLocations.find((l) => l.id === pin.id);
          const isNear = nearestId === pin.id;
          return (
            <g key={pin.id}>
              <ellipse cx={pin.x} cy={pin.y + 26} rx="22" ry="5" fill="#000" opacity="0.4" />
              {isNear && (
                <circle cx={pin.x} cy={pin.y} r="40" fill={POKE.accent} opacity="0.3">
                  <animate attributeName="r" values="36;48;36" dur="1s" repeatCount="indefinite" />
                </circle>
              )}
              <PokeBall x={pin.x} y={pin.y} size={isNear ? 40 : 32} />
              {/* Name sign */}
              <g transform={`translate(${pin.x}, ${pin.y + 44})`}>
                <rect x={-95} y={0} width="190" height="34" fill={POKE.dialogBg} stroke="#000" strokeWidth="3" rx="4" />
                <rect x={-90} y={5} width="180" height="24" fill="none" stroke={POKE.dialogBorderInner} strokeWidth="2" />
                <text
                  x={0}
                  y={22}
                  textAnchor="middle"
                  fontSize="14"
                  fill={POKE.text}
                  fontFamily="'Press Start 2P', monospace"
                >
                  {loc?.name.toUpperCase().slice(0, 14)}
                </text>
              </g>
            </g>
          );
        })}

        {/* Per-day floaters (butterflies, seagulls, leaves, fog…) */}
        <DayFloaters day={day} />

        {/* Wild Pokémon waiting on the map — stays after defeat (re-challengeable) */}
        {wildCreature && (
          <g transform={`translate(${wildPos[0]}, ${wildPos[1]})`}>
            <ellipse cx="0" cy="28" rx="24" ry="6" fill="#000" opacity="0.4" />
            <motion.g
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <foreignObject x={-32} y={-32} width="64" height="64">
                <div style={{
                  width: 64, height: 64,
                  // Faint wild sprite slightly once defeated so you can tell
                  opacity: wildDefeated ? 0.7 : 1,
                  filter: wildDefeated ? "grayscale(0.3)" : "none",
                }}>
                  {wildCreature.renderSprite(64, { animated: true })}
                </div>
              </foreignObject>
            </motion.g>

            {/* ✓ badge if already defeated */}
            {wildDefeated && (
              <g transform="translate(22, -24)">
                <circle cx="0" cy="0" r="10" fill="#40d040" stroke="#000" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fontSize="11" fill="#000"
                      fontFamily="'Press Start 2P', monospace" fontWeight="bold">✓</text>
              </g>
            )}

            {/* "!" bounce when player is nearby */}
            {nearWild && !fightDialog && (
              <motion.g
                animate={{ y: [-4, -10, -4] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <rect x={-14} y={-58} width="28" height="22" fill="#000" stroke="#ffe066" strokeWidth="2" rx="2" />
                <text x={0} y={-41} textAnchor="middle" fontSize="14" fill="#ffe066"
                      fontFamily="'Press Start 2P', monospace" fontWeight="bold">
                  {wildDefeated ? "!?" : "!"}
                </text>
              </motion.g>
            )}
          </g>
        )}

        {/* Hero — chosen starter creature (mirrored to face walk direction) */}
        <motion.g
          animate={{ x: pos[0], y: pos[1] }}
          transition={{ type: "tween", ease: "linear", duration: 0.05 }}
        >
          <ellipse cx="0" cy="28" rx="20" ry="5" fill="#000" opacity="0.45" />
          {heroCreature ? (
            <foreignObject x={-28} y={-36} width="56" height="64">
              <div style={{
                width: 56, height: 64,
                transform: lastDir === "left" ? "scaleX(-1)" : "scaleX(1)",
              }}>
                {heroCreature.renderSprite(56)}
              </div>
            </foreignObject>
          ) : (
            <g transform="scale(2)">
              <TrainerOverworld dir={lastDir} />
            </g>
          )}
        </motion.g>

        {/* Interact prompt — classic Pokémon dialog (BIG) */}
        {nearestId && !viewerOpen && (() => {
          const pin = layout.pins.find((p) => p.id === nearestId)!;
          return (
            <g transform={`translate(${pin.x}, ${pin.y - 80})`}>
              <rect x={-80} y={-24} width="160" height="40" fill={POKE.dialogBg} stroke="#000" strokeWidth="3" rx="4" />
              <rect x={-74} y={-18} width="148" height="28" fill="none" stroke={POKE.dialogBorderInner} strokeWidth="2" />
              <text x={0} y={4} textAnchor="middle" fontSize="18" fill={POKE.text} fontFamily="'Press Start 2P', monospace">
                PRESS A
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Top status bar — Pokémon dialog box */}
      <div className="absolute top-2 left-2 right-2 flex justify-between gap-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
        <div style={dialogBoxStyle("small")} className="px-3 py-2">
          <span className="text-[10px]" style={{ color: POKE.text }}>
            DAY {day} · <span style={{ color: DAY_COLORS[day] }}>{DAY_META[day].title}</span>
          </span>
        </div>
        <div style={dialogBoxStyle("small")} className="px-3 py-2">
          <span className="text-[10px]" style={{ color: POKE.text }}>
            B = BACK
          </span>
        </div>
      </div>

      {/* Pokémon battle-flash transition on entry */}
      <BattleFlash key={`flash-${day}`} />

      {/* Wild encounter — Fight? dialog */}
      {fightDialog && wildCreature && (
        <div className="absolute inset-0 z-[500] flex items-end justify-center pb-12"
             style={{ background: "rgba(0,0,0,0.55)", fontFamily: "'Press Start 2P', monospace" }}>
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="w-[90%] max-w-2xl"
            style={dialogBoxStyle()}
          >
            <div className="p-5">
              <div className="flex items-center gap-4 mb-3">
                <div style={{ width: 80, height: 80, flexShrink: 0 }}>
                  {wildCreature.renderSprite(80, { animated: true })}
                </div>
                <div className="flex-1">
                  <div className="text-[14px]" style={{ color: POKE.text }}>
                    {wildDefeated ? (
                      <><span style={{ color: POKE.red }}>{wildCreature.name}</span> wants a rematch!</>
                    ) : (
                      <>A wild <span style={{ color: POKE.red }}>{wildCreature.name}</span> appeared!</>
                    )}
                  </div>
                  <div className="text-[10px] mt-2" style={{ color: POKE.text }}>
                    Will you challenge it?
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-6 mt-2">
                <button
                  onMouseEnter={() => setFightChoice("yes")}
                  onClick={() => { setFightDialog(false); onEncounterWild(); }}
                  className="flex items-center gap-2"
                >
                  <span className="text-[14px]" style={{ color: fightChoice === "yes" ? POKE.text : "transparent" }}>▶</span>
                  <span className="text-[14px]" style={{ color: POKE.red }}>YES</span>
                </button>
                <button
                  onMouseEnter={() => setFightChoice("no")}
                  onClick={() => setFightDialog(false)}
                  className="flex items-center gap-2"
                >
                  <span className="text-[14px]" style={{ color: fightChoice === "no" ? POKE.text : "transparent" }}>▶</span>
                  <span className="text-[14px]" style={{ color: POKE.text }}>NO</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ─── Decor sprites ───────────────────────────────────────────────────────
function DecorSprite({ type, x, y, theme }: { type: string; x: number; y: number; theme: string }) {
  if (type === "tree") {
    const darkLeaf = theme === "mountain" ? "#1a4428" : POKE.tree;
    const lightLeaf = theme === "mountain" ? "#2a6038" : POKE.treeLight;
    return (
      <g transform={`translate(${x}, ${y})`}>
        <ellipse cx="0" cy="26" rx="22" ry="6" fill="#000" opacity="0.3" />
        <rect x="-6" y="4" width="12" height="22" fill="#5a3a1a" />
        <circle cx="0" cy="-4" r="24" fill={darkLeaf} />
        <circle cx="-8" cy="-10" r="12" fill={lightLeaf} />
        <circle cx="10" cy="-6" r="10" fill={lightLeaf} />
      </g>
    );
  }
  if (type === "bush") {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <ellipse cx="0" cy="12" rx="20" ry="5" fill="#000" opacity="0.3" />
        <circle cx="-12" cy="0" r="12" fill={POKE.tree} />
        <circle cx="12" cy="0" r="12" fill={POKE.tree} />
        <circle cx="0" cy="-6" r="14" fill={POKE.treeLight} />
      </g>
    );
  }
  if (type === "rock") {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <ellipse cx="0" cy="12" rx="18" ry="4" fill="#000" opacity="0.3" />
        <ellipse cx="0" cy="0" rx="18" ry="12" fill={POKE.rock} />
        <ellipse cx="-6" cy="-4" rx="6" ry="4" fill="#c8c8d0" />
      </g>
    );
  }
  // flower
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r="6" fill={POKE.flower} />
      <circle cx="0" cy="0" r="3" fill={POKE.flowerY} />
      <rect x="-1" y="4" width="2" height="8" fill={POKE.grassDark} />
    </g>
  );
}

// ─── Pokéball pin ────────────────────────────────────────────────────────
function PokeBall({ x, y, size }: { x: number; y: number; size: number }) {
  const r = size / 2;
  return (
    <g>
      {/* Red top half */}
      <path
        d={`M ${x - r} ${y} A ${r} ${r} 0 0 1 ${x + r} ${y}`}
        fill={POKE.red}
        stroke="#000"
        strokeWidth="1.5"
      />
      {/* White bottom half */}
      <path
        d={`M ${x - r} ${y} A ${r} ${r} 0 0 0 ${x + r} ${y}`}
        fill="#ffffff"
        stroke="#000"
        strokeWidth="1.5"
      />
      {/* Middle band */}
      <rect x={x - r} y={y - 1} width={r * 2} height="2" fill="#000" />
      {/* Center button */}
      <circle cx={x} cy={y} r="2.5" fill="#ffffff" stroke="#000" strokeWidth="1" />
      <circle cx={x} cy={y} r="1" fill="#c8c8c8" />
    </g>
  );
}

// ─── Trainer sprite in overworld ─────────────────────────────────────────
function TrainerOverworld({ dir }: { dir: "up" | "down" | "left" | "right" }) {
  // Simple 16×22 trainer centered at origin
  const facing = dir === "left" ? -1 : dir === "right" ? 1 : 0;
  const showingBack = dir === "up";
  return (
    <g transform={`translate(-8, -16) scale(${dir === "left" ? -1 : 1}, 1) translate(${dir === "left" ? -16 : 0}, 0)`}>
      {/* Hat */}
      <rect x="4" y="1" width="8" height="2" fill="#e03030" />
      <rect x="3" y="3" width="10" height="2" fill="#e03030" />
      <rect x="6" y="0" width="4" height="1" fill="#fff" />
      {/* Face / back of head */}
      {showingBack ? (
        <rect x="5" y="5" width="6" height="3" fill="#8a4820" />
      ) : (
        <>
          <rect x="5" y="5" width="6" height="3" fill="#f0c090" />
          {facing === 0 ? (
            <>
              <rect x="6" y="6" width="1" height="1" fill="#000" />
              <rect x="9" y="6" width="1" height="1" fill="#000" />
            </>
          ) : (
            <rect x="9" y="6" width="1" height="1" fill="#000" />
          )}
        </>
      )}
      {/* Shirt */}
      <rect x="4" y="8" width="8" height="6" fill="#ffffff" />
      <rect x="4" y="8" width="8" height="1" fill="#e03030" />
      <rect x="4" y="13" width="8" height="1" fill="#e03030" />
      {/* Arms */}
      <rect x="3" y="9" width="1" height="4" fill="#f0c090" />
      <rect x="12" y="9" width="1" height="4" fill="#f0c090" />
      {/* Legs */}
      <rect x="5" y="14" width="2" height="5" fill="#1040a8" />
      <rect x="9" y="14" width="2" height="5" fill="#1040a8" />
      {/* Shoes */}
      <rect x="4" y="19" width="3" height="2" fill="#c82020" />
      <rect x="9" y="19" width="3" height="2" fill="#c82020" />
    </g>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// PER-DAY SCENES — sky / horizon / landmarks / floaters
// ──────────────────────────────────────────────────────────────────────────
function DaySky({ day }: { day: number }) {
  switch (day) {
    case 1:
      return (
        <g>
          <Sun x={780} y={80} />
          <Cloud x={100} y={70} scale={1} speed={55} />
          <Cloud x={500} y={110} scale={0.8} speed={70} />
        </g>
      );
    case 2:
      return (
        <g>
          <Cloud x={150} y={60} scale={0.9} speed={50} />
          <Cloud x={600} y={90} scale={1.1} speed={65} />
        </g>
      );
    case 3:
      return (
        <g>
          <rect x="0" y="0" width={WORLD_W} height="280" fill="#0a0a28" opacity="0.6" />
          <Moon x={770} y={90} />
          <Stars count={50} />
        </g>
      );
    case 4:
      return (
        <g>
          <Cloud x={100} y={50} scale={0.7} speed={60} />
          <Cloud x={450} y={80} scale={1} speed={75} />
          <Cloud x={750} y={60} scale={0.8} speed={55} />
        </g>
      );
    case 5:
      return (
        <g>
          <Cloud x={50} y={70} scale={1.2} speed={80} />
          <Cloud x={500} y={50} scale={1} speed={90} />
          <Cloud x={800} y={100} scale={0.9} speed={70} />
        </g>
      );
    case 6:
      return (
        <g>
          <Cloud x={80} y={50} scale={0.8} speed={90} />
          <Cloud x={550} y={90} scale={1} speed={70} />
        </g>
      );
  }
  return null;
}

function DayHorizon({ day }: { day: number }) {
  switch (day) {
    case 1: return <HorizonMountains y={180} color="#80a0c8" peaks={5} />;
    case 2: return <HorizonCity       y={210} color="#404a60" />;
    case 3: return <HorizonCity       y={200} color="#1a1a3a" />;
    case 4: return <HorizonMountains y={190} color="#4d8b3d" peaks={4} />;
    case 5: return <Volcano x={750} y={230} />;
    case 6: return (
      <g>
        <HorizonPines y={180} color="#2a1a4a" />
        <HorizonPines y={210} color="#1a0830" />
      </g>
    );
  }
  return null;
}

function DayLandmarks({ day }: { day: number }) {
  switch (day) {
    case 1:
      return (
        <g>
          <Plane x={0} y={100} animate />
          <PalmTree x={120} y={500} />
          <PalmTree x={80} y={600} />
          <PalmTree x={780} y={520} />
          <Lighthouse x={420} y={360} />
          <MOAGlobe x={760} y={540} />
        </g>
      );
    case 2:
      return (
        <g>
          <ApartmentBuilding x={230} y={370} />
          <Factory x={490} y={370} />
          <OfficeTower x={700} y={460} h={110} />
          <StreetLamp x={150} y={560} />
          <StreetLamp x={380} y={580} />
          <StreetLamp x={600} y={570} />
          <Car x={0} y={570} color="#4080c8" animate />
        </g>
      );
    case 3:
      return (
        <g>
          <Skyscraper x={110} y={520} h={160} />
          <Skyscraper x={780} y={520} h={140} />
          <Skyscraper x={450} y={520} h={180} />
          <NeonBillboard x={260} y={380} text="BGC!" />
          <NeonBillboard x={700} y={380} text="AZIZ" />
          <TrafficLight x={400} y={510} />
          <Car x={0} y={540} color="#e03030" animate />
        </g>
      );
    case 4:
      return (
        <g>
          <LogBridge x={300} y={440} />
          <MushroomCluster x={150} y={420} />
          <MushroomCluster x={650} y={500} />
          <Pond x={200} y={520} />
          <WoodenFence x={420} y={540} segments={4} />
          <WoodenFence x={620} y={540} segments={3} />
        </g>
      );
    case 5:
      return (
        <g>
          <FerrisWheel x={200} y={400} />
          <Gazebo x={500} y={520} />
          <PineTree x={120} y={560} />
          <PineTree x={780} y={540} />
          <PineTree x={720} y={600} />
        </g>
      );
    case 6:
      return (
        <g>
          <Pagoda x={500} y={370} />
          <StrawberryPatch x={370} y={380} />
          <Flagpole x={670} y={410} />
          <PineTree x={120} y={500} />
          <PineTree x={150} y={580} />
          <PineTree x={810} y={500} />
          <PineTree x={780} y={600} />
          <PineTree x={260} y={540} />
        </g>
      );
  }
  return null;
}

function DayFloaters({ day }: { day: number }) {
  switch (day) {
    case 1:
      return (
        <g>
          <Seagull x={0} y={120} delay={0} />
          <Seagull x={0} y={80}  delay={5} />
          <Seagull x={0} y={140} delay={10} />
        </g>
      );
    case 2:
      return null;
    case 3:
      return (
        <g>
          {/* subtle neon glow pulse */}
          <rect x="0" y="0" width={WORLD_W} height={WORLD_H} fill="#ff2ec8" opacity="0">
            <animate attributeName="opacity" values="0;0.04;0" dur="3s" repeatCount="indefinite" />
          </rect>
        </g>
      );
    case 4:
      return (
        <g>
          <Butterfly x={200} y={450} delay={0} color="#ff80e0" />
          <Butterfly x={500} y={380} delay={3} color="#ffe066" />
          <Butterfly x={700} y={500} delay={6} color="#80e0ff" />
        </g>
      );
    case 5:
      return <FogLayer y={560} color="#ffffff" />;
    case 6:
      return (
        <g>
          <FallingLeaves count={12} color="#e08840" />
          <FogLayer y={600} color="#c8b8d8" />
        </g>
      );
  }
  return null;
}

// Classic Pokémon battle-style white flash when entering a day
function BattleFlash() {
  const [opacity, setOpacity] = useState(1);
  useEffect(() => {
    setOpacity(1);
    const t1 = setTimeout(() => setOpacity(0.6), 100);
    const t2 = setTimeout(() => setOpacity(1),   180);
    const t3 = setTimeout(() => setOpacity(0),   350);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  return (
    <div
      className="absolute inset-0 pointer-events-none bg-white transition-opacity"
      style={{ opacity, transitionDuration: "120ms" }}
    />
  );
}

function BouncingArrow() {
  return (
    <motion.div
      animate={{ y: [0, 3, 0] }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-1 right-2 text-[10px]"
      style={{ color: POKE.textBlue, fontFamily: "'Press Start 2P', monospace" }}
    >
      ▼
    </motion.div>
  );
}

// Seeded PRNG (Mulberry32)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
