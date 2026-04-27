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
  FerrisWheel, Gazebo,
  PineTree, StrawberryPatch, Pagoda, Flagpole,
  Seagull, Butterfly, FallingLeaves, FogLayer,
  // Phase 6 additions
  BeachUmbrella, WaveCrest, NeonSign, ConfettiRain, LogStack,
  SmallVolcano, SnowFall, StrawberryRow,
  // Phase 8C density pack
  Ship, LifeguardChair, Bench, BikeRack, BusStop, Fountain,
  Tent, PicnicTable, Waterfall, Telescope, RockFormation,
  Lantern, StoneBridge, Snowman, FlowerCluster,
  // Phase 9B Day 1 pixel-art pack
  AirportTerminal, ControlTower, IntramurosGate, StoneWall,
  ShoppingMall, PixelPalm, HotAirBalloon, ShoppingBag,
  AccentCreature,
  // Pixel-art filler pack
  PixelMailbox, PixelFireHydrant, PixelStreetSign, PixelCrate,
  PixelCobble, RoadTile, PixelBush, PixelLampPost,
  // Phase 10 pixel-tile background bands
  SkyBand, WaterBand, SandBand, ShorelineTile,
  // Day 2 rainy-urban pack
  PixelDorm, PixelFactory2, PixelOfficeTower2,
  Puddle, RainOverlay, OvercastSkyBand, CityscapeBand, WetPavementBand,
  // Day 3 neon cyberpunk pack
  NeonSkyBand, NeonCityBand, NeonStreetBand,
  MMDAHq, BGCTowerA, BGCTowerB, BillboardTV, NeonShopSign,
  NeonPulse, NeonSparkle,
  // Day 4 countryside + river + studio pack
  CountrysideSkyBand, RollingHillsBand, MeadowBand, RiverBand,
  RicePaddyStack, BambooHut, Carabao, WoodenArchBridge, WillowTree,
  LilyPadFrog, Duck, TinyWaterfall, Reeds, Scarecrow,
  AnimationStudio, Easel, StudioCat, StudioLogoSign,
  Kite, FloatingCel, FireflySwarm, PaintSplatter,
  // Day 5 carnival pack
  CarnivalSkyBand, HighlandHorizonBand, CarnivalGroundBand,
  BigFerrisWheel, VikingShip, RollerCoaster, Carousel, SwingRide,
  TicketBooth, CarnivalStall, CottonCandyCart, BalloonBunch,
  RisingBalloon, ConfettiBurst, CarnivalCrowd,
  // Day 5 split terrain
  ParkGatewayArch, CliffRailing,
  // Day 6 Baguio highland 5-zone pack
  DawnMistSkyBand, PineRidgeBand, ForestFloorBand, SignpostPointer,
  BusStation, ParkedBus, TravelerGroup,
  StrawberryTrellisRow, HarvestCart, JamStall,
  BellPagoda, StoneLion, IncenseBrazier, TempleBell,
  ParadeGround, PHFlagpole, Cannon, GuardPost,
  OvalLake, SwanBoat, IceCreamCart,
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

// Total checkpoint count across all 6 days — exported so the title screen
// label stays in sync with the actual data.
export const CHECKPOINT_COUNT = Object.values(DAY_LAYOUTS)
  .reduce((n, d) => n + d.pins.length, 0);
