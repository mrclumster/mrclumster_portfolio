"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CREATURES } from "./creatures";
import { POKE } from "./adventure-screens";

interface Props {
  onPick: (creatureId: string) => void;
}

export function StarterSelect({ onPick }: Props) {
  const [index, setIndex]       = useState(0);
  const [confirming, setConfirm] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (confirming) {
        if (e.key === "Enter" || e.key === "z" || e.key === "Z") {
          onPick(CREATURES[index].id);
        } else if (e.key === "Escape" || e.key === "b" || e.key === "B") {
          setConfirm(false);
        }
        return;
      }
      switch (e.key) {
        case "ArrowRight": case "d": case "D":
          setIndex((i) => (i + 1) % CREATURES.length); break;
        case "ArrowLeft": case "a": case "A":
          setIndex((i) => (i - 1 + CREATURES.length) % CREATURES.length); break;
        case "ArrowDown": case "s": case "S":
          setIndex((i) => (i + 4) % CREATURES.length); break;
        case "ArrowUp": case "w": case "W":
          setIndex((i) => (i - 4 + CREATURES.length) % CREATURES.length); break;
        case "Enter": case "z": case "Z": case " ":
          setConfirm(true); e.preventDefault(); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, confirming, onPick]);

  const current = CREATURES[index];

  return (
    <div className="absolute inset-0 flex flex-col p-4" style={{
      background: "linear-gradient(to bottom, #5a78b8 0%, #9cc2e8 60%, #7cc97c 60%, #3c8c3c 100%)",
      fontFamily: "'Press Start 2P', monospace",
    }}>
      {/* Header */}
      <div style={dialogBoxStyle()} className="mb-3 text-center py-3 px-4">
        <div className="text-[14px]" style={{ color: POKE.textBlue }}>PROFESSOR OAK-IZ</div>
        <div className="text-[10px] mt-2" style={{ color: POKE.text }}>
          Choose your partner for the Manila adventure!
        </div>
      </div>

      {/* Creature grid — 4 on top, 3 on bottom */}
      <div style={dialogBoxStyle()} className="flex-1 p-4">
        <div className="grid grid-cols-4 gap-2 h-full">
          {CREATURES.map((c, i) => {
            const isSel = i === index;
            return (
              <button
                key={c.id}
                onClick={() => { setIndex(i); setConfirm(true); }}
                onMouseEnter={() => setIndex(i)}
                className={`flex flex-col items-center justify-between p-2 border-2 transition-all ${
                  isSel ? "border-black bg-white" : "border-transparent bg-black/5"
                }`}
                style={{ transform: isSel ? "scale(1.04)" : "scale(1)" }}
              >
                <div style={{ height: 72, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {c.renderSprite(64)}
                </div>
                <div className="text-[8px] mt-1" style={{ color: POKE.text }}>
                  {c.name}
                </div>
                <div className="flex gap-0.5 mt-0.5">
                  {c.types.map((t) => (
                    <span key={t} className="text-[5px] px-1 py-0.5"
                      style={{ background: typeColor(t), color: "#fff", borderRadius: 2 }}>
                      {t.toUpperCase()}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      <div style={dialogBoxStyle()} className="mt-3 p-3">
        <div className="flex items-start gap-3">
          <div style={{ width: 80, height: 80, flexShrink: 0 }}>
            {current.renderSprite(80)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[12px]" style={{ color: POKE.text }}>{current.name}</span>
              <span className="text-[9px]" style={{ color: POKE.textBlue }}>Lv.{current.level}</span>
              <span className="text-[9px]" style={{ color: POKE.textShadow }}>HP {current.maxHp}</span>
            </div>
            <div className="text-[8px] leading-relaxed mb-2" style={{ color: POKE.text }}>
              {current.description}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {current.moves.map((m) => (
                <div key={m.name} className="text-[7px] px-1.5 py-0.5 border"
                  style={{ color: POKE.text, borderColor: "#00000022", background: `${typeColor(m.type)}20` }}>
                  <span style={{ color: typeColor(m.type) }}>●</span> {m.name} <span style={{ color: POKE.textShadow }}>({m.power})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-2 text-[7px] text-right" style={{ color: POKE.textShadow }}>
          ◀ ▶ BROWSE · A CHOOSE
        </div>
      </div>

      {/* Confirm overlay */}
      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 p-8"
          >
            <div style={dialogBoxStyle()} className="p-6 max-w-md text-center">
              <div style={{ height: 100, display: "flex", justifyContent: "center", alignItems: "center" }}>
                {current.renderSprite(96)}
              </div>
              <div className="text-[11px] mt-3" style={{ color: POKE.text }}>
                Will you choose <span style={{ color: POKE.red }}>{current.name}</span>?
              </div>
              <div className="text-[8px] mt-4" style={{ color: POKE.textShadow }}>
                A YES · B BACK
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
    normal:   "#a8a878",
    fire:     "#f08030",
    water:    "#6890f0",
    electric: "#f8d030",
    grass:    "#78c850",
    ice:      "#98d8d8",
    flying:   "#a890f0",
    rock:     "#b8a038",
    ghost:    "#705898",
    fairy:    "#ee99ac",
  };
  return map[t] ?? "#888";
}

function dialogBoxStyle(): React.CSSProperties {
  return {
    background: POKE.dialogBg,
    border: `3px solid ${POKE.dialogBorderOuter}`,
    borderRadius: "4px",
    boxShadow: `inset 0 0 0 2px ${POKE.dialogBorderInner}, 3px 3px 0 rgba(0,0,0,0.3)`,
  };
}
