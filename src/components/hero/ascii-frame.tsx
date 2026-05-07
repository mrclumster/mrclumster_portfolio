"use client";

import { useState } from "react";
import { PhotoFrame } from "@/components/hero/photo-frame";
import { AsciiBit, type BitPosition } from "@/components/hero/ascii-bit";

interface BitDef {
  id: string;
  position: BitPosition;
  ariaLabel: string;
  defaultHue: number;
  glyph?: string;
  eyePair?: boolean;
  className?: string;
}

const HUE_STEP = 30;

const EYE_PAIRS: BitDef[] = [
  { id: "eye-1", position: { top: 0, left: 0 }, ariaLabel: "Eye pair 1, click to recolor", defaultHue: 0, eyePair: true },
  { id: "eye-2", position: { top: 0, left: 56 }, ariaLabel: "Eye pair 2, click to recolor", defaultHue: 60, eyePair: true },
  { id: "eye-3", position: { top: 0, left: 112 }, ariaLabel: "Eye pair 3, click to recolor", defaultHue: 120, eyePair: true },
  { id: "eye-4", position: { top: 0, left: 168 }, ariaLabel: "Eye pair 4, click to recolor", defaultHue: 200, eyePair: true },
  { id: "eye-5", position: { top: 0, left: 224 }, ariaLabel: "Eye pair 5, click to recolor", defaultHue: 280, eyePair: true },
];

const FRAME_BITS: BitDef[] = [
  { id: "tl-label", glyph: "// 01", position: { top: 28, left: 4 }, ariaLabel: "Cluster 01 label", defaultHue: 0 },
  { id: "tl-face", glyph: "(´ω`)", position: { top: 44, left: 4 }, ariaLabel: "Face: cute", defaultHue: 350 },
  { id: "tr-label", glyph: "// 02", position: { top: 28, right: 4 }, ariaLabel: "Cluster 02 label", defaultHue: 220 },
  { id: "tr-face", glyph: "ʕ•ᴥ•ʔ", position: { top: 44, right: 4 }, ariaLabel: "Face: bear", defaultHue: 220 },
  { id: "lm-1", glyph: "{*}", position: { top: 140, left: 0 }, ariaLabel: "Symbol asterisk", defaultHue: 140 },
  { id: "lm-2", glyph: "~~~", position: { top: 156, left: 0 }, ariaLabel: "Symbol waves", defaultHue: 0 },
  { id: "lm-3", glyph: "[+]", position: { top: 172, left: 0 }, ariaLabel: "Symbol plus", defaultHue: 280 },
  { id: "rm-1", glyph: "[!]", position: { top: 140, right: 0 }, ariaLabel: "Symbol bang", defaultHue: 0 },
  { id: "rm-2", glyph: "░▒▓", position: { top: 156, right: 0 }, ariaLabel: "Symbol shading", defaultHue: 220 },
  { id: "rm-3", glyph: "▮▮▮", position: { top: 172, right: 0 }, ariaLabel: "Symbol blocks", defaultHue: 60 },
  { id: "bl-face", glyph: "(>‿<)", position: { bottom: 28, left: 4 }, ariaLabel: "Face: smiling", defaultHue: 200 },
  { id: "br-face", glyph: "(◕‿◕)", position: { bottom: 28, right: 4 }, ariaLabel: "Face: happy", defaultHue: 280 },
  { id: "footer", glyph: "└─ aziz_v1.0 — online ─┘", position: { bottom: 4, left: "50%", transform: "translateX(-50%)" }, ariaLabel: "Status footer", defaultHue: 0 },
];

const ALL_BITS: BitDef[] = [...EYE_PAIRS, ...FRAME_BITS];

function buildDefaultHues(): Record<string, number> {
  return Object.fromEntries(ALL_BITS.map((b) => [b.id, b.defaultHue]));
}

interface AsciiFrameProps {
  imageSrc: string;
}

export function AsciiFrame({ imageSrc }: AsciiFrameProps) {
  const [hues, setHues] = useState<Record<string, number>>(buildDefaultHues);

  const cycleHue = (id: string) => {
    setHues((prev) => ({ ...prev, [id]: (prev[id] + HUE_STEP) % 360 }));
  };

  const shuffleAll = () => {
    setHues(Object.fromEntries(ALL_BITS.map((b) => [b.id, Math.floor(Math.random() * 360)])));
  };

  return (
    <div className="relative w-full" style={{ height: 400 }}>
      <div
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 200,
          height: 260,
        }}
      >
        <PhotoFrame imageSrc={imageSrc} />
      </div>

      <button
        type="button"
        onClick={shuffleAll}
        className="absolute font-mono text-[12px] transition-colors duration-150 hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] focus-visible:bg-[color:var(--ink)] focus-visible:text-[color:var(--paper)] focus-visible:outline-none cursor-pointer"
        style={{ top: 4, right: 4, color: "var(--ink)", background: "transparent", border: "none", padding: "2px 4px" }}
        aria-label="Shuffle all bit colors"
      >
        [ shuffle ]
      </button>

      {ALL_BITS.map((b) => (
        <AsciiBit
          key={b.id}
          hue={hues[b.id]}
          onClick={() => cycleHue(b.id)}
          position={b.position}
          ariaLabel={b.ariaLabel}
          glyph={b.glyph}
          eyePair={b.eyePair}
          className={b.className}
        />
      ))}
    </div>
  );
}