export const DAY_COUNT = Object.keys(DAY_LAYOUTS).length;

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
  const [pos, setPos] = useState<[number, number]>(layout.spawn);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [lastDir, setLastDir] = useState<"up" | "down" | "left" | "right">("down");
  const keys = useRef<Record<string, boolean>>({});

  // Wild encounter state
  const wildPos = WILD_POS[day];
  const [fightDialog, setFightDialog] = useState(false);
  const [fightChoice, setFightChoice] = useState<"yes" | "no">("yes");
  const heroCreature = starterId ? getCreature(starterId) : null;
  const wildCreature = wildCreatureId ? getCreature(wildCreatureId) : null;

  // Derived proximity state — recomputed from pos without ever calling setState
  // (avoids the max-update-depth cascade a useEffect + setState would cause
  // when pos updates every animation frame).
  const nearestId = useMemo(() => {
    let nearest: { id: string; dist: number } | null = null;
    for (const pin of layout.pins) {
      const d = Math.hypot(pos[0] - pin.x, pos[1] - pin.y);
      if (d < INTERACT_RADIUS && (!nearest || d < nearest.dist)) {
        nearest = { id: pin.id, dist: d };
      }
    }
    return nearest?.id ?? null;
  }, [pos, layout.pins]);

  const nearWild = useMemo(() => {
    if (!wildCreature) return false;
    return Math.hypot(pos[0] - wildPos[0], pos[1] - wildPos[1]) < INTERACT_RADIUS + 10;
  }, [pos, wildCreature, wildPos]);

  useEffect(() => { setPos(layout.spawn); }, [day, layout.spawn]);

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

  // Internal ref for lastDir — avoids calling setLastDir every tick
  const lastDirRef = useRef<"up" | "down" | "left" | "right">("down");
  useEffect(() => { lastDirRef.current = lastDir; }, [lastDir]);

  useEffect(() => {
    if (viewerOpen) return;
    let alive = true;
    let rafId = 0;
    let lastTime = 0;
    const STEP_MS = 1000 / 60;

    const step = (time: number) => {
      if (!alive) return;
      // Throttle to ~60Hz; skip frames when browser fires too fast
      if (time - lastTime >= STEP_MS) {
        lastTime = time;

        const k = keys.current;
        let dx = 0, dy = 0;
        if (k["w"] || k["arrowup"])    dy -= 1;
        if (k["s"] || k["arrowdown"])  dy += 1;
        if (k["a"] || k["arrowleft"])  dx -= 1;
        if (k["d"] || k["arrowright"]) dx += 1;

        if (dx !== 0 || dy !== 0) {
          const len = Math.hypot(dx, dy);
          const ndx = (dx / len) * PLAYER_SPEED;
          const ndy = (dy / len) * PLAYER_SPEED;

          setPos((prev) => {
            const [x, y] = prev;
            const nx = Math.max(50, Math.min(WORLD_W - 50, x + ndx));
            const ny = Math.max(50, Math.min(WORLD_H - 50, y + ndy));
            // Return SAME array reference when clamped so React skips render
            if (nx === x && ny === y) return prev;
            return [nx, ny];
          });

          // Only update the sprite facing when the player moves HORIZONTALLY.
          // Pure up/down movement preserves the last horizontal facing so the
          // hero doesn't suddenly "look the wrong way" when just walking north.
          if (dx !== 0) {
            const newDir: "left" | "right" = dx > 0 ? "right" : "left";
            if (newDir !== lastDirRef.current) {
              lastDirRef.current = newDir;
              setLastDir(newDir);
            }
          }
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
    };
  }, [viewerOpen]);


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

  // All 6 days use the pixel-tile backdrop — deep-space BG + day-accent glow
  const wrapperStyle: React.CSSProperties = {
    background: "#0a1020",
    boxShadow: `inset 0 0 30px ${accent}55, inset 0 0 6px ${accent}`,
  };

  return (
    <div className="absolute inset-0" style={wrapperStyle}>
      <svg
        viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        shapeRendering="crispEdges"
      >
        {/* Pixel-tile background bands — per-day composition */}
        {day === 1 && (
          <g>
            <SkyBand       width={WORLD_W} top={0}   bottom={200} />
            <WaterBand     width={WORLD_W} top={200} bottom={420} />
            <SandBand      width={WORLD_W} top={420} bottom={WORLD_H} />
            <ShorelineTile width={WORLD_W} y={420} />
          </g>
        )}
        {day === 2 && (
          <g>
            <OvercastSkyBand width={WORLD_W} top={0}   bottom={200} />
            <CityscapeBand   width={WORLD_W} top={180} bottom={340} />
            <WetPavementBand width={WORLD_W} top={340} bottom={WORLD_H} />
          </g>
        )}
        {day === 3 && (
          <g>
            <NeonSkyBand    width={WORLD_W} top={0}   bottom={220} />
            <NeonCityBand   width={WORLD_W} top={200} bottom={360} />
            <NeonStreetBand width={WORLD_W} top={360} bottom={WORLD_H} />
          </g>
        )}
        {day === 4 && (
          <g>
            <CountrysideSkyBand width={WORLD_W} top={0}   bottom={220} />
            <RollingHillsBand   width={WORLD_W} top={180} bottom={360} />
            <MeadowBand         width={WORLD_W} top={340} bottom={WORLD_H} />
            {/* Horizontal river flowing through the middle */}
            <RiverBand x={0} y={500} width={WORLD_W} height={50} />
          </g>
        )}
        {day === 5 && (
          <g>
            <CarnivalSkyBand     width={WORLD_W} top={0}   bottom={200} />
            <HighlandHorizonBand width={WORLD_W} top={180} bottom={340} />
            {/* Left half — People's Park meadow (x: 0 → 470) */}
            <MeadowBand          x={0}   width={470} top={320} bottom={WORLD_H} />
            {/* Right half — Sky Ranch carnival concourse (x: 470 → 900) */}
            <CarnivalGroundBand  x={470} width={430} top={320} bottom={WORLD_H} />
          </g>
        )}
        {day === 6 && (
          <g>
            <DawnMistSkyBand width={WORLD_W} top={0}   bottom={220} />
            <PineRidgeBand   width={WORLD_W} top={180} bottom={340} />
            <ForestFloorBand width={WORLD_W} top={320} bottom={WORLD_H} />
          </g>
        )}

        {/* All 6 days use the pixel-tile backdrop — no fallback layers needed */}

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
              <PokeBall x={pin.x} y={pin.y} size={isNear ? 88 : 72} />
              {/* Name tag — only visible when player is near, floats ABOVE the pin.
                  Includes the location name + a little "A" button hint on the right. */}
              {isNear && loc && !viewerOpen && (() => {
                const fullName = loc.name.toUpperCase();
                // Text width + A-badge + padding
                const textW = fullName.length * 10;
                const tagW  = Math.max(150, textW + 46);
                const textX = -tagW / 2 + 12;
                const badgeX = tagW / 2 - 18;
                return (
                  <motion.g
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <g transform={`translate(${pin.x}, ${pin.y - 70})`}>
                      {/* Main pill */}
                      <rect x={-tagW / 2}     y={-16} width={tagW}     height={28} fill={POKE.dialogBg} stroke="#000" strokeWidth="2.5" rx="4" />
                      <rect x={-tagW / 2 + 3} y={-13} width={tagW - 6} height="2"  fill={POKE.dialogBorderInner} />
                      {/* Location name (left-aligned) */}
                      <text
                        x={textX}
                        y={3}
                        fontSize="9"
                        fill={POKE.text}
                        fontFamily="'Press Start 2P', monospace"
                      >
                        {fullName}
                      </text>
                      {/* A-button badge on the right */}
                      <circle cx={badgeX} cy={-2} r="9" fill="#c73030" stroke="#000" strokeWidth="2" />
                      <circle cx={badgeX - 2} cy={-4} r="2.5" fill="#ffffff" opacity="0.5" />
                      <text
                        x={badgeX}
                        y={2}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#ffffff"
                        fontFamily="'Press Start 2P', monospace"
                      >
                        A
                      </text>
                      {/* Triangular tail pointing down at the pin */}
                      <path d="M -6 12 L 6 12 L 0 20 Z" fill={POKE.dialogBg} stroke="#000" strokeWidth="2" />
                    </g>
                  </motion.g>
                );
              })()}
            </g>
          );
        })}

        {/* Per-day floaters (butterflies, seagulls, leaves, fog…) */}
        <DayFloaters day={day} />

        {/* Wild Pokémon waiting on the map — stays after defeat (re-challengeable) */}
        {wildCreature && (
          <g transform={`translate(${wildPos[0]}, ${wildPos[1]})`}>
            <ellipse cx="0" cy="44" rx="36" ry="7" fill="#000" opacity="0.4" />
            <motion.g
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <foreignObject x={-48} y={-52} width="96" height="96">
                <div style={{
                  width: 96, height: 96,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  opacity: wildDefeated ? 0.7 : 1,
                  filter: wildDefeated ? "grayscale(0.3)" : "none",
                }}>
                  {/* Base 64 — internal scale 1.4-1.5 lands visual ~96 (fits foreignObject) */}
                  {wildCreature.renderSprite(64, { animated: true })}
                </div>
              </foreignObject>
            </motion.g>

            {/* ✓ badge if already defeated */}
            {wildDefeated && (
              <g transform="translate(36, -38)">
                <circle cx="0" cy="0" r="13" fill="#40d040" stroke="#000" strokeWidth="2.5" />
                <text x="0" y="5" textAnchor="middle" fontSize="14" fill="#000"
                      fontFamily="'Press Start 2P', monospace" fontWeight="bold">✓</text>
              </g>
            )}

            {/* "!" bounce when player is nearby */}
            {nearWild && !fightDialog && (
              <motion.g
                animate={{ y: [-4, -10, -4] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <rect x={-18} y={-82} width="36" height="26" fill="#000" stroke="#ffe066" strokeWidth="2.5" rx="3" />
                <text x={0} y={-62} textAnchor="middle" fontSize="16" fill="#ffe066"
                      fontFamily="'Press Start 2P', monospace" fontWeight="bold">
                  {wildDefeated ? "!?" : "!"}
                </text>
              </motion.g>
            )}
          </g>
        )}

        {/* Hero — outer <g> drives the translate from pos every frame.
            Inner <motion.g> handles the spawn-in fade only — they don't fight
            because the inner motion never touches `transform` directly. */}
        <g transform={`translate(${pos[0]}, ${pos[1]})`}>
          <motion.g
            key={`hero-spawn-${day}`}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
          <ellipse cx="0" cy="46" rx="32" ry="7" fill="#000" opacity="0.45" />
          {heroCreature ? (
            <foreignObject x={-60} y={-70} width="120" height="120">
              <div style={{
                width: 120, height: 120,
                // PokéAPI front sprites face slightly to the viewer's LEFT by
                // default — so we flip when walking RIGHT so the hero appears
                // to look in the direction they're moving.
                transform: lastDir === "right" ? "scaleX(-1)" : "scaleX(1)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: 8,
              }}>
                {/* Base 72 — internal scale 1.4-1.5 yields visual ~108 (fits 120 box) */}
                {heroCreature.renderSprite(72, { animated: true })}
              </div>
            </foreignObject>
          ) : (
            <g transform="scale(3)">
              <TrainerOverworld dir={lastDir} />
            </g>
          )}
          </motion.g>
        </g>

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

// ─── Pokéball pin ────────────────────────────────────────────────────────
// Animated, glowing, floating Pokéball that reads clearly as interactable.
// Loads the real PokéAPI items sprite via raw GitHub URL; falls back to
// an inline SVG Pokéball if the network is unavailable.
const POKEBALL_ITEM_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

function PokeBall({ x, y, size }: { x: number; y: number; size: number }) {
  const r = size / 2;
  const glowR = size * 0.85;
  return (
    <g>
      {/* Pulsing golden glow ring */}
      <circle cx={x} cy={y} r={glowR} fill="#ffe066" opacity="0.25">
        <animate attributeName="r" values={`${glowR};${glowR * 1.35};${glowR}`} dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0;0.25" dur="1.6s" repeatCount="indefinite" />
      </circle>
      {/* Static glow halo */}
      <circle cx={x} cy={y} r={r * 1.15} fill="#ffe066" opacity="0.3" />
      {/* Drop shadow below */}
      <ellipse cx={x} cy={y + r + 4} rx={r * 0.9} ry={r * 0.2} fill="#000" opacity="0.35" />
      {/* Animated sprite — bobs up/down */}
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <foreignObject x={x - r} y={y - r} width={size} height={size}>
          <img
            src={POKEBALL_ITEM_URL}
            alt=""
            width={size}
            height={size}
            draggable={false}
            style={{
              width: size,
              height: size,
              imageRendering: "pixelated",
              filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.6))",
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).outerHTML = fallbackPokeballSvg(size);
            }}
          />
        </foreignObject>
      </motion.g>
    </g>
  );
}

