import React, { useState } from "react";

// ──────────────────────────────────────────────────────────────────────────
// Remote sprite fetching from the public PokeAPI/sprites GitHub repo.
//
// Fallback chain per sprite:
//   1. Animated GIF (Gen-V Black/White) — if opts.animated
//   2. Static PNG on GitHub (front or back)
//   3. Local PNG at /public/sprites/pokemon/{name}.png — front only
//   4. Inline stylized SVG (always works)
// ──────────────────────────────────────────────────────────────────────────
const REMOTE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export interface SpriteOpts {
  back?: boolean;
  animated?: boolean;
}

function buildUrlChain(dexId: number, localName: string, opts: SpriteOpts): string[] {
  const { back, animated } = opts;
  const chain: string[] = [];
  if (animated) {
    chain.push(
      back
        ? `${REMOTE}/versions/generation-v/black-white/animated/back/${dexId}.gif`
        : `${REMOTE}/versions/generation-v/black-white/animated/${dexId}.gif`
    );
  }
  chain.push(back ? `${REMOTE}/back/${dexId}.png` : `${REMOTE}/${dexId}.png`);
  if (!back) chain.push(`/sprites/pokemon/${localName}.png`); // local front fallback
  return chain;
}

export function PokemonSprite({
  dexId, localName, opts, fallback, size, scale = 1,
}: {
  dexId: number;
  localName: string;
  opts: SpriteOpts;
  fallback: React.ReactElement;
  size: number;
  scale?: number;   // visual zoom applied on top of the box size (for small sprites)
}) {
  const [idx, setIdx] = useState(0);
  const urls = buildUrlChain(dexId, localName, opts);
  if (idx >= urls.length) return fallback;
  return (
    <img
      key={urls[idx]}
      src={urls[idx]}
      width={size}
      height={size}
      alt=""
      draggable={false}
      onError={() => setIdx((i) => i + 1)}
      style={{
        width: size,
        height: size,
        imageRendering: "pixelated",
        objectFit: "contain",
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "center",
      }}
    />
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Stylized fan-art SVG sprites — simple flat-shape interpretations,
// not reproductions of official Pokémon artwork.
// ──────────────────────────────────────────────────────────────────────────

const makeSvg = (size: number, content: React.ReactNode) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ imageRendering: "crisp-edges" }}>
    {content}
  </svg>
);

// Render a sprite via the PokeAPI URL chain with inline SVG as ultimate fallback.
const wrap = (
  localName: string,
  dexId: number,
  size: number,
  content: React.ReactNode,
  opts: SpriteOpts = {},
  scale: number = 1,
) => (
  <PokemonSprite
    dexId={dexId}
    localName={localName}
    opts={opts}
    fallback={makeSvg(size, content)}
    size={size}
    scale={scale}
  />
);

// ── PIKACHU ──────────────────────────────────────────────────────────────
export function PikachuSprite(size: number, opts?: SpriteOpts) {
  return wrap("pikachu", 25, size, (
    <g>
      <ellipse cx="0" cy="40" rx="26" ry="4" fill="#000" opacity="0.3" />
      <polygon points="-22,-22 -14,-46 -8,-22" fill="#ffdd40" stroke="#000" strokeWidth="2.5" />
      <polygon points="22,-22 14,-46 8,-22" fill="#ffdd40" stroke="#000" strokeWidth="2.5" />
      <polygon points="-20,-32 -14,-46 -10,-32" fill="#2a2a2a" />
      <polygon points="20,-32 14,-46 10,-32" fill="#2a2a2a" />
      <ellipse cx="0" cy="2" rx="30" ry="32" fill="#ffdd40" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-6" cy="0" rx="22" ry="24" fill="#ffea70" />
      <circle cx="-10" cy="-6" r="5" fill="#000" />
      <circle cx="10" cy="-6" r="5" fill="#000" />
      <circle cx="-9" cy="-8" r="1.8" fill="#fff" />
      <circle cx="11" cy="-8" r="1.8" fill="#fff" />
      <circle cx="-20" cy="6" r="5" fill="#e84040" stroke="#000" strokeWidth="1.5" />
      <circle cx="20" cy="6" r="5" fill="#e84040" stroke="#000" strokeWidth="1.5" />
      <path d="M -2 2 L 2 2 L 0 6 Z" fill="#000" />
      <path d="M -6 10 Q 0 16 6 10" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 24 12 L 34 4 L 30 14 L 42 8 L 34 22 L 44 18 L 32 32 Z" fill="#ffdd40" stroke="#000" strokeWidth="2" />
      <ellipse cx="-10" cy="34" rx="7" ry="4" fill="#ffdd40" stroke="#000" strokeWidth="1.5" />
      <ellipse cx="10" cy="34" rx="7" ry="4" fill="#ffdd40" stroke="#000" strokeWidth="1.5" />
    </g>
  ), opts, 1.5);
}

