"use client";

import { useCallback, useEffect, useRef, useState, CSSProperties } from "react";
import { motion, useAnimationControls } from "framer-motion";
import type { Creature, Move, CreatureType } from "./creatures";
import { computeDamage, effectiveness } from "./creatures";
import { POKE } from "./adventure-screens";
import { useCreatureData } from "./poke-api";
import { getMoveFx, allFxUrls, type FxMode } from "./move-fx";

// Merge live PokéAPI data into a Creature (falling back to hardcoded values).
function mergeApiData(c: Creature, apiData: ReturnType<typeof useCreatureData>["data"]): Creature {
  if (!apiData) return c;
  // Deliberately DO NOT override level/maxHp — those are balanced in creatures.ts
  // (all creatures share L99 with tiered HP so battles come down to move choice
  // and type matchup, not stat gaps pulled from PokéAPI base stats).
  return {
    ...c,
    types: (apiData.types.length ? apiData.types : c.types) as CreatureType[],
    description: apiData.description || c.description,
    moves: apiData.moves.length === 4
      ? (apiData.moves.map((m) => ({
          name: m.name,
          type: m.type as CreatureType,
          power: m.power || 20,
          flavor: m.flavor || "A solid hit!",
        })) as Move[])
      : c.moves,
  };
}

type BattleResult = "victory" | "defeat" | "run" | "caught";

// ── Status effects ──────────────────────────────────────────────────────
type Status = "poison" | "paralysis" | null;
// Map canonical move-name slugs → status they may apply (plus application odds).
const STATUS_INFLICTORS: Record<string, { status: Status; odds: number; label: string }> = {
  "sludge-bomb":  { status: "poison",     odds: 0.30, label: "POISONED" },
  "poison-jab":   { status: "poison",     odds: 0.30, label: "POISONED" },
  "sludge":       { status: "poison",     odds: 0.30, label: "POISONED" },
  "acid":         { status: "poison",     odds: 0.10, label: "POISONED" },
  "toxic":        { status: "poison",     odds: 1.00, label: "BADLY POISONED" },
  "thunder-wave": { status: "paralysis",  odds: 1.00, label: "PARALYZED" },
  "thunder":      { status: "paralysis",  odds: 0.30, label: "PARALYZED" },
  "thunderbolt":  { status: "paralysis",  odds: 0.10, label: "PARALYZED" },
  "hypnosis":     { status: "paralysis",  odds: 0.60, label: "PARALYZED" },
};
function moveStatusEffect(moveName: string) {
  const slug = moveName.trim().toLowerCase().replace(/\s+/g, "-");
  return STATUS_INFLICTORS[slug] ?? null;
}

// ── Bag inventory — resets at each battle ───────────────────────────────
interface Bag { potion: number; superPotion: number; pokeball: number; }
const INITIAL_BAG: Bag = { potion: 3, superPotion: 1, pokeball: 2 };
const BAG_ITEMS = [
  { key: "potion",       label: "POTION",        desc: "Restore 50 HP" },
  { key: "superPotion",  label: "SUPER POTION",  desc: "Restore 120 HP" },
  { key: "pokeball",     label: "POKé BALL",     desc: "Try to catch the wild foe" },
  { key: "cancel",       label: "CANCEL",        desc: "Back to main menu" },
] as const;

interface Props {
  player: Creature;
  opponent: Creature;
  onExit: (result: BattleResult) => void;
  /** Day number (1-6) — lets the battle backdrop match the location */
  day?: number;
}

// ── Pokémon-style type colors for the type chips ────────────────────────
const TYPE_COLOR: Record<string, string> = {
  fire: "#f08030",   water: "#6890f0",   electric: "#f8d030", grass: "#78c850",
  ice: "#98d8d8",    flying: "#a890f0",  rock: "#b8a038",     ghost: "#705898",
  psychic: "#f85888",fairy: "#ee99ac",   poison: "#a040a0",   normal: "#a8a878",
  dark: "#705848",   ground: "#e0c068",  bug: "#a8b820",      steel: "#b8b8d0",
  fighting: "#c03028",dragon: "#7038f8",
};

// ── Day-themed arena backgrounds ────────────────────────────────────────
function dayBackground(day?: number): string {
  switch (day) {
    case 1: return "linear-gradient(to bottom, #8cc4e8 0%, #7ec8ff 35%, #e8c878 50%, #d0a860 100%)";
    case 2: return "linear-gradient(to bottom, #6a6a78 0%, #9aa8b8 40%, #58585e 55%, #3a3a3e 100%)";
    case 3: return "linear-gradient(to bottom, #2a2040 0%, #6a3a80 30%, #4a2a5a 52%, #2a1a38 100%)";
    case 4: return "linear-gradient(to bottom, #bce4f4 0%, #70c848 45%, #8a6a38 55%, #5a4028 100%)";
    case 5: return "linear-gradient(to bottom, #ffd4a8 0%, #ffa870 25%, #b8e078 52%, #9a8858 100%)";
    case 6: return "linear-gradient(to bottom, #d0e0f0 0%, #9abccc 35%, #4a7858 55%, #3a5840 100%)";
    default: return "linear-gradient(to bottom, #8cc4e8 0%, #7cc97c 48%, #b0a070 52%, #8c7050 100%)";
  }
}

type Phase =
  | "wipe-in"              // slash transition
  | "intro"                // sprites fly in
  | "player-select"        // main menu (FIGHT/BAG/POKEMON/RUN)
  | "player-moves"         // choose a move
  | "player-bag"           // choose an item
  | "player-attack"        // attack animation + message
  | "opponent-attack"      // opponent's turn
  | "catching"             // pokéball throw + wiggle animation
  | "caught"               // successful catch — ends battle as a win variant
  | "victory"
  | "defeat"
  | "run";

const MAIN_MENU = ["FIGHT", "BAG", "POKéMON", "RUN"] as const;

// Screen-space anchors for the attacker / target sprite centres. Must stay in
// sync with the absolute positioning used in the arena render below.
const SPRITE_POS = {
  player:   { x: "20%", y: "65%" },
  opponent: { x: "80%", y: "30%" },
} as const;

interface AttackFxState {
  key: number;
  mode: FxMode;
  url: string;
  fromX: string; fromY: string;
  toX: string;   toY: string;
  tint: string;
  spin: boolean;
  fallbackType: string;
  target: "player" | "opponent";
}