// Inline SVG fallback when PokéAPI CDN is unreachable
function fallbackPokeballSvg(size: number): string {
  const r = size / 2;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <path d="M 0 ${r} A ${r} ${r} 0 0 1 ${size} ${r}" fill="${POKE.red}" stroke="#000" stroke-width="2"/>
    <path d="M 0 ${r} A ${r} ${r} 0 0 0 ${size} ${r}" fill="#fff" stroke="#000" stroke-width="2"/>
    <rect x="0" y="${r - 2}" width="${size}" height="4" fill="#000"/>
    <circle cx="${r}" cy="${r}" r="${r * 0.2}" fill="#fff" stroke="#000" stroke-width="1.5"/>
  </svg>`;
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
function DayLandmarks({ day }: { day: number }) {
  switch (day) {
    case 1:
      return (
        <g>
          {/* ── SKY (y 0-200): plane + 2 balloons, clouds from WaveCrest-less tiles ── */}
          <Plane x={0} y={70} animate />
          <HotAirBalloon x={0} y={110} delay={8} />
          <HotAirBalloon x={0} y={150} delay={22} />

          {/* ── HORIZON (y 200-260): 2 ships staggered on the bay ── */}
          <Ship x={180} y={240} />
          <Ship x={720} y={250} />

          {/* ── LANDMARK ROW (y 340-440): one cluster per pin zone ── */}
          {/* Airport cluster x=100-260 */}
          <ControlTower   x={100} y={420} />
          <AirportTerminal x={220} y={400} />
          {/* Intramuros cluster x=380-540 */}
          <StoneWall      x={340} y={340} length={60} />
          <IntramurosGate x={450} y={330} />
          <StoneWall      x={510} y={340} length={60} />
          {/* MOA cluster x=620-820 */}
          <ShoppingMall x={700} y={420} />
          <MOAGlobe     x={830} y={540} />

          {/* ── MAIN ROAD + BRANCHES (y=450-540) ── */}
          <RoadTile x={0}   y={460} width={120} />
          <RoadTile x={120} y={460} width={120} />
          <RoadTile x={240} y={460} width={120} />
          <RoadTile x={360} y={460} width={120} />
          <RoadTile x={480} y={460} width={120} />
          <RoadTile x={600} y={460} width={120} />
          <RoadTile x={720} y={460} width={120} />
          <RoadTile x={840} y={460} width={60} />
          {/* Vertical branches up to landmark row */}
          <RoadTile x={200} y={440} width={20} vertical />
          <RoadTile x={450} y={380} width={80} vertical />
          <RoadTile x={700} y={440} width={20} vertical />
          {/* Cobblestone at each intersection */}
          <PixelCobble x={200} y={460} />
          <PixelCobble x={450} y={460} />
          <PixelCobble x={700} y={460} />

          {/* ── PIN-ROW INFRASTRUCTURE (y=470-530) ── */}
          {/* One sign + one hydrant flanking each cluster */}
          <PixelStreetSign x={130} y={505} label="TAXI" bg="#ffcc30" />
          <PixelFireHydrant x={280} y={495} />
          <PixelStreetSign x={555} y={505} label="FORT" bg="#4080c8" />
          <PixelFireHydrant x={380} y={495} />
          <PixelStreetSign x={620} y={505} label="MALL" bg="#c94040" />
          <PixelFireHydrant x={790} y={495} />

          {/* Sudowoodo cameo — near the Intramuros wall but off the road */}
          <AccentCreature x={400} y={490} dexId={185} size={48} />

          {/* ── DECOR ROW 1 (y=540-620): palms + benches + mailboxes ── */}
          {/* Palms evenly spaced, avoiding landmark x-ranges */}
          <PixelPalm x={50}  y={560} />
          <PixelPalm x={340} y={560} />
          <PixelPalm x={580} y={560} />
          <PixelPalm x={880} y={560} />
          {/* One bench per cluster */}
          <Bench x={140} y={600} />
          <Bench x={540} y={600} />
          <Bench x={760} y={600} />
          {/* One mailbox per cluster */}
          <PixelMailbox x={260} y={600} />
          <PixelMailbox x={650} y={600} />
          <PixelMailbox x={880} y={600} />

          {/* ── DECOR ROW 2 (y=620-700): umbrellas + lifeguards + flowers ── */}
          <BeachUmbrella x={80}  y={670} />
          <BeachUmbrella x={220} y={670} />
          <BeachUmbrella x={500} y={670} />
          <BeachUmbrella x={720} y={670} />
          <BeachUmbrella x={860} y={670} />
          <LifeguardChair x={380} y={660} />
          {/* Flower clusters ONLY in leftover gaps */}
          <FlowerCluster x={30}  y={630} />
          <FlowerCluster x={440} y={650} />
          <FlowerCluster x={620} y={640} />
          <FlowerCluster x={830} y={630} />
          <PixelBush x={160} y={645} />
          <PixelBush x={580} y={645} />
        </g>
      );
    case 2:
      return (
        <g>
          {/* ── LANDMARK ROW (y 260-420) — three wide buildings behind pins ── */}
          {/* DJM Dorm cluster x=150-350 */}
          <PixelDorm x={250} y={340} />
          {/* Hytec Factory cluster x=400-600 */}
          <PixelFactory2 x={500} y={360} />
          {/* OpenText Office cluster x=650-830 */}
          <PixelOfficeTower2 x={720} y={380} />

          {/* ── ROADS (y 460-540) ── */}
          <RoadTile x={0}   y={500} width={120} />
          <RoadTile x={120} y={500} width={120} />
          <RoadTile x={240} y={500} width={120} />
          <RoadTile x={360} y={500} width={120} />
          <RoadTile x={480} y={500} width={120} />
          <RoadTile x={600} y={500} width={120} />
          <RoadTile x={720} y={500} width={120} />
          <RoadTile x={840} y={500} width={60} />
          {/* Vertical branches to each pin */}
          <RoadTile x={250} y={420} width={80} vertical />
          <RoadTile x={500} y={420} width={80} vertical />
          <RoadTile x={720} y={460} width={40} vertical />
          <PixelCobble x={250} y={500} />
          <PixelCobble x={500} y={500} />
          <PixelCobble x={720} y={500} />

          {/* ── PIN-ROW INFRASTRUCTURE ── */}
          <PixelStreetSign x={170} y={480} label="DORM" bg="#4080c8" />
          <BusStop x={330} y={480} />
          <PixelStreetSign x={420} y={480} label="FACTORY" bg="#c94040" />
          <PixelFireHydrant x={610} y={470} />
          <PixelStreetSign x={640} y={480} label="OFFICE" bg="#ffb000" />

          {/* Puddles on the wet pavement */}
          <Puddle x={100} y={540} w={36} />
          <Puddle x={400} y={550} w={28} />
          <Puddle x={550} y={540} w={40} />
          <Puddle x={820} y={555} w={32} />

          {/* Animated cars */}
          <Car x={0} y={540} color="#4080c8" animate />
          <Car x={0} y={580} color="#e0a040" animate />

          {/* ── DECOR ROW 1 (y 570-620): lamps, benches, bike racks ── */}
          <PixelLampPost x={80}  y={560} />
          <PixelLampPost x={380} y={560} />
          <PixelLampPost x={620} y={560} />
          <PixelLampPost x={870} y={560} />
          <Bench x={200} y={610} />
          <Bench x={460} y={610} />
          <Bench x={780} y={610} />
          <BikeRack x={140} y={615} />
          <BikeRack x={680} y={615} />

          {/* ── DECOR ROW 2 (y 630-700): crates, mailbox, flower clusters ── */}
          <PixelMailbox x={300} y={650} />
          <PixelMailbox x={700} y={650} />
          <PixelCrate x={50}  y={660} />
          <PixelCrate x={530} y={660} />
          <PixelCrate x={860} y={660} />
          <FlowerCluster x={40}  y={630} />
          <FlowerCluster x={240} y={650} />
          <FlowerCluster x={500} y={640} />
          <FlowerCluster x={600} y={670} />
          <FlowerCluster x={830} y={640} />

          {/* ── RAIN OVERLAY — over every other element ── */}
          <RainOverlay width={WORLD_W} height={WORLD_H} density={90} />
        </g>
      );
    case 3:
      return (
        <g>
          {/* ── LANDMARK ROW: MMDA (left cluster) + BGC towers (right cluster) ── */}
          {/* MMDA cluster x=180-330 */}
          <MMDAHq x={260} y={380} />
          {/* BGC plaza x=520-820 — two towers */}
          <BGCTowerA x={640} y={380} />
          <BGCTowerB x={800} y={380} />

          {/* ── ROADS (y=470-540) ── */}
          <RoadTile x={0}   y={500} width={120} />
          <RoadTile x={120} y={500} width={120} />
          <RoadTile x={240} y={500} width={120} />
          <RoadTile x={360} y={500} width={120} />
          <RoadTile x={480} y={500} width={120} />
          <RoadTile x={600} y={500} width={120} />
          <RoadTile x={720} y={500} width={120} />
          <RoadTile x={840} y={500} width={60} />
          <RoadTile x={260} y={440} width={60} vertical />
          <RoadTile x={640} y={440} width={60} vertical />
          <PixelCobble x={260} y={500} />
          <PixelCobble x={640} y={500} />

          {/* ── BILLBOARDS + NEON SIGNS (y 440-520) ── */}
          <BillboardTV x={120} y={472} />
          <BillboardTV x={470} y={472} />
          <BillboardTV x={870} y={472} />
          <NeonShopSign x={180} y={525} text="OPEN" color="#ff2ec8" />
          <NeonShopSign x={360} y={525} text="KTV"  color="#00e0ff" />
          <NeonShopSign x={550} y={525} text="24HR" color="#ffe066" />
          <NeonShopSign x={740} y={525} text="SUSHI" color="#ff60d0" />

          {/* ── TRAFFIC + CARS ── */}
          <TrafficLight x={400} y={488} />
          <TrafficLight x={720} y={488} />
          <Car x={0} y={512} color="#ff2ec8" animate />
          <Car x={0} y={560} color="#00e0ff" animate />

          {/* ── DECOR ROW 1 (y 560-620): streetlamps + benches ── */}
          <PixelLampPost x={60}  y={580} />
          <PixelLampPost x={320} y={580} />
          <PixelLampPost x={580} y={580} />
          <PixelLampPost x={860} y={580} />
          <Bench x={180} y={610} />
          <Bench x={460} y={610} />
          <Bench x={760} y={610} />

          {/* ── DECOR ROW 2 (y 630-690): fire hydrants, mailbox, crates ── */}
          <PixelFireHydrant x={100} y={660} />
          <PixelFireHydrant x={420} y={660} />
          <PixelFireHydrant x={820} y={660} />
          <PixelMailbox x={240} y={650} />
          <PixelMailbox x={660} y={650} />
          <PixelCrate x={520} y={670} />
          <PixelCrate x={540} y={684} />

          {/* ── AMBIENT OVERLAYS (on top of everything except pins/hero) ── */}
          <NeonSparkle width={WORLD_W} height={WORLD_H} count={40} />
          <NeonPulse   width={WORLD_W} height={WORLD_H} />
        </g>
      );
    case 4:
      return (
        <g>
          {/* ── SKY LAYER — kite drifting + floating animation cels ── */}
          <Kite x={0} y={90} delay={2} />
          <Kite x={0} y={150} delay={20} />
          <FloatingCel x={200} y={250} delay={0}  duration={18} />
          <FloatingCel x={500} y={220} delay={4}  duration={22} />
          <FloatingCel x={760} y={270} delay={8}  duration={20} />

          {/* ── HILL-LINE BACKDROP DETAILS (behind landmarks) ── */}
          <TinyWaterfall x={860} y={400} />
          <WillowTree x={60}  y={440} />
          <WillowTree x={880} y={450} />

          {/* ── LANDMARK ROW (y 340-440) ── */}
          {/* Rice paddy cluster x=100-260 */}
          <RicePaddyStack x={170} y={390} />
          <BambooHut x={80}  y={440} />
          <Scarecrow x={260} y={420} />
          {/* Animation studio — centred behind Day 4 Photo Dump pin at (500,400) */}
          <AnimationStudio x={500} y={400} />
          <StudioLogoSign x={420} y={430} />
          <Easel          x={590} y={430} />
          {/* Right cluster — river-valley vibe + carabao */}
          <Carabao x={750} y={440} />
          <WillowTree x={820} y={450} />

          {/* ── ROAD going from left edge toward the pin + from pin toward the bridge ── */}
          <RoadTile x={0}   y={470} width={120} />
          <RoadTile x={120} y={470} width={120} />
          <RoadTile x={240} y={470} width={120} />
          <RoadTile x={360} y={470} width={120} />
          <RoadTile x={500} y={440} width={40}  vertical />
          <RoadTile x={620} y={470} width={120} />
          <RoadTile x={740} y={470} width={120} />
          <RoadTile x={860} y={470} width={40} />
          <PixelCobble x={500} y={470} />

          {/* ── RIVER CROSSING — wooden bridge spanning the river at y=500 ── */}
          <WoodenArchBridge x={410} y={510} width={180} />

          {/* ── RIVER LIFE (inside the river band y 500-550) ── */}
          <LilyPadFrog x={120}  y={530} />
          <LilyPadFrog x={680}  y={535} />
          <LilyPadFrog x={820}  y={525} />
          <Reeds x={40}   y={540} />
          <Reeds x={240}  y={545} />
          <Reeds x={620}  y={545} />
          <Reeds x={840}  y={540} />
          <Duck  x={0}    y={520} delay={0} />
          <Duck  x={0}    y={532} delay={14} />

          {/* ── PIN-ROW PROPS (around the pin at (500,400) and wild (700,500)) ── */}
          <PaintSplatter x={440} y={460} color="#ff6080" />
          <PaintSplatter x={560} y={460} color="#50c8d0" />
          <PaintSplatter x={410} y={478} color="#ffe066" />
          <PaintSplatter x={590} y={478} color="#a080f0" />

          {/* ── FOREGROUND (y 580-700) — meadow decorations ── */}
          <PixelPalm x={50}  y={600} />
          <PixelPalm x={150} y={660} />
          <PixelPalm x={280} y={600} />
          <PixelPalm x={400} y={650} />
          <PixelPalm x={600} y={640} />
          <PixelPalm x={820} y={600} />
          <Bench x={220} y={640} />
          <Bench x={500} y={640} />
          <Bench x={700} y={640} />
          <PicnicTable x={360} y={660} />
          <PicnicTable x={760} y={660} />
          <WoodenFence x={80}  y={690} segments={5} />
          <WoodenFence x={310} y={690} segments={5} />
          <WoodenFence x={540} y={690} segments={5} />
          <WoodenFence x={780} y={690} segments={5} />
          <MushroomCluster x={460} y={620} />
          <MushroomCluster x={640} y={620} />
          <FlowerCluster x={30}  y={660} />
          <FlowerCluster x={250} y={680} />
          <FlowerCluster x={480} y={680} />
          <FlowerCluster x={690} y={680} />
          <FlowerCluster x={870} y={660} />

          {/* ── CREATIVE AMBIENT — studio cat wandering + fireflies ── */}
          <StudioCat x={0} y={600} delay={3} />
          <StudioCat x={0} y={655} delay={18} />
          <FireflySwarm width={WORLD_W} height={WORLD_H} count={26} top={400} />
        </g>
      );
    case 5:
      return (
        <g>
          {/* ── SKY LAYER — rising balloons + confetti ONLY above right half ── */}
          <RisingBalloon x={540}  color="#40c860" delay={4}  duration={24} />
          <RisingBalloon x={640}  color="#ffa030" delay={8}  duration={26} />
          <RisingBalloon x={720}  color="#ffe040" delay={14} duration={20} />
          <RisingBalloon x={800}  color="#4090e0" delay={18} duration={22} />
          <RisingBalloon x={860}  color="#c060e0" delay={12} duration={25} />
          <ConfettiBurst x={560}  y={110} delay={0} />
          <ConfettiBurst x={720}  y={90}  delay={1.4} />
          <ConfettiBurst x={850}  y={120} delay={2.8} />

          {/* ════════ LEFT HALF — PEOPLE'S PARK HIGHLAND (x 0-470) ════════ */}

          {/* Distant scenery on the left cliff */}
          <Waterfall x={60} y={420} />
          <RockFormation x={140} y={420} />
          <RockFormation x={220} y={460} />

          {/* Pine ridge above the viewing deck */}
          <PineTree x={40}  y={380} />
          <PineTree x={190} y={380} />
          <PineTree x={260} y={420} />

          {/* People's Park viewing area (tagaytay pin at 350,420) */}
          <Gazebo x={360} y={460} />
          <Telescope x={300} y={490} />
          <Bench x={430} y={560} />

          {/* Wooden cliff railing along the bottom of the viewing deck */}
          <CliffRailing x={40}  y={600} segments={6} />
          <CliffRailing x={260} y={600} segments={6} />

          {/* Quiet foreground fillers — pines + flowers, no crowds */}
          <PineTree x={80}  y={620} />
          <PineTree x={400} y={630} />
          <FlowerCluster x={20}  y={670} />
          <FlowerCluster x={160} y={685} />
          <FlowerCluster x={320} y={680} />

          {/* ════════ DIVIDER — PARK GATEWAY ARCH @ x=470 ════════ */}
          <ParkGatewayArch x={470} y={380} />

          {/* ════════ RIGHT HALF — SKY RANCH CARNIVAL (x 500-880) ════════ */}

          {/* BIG Ferris Wheel — centrepiece far right (peaks above the arch) */}
          <BigFerrisWheel x={830} y={290} />

          {/* Viking ship + carousel + swing + ticket booth cluster */}
          <TicketBooth x={530} y={380} />
          <Carousel    x={620} y={420} />
          <VikingShip  x={720} y={380} />
          <SwingRide   x={780} y={400} />

          {/* Roller Coaster — fits inside the right half */}
          <RollerCoaster x={520} y={560} width={360} />

          {/* Balloon bunches flanking the arch entry */}
          <BalloonBunch x={510} y={540} />
          <BalloonBunch x={890} y={540} />

          {/* Food stalls + cotton candy carts along the concourse */}
          <CarnivalStall   x={540} y={620} color="#ff4060" label="HOT DOG" />
          <CottonCandyCart x={640} y={620} />
          <CarnivalStall   x={720} y={620} color="#ffa030" label="POPCORN" />
          <CottonCandyCart x={810} y={620} />
          <CarnivalStall   x={880} y={620} color="#40c0e0" label="TREATS" />

          {/* Carnival crowds — only on the right half */}
          <CarnivalCrowd x={520} y={670} count={6} />
          <CarnivalCrowd x={660} y={675} count={6} />
          <CarnivalCrowd x={800} y={670} count={5} />

          {/* Right-half flower accents (small bits of green between the chaos) */}
          <FlowerCluster x={560} y={685} />
          <FlowerCluster x={750} y={690} />
        </g>
      );
    case 6:
      return (
        <g>
          {/* ════════ ZONE 1 — BUS TERMINAL (x=0-240) behind baguio pin (200,380) ════════ */}
          <BusStation    x={180} y={340} />
          <ParkedBus     x={60}  y={430} />
          <TravelerGroup x={140} y={460} />
          <PineTree x={40}  y={450} />
          <PineTree x={260} y={470} />
          <SignpostPointer x={230} y={490} label="FARM" direction="right" bg="#c06828" />

          {/* ════════ ZONE 2 — STRAWBERRY FIELD (x=260-460) behind strawberry pin (370,300) ════════ */}
          <JamStall x={300} y={340} />
          <StrawberryTrellisRow x={280} y={380} width={160} />
          <StrawberryTrellisRow x={280} y={420} width={160} />
          <HarvestCart x={420} y={460} />
          <Scarecrow x={340} y={430} />
          <SignpostPointer x={450} y={490} label="TEMPLE" direction="right" bg="#c04040" />

          {/* ════════ ZONE 3 — BELL TEMPLE (x=460-620) behind bell-church pin (530,270) ════════ */}
          <BellPagoda x={540} y={340} />
          <StoneLion x={488} y={410} facing="right" />
          <StoneLion x={592} y={410} facing="left" />
          <IncenseBrazier x={540} y={420} />
          <TempleBell x={475} y={400} />
          <Lantern x={500} y={360} color="#e04040" />
          <Lantern x={580} y={360} color="#ffcc40" />
          <SignpostPointer x={625} y={490} label="PMA" direction="right" bg="#305070" />

          {/* ════════ ZONE 4 — PMA PARADE (x=620-820) behind pma pin (690,340) ════════ */}
          <GuardPost x={640} y={380} />
          <ParadeGround x={655} y={410} width={160} />
          <PHFlagpole x={720} y={410} />
          <Cannon x={680} y={460} />
          <Cannon x={770} y={460} />
          <SignpostPointer x={820} y={490} label="PARK" direction="right" bg="#40a060" />

          {/* ════════ ZONE 5 — BURNHAM PARK (x=380-800, lower band) behind day6-dump pin (560,460) ════════ */}
          <OvalLake x={400} y={500} width={320} height={90} />
          <SwanBoat x={440} y={534} delay={0} />
          <SwanBoat x={500} y={554} delay={8} />
          <IceCreamCart x={820} y={580} />

          {/* ════════ FOREGROUND — pines + rocks + flowers fill the frame ════════ */}
          <PineTree x={20}  y={500} />
          <PineTree x={80}  y={630} />
          <RockFormation x={340} y={640} />
          <PineTree x={240} y={610} />
          <PineTree x={360} y={600} />
          <PineTree x={860} y={480} />
          <PineTree x={820} y={640} />
          <RockFormation x={760} y={620} />
          <Snowman x={130} y={650} />
          <Snowman x={700} y={650} />
          <FlowerCluster x={40}  y={680} />
          <FlowerCluster x={180} y={685} />
          <FlowerCluster x={300} y={680} />
          <FlowerCluster x={480} y={685} />
          <FlowerCluster x={640} y={680} />
          <FlowerCluster x={780} y={685} />
          <FlowerCluster x={880} y={680} />
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
          <ConfettiRain count={16} />
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
          <FallingLeaves count={8} color="#e08840" />
          <SnowFall count={14} />
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