// ── CHARIZARD ────────────────────────────────────────────────────────────
export function CharizardSprite(size: number, opts?: SpriteOpts) {
  return wrap("charizard", 6, size, (
    <g>
      <ellipse cx="0" cy="40" rx="26" ry="4" fill="#000" opacity="0.35" />
      <path d="M -28 -8 Q -48 -24 -44 8 L -20 6 Z" fill="#507090" stroke="#000" strokeWidth="2" />
      <path d="M 28 -8 Q 48 -24 44 8 L 20 6 Z" fill="#507090" stroke="#000" strokeWidth="2" />
      <ellipse cx="0" cy="2" rx="26" ry="28" fill="#ee8030" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-4" cy="6" rx="16" ry="18" fill="#ffd0a0" />
      <ellipse cx="0" cy="-24" rx="18" ry="14" fill="#ee8030" stroke="#000" strokeWidth="2.5" />
      <polygon points="-14,-34 -10,-42 -6,-32" fill="#ee8030" stroke="#000" strokeWidth="2" />
      <polygon points="14,-34 10,-42 6,-32" fill="#ee8030" stroke="#000" strokeWidth="2" />
      <ellipse cx="0" cy="-20" rx="8" ry="6" fill="#f0a060" />
      <circle cx="-7" cy="-28" r="3" fill="#fff" />
      <circle cx="7" cy="-28" r="3" fill="#fff" />
      <circle cx="-7" cy="-27" r="1.5" fill="#000" />
      <circle cx="7" cy="-27" r="1.5" fill="#000" />
      <path d="M 22 20 L 38 22 L 32 8" fill="#ee8030" stroke="#000" strokeWidth="2" />
      <g>
        <path d="M 36 8 Q 44 -4 38 -16 Q 34 -6 30 -4 Q 36 2 36 8 Z" fill="#ffc040">
          <animate attributeName="d" values="M 36 8 Q 44 -4 38 -16 Q 34 -6 30 -4 Q 36 2 36 8 Z;
                                                M 36 8 Q 46 -6 40 -18 Q 32 -8 28 -6 Q 38 2 36 8 Z;
                                                M 36 8 Q 44 -4 38 -16 Q 34 -6 30 -4 Q 36 2 36 8 Z"
                   dur="0.6s" repeatCount="indefinite" />
        </path>
        <path d="M 36 2 Q 40 -8 37 -14 Q 35 -4 33 -2 Z" fill="#ff6030">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="0.4s" repeatCount="indefinite" />
        </path>
      </g>
      <ellipse cx="-10" cy="34" rx="8" ry="4" fill="#ee8030" stroke="#000" strokeWidth="1.5" />
      <ellipse cx="10" cy="34" rx="8" ry="4" fill="#ee8030" stroke="#000" strokeWidth="1.5" />
    </g>
  ), opts);
}

// ── BULBASAUR ────────────────────────────────────────────────────────────
export function BulbasaurSprite(size: number, opts?: SpriteOpts) {
  return wrap("bulbasaur", 1, size, (
    <g>
      <ellipse cx="0" cy="40" rx="28" ry="5" fill="#000" opacity="0.35" />
      {/* Body — squat quadruped */}
      <ellipse cx="0" cy="10" rx="32" ry="24" fill="#6ebe7e" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-4" cy="14" rx="20" ry="16" fill="#a0e0a0" />
      {/* Dark spots on body */}
      <circle cx="-16" cy="6" r="4" fill="#2d6040" />
      <circle cx="16" cy="6" r="4" fill="#2d6040" />
      <circle cx="0" cy="-2" r="3" fill="#2d6040" />
      <circle cx="12" cy="18" r="3" fill="#2d6040" />
      {/* Bulb on back — round green with leaf tuft */}
      <ellipse cx="-2" cy="-20" rx="20" ry="16" fill="#5a9850" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-6" cy="-24" rx="10" ry="6" fill="#80c080" />
      {/* Leaf on top of bulb */}
      <path d="M -8 -34 Q -4 -44 6 -38 Q 2 -30 -6 -32 Z" fill="#2d8b2d" stroke="#000" strokeWidth="2" />
      {/* Head — rounded */}
      <ellipse cx="2" cy="0" rx="22" ry="20" fill="#6ebe7e" stroke="#000" strokeWidth="2.5" />
      {/* Pointy ears */}
      <polygon points="-14,-14 -10,-22 -6,-14" fill="#6ebe7e" stroke="#000" strokeWidth="1.5" />
      <polygon points="14,-14 18,-22 22,-14" fill="#6ebe7e" stroke="#000" strokeWidth="1.5" />
      {/* Eyes — big red */}
      <ellipse cx="-8" cy="-2" rx="4" ry="5" fill="#e03030" />
      <ellipse cx="12" cy="-2" rx="4" ry="5" fill="#e03030" />
      <circle cx="-8" cy="-4" r="1.5" fill="#fff" />
      <circle cx="12" cy="-4" r="1.5" fill="#fff" />
      {/* Mouth */}
      <path d="M -4 8 Q 2 14 10 8" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Tiny fangs */}
      <polygon points="-3,8 -1,12 0,8" fill="#fff" />
      <polygon points="8,8 10,12 11,8" fill="#fff" />
      {/* Feet (stubby) */}
      <ellipse cx="-18" cy="32" rx="8" ry="5" fill="#6ebe7e" stroke="#000" strokeWidth="1.5" />
      <ellipse cx="18" cy="32" rx="8" ry="5" fill="#6ebe7e" stroke="#000" strokeWidth="1.5" />
    </g>
  ), opts, 1.4);
}

