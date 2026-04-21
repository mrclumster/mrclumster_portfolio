"use client";

import { motion } from "framer-motion";

// ──────────────────────────────────────────────────────────────────────────
// Landmark sprites — each is a self-contained SVG <g> positioned at (x, y).
// Sized for the 900×700 overworld coordinate system (matches adventure-screens).
// All hard-edged shapes — no anti-aliasing anywhere.
// ──────────────────────────────────────────────────────────────────────────

// ── Day 1 — Coast ────────────────────────────────────────────────────────
export function PalmTree({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="28" rx="24" ry="6" fill="#000" opacity="0.3" />
      {/* Trunk — curved with rect segments */}
      <rect x="-3" y="-8" width="6" height="36" fill="#6b4423" />
      <rect x="-2" y="-18" width="6" height="12" fill="#8b5833" />
      {/* Palm fronds — 6 radial */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <g key={deg} transform={`rotate(${deg - 90})`}>
          <ellipse cx="24" cy="-22" rx="22" ry="8" fill="#2d8b2d" />
          <ellipse cx="24" cy="-22" rx="18" ry="5" fill="#4cb04c" />
        </g>
      ))}
      {/* Coconuts */}
      <circle cx="-4" cy="-14" r="3" fill="#3d2410" />
      <circle cx="4" cy="-14" r="3" fill="#3d2410" />
    </g>
  );
}

export function Lighthouse({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="48" rx="20" ry="5" fill="#000" opacity="0.35" />
      {/* Tower */}
      <rect x="-10" y="-30" width="20" height="78" fill="#ffffff" stroke="#000" strokeWidth="2" />
      <rect x="-10" y="-10" width="20" height="10" fill="#e03030" />
      <rect x="-10" y="16" width="20" height="10" fill="#e03030" />
      {/* Top cab */}
      <rect x="-12" y="-42" width="24" height="14" fill="#202040" stroke="#000" strokeWidth="2" />
      {/* Lamp */}
      <circle cx="0" cy="-35" r="4" fill="#ffe066">
        <animate attributeName="fill" values="#ffe066;#ffffff;#ffe066" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Dome */}
      <path d="M -12 -42 Q 0 -52 12 -42 Z" fill="#404060" stroke="#000" strokeWidth="2" />
      <rect x="-2" y="-54" width="4" height="4" fill="#000" />
    </g>
  );
}

