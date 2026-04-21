"use client";

import { useCallback, useEffect, useRef, useState, CSSProperties } from "react";
import { motion, useAnimationControls } from "framer-motion";
import type { Creature, Move } from "./creatures";
import { computeDamage } from "./creatures";
import { POKE } from "./adventure-screens";

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

export function BattleScene({ player, opponent, onExit }: Props) {
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
      await say(`A wild ${opponent.name} appeared!`, 1400);
      await say(`Go! ${player.name}!`, 1200);
      busyRef.current = false;
      setPhase("player-select");
      setDialog(`What will ${player.name} do?`);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Turn resolver: player attacks, then opponent ─────────────────────
  const resolvePlayerMove = useCallback(async (move: Move) => {
    busyRef.current = true;
    setPhase("player-attack");
    await say(`${player.name} used ${move.name}!`, 800);

    const { damage, effectiveness } = computeDamage(player, opponent, move);
    const isCrit = effectiveness.includes("super");
    if (isCrit) { setCrit(true); setTimeout(() => setCrit(false), 400); }
    await hitAnim("opponent");
    setOpponentHp((hp) => Math.max(0, hp - damage));

    if (effectiveness) await say(effectiveness, 900);
    else               await new Promise((r) => setTimeout(r, 400));

    // Did the opponent faint?
    const remainingOpp = Math.max(0, opponentHp - damage);
    if (remainingOpp <= 0) {
      await say(`${opponent.name} fainted!`, 1300);
      setPhase("victory");
      busyRef.current = false;
      return;
    }

    // Opponent's counter-attack
    setPhase("opponent-attack");
    const oppMove = opponent.moves[Math.floor(Math.random() * opponent.moves.length)];
    await say(`Foe ${opponent.name} used ${oppMove.name}!`, 800);
    const { damage: dmg2, effectiveness: eff2 } = computeDamage(opponent, player, oppMove);
    // Screen-shake when YOU get hit
    sceneAnim.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.45 } });
    await hitAnim("player");
    setPlayerHp((hp) => Math.max(0, hp - dmg2));

    if (eff2) await say(eff2, 900);
    else      await new Promise((r) => setTimeout(r, 400));

    const remainingPlayer = Math.max(0, playerHp - dmg2);
    if (remainingPlayer <= 0) {
      await say(`${player.name} fainted!`, 1300);
      setPhase("defeat");
      busyRef.current = false;
      return;
    }

    // Back to player's turn
    setPhase("player-select");
    setDialog(`What will ${player.name} do?`);
    busyRef.current = false;
  }, [player, opponent, opponentHp, playerHp, hitAnim, say]);

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
