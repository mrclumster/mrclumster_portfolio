"use client";

import { useCallback, useEffect, useRef, useState, CSSProperties } from "react";
import { motion, useAnimationControls } from "framer-motion";
import type { Creature, Move, CreatureType } from "./creatures";
import { computeDamage } from "./creatures";
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

type BattleResult = "victory" | "defeat" | "run";

interface Props {
  player: Creature;
  opponent: Creature;
  onExit: (result: BattleResult) => void;
}

type Phase =
  | "wipe-in"              // slash transition
  | "intro"                // sprites fly in
  | "player-select"        // main menu (FIGHT/BAG/POKEMON/RUN)
  | "player-moves"         // choose a move
  | "player-attack"        // attack animation + message
  | "opponent-attack"      // opponent's turn
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

export function BattleScene({ player: rawPlayer, opponent: rawOpponent, onExit }: Props) {
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
  const [dialog,  setDialog]  = useState<string>("");

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

    // 3. Impact — crit flash, screen shake (when player is hit), sprite shake, damage number
    if (isCrit) { setCrit(true); setTimeout(() => setCrit(false), 400); }
    if (target === "player") {
      sceneAnim.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.45 } });
    }
    hitAnim(target);
    pushDamageNumber(to.x, to.y, damage, isCrit);

    // 4. Aftermath — let the image finish its scale-out, then clear
    await wait(380);
    setAttackFx(null);
  }, [playerAnim, opponentAnim, sceneAnim, hitAnim, pushDamageNumber]);

  // ── Turn resolver: player attacks, then opponent ─────────────────────
  const resolvePlayerMove = useCallback(async (move: Move) => {
    busyRef.current = true;
    setPhase("player-attack");
    await say(`${player.name} used ${move.name}!`, 700);

    // Player attacks opponent
    const { damage, effectiveness } = computeDamage(player, opponent, move);
    const isCrit = effectiveness.includes("super");
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

    // Opponent counter-attacks
    setPhase("opponent-attack");
    const oppMove = opponent.moves[Math.floor(Math.random() * opponent.moves.length)];
    await say(`Foe ${opponent.name} used ${oppMove.name}!`, 700);
    const { damage: dmg2, effectiveness: eff2 } = computeDamage(opponent, player, oppMove);
    const isCrit2 = eff2.includes("super");
    await runAttackSequence("opponent", "player", oppMove, dmg2, isCrit2);
    setPlayerHp((hp) => Math.max(0, hp - dmg2));

    if (eff2) await say(eff2, 800);
    else      await wait(300);

    const remainingPlayer = Math.max(0, playerHp - dmg2);
    if (remainingPlayer <= 0) {
      await say(`${player.name} fainted!`, 1300);
      setPhase("defeat");
      busyRef.current = false;
      return;
    }

    setPhase("player-select");
    setDialog(`What will ${player.name} do?`);
    busyRef.current = false;
  }, [player, opponent, opponentHp, playerHp, runAttackSequence, say]);

  // ── Keyboard input ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (busyRef.current) return;

      const prevent = () => e.preventDefault();

      // Any key (including keyboard A) to exit end-screen
      if (phase === "victory" || phase === "defeat" || phase === "run") {
        if (
          e.key === "Enter" || e.key === "z" || e.key === "Z" ||
          e.key === "a" || e.key === "A" ||
          e.key === "Escape" || e.key === " "
        ) {
          onExit(phase as BattleResult); prevent();
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
            else if (sel === "BAG") { say("Your bag is empty!", 1000); }
            else { say(`${player.name} is already out!`, 1000); }
            prevent();
            break;
          }
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
          case "Enter": case "z": case "Z": case " ":
            resolvePlayerMove(player.moves[moveIdx]); prevent(); break;
          case "Escape": case "b": case "B":
            setPhase("player-select"); setDialog(`What will ${player.name} do?`); prevent(); break;
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, menuIdx, moveIdx, player, resolvePlayerMove, onExit, say]);

  // ── Render ────────────────────────────────────────────────────────────
  const opponentFainted = opponentHp <= 0;
  const playerFainted   = playerHp   <= 0;

  return (
    <motion.div
      animate={sceneAnim}
      className="absolute inset-0 flex flex-col"
      style={{
        background: "linear-gradient(to bottom, #8cc4e8 0%, #7cc97c 48%, #b0a070 52%, #8c7050 100%)",
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
      {(phase === "victory" || phase === "defeat" || phase === "run") && (
        <EndBanner phase={phase} opponentName={opponent.name} playerName={player.name} />
      )}

      {/* ── BATTLE ARENA ──────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden">
        {/* Opponent platform + sprite */}
        <div className="absolute" style={{ right: "8%", top: "16%" }}>
          <BattlePlatform />
          {/* Entry slide-in */}
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
            style={{ zIndex: 2, marginTop: -110 }}
          >
            {/* Hit-shake layer driven by ref */}
            <motion.div animate={opponentAnim}>
              {/* Faint animation */}
              <motion.div
                animate={opponentFainted ? { y: 120, opacity: 0, rotate: 25 } : { y: 0, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.6 }}
              >
                {opponent.renderSprite(220, { animated: true })}
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
          <div className="flex items-baseline gap-3">
            <span className="text-[14px]" style={{ color: POKE.text }}>{opponent.name}</span>
            <span className="text-[11px]" style={{ color: POKE.text }}>Lv{opponent.level}</span>
          </div>
          <HpBar hp={opponentHp} max={opponent.maxHp} showNumber={false} />
        </motion.div>

        {/* Player platform + sprite — mirrored for "back view" feel */}
        <div className="absolute" style={{ left: "6%", bottom: "4%" }}>
          <BattlePlatform wide />
          {/* Entry slide-in — back sprite faces away naturally, no mirror needed */}
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
            className="relative"
            style={{ zIndex: 2, marginTop: -170 }}
          >
            {/* Hit-shake layer driven by ref */}
            <motion.div animate={playerAnim}>
              {/* Faint animation */}
              <motion.div
                animate={playerFainted ? { y: 120, opacity: 0, rotate: -25 } : { y: 0, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.6 }}
              >
                {player.renderSprite(260, { back: true, animated: true })}
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
          <div className="flex items-baseline gap-3">
            <span className="text-[14px]" style={{ color: POKE.text }}>{player.name}</span>
            <span className="text-[11px]" style={{ color: POKE.text }}>Lv{player.level}</span>
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
                return (
                  <button key={m.name} onClick={() => setMoveIdx(i)}
                    className="flex items-center gap-2 text-left"
                    style={{ color: POKE.text, fontSize: "12px" }}>
                    <span style={{ color: isSel ? POKE.text : "transparent", width: 12 }}>▶</span>
                    <span>{m.name}</span>
                  </button>
                );
              })}
            </div>
            <MoveDetail move={player.moves[moveIdx]} />
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
function EndBanner({
  phase, opponentName, playerName,
}: { phase: Phase; opponentName: string; playerName: string }) {
  const text =
    phase === "victory" ? `YOU WIN!` :
    phase === "defeat"  ? `${playerName} BLACKED OUT…` :
    "GOT AWAY SAFELY!";
  const sub =
    phase === "victory" ? `You defeated ${opponentName}!` :
    phase === "defeat"  ? "Better luck next time." :
    "";
  const color =
    phase === "victory" ? "#ffe066" :
    phase === "defeat"  ? "#e84040" :
    "#8ce0c0";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.4 }}
      className="absolute inset-0 z-[500] flex flex-col items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)" }}
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", delay: 1.6 }}
        className="px-8 py-6 text-center"
        style={{
          background: POKE.dialogBg,
          border: "4px solid #000",
          boxShadow: `inset 0 0 0 3px ${color}, 6px 6px 0 rgba(0,0,0,0.5)`,
        }}
      >
        <div className="text-[26px]" style={{ color, textShadow: "2px 2px 0 #000", fontFamily: "'Press Start 2P', monospace" }}>
          {text}
        </div>
        {sub && (
          <div className="mt-3 text-[10px]" style={{ color: POKE.text, fontFamily: "'Press Start 2P', monospace" }}>
            {sub}
          </div>
        )}
        <div className="mt-5 text-[8px]" style={{ color: POKE.textShadow, fontFamily: "'Press Start 2P', monospace" }}>
          PRESS ENTER / Z / A
        </div>
      </motion.div>
    </motion.div>
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

function MoveDetail({ move }: { move: Move }) {
  return (
    <div className="mt-3 pt-2 border-t text-[10px]" style={{ borderColor: "#00000022", color: POKE.text }}>
      <div className="flex justify-between">
        <span>TYPE/{move.type.toUpperCase()}</span>
        <span>PWR {move.power}</span>
      </div>
      <div className="text-[9px] mt-1" style={{ color: POKE.textShadow }}>
        {move.flavor}
      </div>
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