// ── PSYDUCK ──────────────────────────────────────────────────────────────
export function PsyduckSprite(size: number, opts?: SpriteOpts) {
  return wrap("psyduck", 54, size, (
    <g>
      <ellipse cx="0" cy="42" rx="22" ry="4" fill="#000" opacity="0.35" />
      {/* Body */}
      <ellipse cx="0" cy="8" rx="20" ry="24" fill="#f0d858" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-4" cy="10" rx="12" ry="18" fill="#f8ea90" />
      {/* Head — large egg-shape */}
      <ellipse cx="0" cy="-18" rx="22" ry="20" fill="#f0d858" stroke="#000" strokeWidth="2.5" />
      {/* Cheek tufts (feathers at top of head) */}
      <path d="M -22 -30 L -18 -38 L -14 -30 L -16 -26 Z" fill="#f0d858" stroke="#000" strokeWidth="1.5" />
      <path d="M -12 -36 L -8 -42 L -4 -36" fill="#f0d858" stroke="#000" strokeWidth="1.5" />
      <path d="M 4 -36 L 8 -42 L 12 -36" fill="#f0d858" stroke="#000" strokeWidth="1.5" />
      <path d="M 22 -30 L 18 -38 L 14 -30 L 16 -26 Z" fill="#f0d858" stroke="#000" strokeWidth="1.5" />
      {/* Bill — flat duck beak */}
      <ellipse cx="0" cy="-10" rx="14" ry="6" fill="#d89030" stroke="#000" strokeWidth="2" />
      <line x1="-10" y1="-10" x2="10" y2="-10" stroke="#000" strokeWidth="1.5" />
      {/* Eyes — vacant stare */}
      <circle cx="-8" cy="-20" r="4" fill="#fff" stroke="#000" strokeWidth="1.5" />
      <circle cx="8" cy="-20" r="4" fill="#fff" stroke="#000" strokeWidth="1.5" />
      <circle cx="-8" cy="-20" r="1.5" fill="#000" />
      <circle cx="8" cy="-20" r="1.5" fill="#000" />
      {/* Forehead — clutching confused hands */}
      <g>
        <rect x="-16" y="-26" width="5" height="10" rx="2" fill="#f0d858" stroke="#000" strokeWidth="1.5" />
        <rect x="11" y="-26" width="5" height="10" rx="2" fill="#f0d858" stroke="#000" strokeWidth="1.5" />
      </g>
      {/* Arms */}
      <ellipse cx="-22" cy="8" rx="4" ry="8" fill="#f0d858" stroke="#000" strokeWidth="2" />
      <ellipse cx="22" cy="8" rx="4" ry="8" fill="#f0d858" stroke="#000" strokeWidth="2" />
      {/* Feet — webbed */}
      <ellipse cx="-10" cy="32" rx="7" ry="4" fill="#d89030" stroke="#000" strokeWidth="1.5" />
      <ellipse cx="10" cy="32" rx="7" ry="4" fill="#d89030" stroke="#000" strokeWidth="1.5" />
      {/* Tail */}
      <path d="M 14 26 L 22 30 L 14 34 Z" fill="#f0d858" stroke="#000" strokeWidth="1.5" />
    </g>
  ), opts, 1.4);
}