export function Plane({ x, y, animate = true }: { x: number; y: number; animate?: boolean }) {
  const body = (
    <g>
      <ellipse cx="0" cy="0" rx="32" ry="7" fill="#ffffff" stroke="#000" strokeWidth="2" />
      <rect x="-4" y="-18" width="8" height="14" fill="#ffffff" stroke="#000" strokeWidth="2" />
      <rect x="-22" y="-3" width="44" height="4" fill="#c0c0c8" />
      {/* Windows */}
      <circle cx="-18" cy="-1" r="1.5" fill="#4080c8" />
      <circle cx="-12" cy="-1" r="1.5" fill="#4080c8" />
      <circle cx="-6" cy="-1" r="1.5" fill="#4080c8" />
      <circle cx="0" cy="-1" r="1.5" fill="#4080c8" />
      <circle cx="6" cy="-1" r="1.5" fill="#4080c8" />
      {/* Red stripe */}
      <rect x="-32" y="-1" width="64" height="2" fill="#e03030" />
      {/* Nose */}
      <path d="M 32 -2 L 38 0 L 32 2 Z" fill="#ffffff" stroke="#000" strokeWidth="2" />
    </g>
  );
  if (!animate) {
    return <g transform={`translate(${x}, ${y})`}>{body}</g>;
  }
  return (
    <motion.g
      initial={{ x: x - 400 }}
      animate={{ x: x + 1200 }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
    >
      <g transform={`translate(0, ${y})`}>{body}</g>
    </motion.g>
  );
}

export function MOAGlobe({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="30" rx="22" ry="5" fill="#000" opacity="0.35" />
      {/* Pedestal */}
      <rect x="-14" y="16" width="28" height="14" fill="#606068" stroke="#000" strokeWidth="2" />
      {/* Globe */}
      <circle cx="0" cy="-2" r="22" fill="#4080c8" stroke="#000" strokeWidth="2.5" />
      {/* Longitude lines */}
      <ellipse cx="0" cy="-2" rx="22" ry="6" fill="none" stroke="#2050a0" strokeWidth="1.5" />
      <ellipse cx="0" cy="-2" rx="14" ry="22" fill="none" stroke="#2050a0" strokeWidth="1.5" />
      <ellipse cx="0" cy="-2" rx="6" ry="22" fill="none" stroke="#2050a0" strokeWidth="1.5" />
      {/* Landmass hint */}
      <path d="M -8 -8 q 6 -4 10 0 q -4 6 -10 4 Z" fill="#40a050" />
    </g>
  );
}

// ── Day 2 — Urban / QC ───────────────────────────────────────────────────
export function OfficeTower({ x, y, h = 80 }: { x: number; y: number; h?: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="4" rx="28" ry="5" fill="#000" opacity="0.35" />
      <rect x="-24" y={-h} width="48" height={h} fill="#5060a8" stroke="#000" strokeWidth="2" />
      <rect x="-22" y={-h + 2} width="44" height={h - 4} fill="#6078c0" />
      {/* Window grid */}
      {Array.from({ length: Math.floor(h / 10) - 1 }).map((_, row) =>
        Array.from({ length: 5 }).map((_, col) => (
          <rect key={`${row}-${col}`}
            x={-20 + col * 8} y={-h + 6 + row * 10}
            width="6" height="5" fill="#c0e0ff"
          />
        ))
      )}
      {/* Antenna */}
      <rect x="-1" y={-h - 12} width="2" height="12" fill="#808088" />
    </g>
  );
}

export function Factory({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="4" rx="36" ry="5" fill="#000" opacity="0.35" />
      <rect x="-32" y="-40" width="64" height="44" fill="#a06838" stroke="#000" strokeWidth="2" />
      <rect x="-32" y="-48" width="64" height="8" fill="#805028" stroke="#000" strokeWidth="2" />
      {/* Windows */}
      <rect x="-24" y="-32" width="8" height="8" fill="#80c0ff" />
      <rect x="-10" y="-32" width="8" height="8" fill="#80c0ff" />
      <rect x="4" y="-32" width="8" height="8" fill="#80c0ff" />
      <rect x="18" y="-32" width="8" height="8" fill="#80c0ff" />
      {/* Door */}
      <rect x="-6" y="-16" width="12" height="20" fill="#3d2410" />
      {/* Chimney */}
      <rect x="16" y="-72" width="8" height="24" fill="#707080" stroke="#000" strokeWidth="1.5" />
      <rect x="14" y="-74" width="12" height="4" fill="#505060" />
      {/* Smoke */}
      <motion.g
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: [0.6, 0.2, 0], y: -30 }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <circle cx="20" cy="-78" r="5" fill="#b0b0c0" />
        <circle cx="22" cy="-82" r="4" fill="#b0b0c0" />
      </motion.g>
      <motion.g
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: [0.6, 0.2, 0], y: -30 }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
      >
        <circle cx="18" cy="-78" r="4" fill="#b0b0c0" />
      </motion.g>
    </g>
  );
}

export function ApartmentBuilding({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="4" rx="32" ry="5" fill="#000" opacity="0.35" />
      <rect x="-28" y="-50" width="56" height="54" fill="#f0e0a0" stroke="#000" strokeWidth="2" />
      <rect x="-28" y="-56" width="56" height="8" fill="#a0502c" />
      {/* 3×2 windows */}
      {[0, 1, 2].map((col) => [0, 1].map((row) => (
        <rect key={`${col}-${row}`}
          x={-22 + col * 16} y={-40 + row * 20}
          width="10" height="10" fill="#3a5878" stroke="#000" strokeWidth="1" />
      )))}
      {/* Door */}
      <rect x="-6" y="-16" width="12" height="20" fill="#6b3010" />
    </g>
  );
}

export function StreetLamp({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-1" y="-40" width="2" height="40" fill="#404048" />
      <rect x="-6" y="-44" width="12" height="4" fill="#404048" />
      <circle cx="0" cy="-38" r="4" fill="#ffe066">
        <animate attributeName="fill" values="#ffe066;#fff080;#ffe066" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="0" cy="-38" r="10" fill="#ffe066" opacity="0.15" />
    </g>
  );
}