interface DmgNum {
  key: number;
  x: string; y: string;
  value: number;
  crit: boolean;
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function BattleScene({ player: rawPlayer, opponent: rawOpponent, onExit, day }: Props) {
  // Live PokéAPI merge (falls back to hardcoded if offline)
  const { data: playerApi   } = useCreatureData(rawPlayer.dexId);
  const { data: opponentApi } = useCreatureData(rawOpponent.dexId);
  const player   = mergeApiData(rawPlayer, playerApi);
  const opponent = mergeApiData(rawOpponent, opponentApi);

  // Live HP pools (initialised to max)
  const [playerHp,   setPlayerHp]   = useState(player.maxHp);
  const [opponentHp, setOpponentHp] = useState(opponent.maxHp);

  const [phase, setPhase]     = useState<Phase>("wipe-in");
  const [menuIdx, setMenuIdx] = useState(0);
  const [moveIdx, setMoveIdx] = useState(0);
  const [itemIdx, setItemIdx] = useState(0);
  const [bag,     setBag]     = useState<Bag>(INITIAL_BAG);
  const [dialog,  setDialog]  = useState<string>("");
  // Pokéball throw animation state (null when not catching)
  const [ballThrow, setBallThrow] = useState<{ phase: "fly" | "absorb" | "wiggle" | "burst" | "caught"; wiggles: number } | null>(null);
  // Status effects — cleared on faint / battle end
  const [playerStatus,   setPlayerStatus]   = useState<Status>(null);
  const [opponentStatus, setOpponentStatus] = useState<Status>(null);

  // PP (power points) — max uses per move. Low-power moves get more PP.
  const [pp, setPp] = useState<Record<string, { current: number; max: number }>>({});
  useEffect(() => {
    // Seed per-move PP when the player's moveset resolves (after PokéAPI merge).
    if (!player.moves.length) return;
    setPp((prev) => {
      if (Object.keys(prev).length === player.moves.length) return prev;
      const next: Record<string, { current: number; max: number }> = {};
      for (const m of player.moves) {
        // Scale PP: weaker moves get more uses, bigger nukes get fewer
        const max =
          m.power >= 70 ? 5  :
          m.power >= 40 ? 10 :
          m.power >= 20 ? 15 :
                          20;
        next[m.name] = { current: max, max };
      }
      return next;
    });
  }, [player.moves]);

  const decrementPp = useCallback((moveName: string) => {
    setPp((prev) => {
      const entry = prev[moveName];
      if (!entry) return prev;
      return { ...prev, [moveName]: { ...entry, current: Math.max(0, entry.current - 1) } };
    });
  }, []);

  // Animation controls for sprite shake / flash / full-screen shake
  const playerAnim    = useAnimationControls();
  const opponentAnim  = useAnimationControls();
  const sceneAnim     = useAnimationControls();
  const [crit, setCrit] = useState(false);
  // Legacy per-type SVG fallback — used when the Showdown image 404s
  const [activeVfx, setActiveVfx] = useState<{ type: string; target: "player" | "opponent"; key: number } | null>(null);
  // Showdown move-FX overlay (projectile / beam / impact image pulled from Showdown's /fx/)
  const [attackFx, setAttackFx] = useState<AttackFxState | null>(null);
  // Attacker windup glow — tint flash on the attacker sprite right before launch
  const [windup, setWindup] = useState<{ who: "player" | "opponent"; tint: string; key: number } | null>(null);
  // Floating damage numbers — multiple can overlap if timing allows
  const [damageNumbers, setDamageNumbers] = useState<DmgNum[]>([]);

  // Preload all Showdown FX image URLs so the first hit of each type
  // doesn't show a one-frame pop-in.
  useEffect(() => {
    for (const url of allFxUrls()) {
      const img = new Image();
      img.src = url;
    }
  }, []);

  // Guard against double-firing key events during animations
  const busyRef = useRef(false);

  // ── Battle stats tracked for the end banner ────────────────────────────
  const turnsRef       = useRef(0);
  const damageDealtRef = useRef(0);
  const damageTakenRef = useRef(0);
  const critsRef       = useRef(0);
  const moveCountsRef  = useRef<Record<string, number>>({});

  // Util — write dialog and wait
  const say = useCallback((text: string, ms = 1000): Promise<void> => {
    setDialog(text);
    return new Promise((r) => setTimeout(r, ms));
  }, []);

  // Sprite hit feedback
  const hitAnim = useCallback(async (who: "player" | "opponent") => {
    const ctrl = who === "player" ? playerAnim : opponentAnim;
    await ctrl.start({
      x: [0, -8, 8, -6, 6, 0],
      filter: ["brightness(1)", "brightness(3) hue-rotate(-20deg)", "brightness(1)"],
      transition: { duration: 0.5 },
    });
  }, [playerAnim, opponentAnim]);

  // Intro: slash-wipe, then sprites fly in, then prompt
  useEffect(() => {
    (async () => {
      busyRef.current = true;
      // Wipe duration handled by the overlay component — just wait
      await new Promise((r) => setTimeout(r, 900));
      setPhase("intro");
      // Play the opponent's cry from PokéAPI
      if (opponentApi?.cryUrl) {
        try {
          const a = new Audio(opponentApi.cryUrl);
          a.volume = 0.3;
          a.play().catch(() => {});
        } catch { /* autoplay blocked — ignore */ }
      }
      await say(`A wild ${opponent.name} appeared!`, 1400);
      await say(`Go! ${player.name}!`, 1200);
      busyRef.current = false;
      setPhase("player-select");
      setDialog(`What will ${player.name} do?`);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Spawn a floating damage number that rises + fades. Auto-cleans after 1s.
  const pushDamageNumber = useCallback((x: string, y: string, value: number, crit: boolean) => {
    const key = Date.now() + Math.random();
    setDamageNumbers((list) => [...list, { key, x, y, value, crit }]);
    setTimeout(() => {
      setDamageNumbers((list) => list.filter((d) => d.key !== key));
    }, 1000);
  }, []);

  // 4-phase attack sequence: windup → projectile/beam → impact → aftermath.
  // Returns once the target has visibly been hit — caller applies HP damage.
  const runAttackSequence = useCallback(async (
    attacker: "player" | "opponent",
    target:   "player" | "opponent",
    move: Move,
    damage: number,
    isCrit: boolean,
  ) => {
    const fx = getMoveFx(move.name, move.type);
    const from = SPRITE_POS[attacker];
    const to   = SPRITE_POS[target];

    // 1. Windup — tint halo + lunge on the attacker
    setWindup({ who: attacker, tint: fx.tint, key: Date.now() });
    const attackerCtrl = attacker === "player" ? playerAnim : opponentAnim;
    attackerCtrl.start({
      x: [0, attacker === "player" ? 18 : -18, 0],
      transition: { duration: 0.22 },
    });
    await wait(200);
    setWindup(null);

    // 2. FX travel
    setAttackFx({
      key: Date.now(),
      mode: fx.mode,
      url: fx.url,
      fromX: from.x, fromY: from.y,
      toX: to.x,     toY: to.y,
      tint: fx.tint,
      spin: !!fx.spin,
      fallbackType: move.type,
      target,
    });

    const travelMs =
      fx.mode === "projectile" ? 420 :
      fx.mode === "beam"       ? 260 :
      /* impact */               180;
    await wait(travelMs);

    // 3. Impact — crit flash, camera zoom on super-effective, screen shake, damage number
    if (isCrit) {
      setCrit(true); setTimeout(() => setCrit(false), 400);
      // Super-effective gets a dramatic camera zoom + harder shake
      sceneAnim.start({
        scale: [1, 1.06, 1.03, 1],
        x:     [0, -12, 12, -6, 0],
        transition: { duration: 0.55 },
      });
    } else if (target === "player") {
      sceneAnim.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.45 } });
    }
    hitAnim(target);
    pushDamageNumber(to.x, to.y, damage, isCrit);

    // 4. Aftermath — let the image finish its scale-out, then clear
    await wait(380);
    setAttackFx(null);
  }, [playerAnim, opponentAnim, sceneAnim, hitAnim, pushDamageNumber]);

  // Poison tick — 1/16 of max HP, with floating PSN damage and fade.
  const tickPoisonOnPlayer = useCallback(async (): Promise<"fainted" | "ok"> => {
    if (playerStatus !== "poison") return "ok";
    const dmg = Math.max(1, Math.floor(player.maxHp / 16));
    setPlayerHp((hp) => Math.max(0, hp - dmg));
    pushDamageNumber(SPRITE_POS.player.x, SPRITE_POS.player.y, dmg, false);
    await say(`${player.name} is hurt by poison!`, 900);
    if (Math.max(0, playerHp - dmg) <= 0) {
      await say(`${player.name} fainted!`, 1300);
      setPhase("defeat");
      return "fainted";
    }
    return "ok";
  }, [playerStatus, player, playerHp, pushDamageNumber, say]);

  const tickPoisonOnOpponent = useCallback(async (): Promise<"fainted" | "ok"> => {
    if (opponentStatus !== "poison") return "ok";
    const dmg = Math.max(1, Math.floor(opponent.maxHp / 16));
    setOpponentHp((hp) => Math.max(0, hp - dmg));
    pushDamageNumber(SPRITE_POS.opponent.x, SPRITE_POS.opponent.y, dmg, false);
    await say(`Foe ${opponent.name} is hurt by poison!`, 900);
    if (Math.max(0, opponentHp - dmg) <= 0) {
      await say(`${opponent.name} fainted!`, 1300);
      setPhase("victory");
      return "fainted";
    }
    return "ok";
  }, [opponentStatus, opponent, opponentHp, pushDamageNumber, say]);

  // Opponent counter-attack — shared between move and bag-item paths so
  // using an item still burns the player's turn.
  const runOpponentCounter = useCallback(async (): Promise<"fainted" | "ok"> => {
    setPhase("opponent-attack");

    // Paralysis check on opponent — 25% chance the foe is fully paralyzed
    if (opponentStatus === "paralysis" && Math.random() < 0.25) {
      await say(`Foe ${opponent.name} is paralyzed! It can't move!`, 1100);
      return "ok";
    }

    const oppMove = opponent.moves[Math.floor(Math.random() * opponent.moves.length)];
    await say(`Foe ${opponent.name} used ${oppMove.name}!`, 700);
    const { damage, effectiveness } = computeDamage(opponent, player, oppMove);
    const isCrit = effectiveness.includes("super");
    damageTakenRef.current += damage;
    await runAttackSequence("opponent", "player", oppMove, damage, isCrit);
    setPlayerHp((hp) => Math.max(0, hp - damage));
    if (effectiveness) await say(effectiveness, 800);
    else               await wait(300);

    // Maybe apply status effect on hit
    const inflict = moveStatusEffect(oppMove.name);
    if (inflict && !playerStatus && Math.random() < inflict.odds) {
      setPlayerStatus(inflict.status);
      await say(`${player.name} was ${inflict.label.toLowerCase()}!`, 900);
    }

    const remaining = Math.max(0, playerHp - damage);
    if (remaining <= 0) {
      await say(`${player.name} fainted!`, 1300);
      setPhase("defeat");
      return "fainted";
    }
    return "ok";
  }, [player, opponent, playerHp, playerStatus, opponentStatus, runAttackSequence, say]);

  // ── Use an item from the bag ──────────────────────────────────────────
  const useItem = useCallback(async (itemKey: "potion" | "superPotion" | "pokeball") => {
    if (bag[itemKey] <= 0) { await say("You have none of those!", 800); return; }
    busyRef.current = true;

    if (itemKey === "potion" || itemKey === "superPotion") {
      const healAmount = itemKey === "potion" ? 50 : 120;
      const itemName   = itemKey === "potion" ? "Potion" : "Super Potion";
      setBag((b) => ({ ...b, [itemKey]: b[itemKey] - 1 }));
      setPhase("player-attack");
      await say(`You used a ${itemName}!`, 800);
      // Green heal pulse on player
      playerAnim.start({
        filter: ["brightness(1)", "brightness(1.6) hue-rotate(60deg)", "brightness(1)"],
        transition: { duration: 0.6 },
      });
      const before = playerHp;
      const after  = Math.min(player.maxHp, before + healAmount);
      setPlayerHp(after);
      pushDamageNumber(SPRITE_POS.player.x, SPRITE_POS.player.y, -(after - before), false);
      await say(`${player.name} recovered ${after - before} HP!`, 1000);

      // Using an item burns the player's turn — opponent still gets to hit
      const result = await runOpponentCounter();
      if (result === "fainted") { busyRef.current = false; return; }
      setPhase("player-select");
      setDialog(`What will ${player.name} do?`);
      busyRef.current = false;
      return;
    }

    if (itemKey === "pokeball") {
      setBag((b) => ({ ...b, pokeball: b.pokeball - 1 }));
      await attemptCatch();
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bag, playerHp, player, runOpponentCounter, say, pushDamageNumber]);

  // ── Catch attempt — Pokéball throw + wiggle + success/fail ────────────
  const attemptCatch = useCallback(async () => {
    busyRef.current = true;
    setPhase("catching");
    await say(`You threw a Poké Ball!`, 700);

    // Catch chance scales with how low the opponent's HP is
    const hpRatio  = opponentHp / opponent.maxHp;        // 1.0 full, 0.0 fainted
    const catchRate = Math.max(0.08, 0.6 * (1 - hpRatio) + 0.05);
    const willCatch = Math.random() < catchRate;
    // Always wiggle 1-3 times regardless; success decided up front
    const wiggleCount = willCatch ? 3 : 1 + Math.floor(Math.random() * 2);

    // Phase: fly to target
    setBallThrow({ phase: "fly", wiggles: 0 });
    await wait(600);
    // Absorb
    setBallThrow({ phase: "absorb", wiggles: 0 });
    await wait(500);
    // Wiggle on the ground
    for (let i = 1; i <= wiggleCount; i++) {
      setBallThrow({ phase: "wiggle", wiggles: i });
      await wait(650);
    }

    if (willCatch) {
      setBallThrow({ phase: "caught", wiggles: wiggleCount });
      await wait(300);
      await say(`Gotcha! ${opponent.name} was caught!`, 1400);
      setPhase("caught");
      busyRef.current = false;
      return;
    }

    // Burst out
    setBallThrow({ phase: "burst", wiggles: wiggleCount });
    await wait(400);
    setBallThrow(null);
    await say(`Oh no! ${opponent.name} broke free!`, 1000);

    // Opponent gets a free turn since the ball missed
    const result = await runOpponentCounter();
    if (result === "fainted") { busyRef.current = false; return; }
    setPhase("player-select");
    setDialog(`What will ${player.name} do?`);
    busyRef.current = false;
  }, [opponent, opponentHp, player.name, runOpponentCounter, say]);

  // ── Turn resolver: player attacks, then opponent ─────────────────────
  const resolvePlayerMove = useCallback(async (moveArg: Move) => {
    // If the player has no usable moves, fall back to Struggle — Pokémon
    // canon: every creature can always attack, but paying with their own HP.
    const hasUsable = player.moves.some((m) => (pp[m.name]?.current ?? 0) > 0);
    let move = moveArg;
    if (!hasUsable) {
      move = { name: "STRUGGLE", type: "normal", power: 10, flavor: "Recoil damages the user." };
    } else {
      decrementPp(move.name);
    }

    busyRef.current = true;
    turnsRef.current += 1;
    moveCountsRef.current[move.name] = (moveCountsRef.current[move.name] ?? 0) + 1;
    setPhase("player-attack");

    // Paralysis check — 25% chance the player is fully paralyzed this turn
    if (playerStatus === "paralysis" && Math.random() < 0.25) {
      await say(`${player.name} is paralyzed! It can't move!`, 1100);
      // Opponent still attacks
      const result = await runOpponentCounter();
      if (result === "fainted") { busyRef.current = false; return; }
      // End-of-turn poison tick on player
      if (await tickPoisonOnPlayer() === "fainted") { busyRef.current = false; return; }
      setPhase("player-select");
      setDialog(`What will ${player.name} do?`);
      busyRef.current = false;
      return;
    }

    await say(`${player.name} used ${move.name}!`, 700);

    // Player attacks opponent
    const { damage, effectiveness } = computeDamage(player, opponent, move);
    const isCrit = effectiveness.includes("super");
    if (isCrit) critsRef.current += 1;
    damageDealtRef.current += damage;
    await runAttackSequence("player", "opponent", move, damage, isCrit);
    setOpponentHp((hp) => Math.max(0, hp - damage));

    if (effectiveness) await say(effectiveness, 800);
    else               await wait(300);

    const remainingOpp = Math.max(0, opponentHp - damage);
    if (remainingOpp <= 0) {
      await say(`${opponent.name} fainted!`, 1300);
      setPhase("victory");
      busyRef.current = false;
      return;
    }

    // Maybe apply status effect on hit
    const inflict = moveStatusEffect(move.name);
    if (inflict && !opponentStatus && Math.random() < inflict.odds) {
      setOpponentStatus(inflict.status);
      await say(`Foe ${opponent.name} was ${inflict.label.toLowerCase()}!`, 900);
    }

    // Opponent counter-attacks
    const result = await runOpponentCounter();
    if (result === "fainted") { busyRef.current = false; return; }

    // End-of-turn poison tick — player first, then opponent
    if (await tickPoisonOnPlayer() === "fainted")   { busyRef.current = false; return; }
    if (await tickPoisonOnOpponent() === "fainted") { busyRef.current = false; return; }

    setPhase("player-select");
    setDialog(`What will ${player.name} do?`);
    busyRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, opponent, opponentHp, playerStatus, opponentStatus, runAttackSequence, runOpponentCounter, say]);

  // ── Keyboard input ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (busyRef.current) return;

      const prevent = () => e.preventDefault();

      // Any key (including keyboard A) to exit end-screen
      if (phase === "victory" || phase === "defeat" || phase === "run" || phase === "caught") {
        if (
          e.key === "Enter" || e.key === "z" || e.key === "Z" ||
          e.key === "a" || e.key === "A" ||
          e.key === "Escape" || e.key === " "
        ) {
          // A caught wild counts as a victory to the rest of the game so the
          // "defeated wilds" set records it the same way.
          onExit(phase === "caught" ? "victory" : phase as BattleResult); prevent();
        }
        return;
      }

      if (phase === "player-select") {
        switch (e.key) {
          case "ArrowUp": case "w": case "W":
            setMenuIdx((i) => (i >= 2 ? i - 2 : i)); prevent(); break;
          case "ArrowDown": case "s": case "S":
            setMenuIdx((i) => (i < 2 ? i + 2 : i)); prevent(); break;
          case "ArrowLeft": case "a": case "A":
            setMenuIdx((i) => (i % 2 === 1 ? i - 1 : i)); prevent(); break;
          case "ArrowRight": case "d": case "D":
            setMenuIdx((i) => (i % 2 === 0 ? i + 1 : i)); prevent(); break;
          case "Enter": case "z": case "Z": case " ": {
            const sel = MAIN_MENU[menuIdx];
            if (sel === "FIGHT") { setPhase("player-moves"); setMoveIdx(0); setDialog(""); }
            else if (sel === "RUN") {
              (async () => {
                busyRef.current = true;
                await say("Got away safely!", 1000);
                setPhase("run");
                busyRef.current = false;
              })();
            }
            else if (sel === "BAG") { setPhase("player-bag"); setItemIdx(0); setDialog(""); }
            else { say(`${player.name} is already out!`, 1000); }
            prevent();
            break;
          }
        }
      } else if (phase === "player-bag") {
        switch (e.key) {
          case "ArrowUp": case "w": case "W":
            setItemIdx((i) => (i >= 2 ? i - 2 : i)); prevent(); break;
          case "ArrowDown": case "s": case "S":
            setItemIdx((i) => (i < 2 ? i + 2 : i)); prevent(); break;
          case "ArrowLeft": case "a": case "A":
            setItemIdx((i) => (i % 2 === 1 ? i - 1 : i)); prevent(); break;
          case "ArrowRight": case "d": case "D":
            setItemIdx((i) => (i % 2 === 0 ? i + 1 : i)); prevent(); break;
          case "Enter": case "z": case "Z": case " ": {
            const sel = BAG_ITEMS[itemIdx];
            if (sel.key === "cancel") {
              setPhase("player-select");
              setDialog(`What will ${player.name} do?`);
            } else {
              useItem(sel.key as "potion" | "superPotion" | "pokeball");
            }
            prevent();
            break;
          }
          case "Escape": case "b": case "B":
            setPhase("player-select"); setDialog(`What will ${player.name} do?`); prevent(); break;
        }
      } else if (phase === "player-moves") {
        switch (e.key) {
          case "ArrowUp": case "w": case "W":
            setMoveIdx((i) => (i >= 2 ? i - 2 : i)); prevent(); break;
          case "ArrowDown": case "s": case "S":
            setMoveIdx((i) => (i < 2 ? i + 2 : i)); prevent(); break;
          case "ArrowLeft": case "a": case "A":
            setMoveIdx((i) => (i % 2 === 1 ? i - 1 : i)); prevent(); break;
          case "ArrowRight": case "d": case "D":
            setMoveIdx((i) => (i % 2 === 0 ? i + 1 : i)); prevent(); break;
          case "Enter": case "z": case "Z": case " ": {
            const chosen = player.moves[moveIdx];
            const chosenPp = pp[chosen.name]?.current ?? 1;
            const anyUsable = player.moves.some((m) => (pp[m.name]?.current ?? 0) > 0);
            // Block selection of out-of-PP moves UNLESS the player has no usable moves
            if (chosenPp === 0 && anyUsable) {
              say("No PP left for that move!", 800);
            } else {
              resolvePlayerMove(chosen);
            }
            prevent();
            break;
          }
          case "Escape": case "b": case "B":
            setPhase("player-select"); setDialog(`What will ${player.name} do?`); prevent(); break;
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, menuIdx, moveIdx, itemIdx, player, pp, resolvePlayerMove, onExit, say, useItem]);

  // ── Render ────────────────────────────────────────────────────────────
  const opponentFainted = opponentHp <= 0;
  const playerFainted   = playerHp   <= 0;

  return (
    <motion.div
      animate={sceneAnim}
      className="absolute inset-0 flex flex-col"
      style={{
        background: dayBackground(day),
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      {/* Intro slash-wipe */}
      {phase === "wipe-in" && <SlashWipe />}

      {/* Attacker windup — tint halo flash */}
      {windup && <AttackerWindup who={windup.who} tint={windup.tint} />}

      {/* Showdown move FX — projectile / beam / impact pulled from their /fx/ CDN */}
      {attackFx && (
        <ShowdownFx
          key={attackFx.key}
          state={attackFx}
          onError={() => {
            // Image 404'd — fall back to our own SVG VFX burst
            setActiveVfx({ type: attackFx.fallbackType, target: attackFx.target, key: attackFx.key });
            setAttackFx(null);
            setTimeout(() => setActiveVfx(null), 500);
          }}
        />
      )}

      {/* Legacy per-type VFX — only renders if the Showdown image failed to load */}
      {activeVfx && (
        <MoveVfx
          key={activeVfx.key}
          type={activeVfx.type}
          target={activeVfx.target}
        />
      )}

      {/* Floating damage numbers */}
      {damageNumbers.map((d) => (
        <DamageNumber key={d.key} x={d.x} y={d.y} value={d.value} crit={d.crit} />
      ))}

      {/* Pokéball throw + catch animation */}
      {ballThrow && <PokeballThrow state={ballThrow} />}

      {/* Crit flash — white burst for super-effective hits */}
      {crit && (
        <motion.div
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 pointer-events-none z-[200]"
          style={{ background: "#ffffff", mixBlendMode: "screen" }}
        />
      )}

      {/* Victory / defeat overlay */}
      {(phase === "victory" || phase === "defeat" || phase === "run" || phase === "caught") && (
        <EndBanner
          phase={phase}
          opponentName={opponent.name}
          playerName={player.name}
          opponentLevel={opponent.level}
          stats={{
            turns: turnsRef.current,
            damageDealt: damageDealtRef.current,
            damageTaken: damageTakenRef.current,
            crits: critsRef.current,
            topMove: Object.entries(moveCountsRef.current)
              .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null,
          }}
        />
      )}

      {/* ── BATTLE ARENA ──────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden">
        {/* Opponent platform + sprite — box sized to match the platform footprint */}
        <div
          className="absolute"
          style={{
            right: "14%", top: "14%",
            width: 200, height: 170,
            pointerEvents: "none",
          }}
        >
          <BattlePlatform />
          <EntryDust side="right" />
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative flex items-end justify-center"
            style={{ zIndex: 2, width: "100%", height: "100%", paddingBottom: 28 }}
          >
            <motion.div animate={opponentAnim} className="flex items-end justify-center">
              <motion.div
                animate={opponentFainted ? undefined : { scale: [1, 1.03, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-end justify-center"
              >
                <motion.div
                  animate={opponentFainted ? { y: 120, opacity: 0, rotate: 25 } : { y: 0, opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}
                >
                  {/* Small base size — sprites have internal scale 1.4-1.5 so visual lands ~160-170 */}
                  {opponent.renderSprite(110, { animated: true })}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Opponent info box */}
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0,    opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          style={{ position: "absolute", left: "4%", top: "5%", minWidth: 260, ...dialogBoxStyle() }}
          className="p-3"
        >
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-[14px]" style={{ color: POKE.text }}>{opponent.name}</span>
            <span className="text-[11px]" style={{ color: POKE.text }}>Lv{opponent.level}</span>
            {opponentStatus && <StatusChip status={opponentStatus} />}
            <div className="flex gap-1 ml-auto">
              {opponent.types.map((t) => <TypeChip key={t} type={t} />)}
            </div>
          </div>
          <HpBar hp={opponentHp} max={opponent.maxHp} showNumber />
        </motion.div>

        {/* Player platform + sprite — back view. Box sized to wide platform footprint */}
        <div
          className="absolute"
          style={{
            left: "12%", bottom: "8%",
            width: 260, height: 210,
            pointerEvents: "none",
          }}
        >
          <BattlePlatform wide />
          <EntryDust side="left" />
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
            className="relative flex items-end justify-center"
            style={{ zIndex: 2, width: "100%", height: "100%", paddingBottom: 32 }}
          >
            <motion.div animate={playerAnim} className="flex items-end justify-center">
              <motion.div
                animate={playerFainted ? undefined : { scale: [1, 1.03, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-end justify-center"
              >
                <motion.div
                  animate={playerFainted ? { y: 120, opacity: 0, rotate: -25 } : { y: 0, opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}
                >
                  {/* Small base size — internal scale 1.4-1.5 pushes visual to ~195-210 */}
                  {player.renderSprite(140, { back: true, animated: true })}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Player info box */}
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0,   opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.35 }}
          style={{ position: "absolute", right: "4%", bottom: "4%", minWidth: 300, ...dialogBoxStyle() }}
          className="p-3"
        >
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-[14px]" style={{ color: POKE.text }}>{player.name}</span>
            <span className="text-[11px]" style={{ color: POKE.text }}>Lv{player.level}</span>
            {playerStatus && <StatusChip status={playerStatus} />}
            <div className="flex gap-1 ml-auto">
              {player.types.map((t) => <TypeChip key={t} type={t} />)}
            </div>
          </div>
          <HpBar hp={playerHp} max={player.maxHp} showNumber={true} />
        </motion.div>
      </div>

      {/* ── DIALOG + MENU ────────────────────────────────────────── */}
      <div className="flex gap-2 p-3" style={{ height: 180 }}>
        <div style={{ ...dialogBoxStyle(), flex: 1 }} className="p-4 relative">
          <div className="text-[13px]" style={{ color: POKE.text, lineHeight: 1.6 }}>
            {dialog}
          </div>
          {phase === "player-select" && (
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="absolute bottom-2 right-3 text-[14px]"
              style={{ color: POKE.textBlue }}
            >
              ▼
            </motion.div>
          )}
        </div>

        {phase === "player-select" ? (
          <div style={{ ...dialogBoxStyle(), width: 340 }} className="p-4">
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              {MAIN_MENU.map((item, i) => {
                const isSel = i === menuIdx;
                return (
                  <button key={item} onClick={() => setMenuIdx(i)}
                    className="flex items-center gap-2 text-left"
                    style={{ color: POKE.text, fontSize: "14px" }}>
                    <span style={{ color: isSel ? POKE.text : "transparent", width: 14 }}>▶</span>
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : phase === "player-moves" ? (
          <div style={{ ...dialogBoxStyle(), width: 480 }} className="p-4">
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {player.moves.map((m, i) => {
                const isSel = i === moveIdx;
                const entry = pp[m.name];
                const current = entry?.current ?? 0;
                const max     = entry?.max ?? 0;
                const outOfPp = !!entry && current === 0;
                return (
                  <button
                    key={m.name}
                    onClick={() => setMoveIdx(i)}
                    className="flex items-center gap-2 text-left"
                    style={{
                      color: outOfPp ? POKE.textShadow : POKE.text,
                      fontSize: "12px",
                      opacity: outOfPp ? 0.5 : 1,
                    }}
                  >
                    <span style={{ color: isSel ? POKE.text : "transparent", width: 12 }}>▶</span>
                    <span style={{ flex: 1 }}>{m.name}</span>
                    {entry && (
                      <span className="text-[9px]" style={{ color: POKE.textShadow }}>
                        {current}/{max}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <MoveDetail
              move={player.moves[moveIdx]}
              defenderTypes={opponent.types}
              attackerTypes={player.types}
              pp={pp[player.moves[moveIdx].name]}
            />
          </div>
        ) : phase === "player-bag" ? (
          <div style={{ ...dialogBoxStyle(), width: 460 }} className="p-4">
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              {BAG_ITEMS.map((item, i) => {
                const isSel = i === itemIdx;
                const count = item.key === "cancel" ? null : bag[item.key as keyof Bag];
                const empty = typeof count === "number" && count === 0;
                return (
                  <button
                    key={item.key}
                    onClick={() => setItemIdx(i)}
                    className="flex items-center gap-2 text-left"
                    style={{
                      color: empty ? POKE.textShadow : POKE.text,
                      fontSize: "11px",
                      opacity: empty ? 0.5 : 1,
                    }}
                  >
                    <span style={{ color: isSel ? POKE.text : "transparent", width: 12 }}>▶</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {count !== null && (
                      <span style={{ color: POKE.textShadow }}>×{count}</span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 pt-2 border-t text-[9px]" style={{ borderColor: "#00000022", color: POKE.textShadow }}>
              » {BAG_ITEMS[itemIdx].desc}
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

// ── Showdown FX overlay (projectile / beam / impact image from PS /fx/) ─
function ShowdownFx({ state, onError }: { state: AttackFxState; onError: () => void }) {
  if (state.mode === "beam")       return <BeamFx state={state} onError={onError} />;
  if (state.mode === "projectile") return <ProjectileFx state={state} onError={onError} />;
  return <ImpactFx state={state} onError={onError} />;
}

function ProjectileFx({ state, onError }: { state: AttackFxState; onError: () => void }) {
  return (
    <>
      <motion.img
        src={state.url}
        onError={onError}
        alt=""
        initial={{ left: state.fromX, top: state.fromY, opacity: 0, scale: 0.5, rotate: 0 }}
        animate={{
          left: state.toX,
          top:  state.toY,
          opacity: [0, 1, 1, 1, 0.8],
          scale: [0.5, 1, 1.1, 1.3, 1.6],
          rotate: state.spin ? 540 : 0,
        }}
        transition={{ duration: 0.65, ease: [0.3, 0.2, 0.7, 1] }}
        className="absolute pointer-events-none z-[250]"
        style={{
          width: 72, height: 72,
          translate: "-50% -50%",
          filter: `drop-shadow(0 0 14px ${state.tint})`,
          imageRendering: "pixelated",
        }}
      />
      {/* Trailing particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ left: state.fromX, top: state.fromY, opacity: 0.8, scale: 1 }}
          animate={{ left: state.toX, top: state.toY, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.55, delay: i * 0.05, ease: "easeIn" }}
          className="absolute pointer-events-none z-[249] rounded-full"
          style={{
            width: 10, height: 10,
            translate: "-50% -50%",
            background: state.tint,
            filter: "blur(2px)",
          }}
        />
      ))}
    </>
  );
}

function BeamFx({ state, onError }: { state: AttackFxState; onError: () => void }) {
  return (
    <>
      {/* Sustained pulse at target */}
      <motion.img
        src={state.url}
        onError={onError}
        alt=""
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 1, 0.85, 1, 0.9, 0],
          scale:   [0.8, 1.8, 2.1, 1.9, 2.3, 1.6],
        }}
        transition={{ duration: 0.85 }}
        className="absolute pointer-events-none z-[250]"
        style={{
          left: state.toX, top: state.toY,
          width: 104, height: 104,
          translate: "-50% -50%",
          filter: `drop-shadow(0 0 22px ${state.tint})`,
          imageRendering: "pixelated",
        }}
      />
      {/* Directional streaks from attacker to target */}
      {[...Array(5)].map((_, i) => (
        <motion.img
          key={i}
          src={state.url}
          alt=""
          initial={{ left: state.fromX, top: state.fromY, opacity: 0, scale: 0.4 }}
          animate={{ left: state.toX, top: state.toY, opacity: [0, 1, 0], scale: [0.4, 0.8, 1.1] }}
          transition={{ duration: 0.38, delay: i * 0.07, ease: "easeIn" }}
          className="absolute pointer-events-none z-[250]"
          style={{
            width: 44, height: 44,
            translate: "-50% -50%",
            filter: `drop-shadow(0 0 8px ${state.tint})`,
            imageRendering: "pixelated",
          }}
        />
      ))}
    </>
  );
}

function ImpactFx({ state, onError }: { state: AttackFxState; onError: () => void }) {
  return (
    <>
      <motion.img
        src={state.url}
        onError={onError}
        alt=""
        initial={{ opacity: 1, scale: 0.3, rotate: 0 }}
        animate={{ opacity: [1, 1, 0], scale: [0.3, 2.0, 2.6], rotate: state.spin ? 360 : 0 }}
        transition={{ duration: 0.6 }}
        className="absolute pointer-events-none z-[250]"
        style={{
          left: state.toX, top: state.toY,
          width: 104, height: 104,
          translate: "-50% -50%",
          filter: `drop-shadow(0 0 18px ${state.tint})`,
          imageRendering: "pixelated",
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.25, 0] }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 pointer-events-none z-[249]"
        style={{ background: state.tint, mixBlendMode: "screen" }}
      />
    </>
  );
}

// ── Attacker windup — tint halo flash behind the attacker ───────────────
function AttackerWindup({ who, tint }: { who: "player" | "opponent"; tint: string }) {
  const pos = SPRITE_POS[who];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: [0, 0.7, 0], scale: [0.6, 1.2, 1.4] }}
      transition={{ duration: 0.25 }}
      className="absolute pointer-events-none z-[240] rounded-full"
      style={{
        left: pos.x, top: pos.y,
        width: 200, height: 200,
        translate: "-50% -50%",
        background: `radial-gradient(circle, ${tint} 0%, ${tint}66 40%, transparent 75%)`,
        filter: "blur(6px)",
      }}
    />
  );
}

// ── Floating damage number ───────────────────────────────────────────────
function DamageNumber({ x, y, value, crit }: { x: string; y: string; value: number; crit: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: crit ? 0.5 : 0.7 }}
      animate={{ opacity: [0, 1, 1, 0], y: -56, scale: crit ? 1.4 : 1 }}
      transition={{ duration: 0.95, ease: "easeOut" }}
      className="absolute pointer-events-none z-[260]"
      style={{
        left: x, top: y,
        translate: "-50% -50%",
        color: crit ? "#ffee44" : "#ffffff",
        fontFamily: "'Press Start 2P', monospace",
        fontSize: crit ? 22 : 18,
        textShadow: "2px 2px 0 #000, 0 0 8px rgba(0,0,0,0.85)",
        whiteSpace: "nowrap",
      }}
    >
      -{value}{crit ? "!" : ""}
    </motion.div>
  );
}

// ── Move-type VFX overlay (LEGACY fallback) ──────────────────────────────
// Short (~400ms) visual effect played on top of the battle scene when a move
// connects. One variant per type; falls back to a generic white impact.
function MoveVfx({ type, target }: { type: string; target: "player" | "opponent" }) {
  // Target's approximate screen position (matches BattleScene layout)
  const targetCx = target === "opponent" ? "80%" : "20%";
  const targetCy = target === "opponent" ? "30%" : "65%";

  switch (type) {
    case "fire":
      return <FireVfx cx={targetCx} cy={targetCy} />;
    case "electric":
      return <ElectricVfx />;
    case "water":
      return <WaterVfx cx={targetCx} cy={targetCy} />;
    case "grass":
      return <GrassVfx cx={targetCx} cy={targetCy} />;
    case "ghost":
      return <GhostVfx cx={targetCx} cy={targetCy} />;
    case "psychic":
      return <PsychicVfx cx={targetCx} cy={targetCy} />;
    case "rock":
      return <RockVfx cx={targetCx} cy={targetCy} />;
    case "flying":
      return <FlyingVfx cx={targetCx} cy={targetCy} />;
    case "ice":
      return <IceVfx cx={targetCx} cy={targetCy} />;
    case "poison":
      return <PoisonVfx cx={targetCx} cy={targetCy} />;
    default:
      return <ImpactStar cx={targetCx} cy={targetCy} />;
  }
}

function FireVfx({ cx, cy }: { cx: string; cy: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-[250]">
      {[...Array(14)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 120,
            y: -40 - Math.random() * 60,
            opacity: 0,
            scale: 0.4,
          }}
          transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.015 }}
          className="absolute rounded-full"
          style={{
            left: cx, top: cy,
            width: 14 + Math.random() * 10,
            height: 14 + Math.random() * 10,
            background: i % 2 === 0
              ? "radial-gradient(circle, #ffe066 0%, #ff8020 60%, transparent 100%)"
              : "radial-gradient(circle, #ffffff 0%, #ffaa00 60%, transparent 100%)",
          }}
        />
      ))}
    </div>
  );
}

function ElectricVfx() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[250]">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scaleY: 0.1 }}
          animate={{ opacity: [0, 1, 0.4, 1, 0], scaleY: 1 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="absolute left-0 right-0 h-[3px]"
          style={{
            top: `${35 + i * 12}%`,
            background: "#ffee44",
            boxShadow: "0 0 14px #ffee44, 0 0 30px #ffcc00",
          }}
        />
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.35, 0] }}
        transition={{ duration: 0.35 }}
        className="absolute inset-0"
        style={{ background: "#ffeeaa", mixBlendMode: "screen" }}
      />
    </div>
  );
}

function WaterVfx({ cx, cy }: { cx: string; cy: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-[250]">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 140,
            y: (Math.random() - 0.3) * 120,
            opacity: 0,
          }}
          transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.02 }}
          className="absolute rounded-full"
          style={{
            left: cx, top: cy,
            width: 10,
            height: 10,
            background: "radial-gradient(circle, #a0e0ff 0%, #4090f0 70%, transparent 100%)",
          }}
        />
      ))}
    </div>
  );
}

function GrassVfx({ cx, cy }: { cx: string; cy: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-[250]">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: -80, y: 0, opacity: 1, rotate: 30 }}
          animate={{ x: 60, y: 20, opacity: 0, rotate: 70 }}
          transition={{ duration: 0.35, delay: i * 0.04 }}
          className="absolute"
          style={{
            left: cx, top: cy,
            width: 56,
            height: 3,
            background: "linear-gradient(90deg, transparent, #60c060, #a0e080, transparent)",
            marginTop: i * 8 - 20,
          }}
        />
      ))}
    </div>
  );
}

function GhostVfx({ cx, cy }: { cx: string; cy: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-[250]">
      <motion.div
        initial={{ scale: 0.2, opacity: 1 }}
        animate={{ scale: 2.2, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute rounded-full"
        style={{
          left: cx, top: cy,
          width: 80, height: 80,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, #d060ff 0%, #6020a0 50%, transparent 100%)",
          filter: "blur(2px)",
        }}
      />
      <motion.div
        initial={{ scale: 1, opacity: 0.8 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute rounded-full border-2"
        style={{
          left: cx, top: cy,
          width: 80, height: 80,
          transform: "translate(-50%, -50%)",
          borderColor: "#d060ff",
        }}
      />
    </div>
  );
}

function PsychicVfx({ cx, cy }: { cx: string; cy: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-[250]">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.3, opacity: 0.9 }}
          animate={{ scale: 2 + i * 0.4, opacity: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="absolute rounded-full border-2"
          style={{
            left: cx, top: cy,
            width: 80, height: 80,
            transform: "translate(-50%, -50%)",
            borderColor: "#ff4ca0",
            boxShadow: "0 0 20px #ff4ca0",
          }}
        />
      ))}
    </div>
  );
}

function RockVfx({ cx, cy }: { cx: string; cy: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-[250]">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 140,
            y: (Math.random() - 0.5) * 140,
            rotate: 360,
            opacity: 0,
          }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="absolute"
          style={{
            left: cx, top: cy,
            width: 14, height: 12,
            background: "#8a6040",
            border: "2px solid #3a2010",
            borderRadius: "3px",
          }}
        />
      ))}
    </div>
  );
}

function FlyingVfx({ cx, cy }: { cx: string; cy: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-[250]">
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 200, opacity: [0, 1, 0] }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="absolute"
        style={{
          left: cx, top: cy,
          width: 120, height: 4,
          background: "linear-gradient(90deg, transparent, #ffffff, transparent)",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 12px #ffffff",
        }}
      />
    </div>
  );
}

function IceVfx({ cx, cy }: { cx: string; cy: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-[250]">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: -60, y: -60, opacity: 1, rotate: 45 }}
          animate={{ x: 0, y: 0, opacity: 0 }}
          transition={{ duration: 0.4, delay: i * 0.03 }}
          className="absolute"
          style={{
            left: cx, top: cy,
            width: 4, height: 18,
            background: "linear-gradient(180deg, #ffffff, #a0e8ff, transparent)",
            marginLeft: (i - 5) * 12,
          }}
        />
      ))}
    </div>
  );
}