// ── GENGAR ───────────────────────────────────────────────────────────────
export function GengarSprite(size: number, opts?: SpriteOpts) {
  return wrap("gengar", 94, size, (
    <g>
      <ellipse cx="0" cy="40" rx="30" ry="4" fill="#000" opacity="0.4" />
      <circle cx="0" cy="0" r="40" fill="#a060e0" opacity="0.2">
        <animate attributeName="opacity" values="0.1;0.28;0.1" dur="2s" repeatCount="indefinite" />
      </circle>
      <path d="M -28 12 Q -34 -10 -20 -26 Q -4 -36 16 -32 Q 32 -26 30 -4
               L 36 -10 L 32 4 L 40 2 L 34 16 L 28 12
               Q 28 26 18 32 L -14 32 Q -28 26 -28 12 Z"
            fill="#5030a0" stroke="#000" strokeWidth="2.5" />
      <polygon points="-14,-30 -10,-44 -4,-28" fill="#5030a0" stroke="#000" strokeWidth="2" />
      <polygon points="2,-34 6,-44 10,-30" fill="#5030a0" stroke="#000" strokeWidth="2" />
      <circle cx="-10" cy="-8" r="5" fill="#fff" />
      <circle cx="10" cy="-8" r="5" fill="#fff" />
      <circle cx="-10" cy="-8" r="2" fill="#000" />
      <circle cx="10" cy="-8" r="2" fill="#000" />
      <path d="M -16 4 Q 0 18 16 4" fill="#fff" stroke="#000" strokeWidth="2" />
      <path d="M -16 4 L -10 4 L -6 10 L -2 4 L 2 10 L 6 4 L 10 10 L 16 4" stroke="#000" strokeWidth="1" fill="none" />
      <ellipse cx="-30" cy="6" rx="5" ry="10" fill="#5030a0" stroke="#000" strokeWidth="2" />
      <ellipse cx="30" cy="6" rx="5" ry="10" fill="#5030a0" stroke="#000" strokeWidth="2" />
      <g transform="translate(-30, 16)">
        <rect x="-2" y="0" width="1.5" height="4" fill="#5030a0" stroke="#000" strokeWidth="1" />
        <rect x="0" y="0" width="1.5" height="5" fill="#5030a0" stroke="#000" strokeWidth="1" />
        <rect x="2" y="0" width="1.5" height="4" fill="#5030a0" stroke="#000" strokeWidth="1" />
      </g>
      <g transform="translate(30, 16)">
        <rect x="-2" y="0" width="1.5" height="4" fill="#5030a0" stroke="#000" strokeWidth="1" />
        <rect x="0" y="0" width="1.5" height="5" fill="#5030a0" stroke="#000" strokeWidth="1" />
        <rect x="2" y="0" width="1.5" height="4" fill="#5030a0" stroke="#000" strokeWidth="1" />
      </g>
      <ellipse cx="-12" cy="34" rx="7" ry="3" fill="#5030a0" stroke="#000" strokeWidth="1.5" />
      <ellipse cx="12" cy="34" rx="7" ry="3" fill="#5030a0" stroke="#000" strokeWidth="1.5" />
    </g>
  ), opts);
}

// ── SQUIRTLE ─────────────────────────────────────────────────────────────
export function SquirtleSprite(size: number, opts?: SpriteOpts) {
  return wrap("squirtle", 7, size, (
    <g>
      <ellipse cx="0" cy="40" rx="26" ry="4" fill="#000" opacity="0.35" />
      {/* Shell — rounded brown top */}
      <ellipse cx="0" cy="8" rx="28" ry="22" fill="#a86030" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="0" cy="4" rx="22" ry="16" fill="#c88050" />
      {/* Hexagon shell pattern */}
      <path d="M -10 0 L -4 -6 L 4 -6 L 10 0 L 4 6 L -4 6 Z" fill="none" stroke="#6b3018" strokeWidth="1.5" />
      {/* Body edges — light blue */}
      <ellipse cx="0" cy="14" rx="30" ry="10" fill="#88c8e8" stroke="#000" strokeWidth="2" />
      {/* Head */}
      <ellipse cx="0" cy="-14" rx="18" ry="14" fill="#88c8e8" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-2" cy="-12" rx="12" ry="10" fill="#b0e0f8" />
      {/* Eyes */}
      <circle cx="-8" cy="-14" r="4" fill="#fff" stroke="#000" strokeWidth="1.5" />
      <circle cx="8" cy="-14" r="4" fill="#fff" stroke="#000" strokeWidth="1.5" />
      <circle cx="-7" cy="-13" r="1.8" fill="#000" />
      <circle cx="9" cy="-13" r="1.8" fill="#000" />
      {/* Smile */}
      <path d="M -5 -6 Q 0 -2 5 -6" stroke="#000" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Arms */}
      <ellipse cx="-24" cy="10" rx="5" ry="7" fill="#88c8e8" stroke="#000" strokeWidth="2" />
      <ellipse cx="24" cy="10" rx="5" ry="7" fill="#88c8e8" stroke="#000" strokeWidth="2" />
      {/* Tail — curled */}
      <path d="M 26 24 Q 36 22 34 14 Q 30 18 28 22 Z" fill="#88c8e8" stroke="#000" strokeWidth="1.5" />
      {/* Feet */}
      <ellipse cx="-10" cy="32" rx="7" ry="4" fill="#88c8e8" stroke="#000" strokeWidth="1.5" />
      <ellipse cx="10" cy="32" rx="7" ry="4" fill="#88c8e8" stroke="#000" strokeWidth="1.5" />
      {/* Claws */}
      <rect x="-13" y="32" width="1.5" height="3" fill="#fff" stroke="#000" strokeWidth="0.8" />
      <rect x="-9" y="34" width="1.5" height="3" fill="#fff" stroke="#000" strokeWidth="0.8" />
      <rect x="8" y="34" width="1.5" height="3" fill="#fff" stroke="#000" strokeWidth="0.8" />
      <rect x="12" y="32" width="1.5" height="3" fill="#fff" stroke="#000" strokeWidth="0.8" />
    </g>
  ), opts, 1.5);
}