export function Car({ x, y, color = "#e03030", animate = true }: { x: number; y: number; color?: string; animate?: boolean }) {
  const body = (
    <g>
      {/* Body */}
      <rect x="-18" y="-6" width="36" height="10" fill={color} stroke="#000" strokeWidth="2" rx="2" />
      {/* Roof */}
      <rect x="-10" y="-14" width="22" height="10" fill={color} stroke="#000" strokeWidth="2" rx="2" />
      {/* Windows */}
      <rect x="-8" y="-12" width="8" height="6" fill="#80c0ff" />
      <rect x="2" y="-12" width="8" height="6" fill="#80c0ff" />
      {/* Wheels */}
      <circle cx="-10" cy="6" r="4" fill="#202020" />
      <circle cx="10" cy="6" r="4" fill="#202020" />
      <circle cx="-10" cy="6" r="1.5" fill="#808088" />
      <circle cx="10" cy="6" r="1.5" fill="#808088" />
      {/* Headlight */}
      <rect x="16" y="-4" width="3" height="3" fill="#ffffc0" />
    </g>
  );
  if (!animate) return <g transform={`translate(${x}, ${y})`}>{body}</g>;
  return (
    <motion.g
      initial={{ x: x - 200 }}
      animate={{ x: x + 1100 }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
    >
      <g transform={`translate(0, ${y})`}>{body}</g>
    </motion.g>
  );
}

// ── Day 3 — BGC Night ────────────────────────────────────────────────────
export function Skyscraper({ x, y, h = 120, lit = true }: { x: number; y: number; h?: number; lit?: boolean }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-20" y={-h} width="40" height={h} fill="#1a1a3a" stroke="#000" strokeWidth="2" />
      {/* Window grid — random lit cells */}
      {lit && Array.from({ length: Math.floor(h / 10) }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => {
          const on = (row * 7 + col * 3) % 5 < 2;
          return (
            <rect key={`${row}-${col}`}
              x={-16 + col * 8} y={-h + 4 + row * 10}
              width="5" height="6"
              fill={on ? "#ffe066" : "#302040"}
            >
              {on && <animate attributeName="opacity"
                values="1;0.6;1" dur={`${2 + (row + col) % 4}s`}
                repeatCount="indefinite" begin={`${(row * col) % 5}s`} />}
            </rect>
          );
        })
      )}
      <rect x="-2" y={-h - 14} width="4" height="14" fill="#606070" />
      <circle cx="0" cy={-h - 14} r="2" fill="#ff0000">
        <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

export function NeonBillboard({ x, y, text = "SALE!" }: { x: number; y: number; text?: string }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-2" y="-30" width="4" height="30" fill="#404050" />
      <rect x="-2" y="-30" width="4" height="30" fill="#404050" transform="translate(16 0)" />
      <rect x="-40" y="-60" width="80" height="30" fill="#0a0a20" stroke="#ff2ec8" strokeWidth="2" />
      <text x="0" y="-40" textAnchor="middle" fontSize="14" fill="#ff2ec8"
        fontFamily="'Press Start 2P', monospace"
        style={{ filter: "drop-shadow(0 0 6px #ff2ec8)" }}>
        {text}
        <animate attributeName="opacity" values="1;0.6;1" dur="1.2s" repeatCount="indefinite" />
      </text>
    </g>
  );
}