function PoisonVfx({ cx, cy }: { cx: string; cy: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-[250]">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.4, opacity: 0.8, y: 0 }}
          animate={{ scale: 1.6, opacity: 0, y: -30 }}
          transition={{ duration: 0.5, delay: i * 0.04 }}
          className="absolute rounded-full"
          style={{
            left: cx, top: cy,
            width: 16, height: 16,
            marginLeft: (i - 4) * 14,
            background: "radial-gradient(circle, #b040d0 0%, #6020a0 70%, transparent 100%)",
          }}
        />
      ))}
    </div>
  );
}

function ImpactStar({ cx, cy }: { cx: string; cy: string }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 1.5, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute pointer-events-none z-[250] text-white"
      style={{
        left: cx, top: cy,
        transform: "translate(-50%, -50%)",
        fontSize: 80,
        lineHeight: 1,
        textShadow: "0 0 20px #ffffff",
      }}
    >
      ✦
    </motion.div>
  );
}

// ── Pokéball throw + catch animation ────────────────────────────────────
function PokeballThrow({
  state,
}: { state: { phase: "fly" | "absorb" | "wiggle" | "burst" | "caught"; wiggles: number } }) {
  // Target = opponent's sprite position
  const targetX = SPRITE_POS.opponent.x;
  const targetY = SPRITE_POS.opponent.y;

  return (
    <div className="absolute inset-0 pointer-events-none z-[260]">
      {/* The ball itself */}
      <motion.div
        key={`ball-${state.phase}-${state.wiggles}`}
        className="absolute"
        style={{
          width: 44, height: 44,
          left: state.phase === "fly" ? "20%" : targetX,
          top:  state.phase === "fly" ? "65%" : targetY,
          translate: "-50% -50%",
        }}
        initial={
          state.phase === "fly"
            ? { scale: 0.4, rotate: 0 }
            : state.phase === "burst"
              ? { scale: 1, rotate: 0 }
              : { scale: 1, rotate: 0 }
        }
        animate={
          state.phase === "fly"
            ? { left: targetX, top: targetY, scale: [0.4, 0.9, 1], rotate: 720 }
          : state.phase === "absorb"
            ? { scale: [1.1, 0.7], y: [0, 40] }
          : state.phase === "wiggle"
            ? { rotate: state.wiggles % 2 === 0 ? [0, -18, 18, 0] : [0, 18, -18, 0] }
          : state.phase === "caught"
            ? { scale: [1, 1.05, 1] }
            : { scale: [1, 1.8], opacity: [1, 0] } /* burst */
        }
        transition={{
          duration:
            state.phase === "fly"    ? 0.55 :
            state.phase === "absorb" ? 0.45 :
            state.phase === "wiggle" ? 0.55 :
            state.phase === "burst"  ? 0.35 :
            0.25,
          ease: state.phase === "fly" ? [0.3, 0.6, 0.4, 1] : "easeInOut",
        }}
      >
        <PokeballSvg />
      </motion.div>

      {/* Absorb beam — red light that pulls the opponent into the ball */}
      {state.phase === "absorb" && (
        <motion.div
          initial={{ opacity: 1, scaleY: 1 }}
          animate={{ opacity: 0, scaleY: 0.1 }}
          transition={{ duration: 0.45 }}
          className="absolute"
          style={{
            left: targetX, top: targetY,
            width: 90, height: 120,
            translate: "-50% -50%",
            background: "radial-gradient(circle, rgba(255,60,60,0.75) 0%, transparent 70%)",
            filter: "blur(6px)",
          }}
        />
      )}

      {/* Caught sparkle burst */}
      {state.phase === "caught" && (
        <>
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                scale: 1.2,
                x: Math.cos((i / 10) * Math.PI * 2) * 60,
                y: Math.sin((i / 10) * Math.PI * 2) * 60,
              }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="absolute rounded-full"
              style={{
                left: targetX, top: targetY,
                width: 10, height: 10,
                translate: "-50% -50%",
                background: "#ffe066",
                boxShadow: "0 0 10px #ffe066",
              }}
            />
          ))}
        </>
      )}

      {/* Burst-out: red particles when the ball fails */}
      {state.phase === "burst" && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                scale: 0.2,
                x: Math.cos((i / 8) * Math.PI * 2) * 70,
                y: Math.sin((i / 8) * Math.PI * 2) * 70,
              }}
              transition={{ duration: 0.35 }}
              className="absolute rounded-full"
              style={{
                left: targetX, top: targetY,
                width: 8, height: 8,
                translate: "-50% -50%",
                background: "#ff4a4a",
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

function PokeballSvg() {
  return (
    <svg width="44" height="44" viewBox="0 0 16 16" shapeRendering="crispEdges">
      <rect x="3" y="1" width="10" height="1" fill="#e84040" />
      <rect x="2" y="2" width="12" height="1" fill="#e84040" />
      <rect x="1" y="3" width="14" height="4" fill="#e84040" />
      <rect x="1" y="7" width="14" height="2" fill="#1a1a2a" />
      <rect x="1" y="9" width="14" height="4" fill="#f4f4f0" />
      <rect x="2" y="13" width="12" height="1" fill="#f4f4f0" />
      <rect x="3" y="14" width="10" height="1" fill="#f4f4f0" />
      <rect x="6" y="7" width="4" height="2" fill="#f4f4f0" />
      <rect x="7" y="7" width="2" height="2" fill="#1a1a2a" />
      <rect x="3" y="0" width="10" height="1" fill="#1a1a2a" />
      <rect x="1" y="1" width="2" height="1" fill="#1a1a2a" />
      <rect x="13" y="1" width="2" height="1" fill="#1a1a2a" />
      <rect x="0" y="2" width="1" height="1" fill="#1a1a2a" />
      <rect x="15" y="2" width="1" height="1" fill="#1a1a2a" />
      <rect x="0" y="3" width="1" height="10" fill="#1a1a2a" />
      <rect x="15" y="3" width="1" height="10" fill="#1a1a2a" />
      <rect x="0" y="13" width="1" height="1" fill="#1a1a2a" />
      <rect x="15" y="13" width="1" height="1" fill="#1a1a2a" />
      <rect x="1" y="14" width="2" height="1" fill="#1a1a2a" />
      <rect x="13" y="14" width="2" height="1" fill="#1a1a2a" />
      <rect x="3" y="15" width="10" height="1" fill="#1a1a2a" />
    </svg>
  );
}

// ── Slash-wipe intro transition ──────────────────────────────────────────
function SlashWipe() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[300] overflow-hidden">
      <motion.div
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="absolute top-0 bottom-0 w-[60%]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, #ffffff 40%, #ffffff 60%, transparent 100%)",
          transform: "skewX(-25deg)",
          left: 0,
          filter: "drop-shadow(0 0 20px rgba(255,255,255,0.8))",
        }}
      />
      <motion.div
        initial={{ x: "120%" }}
        animate={{ x: "-120%" }}
        transition={{ duration: 0.7, ease: "easeInOut", delay: 0.1 }}
        className="absolute top-0 bottom-0 w-[60%]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, #ffee66 40%, #ffee66 60%, transparent 100%)",
          transform: "skewX(25deg)",
          right: 0,
          filter: "drop-shadow(0 0 20px rgba(255,238,102,0.8))",
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.9 }}
        className="absolute inset-0 bg-black"
      />
    </div>
  );
}

