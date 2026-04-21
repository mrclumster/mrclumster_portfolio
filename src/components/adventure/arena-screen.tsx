"use client";

import { useEffect, useState, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CREATURES } from "./creatures";
import { POKE } from "./adventure-screens";

interface Props {
  excludeId: string | null; // user's own starter
  onPick: (opponentId: string) => void;
  onBack: () => void;
}

export function ArenaScreen({ excludeId, onPick, onBack }: Props) {
  const pool = CREATURES.filter((c) => c.id !== excludeId);
  const [idx, setIdx] = useState(0);
  const [confirming, setConfirm] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const cols = 3;
      if (confirming) {
        if (e.key === "Enter" || e.key === "z" || e.key === "Z") {
          onPick(pool[idx].id); e.preventDefault();
        } else if (e.key === "Escape" || e.key === "b" || e.key === "B") {
          setConfirm(false); e.preventDefault();
        }
        return;
      }
      switch (e.key) {
        case "ArrowRight": case "d": case "D":
          setIdx((i) => (i + 1) % pool.length); e.preventDefault(); break;
        case "ArrowLeft": case "a": case "A":
          setIdx((i) => (i - 1 + pool.length) % pool.length); e.preventDefault(); break;
        case "ArrowDown": case "s": case "S":
          setIdx((i) => Math.min(i + cols, pool.length - 1)); e.preventDefault(); break;
        case "ArrowUp": case "w": case "W":
          setIdx((i) => Math.max(i - cols, 0)); e.preventDefault(); break;
        case "Enter": case "z": case "Z": case " ":
          setConfirm(true); e.preventDefault(); break;
        case "Escape":
          onBack(); e.preventDefault(); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, pool, onPick, onBack, confirming]);

  const current = pool[idx];

  return (
    <div
      className="absolute inset-0 flex flex-col p-3"
      style={{
        background: "linear-gradient(135deg, #c82020 0%, #80101a 50%, #300810 100%)",
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      {/* Header */}
      <div style={dialogBoxStyle()} className="mb-2 text-center py-3">
        <div className="text-[16px]" style={{ color: POKE.red, textShadow: "2px 2px 0 #000" }}>
          ★ BATTLE ARENA ★
        </div>
        <div className="text-[9px] mt-2" style={{ color: POKE.text }}>
          Choose an opponent to challenge
        </div>
      </div>

      {/* Opponent grid */}
      <div style={dialogBoxStyle()} className="flex-1 p-3">
        <div className="grid grid-cols-3 gap-3 h-full">
          {pool.map((c, i) => {
            const isSel = i === idx;
            return (
              <button
                key={c.id}
                onMouseEnter={() => setIdx(i)}
                onClick={() => setConfirm(true)}
                className="flex flex-col items-center justify-center p-2 border-2 transition-all"
                style={{
                  transform: isSel ? "scale(1.05)" : "scale(1)",
                  borderColor: isSel ? "#000" : "transparent",
                  background:  isSel ? "#fff" : "transparent",
                }}
              >
                <div style={{ height: 90, display: "flex", alignItems: "center" }}>
                  {c.renderSprite(80)}
                </div>
                <div className="text-[10px] mt-1" style={{ color: POKE.text }}>{c.name}</div>
                <div className="text-[7px]" style={{ color: POKE.textBlue }}>Lv.{c.level}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail bar */}
      <div style={dialogBoxStyle()} className="mt-2 p-3">
        <div className="flex items-center gap-3">
          <div style={{ width: 60, height: 60 }}>{current.renderSprite(60)}</div>
          <div className="flex-1">
            <div className="text-[11px]" style={{ color: POKE.text }}>
              {current.name}{" "}
              <span style={{ color: POKE.textBlue }}>Lv.{current.level}</span>{" "}
              <span style={{ color: POKE.textShadow }}>HP {current.maxHp}</span>
            </div>
            <div className="text-[8px] mt-1" style={{ color: POKE.textShadow }}>
              {current.description}
            </div>
            <div className="flex gap-1 mt-1">
              {current.types.map((t) => (
                <span key={t} className="text-[6px] px-1 py-0.5" style={{ background: typeColor(t), color: "#fff" }}>
                  {t.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="text-[7px] mt-2 text-right" style={{ color: POKE.textShadow }}>
          ↑↓←→ BROWSE · A FIGHT · B BACK
        </div>
      </div>

      {/* Confirm overlay */}
      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.7)" }}
          >
            <div style={dialogBoxStyle()} className="p-6 text-center">
              <div style={{ height: 110, display: "flex", justifyContent: "center", alignItems: "center" }}>
                {current.renderSprite(100)}
              </div>
              <div className="text-[12px] mt-3" style={{ color: POKE.text }}>
                Challenge <span style={{ color: POKE.red }}>{current.name}</span>?
              </div>
              <div className="text-[8px] mt-4" style={{ color: POKE.textShadow }}>
                A YES · B CANCEL
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function typeColor(t: string) {
  const map: Record<string, string> = {
    normal: "#a8a878", fire: "#f08030", water: "#6890f0", electric: "#f8d030",
    grass: "#78c850", ice: "#98d8d8", flying: "#a890f0", rock: "#b8a038",
    ghost: "#705898", psychic: "#f85888", fairy: "#ee99ac", poison: "#a040a0",
  };
  return map[t] ?? "#888";
}

function dialogBoxStyle(): CSSProperties {
  return {
    background: POKE.dialogBg,
    border: `3px solid ${POKE.dialogBorderOuter}`,
    borderRadius: "4px",
    boxShadow: `inset 0 0 0 2px ${POKE.dialogBorderInner}, 3px 3px 0 rgba(0,0,0,0.4)`,
  };
}