// ── SNORLAX ──────────────────────────────────────────────────────────────
export function SnorlaxSprite(size: number, opts?: SpriteOpts) {
  return wrap("snorlax", 143, size, (
    <g>
      <ellipse cx="0" cy="42" rx="36" ry="4" fill="#000" opacity="0.4" />
      <ellipse cx="0" cy="8" rx="40" ry="32" fill="#3a5878" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="0" cy="12" rx="32" ry="24" fill="#e8d8b0" />
      <ellipse cx="0" cy="-20" rx="22" ry="16" fill="#3a5878" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-18" cy="-30" rx="5" ry="3" fill="#3a5878" stroke="#000" strokeWidth="2" transform="rotate(-30 -18 -30)" />
      <ellipse cx="18" cy="-30" rx="5" ry="3" fill="#3a5878" stroke="#000" strokeWidth="2" transform="rotate(30 18 -30)" />
      <path d="M -12 -20 Q -8 -18 -4 -20" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 4 -20 Q 8 -18 12 -20" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="0" cy="-10" rx="6" ry="4" fill="#3a1810" stroke="#000" strokeWidth="1.5" />
      <polygon points="-4,-12 -2,-8 -1,-12" fill="#fff" />
      <polygon points="1,-12 2,-8 4,-12" fill="#fff" />
      <ellipse cx="-36" cy="10" rx="7" ry="14" fill="#3a5878" stroke="#000" strokeWidth="2" />
      <ellipse cx="36" cy="10" rx="7" ry="14" fill="#3a5878" stroke="#000" strokeWidth="2" />
      <g transform="translate(-36, 20)">
        <rect x="-4" y="0" width="1.5" height="3" fill="#fff" stroke="#000" strokeWidth="0.8" />
        <rect x="-1" y="0" width="1.5" height="3" fill="#fff" stroke="#000" strokeWidth="0.8" />
        <rect x="2" y="0" width="1.5" height="3" fill="#fff" stroke="#000" strokeWidth="0.8" />
      </g>
      <g transform="translate(36, 20)">
        <rect x="-4" y="0" width="1.5" height="3" fill="#fff" stroke="#000" strokeWidth="0.8" />
        <rect x="-1" y="0" width="1.5" height="3" fill="#fff" stroke="#000" strokeWidth="0.8" />
        <rect x="2" y="0" width="1.5" height="3" fill="#fff" stroke="#000" strokeWidth="0.8" />
      </g>
      <ellipse cx="-14" cy="38" rx="10" ry="4" fill="#3a5878" stroke="#000" strokeWidth="1.5" />
      <ellipse cx="14" cy="38" rx="10" ry="4" fill="#3a5878" stroke="#000" strokeWidth="1.5" />
      <g opacity="0.8">
        <text x="28" y="-32" fontSize="14" fill="#6080a8" fontFamily="monospace" fontWeight="bold">
          z
          <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
        </text>
        <text x="34" y="-38" fontSize="10" fill="#6080a8" fontFamily="monospace" fontWeight="bold">
          z
          <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="1s" />
        </text>
      </g>
    </g>
  ), opts);
}