// ── End banner (Victory / Defeat / Ran) ──────────────────────────────────
interface EndStats {
  turns: number;
  damageDealt: number;
  damageTaken: number;
  crits: number;
  topMove: string | null;
}

function EndBanner({
  phase, opponentName, playerName, opponentLevel, stats,
}: {
  phase: Phase;
  opponentName: string;
  playerName: string;
  opponentLevel: number;
  stats: EndStats;
}) {
  // Cosmetic EXP: scales with opponent's level (all L99 → ~990 EXP)
  const exp = opponentLevel * 10 + (phase === "caught" ? 200 : 0);
  const victorious = phase === "victory" || phase === "caught";
  const text =
    phase === "caught"  ? `GOTCHA!` :
    phase === "victory" ? `YOU WIN!` :
    phase === "defeat"  ? `${playerName} BLACKED OUT…` :
    "GOT AWAY SAFELY!";
  const sub =
    phase === "caught"  ? `${opponentName} was caught!` :
    phase === "victory" ? `You defeated ${opponentName}!` :
    phase === "defeat"  ? "Better luck next time." :
    "";
  const color =
    phase === "caught"  ? "#40d8ff" :
    phase === "victory" ? "#ffe066" :
    phase === "defeat"  ? "#e84040" :
    "#8ce0c0";

  const flawless = phase === "victory" && stats.damageTaken === 0;
  const swift    = phase === "victory" && stats.turns <= 3;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.4 }}
      className="absolute inset-0 z-[500] flex flex-col items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)" }}
    >
      {/* Sparkle particles on a swift victory */}
      {swift && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.4, 0],
                y: -60 - Math.random() * 60,
                x: (Math.random() - 0.5) * 200,
              }}
              transition={{ duration: 1.8, delay: 1.8 + i * 0.06, repeat: Infinity, repeatDelay: 0.8 }}
              className="absolute left-1/2 top-1/2"
              style={{
                width: 6, height: 6,
                borderRadius: "50%",
                background: "#ffe066",
                boxShadow: "0 0 8px #ffe066",
              }}
            />
          ))}
        </div>
      )}
      <motion.div
        initial={{ scale: 0.5, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", delay: 1.6 }}
        className="px-8 py-6 text-center"
        style={{
          background: POKE.dialogBg,
          border: "4px solid #000",
          boxShadow: `inset 0 0 0 3px ${color}, 6px 6px 0 rgba(0,0,0,0.5)`,
          minWidth: 320,
        }}
      >
        <div className="text-[26px]" style={{ color, textShadow: "2px 2px 0 #000", fontFamily: "'Press Start 2P', monospace" }}>
          {text}
        </div>
        {sub && (
          <div className="mt-2 text-[10px]" style={{ color: POKE.text, fontFamily: "'Press Start 2P', monospace" }}>
            {sub}
          </div>
        )}

        {/* Badges for notable feats */}
        {(flawless || swift) && (
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            {flawless && <FeatBadge color="#40d0ff" label="FLAWLESS" />}
            {swift    && <FeatBadge color="#ffd93a" label={`${stats.turns}-TURN WIN`} />}
          </div>
        )}

        {/* Stat summary — only meaningful when a battle actually ran */}
        {phase !== "run" && stats.turns > 0 && (
          <div
            className="mt-4 mx-auto px-3 py-2 text-[8px] text-left"
            style={{
              color: POKE.text,
              fontFamily: "'Press Start 2P', monospace",
              background: "rgba(0,0,0,0.05)",
              border: "2px solid #00000033",
              letterSpacing: "1px",
              lineHeight: 1.9,
              minWidth: 260,
            }}
          >
            <StatRow label="TURNS"        value={String(stats.turns)} />
            <StatRow label="DMG DEALT"    value={String(stats.damageDealt)} />
            <StatRow label="DMG TAKEN"    value={String(stats.damageTaken)} />
            <StatRow label="SUPER HITS"   value={String(stats.crits)} />
            {stats.topMove && (
              <StatRow label="TOP MOVE" value={stats.topMove} />
            )}
          </div>
        )}

        <div className="mt-4 text-[8px]" style={{ color: POKE.textShadow, fontFamily: "'Press Start 2P', monospace" }}>
          PRESS ENTER / Z / A
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span style={{ color: POKE.textShadow }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function FeatBadge({ color, label }: { color: string; label: string }) {
  return (
    <span
      className="text-[8px] px-2 py-0.5"
      style={{
        background: color,
        color: "#1a1a2a",
        letterSpacing: "1.5px",
        border: "1.5px solid #000",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.4)",
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      {label}
    </span>
  );
}

// ── Small components ─────────────────────────────────────────────────────

function BattlePlatform({ wide = false }: { wide?: boolean }) {
  return (
    <div
      className="absolute"
      style={{
        width: wide ? 260 : 200,
        height: wide ? 50 : 40,
        borderRadius: "50%",
        background: "radial-gradient(ellipse at center, #a0d080 0%, #60905a 60%, #3a6030 100%)",
        border: "3px solid #2d4a22",
        boxShadow: "0 6px 0 rgba(0,0,0,0.25)",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: 0,
        zIndex: 1,
      }}
    />
  );
}

function HpBar({ hp, max, showNumber }: { hp: number; max: number; showNumber: boolean }) {
  const pct = (hp / max) * 100;
  const color = pct > 50 ? "#40d840" : pct > 20 ? "#ffe040" : "#e84040";
  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-[9px]" style={{ color: "#e0a028" }}>HP</span>
      <div
        className="flex-1 h-[10px] relative overflow-hidden"
        style={{ background: "#303040", borderRadius: "2px", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6)" }}
      >
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full"
          style={{ background: `linear-gradient(to bottom, ${color}, ${color}dd)` }}
        />
      </div>
      {showNumber && (
        <span className="text-[10px] w-[72px] text-right" style={{ color: POKE.text }}>
          {hp}/{max}
        </span>
      )}
    </div>
  );
}

function MoveDetail({
  move, defenderTypes, attackerTypes, pp,
}: {
  move: Move;
  defenderTypes: CreatureType[];
  attackerTypes: CreatureType[];
  pp?: { current: number; max: number };
}) {
  const eff = effectiveness(move.type, defenderTypes);
  const effLabel =
    eff.multiplier === 0 ? "NO EFFECT"       :
    eff.multiplier >= 2  ? "SUPER EFFECTIVE" :
    eff.multiplier >= 1.5? "EFFECTIVE"       :
    eff.multiplier <= 0.5? "NOT EFFECTIVE"   :
                           "NEUTRAL";
  const effColor =
    eff.multiplier === 0 ? "#888"    :
    eff.multiplier > 1   ? "#40c040" :
    eff.multiplier < 1   ? "#e8a040" :
                           POKE.text;
  const stab = attackerTypes.includes(move.type);

  return (
    <div className="mt-3 pt-2 border-t text-[10px]" style={{ borderColor: "#00000022", color: POKE.text }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TypeChip type={move.type} />
          {stab && (
            <span className="text-[8px] px-1" style={{ background: "#ffd93a", color: "#1a1a2a", letterSpacing: 1 }}>STAB</span>
          )}
        </div>
        <div className="flex gap-3 items-center">
          <span>PWR {move.power}</span>
          {pp && (
            <span
              style={{
                color: pp.current === 0 ? "#e84040" : pp.current <= pp.max * 0.25 ? "#e8a040" : POKE.text,
              }}
            >
              PP {pp.current}/{pp.max}
            </span>
          )}
        </div>
      </div>
      <div className="text-[9px] mt-1" style={{ color: effColor, letterSpacing: 1 }}>
        » {effLabel}
      </div>
      <div className="text-[9px] mt-1" style={{ color: POKE.textShadow }}>
        {move.flavor}
      </div>
    </div>
  );
}

// ── Type chip — colored type badge next to name / move ──────────────────
function TypeChip({ type }: { type: string }) {
  const color = TYPE_COLOR[type.toLowerCase()] ?? "#888";
  return (
    <span
      className="text-[8px] px-1.5"
      style={{
        background: color,
        color: "#ffffff",
        letterSpacing: 1,
        textShadow: "1px 1px 0 rgba(0,0,0,0.5)",
        border: "1px solid rgba(0,0,0,0.4)",
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      {type.toUpperCase()}
    </span>
  );
}

// ── Status chip (PSN / PAR) next to the creature's name ─────────────────
function StatusChip({ status }: { status: Status }) {
  if (!status) return null;
  const meta =
    status === "poison"    ? { label: "PSN", color: "#a040a0" } :
    status === "paralysis" ? { label: "PAR", color: "#ffd93a" } :
                             { label: "",    color: "#888" };
  return (
    <span
      className="text-[8px] px-1.5"
      style={{
        background: meta.color,
        color: status === "paralysis" ? "#1a1a2a" : "#ffffff",
        letterSpacing: 1,
        textShadow: status === "paralysis" ? "none" : "1px 1px 0 rgba(0,0,0,0.5)",
        border: "1px solid rgba(0,0,0,0.4)",
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      {meta.label}
    </span>
  );
}

// ── Entry dust burst — small particles kick up as sprites slide in ──────
function EntryDust({ side }: { side: "left" | "right" }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: "50%", bottom: -10,
        transform: "translateX(-50%)",
        width: 220, height: 30,
      }}
    >
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
          animate={{
            x: (side === "left" ? -1 : 1) * (30 + Math.random() * 80),
            y: -(10 + Math.random() * 20),
            opacity: 0,
            scale: 0.2,
          }}
          transition={{ duration: 0.6, delay: 0.2 + i * 0.03, ease: "easeOut" }}
          className="absolute rounded-full"
          style={{
            left: "50%", bottom: 4,
            width: 8, height: 6,
            background: "rgba(200, 180, 140, 0.85)",
          }}
        />
      ))}
    </div>
  );
}

function dialogBoxStyle(): CSSProperties {
  return {
    background: POKE.dialogBg,
    border: `3px solid ${POKE.dialogBorderOuter}`,
    borderRadius: "4px",
    boxShadow: `inset 0 0 0 2px ${POKE.dialogBorderInner}, 3px 3px 0 rgba(0,0,0,0.4)`,
  };
}