export function TrafficLight({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-1" y="0" width="2" height="30" fill="#404048" />
      <rect x="-8" y="-26" width="16" height="28" fill="#202028" stroke="#000" strokeWidth="1.5" rx="2" />
      <circle cx="0" cy="-20" r="3" fill="#ff2020" />
      <circle cx="0" cy="-12" r="3" fill="#f0a020" />
      <circle cx="0" cy="-4" r="3" fill="#20f020">
        <animate attributeName="fill" values="#20f020;#304030;#20f020" dur="3s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

// ── Day 4 — Nature ───────────────────────────────────────────────────────
export function LogBridge({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-40" y="-2" width="80" height="8" fill="#6b4423" stroke="#000" strokeWidth="1.5" />
      {/* Ring details */}
      {[-30, -16, -2, 12, 26].map((tx) => (
        <rect key={tx} x={tx} y="-2" width="2" height="8" fill="#3d2410" />
      ))}
      {/* Railings */}
      <rect x="-40" y="-12" width="3" height="12" fill="#8b5833" />
      <rect x="37" y="-12" width="3" height="12" fill="#8b5833" />
      <rect x="-40" y="-12" width="80" height="2" fill="#8b5833" />
    </g>
  );
}

export function MushroomCluster({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <Mushroom x={0} y={0} scale={1.2} />
      <Mushroom x={-12} y={4} scale={0.8} />
      <Mushroom x={10} y={6} scale={0.9} />
    </g>
  );
}
function Mushroom({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x="-2" y="0" width="4" height="8" fill="#f0e0c0" />
      <ellipse cx="0" cy="0" rx="8" ry="5" fill="#c83030" stroke="#000" strokeWidth="1.2" />
      <circle cx="-3" cy="-2" r="1.5" fill="#ffffff" />
      <circle cx="3" cy="-1" r="1" fill="#ffffff" />
    </g>
  );
}

export function Pond({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="0" rx="36" ry="18" fill="#3a7fc8" stroke="#1a4a8a" strokeWidth="2.5" />
      <ellipse cx="0" cy="-2" rx="30" ry="12" fill="#4a9fd8" />
      {/* Ripples */}
      <ellipse cx="-8" cy="-2" rx="6" ry="2" fill="none" stroke="#b0d8f0" strokeWidth="1">
        <animate attributeName="rx" values="4;12;4" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0;1" dur="3s" repeatCount="indefinite" />
      </ellipse>
      {/* Lily pad */}
      <ellipse cx="12" cy="2" rx="6" ry="3" fill="#3d8b3d" />
      <circle cx="12" cy="2" r="2" fill="#f0a0c0" />
      {/* Frog */}
      <g transform="translate(-16, -6)">
        <ellipse cx="0" cy="0" rx="5" ry="3" fill="#40a040" />
        <circle cx="-2" cy="-3" r="1.5" fill="#40a040" />
        <circle cx="2" cy="-3" r="1.5" fill="#40a040" />
        <circle cx="-2" cy="-3" r="0.8" fill="#ffffff" />
        <circle cx="2" cy="-3" r="0.8" fill="#ffffff" />
      </g>
    </g>
  );
}

export function WoodenFence({ x, y, segments = 3 }: { x: number; y: number; segments?: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {Array.from({ length: segments }).map((_, i) => (
        <g key={i} transform={`translate(${i * 18}, 0)`}>
          <rect x="0" y="-10" width="4" height="16" fill="#8b5833" stroke="#000" strokeWidth="1" />
          <path d="M 0 -10 L 2 -14 L 4 -10 Z" fill="#6b4423" />
        </g>
      ))}
      <rect x="0" y="-6" width={segments * 18 - 14} height="2" fill="#8b5833" />
      <rect x="0" y="-1" width={segments * 18 - 14} height="2" fill="#8b5833" />
    </g>
  );
}

// ── Day 5 — Tagaytay ─────────────────────────────────────────────────────
export function Volcano({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Mountain silhouette */}
      <path d="M -90 40 L -30 -60 L 30 -60 L 90 40 Z" fill="#40507c" stroke="#000" strokeWidth="2" />
      {/* Ridge highlights */}
      <path d="M -90 40 L -30 -60 L -20 -40 L -70 40 Z" fill="#5060a0" />
      {/* Crater rim */}
      <path d="M -30 -60 L 30 -60 L 26 -54 L -26 -54 Z" fill="#1a1a38" />
      {/* Lake inside crater */}
      <ellipse cx="0" cy="-40" rx="22" ry="6" fill="#3a7fc8" />
      {/* Steam */}
      <motion.g
        animate={{ y: [-4, -30], opacity: [0.4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
      >
        <circle cx="-4" cy="-70" r="6" fill="#d0d0e0" />
        <circle cx="6" cy="-75" r="5" fill="#d0d0e0" />
      </motion.g>
      <motion.g
        animate={{ y: [-4, -30], opacity: [0.4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: 2 }}
      >
        <circle cx="0" cy="-72" r="5" fill="#d0d0e0" />
      </motion.g>
    </g>
  );
}

export function FerrisWheel({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="60" rx="20" ry="5" fill="#000" opacity="0.4" />
      {/* Base */}
      <rect x="-3" y="0" width="6" height="60" fill="#806040" />
      <rect x="-20" y="55" width="40" height="8" fill="#806040" stroke="#000" strokeWidth="1.5" />
      {/* Rotating wheel */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "0px 0px" }}
      >
        <circle cx="0" cy="0" r="42" fill="none" stroke="#ffffff" strokeWidth="2" />
        <circle cx="0" cy="0" r="42" fill="none" stroke="#ff2ec8" strokeWidth="1" strokeDasharray="4 6" />
        {/* Spokes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line key={deg}
            x1="0" y1="0"
            x2={Math.cos((deg * Math.PI) / 180) * 42}
            y2={Math.sin((deg * Math.PI) / 180) * 42}
            stroke="#ffffff" strokeWidth="1.5"
          />
        ))}
        {/* Gondolas */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const cx = Math.cos((deg * Math.PI) / 180) * 42;
          const cy = Math.sin((deg * Math.PI) / 180) * 42;
          const colors = ["#e03030", "#f0c040", "#40a0f0", "#40c080", "#c040f0", "#f09040", "#4090c0", "#e0e040"];
          return (
            <motion.g key={deg}
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            >
              <rect x={cx - 4} y={cy - 2} width="8" height="6" fill={colors[deg / 45]} stroke="#000" strokeWidth="1" />
              <line x1={cx} y1={cy - 2} x2={cx} y2={cy - 5} stroke="#ffffff" strokeWidth="1" />
            </motion.g>
          );
        })}
        {/* Hub */}
        <circle cx="0" cy="0" r="4" fill="#606068" stroke="#000" strokeWidth="1" />
      </motion.g>
    </g>
  );
}

export function Gazebo({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="16" rx="26" ry="5" fill="#000" opacity="0.35" />
      {/* Roof */}
      <path d="M -24 -10 L 0 -32 L 24 -10 Z" fill="#a04030" stroke="#000" strokeWidth="2" />
      <path d="M -24 -10 L 24 -10 L 22 -6 L -22 -6 Z" fill="#701818" />
      {/* Pillars */}
      <rect x="-20" y="-10" width="3" height="26" fill="#ffffff" stroke="#000" strokeWidth="1" />
      <rect x="17" y="-10" width="3" height="26" fill="#ffffff" stroke="#000" strokeWidth="1" />
      <rect x="-2" y="-10" width="3" height="26" fill="#ffffff" stroke="#000" strokeWidth="1" />
      {/* Floor */}
      <rect x="-24" y="14" width="48" height="4" fill="#6b4423" stroke="#000" strokeWidth="1" />
    </g>
  );
}

// ── Day 6 — Baguio ───────────────────────────────────────────────────────
export function PineTree({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="28" rx="20" ry="5" fill="#000" opacity="0.35" />
      <rect x="-4" y="16" width="8" height="14" fill="#6b4423" />
      <path d="M -20 16 L 0 -30 L 20 16 Z" fill="#1a5028" stroke="#000" strokeWidth="1.5" />
      <path d="M -16 2 L 0 -28 L 16 2 Z" fill="#2d7040" />
      <path d="M -12 -10 L 0 -32 L 12 -10 Z" fill="#409050" />
    </g>
  );
}

export function StrawberryPatch({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="0" rx="36" ry="10" fill="#4d8b3d" stroke="#000" strokeWidth="1.5" />
      {/* Strawberries */}
      {[[-22, -2], [-8, 3], [4, -3], [18, 2], [-14, 4], [14, 5]].map(([sx, sy], i) => (
        <g key={i} transform={`translate(${sx}, ${sy})`}>
          <path d="M -3 -2 L 3 -2 L 2 3 L 0 5 L -2 3 Z" fill="#e02020" stroke="#000" strokeWidth="1" />
          <path d="M -3 -3 L 3 -3 L 2 -2 L 0 -1 L -2 -2 Z" fill="#40a040" />
          <circle cx="-1" cy="0" r="0.5" fill="#ffe066" />
          <circle cx="1" cy="1" r="0.5" fill="#ffe066" />
        </g>
      ))}
    </g>
  );
}

export function Pagoda({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="28" rx="32" ry="6" fill="#000" opacity="0.4" />
      {/* Base tier */}
      <rect x="-24" y="4" width="48" height="24" fill="#e03030" stroke="#000" strokeWidth="2" />
      <rect x="-28" y="0" width="56" height="6" fill="#a01818" stroke="#000" strokeWidth="2" />
      {/* Middle tier */}
      <rect x="-18" y="-18" width="36" height="18" fill="#f0a020" stroke="#000" strokeWidth="2" />
      <rect x="-22" y="-22" width="44" height="6" fill="#a01818" stroke="#000" strokeWidth="2" />
      {/* Top tier */}
      <rect x="-10" y="-34" width="20" height="12" fill="#e03030" stroke="#000" strokeWidth="2" />
      <rect x="-14" y="-38" width="28" height="6" fill="#a01818" stroke="#000" strokeWidth="2" />
      {/* Spire */}
      <rect x="-1" y="-50" width="2" height="14" fill="#c8c8c8" />
      <circle cx="0" cy="-52" r="3" fill="#ffe066" />
      {/* Door */}
      <rect x="-5" y="14" width="10" height="14" fill="#3d2410" />
    </g>
  );
}

export function Flagpole({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-1" y="-60" width="2" height="60" fill="#c8c8c8" />
      <circle cx="0" cy="-60" r="2" fill="#ffe066" />
      {/* Flag — blue + red + yellow (Philippine-ish) */}
      <motion.g
        animate={{ scaleX: [1, 0.95, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: "0px -55px" }}
      >
        <path d="M 0 -58 L 22 -52 L 0 -46 Z" fill="#0040a0" stroke="#000" strokeWidth="1" />
        <path d="M 0 -46 L 22 -40 L 0 -34 Z" fill="#e02020" stroke="#000" strokeWidth="1" />
        <path d="M 0 -58 L 8 -46 L 0 -34 Z" fill="#ffffff" stroke="#000" strokeWidth="1" />
        <circle cx="3" cy="-46" r="1.5" fill="#ffe066" />
      </motion.g>
    </g>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Ambient floaters — fullscreen animated layers
// ──────────────────────────────────────────────────────────────────────────

export function Cloud({ x, y, scale = 1, speed = 40 }: { x: number; y: number; scale?: number; speed?: number }) {
  return (
    <motion.g
      initial={{ x: x - 400 }}
      animate={{ x: x + 1400 }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
    >
      <g transform={`translate(0, ${y}) scale(${scale})`}>
        <ellipse cx="0" cy="0" rx="28" ry="10" fill="#ffffff" />
        <ellipse cx="-16" cy="4" rx="16" ry="8" fill="#ffffff" />
        <ellipse cx="14" cy="2" rx="18" ry="9" fill="#ffffff" />
      </g>
    </motion.g>
  );
}

export function Sun({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r="32" fill="#ffe066" opacity="0.4" />
      <circle cx="0" cy="0" r="22" fill="#fff080" />
      <circle cx="0" cy="0" r="14" fill="#ffffff" />
    </g>
  );
}

export function Moon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r="28" fill="#ffffff" opacity="0.2" />
      <circle cx="0" cy="0" r="20" fill="#f0f0e0" />
      <circle cx="-5" cy="-4" r="4" fill="#d8d8c8" />
      <circle cx="6" cy="3" r="3" fill="#d8d8c8" />
    </g>
  );
}

export function Stars({ count = 40 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const x = (i * 37 + 20) % 900;
        const y = (i * 71) % 250;
        const r = (i % 3) * 0.5 + 0.8;
        const dur = 1.5 + (i % 4) * 0.5;
        return (
          <circle key={i} cx={x} cy={y} r={r} fill="#ffffff">
            <animate attributeName="opacity" values="0.2;1;0.2" dur={`${dur}s`} repeatCount="indefinite" begin={`${(i % 5) * 0.3}s`} />
          </circle>
        );
      })}
    </>
  );
}

export function Seagull({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <motion.g
      initial={{ x: x - 300, y }}
      animate={{ x: x + 1300, y: [y, y - 10, y, y + 8, y] }}
      transition={{
        x: { duration: 30, repeat: Infinity, ease: "linear", delay },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
      }}
    >
      <g>
        <motion.path
          d="M -8 0 Q -4 -4 0 0 Q 4 -4 8 0"
          stroke="#ffffff" strokeWidth="2" fill="none"
          animate={{ d: ["M -8 0 Q -4 -4 0 0 Q 4 -4 8 0", "M -8 2 Q -4 -2 0 2 Q 4 -2 8 2", "M -8 0 Q -4 -4 0 0 Q 4 -4 8 0"] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      </g>
    </motion.g>
  );
}

export function Butterfly({ x, y, delay = 0, color = "#ff80e0" }: { x: number; y: number; delay?: number; color?: string }) {
  return (
    <motion.g
      animate={{
        x: [x, x + 100, x - 50, x + 30, x],
        y: [y, y - 30, y + 20, y - 10, y],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear", delay }}
    >
      <g>
        <motion.g
          animate={{ scaleX: [1, 0.3, 1] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        >
          <ellipse cx="-3" cy="0" rx="4" ry="5" fill={color} />
          <ellipse cx="3" cy="0" rx="4" ry="5" fill={color} />
        </motion.g>
        <line x1="0" y1="-5" x2="0" y2="5" stroke="#000" strokeWidth="1" />
      </g>
    </motion.g>
  );
}

export function FallingLeaves({ count = 8, color = "#c08040" }: { count?: number; color?: string }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const x = (i * 113 + 50) % 900;
        const startY = -(i * 89) % 100 - 50;
        const endY = 750 + (i % 3) * 50;
        const duration = 8 + (i % 5) * 2;
        const drift = (i % 2 === 0 ? 1 : -1) * (40 + (i % 3) * 20);
        return (
          <motion.g
            key={i}
            initial={{ x, y: startY, rotate: 0 }}
            animate={{ x: x + drift, y: endY, rotate: 360 }}
            transition={{ duration, repeat: Infinity, ease: "linear", delay: i * 0.8 }}
          >
            <ellipse cx="0" cy="0" rx="3" ry="5" fill={color} transform="rotate(30)" />
          </motion.g>
        );
      })}
    </>
  );
}

export function FogLayer({ y = 500, color = "#ffffff" }: { y?: number; color?: string }) {
  return (
    <motion.g
      initial={{ x: -200 }}
      animate={{ x: 200 }}
      transition={{ duration: 18, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    >
      <ellipse cx="200" cy={y} rx="180" ry="22" fill={color} opacity="0.3" />
      <ellipse cx="500" cy={y + 10} rx="200" ry="26" fill={color} opacity="0.25" />
      <ellipse cx="750" cy={y - 4} rx="160" ry="20" fill={color} opacity="0.28" />
    </motion.g>
  );
}

// Horizon silhouettes
export function HorizonMountains({ y, color, peaks = 4 }: { y: number; color: string; peaks?: number }) {
  let d = `M 0 ${y + 60} `;
  for (let i = 0; i < peaks; i++) {
    const x1 = (i * 900) / peaks;
    const x2 = x1 + 900 / peaks / 2;
    const x3 = x1 + 900 / peaks;
    const peakY = y - 30 - (i % 2) * 20;
    d += `L ${x1} ${y + 20} L ${x2} ${peakY} L ${x3} ${y + 20} `;
  }
  d += `L 900 ${y + 60} Z`;
  return <path d={d} fill={color} opacity="0.6" />;
}

export function HorizonCity({ y, color }: { y: number; color: string }) {
  // Stylized skyline
  let d = `M 0 ${y + 60} `;
  const buildings = [
    { w: 90, h: 80 }, { w: 60, h: 120 }, { w: 80, h: 60 }, { w: 100, h: 140 },
    { w: 70, h: 90 }, { w: 90, h: 110 }, { w: 60, h: 70 }, { w: 110, h: 130 },
    { w: 80, h: 95 }, { w: 90, h: 75 },
  ];
  let x = 0;
  for (const b of buildings) {
    d += `L ${x} ${y - b.h} L ${x + b.w} ${y - b.h} `;
    x += b.w;
    d += `L ${x} ${y - (b.h + 10)} `;
  }
  d += `L 900 ${y + 60} Z`;
  return (
    <g>
      <path d={d} fill={color} opacity="0.6" />
      {/* Window flickers */}
      {Array.from({ length: 25 }).map((_, i) => (
        <rect key={i}
          x={(i * 37) % 880}
          y={y - 10 - ((i * 23) % 100)}
          width="3" height="3"
          fill="#ffe066"
        >
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur={`${2 + (i % 4)}s`} repeatCount="indefinite" />
        </rect>
      ))}
    </g>
  );
}

export function HorizonPines({ y, color }: { y: number; color: string }) {
  const peaks: string[] = [];
  for (let i = 0; i < 12; i++) {
    const x = i * 80;
    const h = 40 + (i % 3) * 20;
    peaks.push(`M ${x} ${y + 20} L ${x + 40} ${y - h} L ${x + 80} ${y + 20} Z`);
  }
  return (
    <g opacity="0.7">
      {peaks.map((d, i) => (
        <path key={i} d={d} fill={color} />
      ))}
    </g>
  );
}
