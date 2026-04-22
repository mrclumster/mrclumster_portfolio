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

// ── Extra landmarks (Phase 6) ────────────────────────────────────────────

// Day 1 — Beach umbrella
export function BeachUmbrella({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="20" rx="14" ry="3" fill="#000" opacity="0.3" />
      <rect x="-1" y="-18" width="2" height="38" fill="#6b4423" />
      <path d="M -24 -16 Q 0 -32 24 -16 L 18 -12 Q 0 -18 -18 -12 Z" fill="#e03030" stroke="#000" strokeWidth="2" />
      <path d="M -12 -16 L -8 -12 M 0 -18 L 0 -12 M 12 -16 L 8 -12" stroke="#a01818" strokeWidth="1.5" />
    </g>
  );
}

// Day 1 — Animated wave crest
export function WaveCrest({ x, y }: { x: number; y: number; }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <motion.path
        d="M -24 0 Q -12 -6 0 0 T 24 0"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </g>
  );
}

// Day 2 — Neon sign that flickers
export function NeonSign({ x, y, text, color = "#ff2ec8" }: { x: number; y: number; text: string; color?: string }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-32" y="-16" width="64" height="20" fill="#0a0a20" stroke={color} strokeWidth="2" />
      <text x="0" y="-2" textAnchor="middle" fontSize="10" fill={color}
            fontFamily="'Press Start 2P', monospace"
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
        {text}
        <animate attributeName="opacity" values="1;0.5;1;0.8;1" dur="2.5s" repeatCount="indefinite" />
      </text>
    </g>
  );
}

// Day 3 — Confetti rain
export function ConfettiRain({ count = 20 }: { count?: number }) {
  const colors = ["#ff2e4d", "#ffb000", "#00ff9c", "#00e0ff", "#ff2ec8", "#a855ff"];
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const x = (i * 47 + 10) % 900;
        const startY = -(i * 31) % 60 - 30;
        const endY = 720;
        const duration = 6 + (i % 4);
        return (
          <motion.rect
            key={i}
            initial={{ x, y: startY, rotate: 0 }}
            animate={{ x: x + ((i % 2 === 0 ? 1 : -1) * 30), y: endY, rotate: 720 }}
            transition={{ duration, repeat: Infinity, ease: "linear", delay: i * 0.4 }}
            width="4" height="8"
            fill={colors[i % colors.length]}
          />
        );
      })}
    </>
  );
}

// Day 4 — Log stack
export function LogStack({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="16" rx="22" ry="4" fill="#000" opacity="0.3" />
      <ellipse cx="-8" cy="8" rx="14" ry="5" fill="#8b5833" stroke="#000" strokeWidth="1.5" />
      <ellipse cx="8" cy="8" rx="14" ry="5" fill="#8b5833" stroke="#000" strokeWidth="1.5" />
      <ellipse cx="0" cy="-2" rx="14" ry="5" fill="#a06838" stroke="#000" strokeWidth="1.5" />
      <circle cx="-8" cy="8" r="3" fill="#6b4423" />
      <circle cx="8" cy="8" r="3" fill="#6b4423" />
      <circle cx="0" cy="-2" r="3" fill="#8b5833" />
    </g>
  );
}

// Day 5 — Second volcano silhouette
export function SmallVolcano({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path d="M -50 30 L -16 -30 L 16 -30 L 50 30 Z" fill="#3a4070" stroke="#000" strokeWidth="2" />
      <path d="M -16 -30 L 16 -30 L 14 -26 L -14 -26 Z" fill="#1a1a38" />
      <motion.circle
        cx="0" cy="-36" r="4" fill="#d0d0e0" opacity="0.5"
        animate={{ y: [0, -12, 0], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1.5 }}
      />
    </g>
  );
}

// Day 6 — Snowflake fall (alternative to FallingLeaves for Baguio chill)
export function SnowFall({ count = 20 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const x = (i * 53 + 20) % 900;
        const startY = -(i * 41) % 80 - 40;
        const endY = 720;
        const duration = 10 + (i % 5);
        const drift = (i % 2 === 0 ? 1 : -1) * (20 + (i % 3) * 10);
        return (
          <motion.circle
            key={i}
            initial={{ x, y: startY }}
            animate={{ x: x + drift, y: endY }}
            transition={{ duration, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
            r={1.5 + (i % 3) * 0.6}
            fill="#ffffff"
            opacity="0.85"
          />
        );
      })}
    </>
  );
}

// ── Density pack (Phase 8C) ──────────────────────────────────────────────

// Day 1 — Ship silhouette
export function Ship({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path d="M -28 0 L 28 0 L 22 8 L -22 8 Z" fill="#3a3040" stroke="#000" strokeWidth="1.5" />
      <rect x="-18" y="-10" width="36" height="10" fill="#505060" stroke="#000" strokeWidth="1.5" />
      <rect x="-6" y="-16" width="12" height="6" fill="#c0c0c8" />
      <rect x="-1" y="-30" width="2" height="14" fill="#808088" />
      <path d="M 1 -28 L 10 -20 L 1 -20 Z" fill="#e03030" />
    </g>
  );
}

// Day 1 — Lifeguard chair
export function LifeguardChair({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="20" rx="18" ry="3" fill="#000" opacity="0.3" />
      <rect x="-8" y="-14" width="16" height="14" fill="#e03030" stroke="#000" strokeWidth="1.5" />
      <rect x="-1" y="-22" width="2" height="8" fill="#fff" />
      <path d="M -10 -24 L 10 -24 L 8 -14 L -8 -14 Z" fill="#c8a050" />
      <rect x="-10" y="0" width="3" height="20" fill="#8b5833" />
      <rect x="7" y="0" width="3" height="20" fill="#8b5833" />
    </g>
  );
}

// Park bench — multi-day
export function Bench({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="16" rx="24" ry="3" fill="#000" opacity="0.3" />
      <rect x="-20" y="-8" width="40" height="4" fill="#8b5833" stroke="#000" strokeWidth="1" />
      <rect x="-20" y="2" width="40" height="4" fill="#8b5833" stroke="#000" strokeWidth="1" />
      <rect x="-18" y="-14" width="3" height="26" fill="#404040" />
      <rect x="15" y="-14" width="3" height="26" fill="#404040" />
      <rect x="-18" y="-14" width="36" height="2" fill="#404040" />
    </g>
  );
}

// Day 2 — Bike rack
export function BikeRack({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="10" rx="20" ry="2" fill="#000" opacity="0.3" />
      <path d="M -18 8 Q -14 -12 -10 8 M -6 8 Q -2 -12 2 8 M 10 8 Q 14 -12 18 8"
            stroke="#606068" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

// Day 2 — Bus stop sign
export function BusStop({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="22" rx="16" ry="3" fill="#000" opacity="0.3" />
      <rect x="-1" y="-20" width="2" height="42" fill="#505060" />
      <rect x="-14" y="-22" width="28" height="14" fill="#4080c8" stroke="#000" strokeWidth="1.5" />
      <text x="0" y="-12" textAnchor="middle" fontSize="7" fill="#fff"
            fontFamily="'Press Start 2P', monospace">BUS</text>
    </g>
  );
}

// Day 3 — Fountain
export function Fountain({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="20" rx="28" ry="5" fill="#000" opacity="0.3" />
      <ellipse cx="0" cy="16" rx="26" ry="8" fill="#4080c8" stroke="#000" strokeWidth="2" />
      <ellipse cx="0" cy="14" rx="22" ry="6" fill="#60a0e0" />
      <rect x="-2" y="-10" width="4" height="22" fill="#808088" />
      <circle cx="0" cy="-14" r="6" fill="#808088" stroke="#000" strokeWidth="1.5" />
      <motion.g
        animate={{ y: [-4, -20, -4], opacity: [1, 0, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <circle cx="0" cy="-18" r="2" fill="#a0e0ff" />
        <circle cx="-4" cy="-16" r="1.5" fill="#a0e0ff" />
        <circle cx="4" cy="-16" r="1.5" fill="#a0e0ff" />
      </motion.g>
    </g>
  );
}

// Day 4 — Camping tent
export function Tent({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="14" rx="24" ry="4" fill="#000" opacity="0.3" />
      <path d="M -20 14 L 0 -16 L 20 14 Z" fill="#e08040" stroke="#000" strokeWidth="2" />
      <path d="M 0 -16 L 0 14 L -10 14 L 0 -6 L 10 14 L 0 14 Z" fill="#2a1a0a" />
      <rect x="-24" y="12" width="48" height="2" fill="#5a3a1a" />
    </g>
  );
}

// Day 4 — Picnic table
export function PicnicTable({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="14" rx="26" ry="3" fill="#000" opacity="0.3" />
      <rect x="-22" y="-4" width="44" height="6" fill="#c08060" stroke="#000" strokeWidth="1.5" />
      <rect x="-22" y="4" width="44" height="3" fill="#8b5833" />
      <rect x="-16" y="6" width="3" height="10" fill="#8b5833" />
      <rect x="13" y="6" width="3" height="10" fill="#8b5833" />
    </g>
  );
}

// Day 5 — Waterfall
export function Waterfall({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-18" y="-30" width="36" height="6" fill="#4080c8" stroke="#000" strokeWidth="1.5" />
      <motion.rect
        x="-14" y="-24" width="28" height="40" fill="#6ca8e8"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <ellipse cx="0" cy="20" rx="22" ry="6" fill="#4080c8" stroke="#000" strokeWidth="1.5" />
      <motion.circle cx="-8" cy="18" r="2" fill="#ffffff"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
      />
      <motion.circle cx="6" cy="22" r="2" fill="#ffffff"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
      />
    </g>
  );
}

// Day 5 — Telescope
export function Telescope({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="16" rx="16" ry="3" fill="#000" opacity="0.3" />
      <rect x="-12" y="10" width="24" height="6" fill="#404048" stroke="#000" strokeWidth="1" />
      <rect x="-3" y="-4" width="6" height="14" fill="#505058" />
      <ellipse cx="0" cy="-6" rx="16" ry="4" fill="#606068" stroke="#000" strokeWidth="1.5" transform="rotate(-25)" />
      <circle cx="-12" cy="-3" r="3" fill="#1a1a28" />
    </g>
  );
}

// Day 5 / 6 — Rock stack
export function RockFormation({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="18" rx="28" ry="5" fill="#000" opacity="0.35" />
      <ellipse cx="-10" cy="12" rx="14" ry="8" fill="#8a8a90" stroke="#000" strokeWidth="1.5" />
      <ellipse cx="10" cy="10" rx="16" ry="10" fill="#7a7a80" stroke="#000" strokeWidth="1.5" />
      <ellipse cx="2" cy="-2" rx="12" ry="8" fill="#9a9aa0" stroke="#000" strokeWidth="1.5" />
      <ellipse cx="-2" cy="-6" rx="4" ry="3" fill="#d0d0d8" />
    </g>
  );
}

// Day 6 — Paper lantern
export function Lantern({ x, y, color = "#e04040" }: { x: number; y: number; color?: string }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-1" y="-32" width="2" height="16" fill="#404040" />
      <motion.ellipse cx="0" cy="-10" rx="10" ry="14" fill={color} stroke="#000" strokeWidth="1.5"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <rect x="-10" y="-12" width="20" height="2" fill="#202020" />
      <rect x="-10" y="-6" width="20" height="2" fill="#202020" />
      <rect x="-2" y="4" width="4" height="4" fill="#202020" />
    </g>
  );
}

// Day 6 — Stone bridge
export function StoneBridge({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="14" rx="36" ry="4" fill="#000" opacity="0.3" />
      <path d="M -34 10 Q 0 -20 34 10 L 34 14 L -34 14 Z" fill="#8a8a90" stroke="#000" strokeWidth="2" />
      <path d="M -30 10 Q 0 -14 30 10" fill="none" stroke="#404048" strokeWidth="1.5" />
      <path d="M -34 10 L -34 -2 M 34 10 L 34 -2" stroke="#606068" strokeWidth="2" />
    </g>
  );
}

// Day 6 — Snowman
export function Snowman({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="24" rx="18" ry="3" fill="#000" opacity="0.3" />
      <ellipse cx="0" cy="14" rx="16" ry="10" fill="#ffffff" stroke="#000" strokeWidth="1.5" />
      <ellipse cx="0" cy="0" rx="12" ry="8" fill="#ffffff" stroke="#000" strokeWidth="1.5" />
      <ellipse cx="0" cy="-12" rx="9" ry="7" fill="#ffffff" stroke="#000" strokeWidth="1.5" />
      <rect x="-10" y="-22" width="20" height="4" fill="#1a1a28" />
      <rect x="-5" y="-28" width="10" height="6" fill="#1a1a28" />
      <circle cx="-3" cy="-14" r="1.2" fill="#000" />
      <circle cx="3" cy="-14" r="1.2" fill="#000" />
      <path d="M -2 -10 L 2 -10 L 0 -6 Z" fill="#ff8040" />
      <circle cx="-3" cy="-2" r="1.5" fill="#000" />
      <circle cx="0" cy="0" r="1.5" fill="#000" />
      <circle cx="3" cy="2" r="1.5" fill="#000" />
    </g>
  );
}

// Generic flower cluster (multi-day filler)
export function FlowerCluster({ x, y }: { x: number; y: number }) {
  const colors = ["#ff4080", "#ffe040", "#80a0ff", "#ff8040"];
  return (
    <g transform={`translate(${x}, ${y})`}>
      {colors.map((c, i) => (
        <g key={i} transform={`translate(${(i - 1.5) * 8}, ${(i % 2) * 4})`}>
          <rect x="-0.5" y="0" width="1" height="6" fill="#3d8b3d" />
          <circle cx="0" cy="-2" r="3" fill={c} stroke="#000" strokeWidth="0.8" />
          <circle cx="0" cy="-2" r="1" fill="#ffe066" />
        </g>
      ))}
    </g>
  );
}

// ── Day 6 pixel-art landmark pack (Baguio highland — 5-zone tour) ───────

// Dawn mist sky — pastel pink-blue with small sun + soft clouds
export function DawnMistSkyBand({ width = 900, top = 0, bottom = 220 }: { width?: number; top?: number; bottom?: number }) {
  const h = bottom - top;
  const clouds: React.ReactElement[] = [];
  const cloudSpots: [number, number, number][] = [
    [100, 40, 3], [320, 24, 4], [560, 44, 3], [800, 30, 4],
  ];
  for (const [cx, cy, sz] of cloudSpots) {
    clouds.push(
      <g key={`cl${cx}`}>
        <rect x={cx}     y={top + cy}     width={sz * 14} height={sz * 3} fill="#ffffff" opacity="0.85" />
        <rect x={cx + sz * 2}  y={top + cy - sz * 2} width={sz * 10} height={sz * 3} fill="#ffffff" opacity="0.85" />
        <rect x={cx + sz * 5}  y={top + cy - sz * 4} width={sz * 6}  height={sz * 3} fill="#ffffff" opacity="0.85" />
      </g>
    );
  }
  return (
    <g shapeRendering="crispEdges">
      {/* Banded pastel dawn */}
      <rect x="0" y={top}             width={width} height={h * 0.35} fill="#f4c8d4" />
      <rect x="0" y={top + h * 0.35}  width={width} height={h * 0.25} fill="#d8b4d0" />
      <rect x="0" y={top + h * 0.60}  width={width} height={h * 0.25} fill="#a8b4d4" />
      <rect x="0" y={top + h * 0.85}  width={width} height={h * 0.15} fill="#98c0d8" />
      {/* Sun disc (upper-left) */}
      <circle cx="170" cy={top + 44} r="14" fill="#ffe8a0" opacity="0.6" />
      <circle cx="170" cy={top + 44} r="9"  fill="#ffecc0" opacity="0.85" />
      <circle cx="170" cy={top + 44} r="4"  fill="#ffffff" />
      {clouds}
      {/* A few faint stars still fading at top */}
      {Array.from({ length: 8 }).map((_, i) => {
        const sx = (i * 113 + 17) % width;
        return <rect key={i} x={sx} y={top + (i * 3) % 20} width="1" height="1" fill="#ffffff" opacity="0.5" />;
      })}
    </g>
  );
}

// Three-layer pine ridge silhouette band
export function PineRidgeBand({ width = 900, top = 180, bottom = 340 }: { width?: number; top?: number; bottom?: number }) {
  const h = bottom - top;
  const makePines = (count: number, color: string, yOffset: number, size: number) => (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const px = ((i + 0.5) * width) / count;
        return (
          <path
            key={i}
            d={`M ${px - size} ${top + yOffset} L ${px} ${top + yOffset - size * 1.6} L ${px + size} ${top + yOffset} Z`}
            fill={color}
          />
        );
      })}
    </g>
  );
  return (
    <g shapeRendering="crispEdges">
      {/* Far ridge — lightest */}
      <rect x="0" y={top} width={width} height={h} fill="#7a8cae" opacity="0" />
      <path
        d={`M 0 ${top + h} L 0 ${top + 60} L ${width / 2} ${top + 30} L ${width} ${top + 55} L ${width} ${top + h} Z`}
        fill="#90a8c0"
      />
      {makePines(22, "#6a8aa8", 60, 8)}
      {/* Mid ridge */}
      <path
        d={`M 0 ${top + h}
            L 0 ${top + 110} L 180 ${top + 90} L 360 ${top + 115}
            L 540 ${top + 95} L 720 ${top + 115} L ${width} ${top + 100}
            L ${width} ${top + h} Z`}
        fill="#4a6880"
      />
      {makePines(16, "#3a5068", 110, 11)}
      {/* Near ridge */}
      <path
        d={`M 0 ${top + h}
            L 0 ${top + 150} L 200 ${top + 140} L 400 ${top + 152}
            L 600 ${top + 138} L 800 ${top + 150} L ${width} ${top + h} Z`}
        fill="#2a3e50"
      />
      {makePines(14, "#1a2d3c", 148, 14)}
    </g>
  );
}

// Cool highland forest floor — grass + pine-needle + moss pixels
export function ForestFloorBand({ x = 0, width = 900, top = 320, bottom = 700 }: { x?: number; width?: number; top?: number; bottom?: number }) {
  const h = bottom - top;
  return (
    <g shapeRendering="crispEdges">
      <rect x={x} y={top}   width={width} height={h} fill="#6ab060" />
      <rect x={x} y={top}   width={width} height="4" fill="#7ec074" />
      {/* Tile seams */}
      {Array.from({ length: Math.floor(h / 24) }).map((_, r) => (
        <rect key={`hs${r}`} x={x} y={top + r * 24} width={width} height="1" fill="#4c8c44" opacity="0.5" />
      ))}
      {/* Pine needles — diagonal tiny lines */}
      {Array.from({ length: 80 }).map((_, i) => {
        const dx = (i * 37 + 11) % width;
        const dy = top + 14 + ((i * 19) % (h - 20));
        return <rect key={`n${i}`} x={x + dx} y={dy} width="3" height="1" fill="#3a6030" opacity="0.7" />;
      })}
      {/* Moss spots */}
      {Array.from({ length: 30 }).map((_, i) => {
        const dx = (i * 61 + 29) % width;
        const dy = top + 20 + ((i * 31) % (h - 40));
        return <rect key={`m${i}`} x={x + dx} y={dy} width="2" height="2" fill="#4a8040" opacity="0.8" />;
      })}
      {/* Flower accents */}
      {Array.from({ length: 20 }).map((_, i) => {
        const dx = (i * 71 + 17) % width;
        const dy = top + 24 + ((i * 43) % (h - 60));
        const col = ["#ffffff", "#ffc8d8", "#fff0a0", "#b8d8ff"][i % 4];
        return <rect key={`fl${i}`} x={x + dx} y={dy} width="2" height="2" fill={col} opacity="0.9" />;
      })}
    </g>
  );
}

// Small signpost pointing to the next zone
export function SignpostPointer({ x, y, label, direction = "right", bg = "#8b5833" }: { x: number; y: number; label: string; direction?: "left" | "right"; bg?: string }) {
  const arrow = direction === "right" ? "→" : "←";
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="22" rx="14" ry="2" fill="#000" opacity="0.4" />
      <rect x="-1" y="-6" width="2" height="28" fill="#6b4020" stroke="#3a2010" strokeWidth="1" />
      {/* Sign board */}
      <rect x="-26" y="-18" width="52" height="14" fill={bg} stroke="#3a2010" strokeWidth="1.5" />
      <rect x="-24" y="-16" width="48" height="3"  fill="#a67838" />
      <text x="0" y="-8" textAnchor="middle" fontSize="5" fill="#ffffff"
            fontFamily="'Press Start 2P', monospace">
        {direction === "left" ? `${arrow} ${label}` : `${label} ${arrow}`}
      </text>
    </g>
  );
}

// ── Zone 1: Bus Terminal ────────────────────────────────────────────────
export function BusStation({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="44" rx="70" ry="6" fill="#000" opacity="0.4" />
      {/* Open-air roof */}
      <rect x="-64" y="-20" width="128" height="10" fill="#c8c0b8" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-62" y="-18" width="124" height="3"  fill="#e0d8d0" />
      {/* Support pillars */}
      {[-54, -18, 18, 54].map((px, i) => (
        <rect key={i} x={px - 3} y={-10} width="6" height="56" fill="#808088" stroke="#1a1a2a" strokeWidth="1" />
      ))}
      {/* Benches under roof */}
      <rect x="-44" y="18" width="28" height="4" fill="#6b4020" stroke="#3a2010" strokeWidth="1" />
      <rect x="16"  y="18" width="28" height="4" fill="#6b4020" stroke="#3a2010" strokeWidth="1" />
      <rect x="-44" y="22" width="28" height="12" fill="none" stroke="#3a2010" strokeWidth="1" />
      <rect x="16"  y="22" width="28" height="12" fill="none" stroke="#3a2010" strokeWidth="1" />
      {/* Schedule board */}
      <rect x="-10" y="10" width="20" height="16" fill="#1a1a2a" stroke="#1a1a2a" strokeWidth="1" />
      <rect x="-8"  y="12" width="16" height="12" fill="#406080" />
      <rect x="-6"  y="14" width="12" height="1"  fill="#ffe066" />
      <rect x="-6"  y="17" width="10" height="1"  fill="#ffe066" />
      <rect x="-6"  y="20" width="12" height="1"  fill="#ffe066" />
      {/* Rooftop sign */}
      <rect x="-30" y="-34" width="60" height="14" fill="#1a1a2a" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-28" y="-32" width="56" height="10" fill="#40a060" />
      <text x="0" y="-24" textAnchor="middle" fontSize="6" fill="#ffffff"
            fontFamily="'Press Start 2P', monospace">BAGUIO</text>
    </g>
  );
}

export function ParkedBus({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="18" rx="36" ry="3" fill="#000" opacity="0.4" />
      {/* Body */}
      <rect x="-34" y="-12" width="68" height="28" fill="#e08840" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-34" y="-12" width="68" height="4"  fill="#f4a060" />
      {/* Windows */}
      {[-28, -18, -8, 2, 12, 22].map((wx, i) => (
        <rect key={i} x={wx} y={-6} width="8" height="8" fill="#a0c8f0" stroke="#1a1a2a" strokeWidth="1" />
      ))}
      {/* Door */}
      <rect x="-32" y="2" width="8" height="14" fill="#1a1a2a" />
      <rect x="-30" y="4" width="4" height="10" fill="#406080" />
      {/* Stripe */}
      <rect x="-34" y="4" width="68" height="2" fill="#c06020" />
      {/* Wheels */}
      <circle cx="-22" cy="18" r="4" fill="#1a1a2a" />
      <circle cx="-22" cy="18" r="2" fill="#808088" />
      <circle cx="22"  cy="18" r="4" fill="#1a1a2a" />
      <circle cx="22"  cy="18" r="2" fill="#808088" />
      {/* Destination sign */}
      <rect x="-16" y="-16" width="32" height="4" fill="#1a1a2a" />
      <text x="0" y="-13" textAnchor="middle" fontSize="3" fill="#ffe066"
            fontFamily="'Press Start 2P', monospace">BAGUIO</text>
      {/* Headlight */}
      <rect x="32" y="-4" width="3" height="3" fill="#ffffc0" />
    </g>
  );
}

export function TravelerGroup({ x, y }: { x: number; y: number }) {
  const shirts = ["#d03030", "#4080c8", "#40a060", "#c060e0"];
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      {shirts.map((s, i) => {
        const px = i * 14;
        return (
          <g key={i} transform={`translate(${px}, 0)`}>
            {/* Luggage */}
            <rect x="-8" y="4" width="5" height="6" fill="#6b4020" stroke="#1a1a2a" strokeWidth="0.5" />
            <rect x="-8" y="2" width="5" height="1" fill="#1a1a2a" />
            {/* Person */}
            <rect x="-3" y="-12" width="6" height="6" fill="#f0c090" stroke="#1a1a2a" strokeWidth="0.6" />
            <rect x="-3" y="-12" width="6" height="2" fill="#3a2010" />
            <rect x="-4" y="-6"  width="8" height="8" fill={s} stroke="#1a1a2a" strokeWidth="0.6" />
            <rect x="-3" y="2"   width="2" height="6" fill="#2a2a44" />
            <rect x="1"  y="2"   width="2" height="6" fill="#2a2a44" />
          </g>
        );
      })}
    </g>
  );
}

// ── Zone 2: Strawberry Field ────────────────────────────────────────────
export function StrawberryTrellisRow({ x, y, width = 140 }: { x: number; y: number; width?: number }) {
  const n = Math.floor(width / 14);
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx={width / 2} cy="10" rx={width / 2 + 4} ry="3" fill="#000" opacity="0.35" />
      {/* Mounded soil row */}
      <rect x="0" y="0" width={width} height="8" fill="#6b4020" stroke="#3a2010" strokeWidth="1" />
      <rect x="0" y="0" width={width} height="2" fill="#8a5828" />
      {/* Plants with berries */}
      {Array.from({ length: n }).map((_, i) => {
        const px = i * 14 + 6;
        return (
          <g key={i}>
            <rect x={px - 4} y="-8" width="8" height="6" fill="#2d7040" stroke="#1a2a10" strokeWidth="0.6" />
            <rect x={px - 6} y="-6" width="12" height="4" fill="#40a050" />
            {/* 2 berries per plant */}
            <path d={`M ${px - 3} -2 L ${px - 1} 2 L ${px - 2} 0 Z`} fill="#e02020" />
            <path d={`M ${px + 1} -2 L ${px + 3} 2 L ${px + 2} 0 Z`} fill="#e02020" />
            <rect x={px - 3} y="-3" width="1" height="1" fill="#ffe066" />
          </g>
        );
      })}
    </g>
  );
}

export function HarvestCart({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="14" rx="20" ry="2" fill="#000" opacity="0.4" />
      {/* Cart body */}
      <rect x="-16" y="-2" width="32" height="14" fill="#8b5833" stroke="#3a2010" strokeWidth="2" />
      <rect x="-16" y="-2" width="32" height="3"  fill="#a87040" />
      {/* Planks */}
      <rect x="-16" y="4"  width="32" height="1" fill="#6b3010" />
      <rect x="-16" y="8"  width="32" height="1" fill="#6b3010" />
      {/* Handle */}
      <rect x="14" y="-4" width="14" height="2" fill="#6b4020" />
      {/* Wheel */}
      <circle cx="-10" cy="14" r="5" fill="#1a1a2a" />
      <circle cx="-10" cy="14" r="2" fill="#808088" />
      {/* Strawberries piled */}
      {[[-12, -6], [-6, -8], [0, -6], [6, -9], [10, -6]].map(([sx, sy], i) => (
        <g key={i}>
          <path d={`M ${sx - 2} ${sy} L ${sx + 2} ${sy} L ${sx + 1} ${sy + 3} L ${sx} ${sy + 4} L ${sx - 1} ${sy + 3} Z`} fill="#e02020" stroke="#1a1a2a" strokeWidth="0.5" />
          <path d={`M ${sx - 2} ${sy - 1} L ${sx + 2} ${sy - 1} L ${sx + 1} ${sy} L ${sx} ${sy + 1} L ${sx - 1} ${sy} Z`} fill="#40a040" />
        </g>
      ))}
    </g>
  );
}

export function JamStall({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="30" rx="26" ry="4" fill="#000" opacity="0.4" />
      {/* Canopy */}
      {Array.from({ length: 5 }).map((_, i) => (
        <rect key={i} x={-20 + i * 8} y="-18" width="8" height="10" fill={i % 2 === 0 ? "#e04040" : "#ffffff"} stroke="#1a1a2a" strokeWidth="1" />
      ))}
      <rect x="-24" y="-20" width="48" height="3" fill="#1a1a2a" />
      {/* Counter */}
      <rect x="-22" y="-8" width="44" height="22" fill="#c08040" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-22" y="-8" width="44" height="3"  fill="#e0a060" />
      <rect x="-22" y="10" width="44" height="4"  fill="#8b5020" />
      {/* Sign */}
      <rect x="-16" y="-6" width="32" height="8" fill="#1a1a2a" />
      <rect x="-14" y="-4" width="28" height="4" fill="#ffe066" />
      <text x="0" y="-1" textAnchor="middle" fontSize="3" fill="#1a1a2a"
            fontFamily="'Press Start 2P', monospace">JAM</text>
      {/* Jam jars */}
      {[-12, -4, 4, 12].map((jx, i) => (
        <g key={i}>
          <rect x={jx - 2} y="4" width="4" height="6" fill="#ffffff" stroke="#1a1a2a" strokeWidth="0.6" />
          <rect x={jx - 2} y="4" width="4" height="1" fill="#1a1a2a" />
          <rect x={jx - 1} y="5" width="2" height="4" fill="#e02040" />
        </g>
      ))}
    </g>
  );
}

// ── Zone 3: Bell Temple ─────────────────────────────────────────────────
export function BellPagoda({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="60" rx="50" ry="6" fill="#000" opacity="0.5" />
      {/* Base tier */}
      <rect x="-40" y="20" width="80" height="40" fill="#c04040" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-40" y="20" width="80" height="4"  fill="#e05050" />
      <rect x="-44" y="16" width="88" height="8"  fill="#8a1818" stroke="#1a1a2a" strokeWidth="2" />
      {/* Base doors */}
      <rect x="-10" y="30" width="20" height="30" fill="#2a1010" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-8"  y="32" width="8"  height="26" fill="#6b3010" />
      <rect x="2"   y="32" width="8"  height="26" fill="#6b3010" />
      <rect x="-2"  y="44" width="4"  height="3"  fill="#ffe066" />
      {/* Side lantern glows */}
      <rect x="-30" y="26" width="6" height="10" fill="#ffe066" stroke="#1a1a2a" strokeWidth="1" />
      <rect x="24"  y="26" width="6" height="10" fill="#ffe066" stroke="#1a1a2a" strokeWidth="1" />
      {/* Middle tier */}
      <rect x="-32" y="-6" width="64" height="22" fill="#f0a020" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-36" y="-10" width="72" height="8" fill="#8a1818" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-28" y="0" width="8" height="10" fill="#2a1010" />
      <rect x="20"  y="0" width="8" height="10" fill="#2a1010" />
      {/* Top tier */}
      <rect x="-22" y="-30" width="44" height="20" fill="#c04040" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-26" y="-34" width="52" height="6"  fill="#8a1818" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-8"  y="-26" width="16" height="14" fill="#2a1010" />
      {/* Roof tips — upturned pagoda eaves */}
      <rect x="-46" y="10" width="6" height="2" fill="#8a1818" />
      <rect x="40"  y="10" width="6" height="2" fill="#8a1818" />
      <rect x="-38" y="-18" width="4" height="2" fill="#8a1818" />
      <rect x="34"  y="-18" width="4" height="2" fill="#8a1818" />
      <rect x="-28" y="-40" width="4" height="2" fill="#8a1818" />
      <rect x="24"  y="-40" width="4" height="2" fill="#8a1818" />
      {/* Spire */}
      <rect x="-2" y="-46" width="4" height="14" fill="#ffe066" stroke="#1a1a2a" strokeWidth="1" />
      <circle cx="0" cy="-48" r="3" fill="#ffe066" stroke="#1a1a2a" strokeWidth="1" />
      <circle cx="0" cy="-48" r="1" fill="#ffffff" />
    </g>
  );
}

export function StoneLion({ x, y, facing = "left" }: { x: number; y: number; facing?: "left" | "right" }) {
  const s = facing === "right" ? -1 : 1;
  return (
    <g transform={`translate(${x}, ${y}) scale(${s}, 1)`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="16" rx="16" ry="3" fill="#000" opacity="0.4" />
      {/* Pedestal */}
      <rect x="-12" y="8" width="24" height="10" fill="#a89878" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="-14" y="6" width="28" height="4" fill="#907858" stroke="#1a1a2a" strokeWidth="1" />
      {/* Lion body */}
      <rect x="-10" y="-4" width="20" height="14" fill="#d8c088" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="-10" y="-4" width="20" height="2" fill="#e8d098" />
      {/* Head */}
      <rect x="-2" y="-14" width="14" height="12" fill="#d8c088" stroke="#1a1a2a" strokeWidth="1.5" />
      {/* Mane */}
      {[-2, 0, 2, 4, 6, 8, 10].map((mx, i) => (
        <rect key={i} x={mx} y={-16 - ((i % 2) * 2)} width="3" height="3" fill="#c0a868" stroke="#1a1a2a" strokeWidth="0.5" />
      ))}
      {/* Eyes */}
      <rect x="4" y="-10" width="2" height="2" fill="#1a1a2a" />
      <rect x="8" y="-10" width="2" height="2" fill="#1a1a2a" />
      {/* Mouth */}
      <rect x="6" y="-4" width="4" height="1" fill="#1a1a2a" />
      {/* Legs */}
      <rect x="-8" y="8" width="3" height="4" fill="#b89858" />
      <rect x="5"  y="8" width="3" height="4" fill="#b89858" />
      {/* Tail */}
      <rect x="-14" y="-4" width="4" height="2" fill="#d8c088" />
      <rect x="-16" y="-6" width="2" height="2" fill="#d8c088" />
    </g>
  );
}

export function IncenseBrazier({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="12" rx="14" ry="2" fill="#000" opacity="0.4" />
      {/* Base */}
      <rect x="-8" y="6" width="16" height="6" fill="#886038" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="-10" y="4" width="20" height="4" fill="#a87840" stroke="#1a1a2a" strokeWidth="1" />
      {/* Bowl */}
      <ellipse cx="0" cy="-2" rx="12" ry="6" fill="#a87840" stroke="#1a1a2a" strokeWidth="1.5" />
      <ellipse cx="0" cy="-3" rx="10" ry="4" fill="#c09050" />
      {/* Embers */}
      <rect x="-4" y="-4" width="2" height="1" fill="#ff6020" />
      <rect x="0"  y="-4" width="2" height="1" fill="#ffa020" />
      <rect x="3"  y="-4" width="2" height="1" fill="#ff6020" />
      {/* Smoke */}
      <motion.g
        animate={{ y: [0, -18, -32], opacity: [0.8, 0.4, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <rect x="-2" y="-10" width="4" height="3" fill="#d0d0d0" />
        <rect x="-3" y="-14" width="6" height="3" fill="#d0d0d0" />
      </motion.g>
      <motion.g
        animate={{ y: [0, -18, -32], opacity: [0.8, 0.4, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      >
        <rect x="-1" y="-8"  width="3" height="2" fill="#d0d0d0" />
      </motion.g>
    </g>
  );
}

export function TempleBell({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="40" rx="22" ry="3" fill="#000" opacity="0.4" />
      {/* A-frame support */}
      <path d="M -18 40 L 0 -30 L 18 40" fill="none" stroke="#6b4020" strokeWidth="3" />
      <rect x="-22" y="40" width="44" height="4" fill="#6b4020" stroke="#1a1a2a" strokeWidth="1" />
      {/* Horizontal beam */}
      <rect x="-14" y="-20" width="28" height="4" fill="#6b4020" stroke="#1a1a2a" strokeWidth="1" />
      {/* Bell rope */}
      <rect x="-1" y="-16" width="2" height="10" fill="#404040" />
      {/* Animated swinging bell */}
      <motion.g
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "0px -16px" }}
      >
        <path d="M -10 -6 L 10 -6 L 8 12 L -8 12 Z" fill="#c89030" stroke="#1a1a2a" strokeWidth="2" />
        <path d="M -10 -6 L 10 -6 L 8 -2 L -8 -2 Z" fill="#e0a840" />
        <ellipse cx="0" cy="12" rx="10" ry="2" fill="#906028" stroke="#1a1a2a" strokeWidth="1" />
        <rect x="-1" y="10" width="2" height="5" fill="#404040" />
        <rect x="-2" y="14" width="4" height="2" fill="#1a1a2a" />
      </motion.g>
    </g>
  );
}

// ── Zone 4: PMA Parade ──────────────────────────────────────────────────
export function ParadeGround({ x, y, width = 180 }: { x: number; y: number; width?: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <rect x="0" y="0" width={width} height="40" fill="#d4c89c" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="0" y="0" width={width} height="4"  fill="#e8dcb0" />
      {/* Painted white reference lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <rect key={i} x={0} y={8 + i * 7} width={width} height="1" fill="#ffffff" opacity="0.8" />
      ))}
      {/* Central cross mark */}
      <rect x={width / 2 - 8} y={18} width="16" height="2" fill="#ffffff" />
      <rect x={width / 2 - 1} y={14} width="2" height="10" fill="#ffffff" />
    </g>
  );
}

export function PHFlagpole({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="2" rx="8" ry="2" fill="#000" opacity="0.4" />
      <rect x="-1" y="-60" width="2" height="62" fill="#c8c8c8" stroke="#1a1a2a" strokeWidth="0.5" />
      <circle cx="0" cy="-62" r="3" fill="#ffe066" />
      <motion.g
        animate={{ scaleX: [1, 0.92, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "1px -58px" }}
      >
        {/* Blue band */}
        <rect x="1" y="-60" width="22" height="7" fill="#0038a8" stroke="#1a1a2a" strokeWidth="0.8" />
        {/* Red band */}
        <rect x="1" y="-53" width="22" height="7" fill="#ce1126" stroke="#1a1a2a" strokeWidth="0.8" />
        {/* White triangle */}
        <path d="M 1 -60 L 9 -53 L 1 -46 Z" fill="#ffffff" stroke="#1a1a2a" strokeWidth="0.8" />
        {/* Sun */}
        <rect x="4" y="-55" width="2" height="2" fill="#ffe066" />
      </motion.g>
      {/* Base platform */}
      <rect x="-6" y="0" width="12" height="4" fill="#808088" stroke="#1a1a2a" strokeWidth="1" />
    </g>
  );
}

export function Cannon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="10" rx="14" ry="2" fill="#000" opacity="0.4" />
      {/* Barrel */}
      <rect x="-12" y="-4" width="20" height="6" fill="#404048" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="8"   y="-5" width="2"  height="8" fill="#303038" />
      <rect x="-14" y="-5" width="4"  height="8" fill="#505058" stroke="#1a1a2a" strokeWidth="1" />
      {/* Carriage */}
      <rect x="-10" y="2" width="16" height="6" fill="#6b4020" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="-10" y="2" width="16" height="2" fill="#8a5828" />
      {/* Wheels */}
      <circle cx="-7" cy="10" r="3" fill="#1a1a2a" />
      <circle cx="-7" cy="10" r="1" fill="#a06030" />
      <circle cx="4"  cy="10" r="3" fill="#1a1a2a" />
      <circle cx="4"  cy="10" r="1" fill="#a06030" />
      {/* Cannonballs */}
      <circle cx="14" cy="10" r="2" fill="#404048" />
      <circle cx="18" cy="10" r="2" fill="#404048" />
      <circle cx="16" cy="8" r="2" fill="#404048" />
    </g>
  );
}

export function GuardPost({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="22" rx="14" ry="3" fill="#000" opacity="0.4" />
      {/* Roof */}
      <path d="M -14 -18 L 0 -26 L 14 -18 Z" fill="#c04040" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-16" y="-18" width="32" height="3" fill="#8a1818" />
      {/* Body */}
      <rect x="-12" y="-15" width="24" height="38" fill="#e0dcc8" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-12" y="-15" width="24" height="3" fill="#f0ecd8" />
      <rect x="-12" y="20" width="24" height="3" fill="#8a8878" />
      {/* Vertical stripes */}
      <rect x="-10" y="-15" width="4" height="38" fill="#c04040" />
      <rect x="6"   y="-15" width="4" height="38" fill="#c04040" />
      {/* Window */}
      <rect x="-6" y="-10" width="12" height="10" fill="#80b0d8" stroke="#1a1a2a" strokeWidth="1" />
      <rect x="0"  y="-10" width="1"  height="10" fill="#1a1a2a" />
      {/* Guard */}
      <rect x="-3" y="4" width="6" height="10" fill="#40a060" stroke="#1a1a2a" strokeWidth="0.6" />
      <rect x="-2" y="-2" width="4" height="4" fill="#f0c090" stroke="#1a1a2a" strokeWidth="0.5" />
      <rect x="-3" y="-3" width="6" height="2" fill="#40a060" />
    </g>
  );
}

// ── Zone 5: Burnham Park ────────────────────────────────────────────────
export function OvalLake({ x, y, width = 260, height = 90 }: { x: number; y: number; width?: number; height?: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      {/* Bank */}
      <ellipse cx={width / 2} cy={height / 2} rx={width / 2 + 4} ry={height / 2 + 4} fill="#4a7020" />
      {/* Water */}
      <ellipse cx={width / 2} cy={height / 2} rx={width / 2} ry={height / 2} fill="#5ea0d8" stroke="#4080b0" strokeWidth="2" />
      <ellipse cx={width / 2} cy={height / 2 - 4} rx={width / 2 - 4} ry={height / 2 - 6} fill="#74b4e8" />
      {/* Ripples — sliding left to right */}
      {[0.3, 0.55, 0.75].map((ry, i) => (
        <motion.rect
          key={i}
          x="0" y={height * ry} width="40" height="1" fill="#ffffff" opacity="0.5"
          animate={{ x: [0, width - 40] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "linear", delay: i * 1.5 }}
        />
      ))}
      {/* Darker surface bands */}
      {Array.from({ length: 4 }).map((_, i) => (
        <rect key={i} x="10" y={15 + i * 18} width={width - 20} height="1" fill="#4a8cc0" opacity="0.5" />
      ))}
    </g>
  );
}

export function SwanBoat({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <motion.g
      initial={{ x: x - 40 }}
      animate={{ x: x + 200 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear", delay }}
    >
      <motion.g
        animate={{ y: [y, y - 1, y] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <g shapeRendering="crispEdges">
          <ellipse cx="0" cy="6" rx="16" ry="2" fill="#1a1a2a" opacity="0.35" />
          {/* Swan body — bright white hull */}
          <path d="M -16 0 L 16 0 L 12 6 L -12 6 Z" fill="#ffffff" stroke="#1a1a2a" strokeWidth="1.5" />
          <path d="M -14 0 L 14 0 L 12 2 L -12 2 Z" fill="#f0f0f0" />
          {/* Rear tail */}
          <path d="M -16 0 L -20 -6 L -14 -2 Z" fill="#ffffff" stroke="#1a1a2a" strokeWidth="1" />
          {/* Swan neck + head */}
          <path d="M 8 0 L 12 -10 L 18 -10 L 18 -4 L 14 -4 Z" fill="#ffffff" stroke="#1a1a2a" strokeWidth="1.5" />
          <rect x="17" y="-8" width="3" height="3" fill="#ff9040" stroke="#1a1a2a" strokeWidth="0.5" />
          <rect x="14" y="-8" width="1" height="1" fill="#1a1a2a" />
          {/* Two seated riders */}
          <rect x="-6" y="-4" width="4" height="4" fill="#f0c090" />
          <rect x="-6" y="-6" width="4" height="2" fill="#3a2010" />
          <rect x="0"  y="-4" width="4" height="4" fill="#f0c090" />
          <rect x="0"  y="-6" width="4" height="2" fill="#c04040" />
        </g>
      </motion.g>
    </motion.g>
  );
}

export function IceCreamCart({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="26" rx="22" ry="3" fill="#000" opacity="0.4" />
      {/* Canopy stripes */}
      {Array.from({ length: 4 }).map((_, i) => (
        <rect key={i} x={-16 + i * 8} y="-22" width="8" height="8" fill={i % 2 === 0 ? "#40a060" : "#ffffff"} stroke="#1a1a2a" strokeWidth="1" />
      ))}
      <rect x="-20" y="-24" width="40" height="3" fill="#1a1a2a" />
      {/* Cart body */}
      <rect x="-18" y="-14" width="36" height="22" fill="#c03838" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-18" y="-14" width="36" height="3"  fill="#e05050" />
      <rect x="-18" y="4"   width="36" height="3"  fill="#8a1818" />
      {/* Sign */}
      <rect x="-14" y="-10" width="28" height="10" fill="#1a1a2a" />
      <rect x="-12" y="-8"  width="24" height="6"  fill="#ffe066" />
      <text x="0" y="-4" textAnchor="middle" fontSize="4" fill="#1a1a2a"
            fontFamily="'Press Start 2P', monospace">SORBETES</text>
      {/* Wheels */}
      <circle cx="-12" cy="12" r="4" fill="#1a1a2a" />
      <circle cx="-12" cy="12" r="2" fill="#808088" />
      <circle cx="12"  cy="12" r="4" fill="#1a1a2a" />
      <circle cx="12"  cy="12" r="2" fill="#808088" />
      {/* Handle */}
      <rect x="16" y="-16" width="2" height="8" fill="#8b5833" />
      {/* Ice cream scoops */}
      <circle cx="-6" cy="-28" r="3" fill="#ff80c0" stroke="#1a1a2a" strokeWidth="0.8" />
      <circle cx="0"  cy="-30" r="3" fill="#ffffff" stroke="#1a1a2a" strokeWidth="0.8" />
      <circle cx="6"  cy="-28" r="3" fill="#8a4a20" stroke="#1a1a2a" strokeWidth="0.8" />
      <path d="M -9 -26 L -6 -22 L -3 -26 Z" fill="#d8a060" stroke="#1a1a2a" strokeWidth="0.6" />
    </g>
  );
}

// ── Day 5 pixel-art landmark pack (Sky Ranch carnival — vibrant daytime) ──

// Carnival sky band — bright daytime blue + clouds + bunting pennants across top
export function CarnivalSkyBand({ width = 900, top = 0, bottom = 200 }: { width?: number; top?: number; bottom?: number }) {
  const h = bottom - top;
  const cloudSpots: [number, number, number][] = [
    [80, 30, 3], [260, 18, 4], [460, 34, 3], [640, 24, 4], [820, 40, 3],
  ];
  const clouds = cloudSpots.map(([cx, cy, sz], i) => (
    <g key={i}>
      <rect x={cx} y={top + cy} width={sz * 14} height={sz * 3} fill="#ffffff" />
      <rect x={cx + sz * 2} y={top + cy - sz * 2} width={sz * 10} height={sz * 3} fill="#ffffff" />
      <rect x={cx + sz * 5} y={top + cy - sz * 4} width={sz * 6} height={sz * 3} fill="#ffffff" />
      <rect x={cx} y={top + cy + sz * 2} width={sz * 14} height={sz} fill="#d4ecf4" opacity="0.8" />
    </g>
  ));
  // Bunting pennants across the top — two staggered rows
  const buntingColors = ["#ff4060", "#ffa030", "#ffe040", "#40c860", "#4090e0", "#c060e0"];
  const bunting = Array.from({ length: Math.floor(width / 28) }).map((_, i) => {
    const bx = i * 28 + 6;
    const color = buntingColors[i % buntingColors.length];
    return (
      <g key={`b${i}`}>
        <path d={`M ${bx} ${top + 90} L ${bx + 10} ${top + 90} L ${bx + 5} ${top + 104} Z`}
              fill={color} stroke="#1a1a2a" strokeWidth="1" />
      </g>
    );
  });
  const bunting2 = Array.from({ length: Math.floor(width / 28) }).map((_, i) => {
    const bx = i * 28 + 20;
    const color = buntingColors[(i + 3) % buntingColors.length];
    return (
      <g key={`b2${i}`}>
        <path d={`M ${bx} ${top + 130} L ${bx + 10} ${top + 130} L ${bx + 5} ${top + 144} Z`}
              fill={color} stroke="#1a1a2a" strokeWidth="1" />
      </g>
    );
  });
  return (
    <g shapeRendering="crispEdges">
      <rect x="0" y={top} width={width} height={h * 0.45} fill="#74bce8" />
      <rect x="0" y={top + h * 0.45} width={width} height={h * 0.55} fill="#9ad4f0" />
      {clouds}
      {/* Bunting string lines (subtle) */}
      <rect x="0" y={top + 88} width={width} height="1" fill="#1a1a2a" opacity="0.4" />
      <rect x="0" y={top + 128} width={width} height="1" fill="#1a1a2a" opacity="0.4" />
      {bunting}
      {bunting2}
    </g>
  );
}

// Highland horizon — Taal silhouette + crater lake visible on distant ridge
export function HighlandHorizonBand({ width = 900, top = 180, bottom = 340 }: { width?: number; top?: number; bottom?: number }) {
  const h = bottom - top;
  return (
    <g shapeRendering="crispEdges">
      {/* Far mountain ridge (lightest) */}
      <path
        d={`M 0 ${top + h}
            L 0 ${top + 70} L 140 ${top + 30} L 240 ${top + 60}
            L 360 ${top + 20} L 520 ${top + 48} L 660 ${top + 20}
            L 780 ${top + 54} L ${width} ${top + 32} L ${width} ${top + h} Z`}
        fill="#7a96b0"
      />
      {/* Mid ridge with crater lake visible on a nearer summit */}
      <path
        d={`M 0 ${top + h}
            L 60 ${top + 110} L 200 ${top + 82}
            L 340 ${top + 120} L 440 ${top + 70}
            L 560 ${top + 110} L 700 ${top + 80}
            L 820 ${top + 120} L ${width} ${top + 90}
            L ${width} ${top + h} Z`}
        fill="#5a7494"
      />
      {/* Nearest ridge */}
      <path
        d={`M 0 ${top + h}
            L 0 ${top + 140} L 180 ${top + 150}
            L 380 ${top + 130} L 580 ${top + 152}
            L 760 ${top + 138} L ${width} ${top + h} Z`}
        fill="#3a5474"
      />
      {/* Taal volcano summit on the nearest ridge — crater bowl */}
      <path
        d={`M 400 ${top + 130} L 440 ${top + 70} L 510 ${top + 78}
            L 560 ${top + 136} Z`}
        fill="#4a6686" stroke="#1a2434" strokeWidth="1.5"
      />
      <path d={`M 440 ${top + 70} L 510 ${top + 78} L 494 ${top + 86} L 454 ${top + 82} Z`}
            fill="#2a3c54" />
      {/* Tiny crater lake inside */}
      <ellipse cx="472" cy={top + 80} rx="16" ry="3" fill="#5ea0d8" />
      <rect x="462" y={top + 79} width="20" height="1" fill="#80c0f0" opacity="0.7" />
      {/* Steam puff */}
      <motion.g
        animate={{ y: [0, -18, -28], opacity: [0.7, 0.3, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <rect x="467" y={top + 66} width="10" height="4" fill="#d4dce4" />
        <rect x="464" y={top + 62} width="14" height="4" fill="#d4dce4" />
      </motion.g>
      {/* Distant pines on ridges */}
      {[60, 200, 340, 560, 780].map((px, i) => {
        const ry = top + 110 + ((i * 7) % 10);
        return (
          <path key={i}
            d={`M ${px - 4} ${ry} L ${px} ${ry - 10} L ${px + 4} ${ry} Z`}
            fill="#2a5030" />
        );
      })}
    </g>
  );
}

// Carnival ground band — painted tile with checker accents + arrows
// Supports optional `x` offset so it can be bounded to a horizontal slice
export function CarnivalGroundBand({ x = 0, width = 900, top = 320, bottom = 700 }: { x?: number; width?: number; top?: number; bottom?: number }) {
  const h = bottom - top;
  const tilesAcross = Math.max(1, Math.floor(width / 16));
  return (
    <g shapeRendering="crispEdges">
      <rect x={x} y={top} width={width} height={h} fill="#b8d878" />
      <rect x={x} y={top} width={width} height="4" fill="#c8e490" />
      {/* Main concourse — a lighter horizontal band */}
      <rect x={x} y={top + 140} width={width} height="80" fill="#e0c878" />
      <rect x={x} y={top + 140} width={width} height="3" fill="#d0b868" />
      <rect x={x} y={top + 218} width={width} height="3" fill="#a89858" />
      {/* Checkerboard trim on concourse edges */}
      {Array.from({ length: tilesAcross }).map((_, i) => (
        <rect key={`c1${i}`} x={x + i * 16} y={top + 136} width="16" height="4"
              fill={i % 2 === 0 ? "#e05050" : "#ffffff"} />
      ))}
      {Array.from({ length: tilesAcross }).map((_, i) => (
        <rect key={`c2${i}`} x={x + i * 16} y={top + 220} width="16" height="4"
              fill={i % 2 === 0 ? "#ffffff" : "#e05050"} />
      ))}
      {/* Confetti pixels on the ground */}
      {Array.from({ length: 50 }).map((_, i) => {
        const colors = ["#ff4060", "#ffa030", "#ffe040", "#40c860", "#4090e0", "#c060e0"];
        const dx = (i * 41 + 7) % width;
        const y = top + 14 + ((i * 17) % (h - 28));
        return <rect key={`cf${i}`} x={x + dx} y={y} width="2" height="1" fill={colors[i % colors.length]} opacity="0.8" />;
      })}
      {/* Grass tuft pixels */}
      {Array.from({ length: 60 }).map((_, i) => {
        const dx = (i * 29 + 11) % width;
        const y = top + 10 + ((i * 13) % 60);
        return <rect key={`g${i}`} x={x + dx} y={y} width="1" height="2" fill="#5aa030" opacity="0.7" />;
      })}
    </g>
  );
}

// Big Ferris Wheel — massive rotating wheel with 12 colored gondolas
export function BigFerrisWheel({ x, y }: { x: number; y: number }) {
  const radius = 90;
  const gondolaColors = ["#ff4060", "#ffa030", "#ffe040", "#40c860", "#40c0e0", "#a050e0", "#ff60c0", "#ff8040", "#80e040", "#60a0e0", "#c080ff", "#ff80a0"];
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="108" rx="32" ry="5" fill="#000" opacity="0.45" />
      {/* Support legs */}
      <rect x="-3" y="0" width="6" height="108" fill="#a02020" stroke="#1a1a2a" strokeWidth="1.5" />
      <path d="M -32 108 L 0 20 L 32 108 Z" fill="none" stroke="#a02020" strokeWidth="3" />
      <rect x="-34" y="104" width="68" height="10" fill="#6b1010" stroke="#1a1a2a" strokeWidth="2" />
      {/* Rotating wheel */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "0px 0px" }}
      >
        {/* Outer rim — 3 concentric circles for thick rim */}
        <circle cx="0" cy="0" r={radius} fill="none" stroke="#ffffff" strokeWidth="4" />
        <circle cx="0" cy="0" r={radius} fill="none" stroke="#ff4060" strokeWidth="2" strokeDasharray="6 4" />
        <circle cx="0" cy="0" r={radius - 6} fill="none" stroke="#ffffff" strokeWidth="1.5" />
        {/* 12 spokes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const ang = (i * 30 * Math.PI) / 180;
          const x2 = Math.cos(ang) * radius;
          const y2 = Math.sin(ang) * radius;
          return <line key={`sp${i}`} x1="0" y1="0" x2={x2} y2={y2} stroke="#ffffff" strokeWidth="2" />;
        })}
        {/* 12 gondolas hanging at the outer rim, counter-rotate to stay upright */}
        {Array.from({ length: 12 }).map((_, i) => {
          const ang = (i * 30 * Math.PI) / 180;
          const cx = Math.cos(ang) * radius;
          const cy = Math.sin(ang) * radius;
          return (
            <motion.g key={`gd${i}`}
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            >
              <rect x={cx - 1} y={cy - 8} width="2" height="8" fill="#ffffff" />
              <rect x={cx - 8} y={cy} width="16" height="10" fill={gondolaColors[i]} stroke="#1a1a2a" strokeWidth="1.5" />
              <rect x={cx - 7} y={cy + 1} width="14" height="2" fill="#ffffff" opacity="0.6" />
              <rect x={cx - 6} y={cy + 3} width="4" height="4" fill="#1a1a2a" />
              <rect x={cx + 2} y={cy + 3} width="4" height="4" fill="#1a1a2a" />
            </motion.g>
          );
        })}
        {/* Hub */}
        <circle cx="0" cy="0" r="12" fill="#ffffff" stroke="#1a1a2a" strokeWidth="2" />
        <circle cx="0" cy="0" r="8" fill="#ff4060" stroke="#1a1a2a" strokeWidth="1.5" />
        <rect x="-1" y="-8" width="2" height="16" fill="#ffffff" />
        <rect x="-8" y="-1" width="16" height="2" fill="#ffffff" />
      </motion.g>
      {/* Pennant flag on top */}
      <rect x="-1" y="-106" width="2" height="16" fill="#1a1a2a" />
      <path d="M 1 -106 L 14 -102 L 1 -98 Z" fill="#ff4060" stroke="#1a1a2a" strokeWidth="1" />
    </g>
  );
}

// Viking Ship — pendulum pirate ride, animated swing
export function VikingShip({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="86" rx="44" ry="5" fill="#000" opacity="0.45" />
      {/* Ground base */}
      <rect x="-40" y="80" width="80" height="8" fill="#6b4020" stroke="#1a1a2a" strokeWidth="2" />
      {/* A-frame support */}
      <path d="M -28 80 L 0 -40 L 28 80" fill="none" stroke="#c8c8d0" strokeWidth="4" />
      <path d="M -28 80 L 0 -40 L 28 80" fill="none" stroke="#1a1a2a" strokeWidth="1" />
      {/* Cross support */}
      <rect x="-14" y="0" width="28" height="3" fill="#c8c8d0" stroke="#1a1a2a" strokeWidth="0.5" />
      {/* Pivot */}
      <circle cx="0" cy="-34" r="4" fill="#1a1a2a" />
      <circle cx="0" cy="-34" r="2" fill="#ffd050" />
      {/* Swinging ship — pendulum motion */}
      <motion.g
        animate={{ rotate: [-38, 38, -38] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "0px -34px" }}
      >
        {/* Rope to boat */}
        <rect x="-1" y="-30" width="2" height="70" fill="#404048" />
        {/* Boat hull */}
        <path d="M -36 40 L 36 40 L 30 56 L -30 56 Z" fill="#8b5833" stroke="#1a1a2a" strokeWidth="2" />
        <path d="M -36 40 L 36 40 L 32 46 L -32 46 Z" fill="#b8804a" />
        {/* Planks */}
        <rect x="-34" y="46" width="68" height="1" fill="#5a3a1a" />
        <rect x="-34" y="50" width="68" height="1" fill="#5a3a1a" />
        {/* Figurehead dragon prow */}
        <path d="M -40 40 L -36 32 L -32 40 Z" fill="#c8c8d0" stroke="#1a1a2a" strokeWidth="1" />
        <rect x="-38" y="34" width="2" height="2" fill="#e04040" />
        {/* Shields row along the hull */}
        {["#e04040", "#4090e0", "#40c860", "#e04040", "#ffe040", "#4090e0"].map((c, i) => (
          <g key={i} transform={`translate(${-24 + i * 10}, 44)`}>
            <rect x="-3" y="-4" width="6" height="8" fill={c} stroke="#1a1a2a" strokeWidth="1" />
            <rect x="-3" y="-4" width="6" height="1" fill="#ffffff" opacity="0.5" />
          </g>
        ))}
        {/* Seats / people tops */}
        {[-18, -6, 6, 18].map((px, i) => (
          <g key={i}>
            <rect x={px - 3} y="30" width="6" height="6" fill={["#ff8040", "#40c0e0", "#ffe040", "#ff60a0"][i]} />
            <rect x={px - 2} y="28" width="4" height="4" fill="#f0c090" />
          </g>
        ))}
        {/* Mast + sail */}
        <rect x="-1" y="16" width="2" height="24" fill="#404048" />
        <path d="M 1 18 L 18 26 L 1 34 Z" fill="#e04040" stroke="#1a1a2a" strokeWidth="1" />
        <rect x="1" y="22" width="17" height="2" fill="#ffffff" />
        <rect x="1" y="28" width="17" height="2" fill="#ffffff" />
      </motion.g>
      {/* Sign */}
      <rect x="-28" y="88" width="56" height="10" fill="#1a1a2a" />
      <rect x="-26" y="90" width="52" height="6" fill="#ffe040" />
      <text x="0" y="95" textAnchor="middle" fontSize="5" fill="#1a1a2a"
            fontFamily="'Press Start 2P', monospace">VIKING</text>
    </g>
  );
}

// Roller Coaster — colorful looping track with animated train running along it
export function RollerCoaster({ x, y, width = 360 }: { x: number; y: number; width?: number }) {
  // Build a pathString the cart follows
  const track = `M 0 40 Q 40 -40 100 0 Q 140 30 180 -20 Q 220 -60 260 -10 Q 300 30 ${width} 40`;
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx={width / 2} cy="50" rx={width / 2} ry="4" fill="#000" opacity="0.3" />
      {/* Support pillars */}
      {[50, 130, 220, 310].map((px, i) => (
        <g key={i}>
          <rect x={px - 3} y="-20" width="6" height="70" fill="#ffe040" stroke="#1a1a2a" strokeWidth="1.5" />
          <rect x={px - 5} y="-22" width="10" height="4" fill="#1a1a2a" />
          <rect x={px - 5} y="46" width="10" height="4" fill="#1a1a2a" />
          {/* Cross braces */}
          <line x1={px} y1="-18" x2={px + 40} y2="48" stroke="#ffe040" strokeWidth="1" />
          <line x1={px + 40} y1="-18" x2={px} y2="48" stroke="#ffe040" strokeWidth="1" />
        </g>
      ))}
      {/* Rails — white + red */}
      <path d={track} fill="none" stroke="#ffffff" strokeWidth="4" />
      <path d={track} fill="none" stroke="#ff4060" strokeWidth="2" />
      <path d={track} fill="none" stroke="#1a1a2a" strokeWidth="0.5" />
      {/* Ties */}
      {Array.from({ length: 14 }).map((_, i) => {
        const cx = (i / 13) * width;
        // approximate offset along track
        const cy = 40 + Math.sin((i / 13) * 3 * Math.PI) * 18;
        return <rect key={i} x={cx - 2} y={cy - 3} width="4" height="6" fill="#1a1a2a" />;
      })}
      {/* Animated train — 4 cars chasing along the path */}
      {[0, 0.1, 0.2, 0.3].map((offset, i) => (
        <motion.g key={i}
          animate={{ offsetDistance: ["0%", "100%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: offset * 6 }}
          style={{ offsetPath: `path("${track}")`, offsetRotate: "auto" }}
        >
          <g transform="translate(-8, -8)">
            <rect x="0" y="0" width="16" height="10" fill={["#ff4060", "#ffa030", "#ffe040", "#40c860"][i]} stroke="#1a1a2a" strokeWidth="1.5" />
            <rect x="0" y="0" width="16" height="2" fill="#ffffff" opacity="0.7" />
            <rect x="2" y="2" width="3" height="3" fill="#f0c090" />
            <rect x="7" y="2" width="3" height="3" fill="#f0c090" />
            <rect x="11" y="2" width="3" height="3" fill="#f0c090" />
            <circle cx="3" cy="10" r="2" fill="#1a1a2a" />
            <circle cx="13" cy="10" r="2" fill="#1a1a2a" />
          </g>
        </motion.g>
      ))}
      {/* Sign */}
      <rect x={width / 2 - 30} y="56" width="60" height="12" fill="#1a1a2a" />
      <rect x={width / 2 - 28} y="58" width="56" height="8"  fill="#ff4060" />
      <text x={width / 2} y="65" textAnchor="middle" fontSize="6" fill="#ffffff"
            fontFamily="'Press Start 2P', monospace">COASTER</text>
    </g>
  );
}

// Carousel — spinning horses under striped canopy
export function Carousel({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="48" rx="54" ry="6" fill="#000" opacity="0.45" />
      {/* Base platform */}
      <ellipse cx="0" cy="40" rx="50" ry="10" fill="#e08040" stroke="#1a1a2a" strokeWidth="2" />
      <ellipse cx="0" cy="38" rx="46" ry="8"  fill="#f09a50" />
      {/* Center pole */}
      <rect x="-3" y="-56" width="6" height="96" fill="#c8c8d0" stroke="#1a1a2a" strokeWidth="1" />
      {/* Canopy — striped cone */}
      <path d="M -56 -30 L 0 -70 L 56 -30 Z" fill="#e04040" stroke="#1a1a2a" strokeWidth="2" />
      {[-48, -32, -16, 0, 16, 32, 48].map((xs, i) => (
        <path key={i}
          d={`M ${xs} -30 L 0 -70 L ${xs + 8} -30 Z`}
          fill={i % 2 === 0 ? "#ffffff" : "#e04040"}
          stroke="#1a1a2a" strokeWidth="1"
        />
      ))}
      <rect x="-56" y="-30" width="112" height="6" fill="#ffe040" stroke="#1a1a2a" strokeWidth="2" />
      {/* Topper */}
      <rect x="-3" y="-78" width="6" height="8" fill="#ffe040" />
      <path d="M 3 -78 L 16 -74 L 3 -70 Z" fill="#4090e0" stroke="#1a1a2a" strokeWidth="1" />
      {/* Rotating horses */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "0px 0px" }}
      >
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const hx = Math.cos(rad) * 40;
          const hz = Math.sin(rad) * 12;
          const zDepth = (Math.sin(rad) + 1) / 2;
          const colors = ["#ffffff", "#f0c090", "#e0a080", "#ffd0a0", "#e8b898", "#d89080"];
          return (
            <motion.g key={i}
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
            >
              <g transform={`translate(${hx}, ${hz})`}>
                {/* Pole */}
                <rect x="-1" y="-26" width="2" height="48" fill="#ffe040" />
                {/* Horse body */}
                <rect x="-8" y="-4" width="16" height="10" fill={colors[i]} stroke="#1a1a2a" strokeWidth="1" />
                {/* Head */}
                <rect x="6" y="-10" width="8" height="8" fill={colors[i]} stroke="#1a1a2a" strokeWidth="1" />
                <rect x="12" y="-8" width="2" height="4" fill="#1a1a2a" />
                {/* Mane */}
                <rect x="4" y="-12" width="6" height="3" fill="#a04040" />
                {/* Tail */}
                <rect x="-10" y="-3" width="2" height="6" fill="#a04040" />
                {/* Legs */}
                <rect x="-6" y="6" width="2" height="6" fill="#8b5833" />
                <rect x="-2" y="6" width="2" height="6" fill="#8b5833" />
                <rect x="2" y="6" width="2" height="6" fill="#8b5833" />
                <rect x="6" y="6" width="2" height="6" fill="#8b5833" />
                {/* Saddle */}
                <rect x="-6" y="-4" width="10" height="3" fill="#e04040" />
              </g>
              <g transform={`translate(${hx}, ${hz})`} opacity={zDepth * 0.3}>
                <rect x="-10" y="12" width="20" height="2" fill="#000" />
              </g>
            </motion.g>
          );
        })}
      </motion.g>
      {/* Sign */}
      <rect x="-32" y="50" width="64" height="12" fill="#1a1a2a" />
      <rect x="-30" y="52" width="60" height="8"  fill="#ffe040" />
      <text x="0" y="59" textAnchor="middle" fontSize="6" fill="#1a1a2a"
            fontFamily="'Press Start 2P', monospace">CAROUSEL</text>
    </g>
  );
}

// Swing Ride — chain swings spinning around a central spire
export function SwingRide({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="70" rx="44" ry="5" fill="#000" opacity="0.45" />
      {/* Base */}
      <rect x="-32" y="62" width="64" height="8" fill="#6b4020" stroke="#1a1a2a" strokeWidth="2" />
      {/* Central spire */}
      <rect x="-5" y="-60" width="10" height="124" fill="#c8c8d0" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="-7" y="-62" width="14" height="4" fill="#ff4060" />
      <rect x="-2" y="-68" width="4" height="8" fill="#1a1a2a" />
      {/* Canopy */}
      <ellipse cx="0" cy="-36" rx="36" ry="10" fill="#ff4060" stroke="#1a1a2a" strokeWidth="1.5" />
      <ellipse cx="0" cy="-38" rx="32" ry="8"  fill="#ffffff" />
      {/* Rotating spinning hub with swings */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "0px -36px" }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const sx = Math.cos(rad) * 44;
          const sy = -36 + Math.sin(rad) * 14;
          const colors = ["#40c0e0", "#ffe040", "#e04040", "#40c860", "#c060e0", "#ff8040", "#4090e0", "#ff60a0"];
          return (
            <g key={i}>
              {/* Chain */}
              <line x1="0" y1="-36" x2={sx} y2={sy + 30} stroke="#606068" strokeWidth="1" />
              {/* Seat */}
              <rect x={sx - 4} y={sy + 28} width="8" height="4" fill={colors[i]} stroke="#1a1a2a" strokeWidth="1" />
              {/* Rider */}
              <rect x={sx - 2} y={sy + 24} width="4" height="4" fill="#f0c090" />
            </g>
          );
        })}
      </motion.g>
      {/* Sign */}
      <rect x="-28" y="72" width="56" height="12" fill="#1a1a2a" />
      <rect x="-26" y="74" width="52" height="8"  fill="#40c0e0" />
      <text x="0" y="81" textAnchor="middle" fontSize="6" fill="#ffffff"
            fontFamily="'Press Start 2P', monospace">SWING</text>
    </g>
  );
}

// Carnival ticket booth — red-and-white striped
export function TicketBooth({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="32" rx="30" ry="5" fill="#000" opacity="0.4" />
      {/* Striped roof */}
      <rect x="-30" y="-30" width="60" height="10" fill="#ffffff" stroke="#1a1a2a" strokeWidth="2" />
      {["#e04040", "#ffffff"].map((_, i) =>
        Array.from({ length: 6 }).map((_, j) => (
          <rect key={`${i}-${j}`} x={-28 + j * 10} y="-28" width="5" height="6" fill={j % 2 === 0 ? "#e04040" : "#ffffff"} />
        ))
      )}
      <path d="M -30 -30 L 0 -42 L 30 -30 Z" fill="#e04040" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-2" y="-50" width="4" height="10" fill="#ffe040" />
      <path d="M 2 -48 L 14 -44 L 2 -40 Z" fill="#e04040" stroke="#1a1a2a" strokeWidth="1" />
      {/* Booth body */}
      <rect x="-26" y="-20" width="52" height="50" fill="#ffffff" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-26" y="-20" width="52" height="6"  fill="#e04040" />
      {/* Stripes down sides */}
      <rect x="-26" y="-14" width="6" height="44" fill="#e04040" />
      <rect x="20"  y="-14" width="6" height="44" fill="#e04040" />
      {/* Window */}
      <rect x="-16" y="-10" width="32" height="18" fill="#a0e0f0" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="0"   y="-10" width="1"  height="18" fill="#1a1a2a" />
      {/* Attendant head */}
      <circle cx="-4" cy="-2" r="3" fill="#f0c090" />
      <rect x="-7" y="-4" width="8" height="2" fill="#6b4020" />
      {/* Sign */}
      <rect x="-20" y="12" width="40" height="14" fill="#1a1a2a" />
      <rect x="-18" y="14" width="36" height="10" fill="#ffe040" />
      <text x="0" y="22" textAnchor="middle" fontSize="7" fill="#1a1a2a"
            fontFamily="'Press Start 2P', monospace">TICKETS</text>
    </g>
  );
}

// Carnival food stall — striped canopy with menu board
export function CarnivalStall({ x, y, color = "#40c0e0", label = "SNACKS" }: { x: number; y: number; color?: string; label?: string }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="30" rx="28" ry="4" fill="#000" opacity="0.4" />
      {/* Striped canopy */}
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={-24 + i * 8} y="-18" width="8" height="10" fill={i % 2 === 0 ? color : "#ffffff"} stroke="#1a1a2a" strokeWidth="1" />
      ))}
      <rect x="-28" y="-20" width="56" height="3" fill="#1a1a2a" />
      <path d="M -28 -18 L -34 -10 M 28 -18 L 34 -10" stroke="#1a1a2a" strokeWidth="1.5" />
      {/* Counter */}
      <rect x="-24" y="-8" width="48" height="24" fill="#c08040" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-24" y="-8" width="48" height="3"  fill="#e0a060" />
      <rect x="-24" y="12" width="48" height="4"  fill="#8b5020" />
      {/* Menu board */}
      <rect x="-20" y="-6" width="16" height="14" fill="#1a1a2a" stroke="#1a1a2a" strokeWidth="1" />
      <rect x="-19" y="-5" width="14" height="12" fill="#ffffff" />
      <rect x="-17" y="-3" width="10" height="1" fill="#1a1a2a" />
      <rect x="-17" y="0"  width="8"  height="1" fill="#1a1a2a" />
      <rect x="-17" y="3"  width="10" height="1" fill="#1a1a2a" />
      {/* Items on counter */}
      <circle cx="4"  cy="-2" r="3" fill="#ffe040" stroke="#1a1a2a" strokeWidth="1" />
      <circle cx="12" cy="-2" r="3" fill="#ff6080" stroke="#1a1a2a" strokeWidth="1" />
      {/* Attendant head */}
      <circle cx="18" cy="-4" r="3" fill="#f0c090" />
      {/* Label */}
      <rect x="-20" y="16" width="40" height="10" fill="#1a1a2a" />
      <rect x="-18" y="18" width="36" height="6"  fill="#ffe040" />
      <text x="0" y="23" textAnchor="middle" fontSize="5" fill="#1a1a2a"
            fontFamily="'Press Start 2P', monospace">{label}</text>
    </g>
  );
}

// Cotton candy cart
export function CottonCandyCart({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="26" rx="22" ry="3" fill="#000" opacity="0.4" />
      {/* Cart body */}
      <rect x="-18" y="0" width="36" height="20" fill="#ff80c0" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-18" y="0" width="36" height="4"  fill="#ffa0d0" />
      <rect x="-18" y="10" width="36" height="2" fill="#1a1a2a" opacity="0.3" />
      {/* Wheels */}
      <circle cx="-12" cy="22" r="4" fill="#1a1a2a" />
      <circle cx="-12" cy="22" r="2" fill="#808088" />
      <circle cx="12"  cy="22" r="4" fill="#1a1a2a" />
      <circle cx="12"  cy="22" r="2" fill="#808088" />
      {/* Handle */}
      <rect x="16" y="-2" width="12" height="2" fill="#606068" />
      {/* Cotton candy sticks */}
      <rect x="-14" y="-14" width="2" height="14" fill="#8b5833" />
      <rect x="-2"  y="-16" width="2" height="16" fill="#8b5833" />
      <rect x="10"  y="-14" width="2" height="14" fill="#8b5833" />
      {/* Pink candy puffs */}
      <circle cx="-13" cy="-16" r="6" fill="#ffb0e0" />
      <circle cx="-11" cy="-18" r="4" fill="#ffd0f0" />
      <circle cx="-1"  cy="-18" r="6" fill="#ffe0c0" />
      <circle cx="1"   cy="-20" r="4" fill="#fff0d0" />
      <circle cx="11"  cy="-16" r="6" fill="#a0d0ff" />
      <circle cx="13"  cy="-18" r="4" fill="#c0e0ff" />
      {/* Sign on front */}
      <rect x="-14" y="4" width="28" height="6" fill="#1a1a2a" />
      <text x="0" y="9" textAnchor="middle" fontSize="4" fill="#ffe040"
            fontFamily="'Press Start 2P', monospace">COTTON!</text>
    </g>
  );
}

// Balloon bunch — 5 colored balloons with strings
export function BalloonBunch({ x, y }: { x: number; y: number }) {
  const colors = ["#ff4060", "#ffa030", "#ffe040", "#40c860", "#4090e0"];
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {colors.map((c, i) => {
          const bx = (i - 2) * 6;
          const by = -((i % 3) * 3);
          return (
            <g key={i}>
              <ellipse cx={bx} cy={by - 14} rx="5" ry="6" fill={c} stroke="#1a1a2a" strokeWidth="1" />
              <rect x={bx - 1} y={by - 9} width="2" height="2" fill={c} />
              <path d={`M ${bx} ${by - 7} Q ${bx - 2} ${by + 10} 0 30`} stroke="#606068" strokeWidth="1" fill="none" />
              <rect x={bx - 2} y={by - 16} width="1" height="1" fill="#ffffff" opacity="0.8" />
            </g>
          );
        })}
        {/* Grip */}
        <rect x="-1" y="28" width="2" height="6" fill="#1a1a2a" />
      </motion.g>
    </g>
  );
}

// Rising balloon — single balloon drifting up slowly
export function RisingBalloon({ x, startY = 650, endY = -60, color = "#ff4060", delay = 0, duration = 18 }: { x: number; startY?: number; endY?: number; color?: string; delay?: number; duration?: number }) {
  return (
    <motion.g
      initial={{ y: startY }}
      animate={{ y: endY, x: [0, 6, -6, 0] }}
      transition={{ y: { duration, repeat: Infinity, ease: "linear", delay }, x: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
    >
      <g transform={`translate(${x}, 0)`} shapeRendering="crispEdges">
        <ellipse cx="0" cy="0" rx="6" ry="8" fill={color} stroke="#1a1a2a" strokeWidth="1" />
        <rect x="-1" y="7" width="2" height="2" fill={color} />
        <path d="M 0 9 Q -2 24 0 40" stroke="#606068" strokeWidth="1" fill="none" />
        <rect x="-2" y="-4" width="1" height="1" fill="#ffffff" opacity="0.8" />
      </g>
    </motion.g>
  );
}

// Fireworks-style confetti burst (daytime) — colorful puff animating out
export function ConfettiBurst({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  const colors = ["#ff4060", "#ffa030", "#ffe040", "#40c860", "#4090e0", "#c060e0"];
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      {colors.map((c, i) => {
        const ang = (i * 60 * Math.PI) / 180;
        const dx = Math.cos(ang) * 24;
        const dy = Math.sin(ang) * 24;
        return (
          <motion.rect
            key={i}
            x={-1} y={-1} width="3" height="3"
            fill={c}
            initial={{ x: -1, y: -1, opacity: 0 }}
            animate={{ x: [-1, dx], y: [-1, dy], opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3, delay: delay + i * 0.02 }}
          />
        );
      })}
      {/* Center sparkle */}
      <motion.rect
        x={-2} y={-2} width="4" height="4" fill="#ffffff"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 3.8, delay }}
      />
    </g>
  );
}

// Carnival crowd silhouette — row of tiny people with shuffling motion
export function CarnivalCrowd({ x, y, count = 8 }: { x: number; y: number; count?: number }) {
  const hair = ["#1a1a2a", "#6b4020", "#d8c080", "#e04040", "#40c0e0"];
  const shirts = ["#ff4060", "#ffa030", "#ffe040", "#40c860", "#4090e0", "#c060e0", "#ff80c0", "#40e0c0"];
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      {Array.from({ length: count }).map((_, i) => {
        const px = i * 16;
        const h = hair[i % hair.length];
        const s = shirts[i % shirts.length];
        return (
          <motion.g
            key={i}
            animate={{ y: [0, -1, 0] }}
            transition={{ duration: 0.7 + (i % 3) * 0.12, repeat: Infinity, ease: "easeInOut", delay: (i * 0.15) % 1 }}
          >
            <g transform={`translate(${px}, 0)`}>
              {/* Head */}
              <rect x="-3" y="-12" width="6" height="6" fill="#f0c090" stroke="#1a1a2a" strokeWidth="0.6" />
              <rect x="-3" y="-12" width="6" height="2" fill={h} />
              {/* Body */}
              <rect x="-4" y="-6"  width="8" height="8" fill={s} stroke="#1a1a2a" strokeWidth="0.6" />
              {/* Legs */}
              <rect x="-3" y="2"   width="2" height="6" fill="#2a2a44" />
              <rect x="1"  y="2"   width="2" height="6" fill="#2a2a44" />
            </g>
          </motion.g>
        );
      })}
    </g>
  );
}

// Stone entry arch — "SKY RANCH" gateway separating two terrains
export function ParkGatewayArch({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="170" rx="54" ry="7" fill="#000" opacity="0.5" />
      {/* Left pillar */}
      <rect x="-52" y="-60" width="24" height="230" fill="#908478" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-50" y="-58" width="20" height="6"   fill="#b4a898" />
      <rect x="-52" y="160" width="24" height="10" fill="#685c50" stroke="#1a1a2a" strokeWidth="2" />
      {/* Right pillar */}
      <rect x="28" y="-60" width="24" height="230" fill="#908478" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="30" y="-58" width="20" height="6"   fill="#b4a898" />
      <rect x="28" y="160" width="24" height="10" fill="#685c50" stroke="#1a1a2a" strokeWidth="2" />
      {/* Stone-block pattern on the pillars */}
      {Array.from({ length: 10 }).map((_, r) => (
        <g key={r}>
          <rect x="-52" y={-52 + r * 22} width="24" height="1" fill="#5a5044" opacity="0.8" />
          <rect x="28"  y={-52 + r * 22} width="24" height="1" fill="#5a5044" opacity="0.8" />
          <rect x={r % 2 === 0 ? -40 : -52} y={-40 + r * 22} width="1" height="22" fill="#5a5044" opacity="0.8" />
          <rect x={r % 2 === 0 ?  40 :  28} y={-40 + r * 22} width="1" height="22" fill="#5a5044" opacity="0.8" />
        </g>
      ))}
      {/* Top beam */}
      <rect x="-60" y="-76" width="120" height="22" fill="#908478" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-60" y="-76" width="120" height="4"  fill="#b4a898" />
      {/* Sign board */}
      <rect x="-46" y="-70" width="92" height="12" fill="#1a1a2a" stroke="#1a1a2a" strokeWidth="1" />
      <rect x="-44" y="-68" width="88" height="8"  fill="#ff4060" />
      <text x="0" y="-62" textAnchor="middle" fontSize="6" fill="#ffffff"
            fontFamily="'Press Start 2P', monospace">SKY RANCH</text>
      {/* Roof — striped triangle with flagpole */}
      <path d="M -60 -76 L 0 -100 L 60 -76 Z" fill="#e04040" stroke="#1a1a2a" strokeWidth="2" />
      {[-48, -32, -16, 0, 16, 32, 48].map((sx, i) => (
        <path key={i}
          d={`M ${sx} -76 L 0 -100 L ${sx + 8} -76 Z`}
          fill={i % 2 === 0 ? "#ffffff" : "#e04040"}
          stroke="#1a1a2a" strokeWidth="1"
        />
      ))}
      <rect x="-2" y="-112" width="4" height="14" fill="#1a1a2a" />
      <path d="M 2 -112 L 18 -106 L 2 -100 Z" fill="#ffe040" stroke="#1a1a2a" strokeWidth="1" />
      {/* Arch opening (visual — path is still walkable) */}
      <rect x="-28" y="-54" width="56" height="6" fill="#2a2030" />
      {/* Subtle glow through the arch */}
      <motion.rect
        x="-28" y="-48" width="56" height="208" fill="#ffe066" opacity="0.08"
        animate={{ opacity: [0.06, 0.16, 0.06] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Bunting streamers off the sides */}
      {[-58, -50, -42, 38, 46, 54].map((bx, i) => (
        <g key={i}>
          <path d={`M ${bx} -72 L ${bx + 4} -72 L ${bx + 2} -66 Z`}
                fill={["#ff4060", "#ffe040", "#40c860", "#4090e0", "#c060e0", "#ffa030"][i]}
                stroke="#1a1a2a" strokeWidth="0.5" />
        </g>
      ))}
    </g>
  );
}

// Cliff railing — short wooden railing segments (for viewing deck)
export function CliffRailing({ x, y, segments = 6 }: { x: number; y: number; segments?: number }) {
  const spacing = 18;
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      {/* Top rail */}
      <rect x="0" y="-8" width={segments * spacing} height="3" fill="#8b5833" stroke="#3a2010" strokeWidth="1" />
      {/* Middle rail */}
      <rect x="0" y="-2" width={segments * spacing} height="2" fill="#8b5833" stroke="#3a2010" strokeWidth="0.5" />
      {/* Posts */}
      {Array.from({ length: segments + 1 }).map((_, i) => (
        <g key={i}>
          <rect x={i * spacing - 1} y="-14" width="3" height="22" fill="#6b4020" stroke="#3a2010" strokeWidth="0.5" />
          <rect x={i * spacing - 2} y="-14" width="5" height="3" fill="#5a3010" />
        </g>
      ))}
    </g>
  );
}

// ── Day 4 pixel-art landmark pack (rice paddy + river + studio homage) ──

// Sunny countryside sky — warm blue + fluffy clouds + a rainbow arc
export function CountrysideSkyBand({ width = 900, top = 0, bottom = 220 }: { width?: number; top?: number; bottom?: number }) {
  const h = bottom - top;
  const clouds: React.ReactElement[] = [];
  const cloudSpots: [number, number, number][] = [
    [120, 40, 3], [380, 28, 4], [640, 50, 3], [800, 38, 4],
  ];
  for (const [cx, cy, sz] of cloudSpots) {
    clouds.push(
      <g key={`cl${cx}`}>
        <rect x={cx}     y={top + cy}     width={sz * 14} height={sz * 3} fill="#ffffff" />
        <rect x={cx + sz * 2}  y={top + cy - sz * 2} width={sz * 10} height={sz * 3} fill="#ffffff" />
        <rect x={cx + sz * 5}  y={top + cy - sz * 4} width={sz * 6}  height={sz * 3} fill="#ffffff" />
        <rect x={cx}     y={top + cy + sz * 2} width={sz * 14} height={sz} fill="#e4ecf0" opacity="0.8" />
      </g>
    );
  }
  return (
    <g shapeRendering="crispEdges">
      {/* Banded sunny gradient */}
      <rect x="0" y={top}             width={width} height={h * 0.4} fill="#8cd4f0" />
      <rect x="0" y={top + h * 0.4}   width={width} height={h * 0.3} fill="#a8dff0" />
      <rect x="0" y={top + h * 0.7}   width={width} height={h * 0.3} fill="#c4eaf0" />
      {/* Arc of rainbow — 7 horizontal arc rects, offset from centre */}
      {[
        ["#ff4040", 0],   ["#ff9030", 3], ["#ffd040", 6],
        ["#40d040", 9],   ["#4080e0", 12], ["#6040c8", 15], ["#a040c8", 18],
      ].map(([color, offset], i) => (
        <rect
          key={i}
          x={width * 0.15}
          y={top + 30 + Number(offset)}
          width={width * 0.7}
          height="3"
          fill={color as string}
          opacity="0.55"
          rx="120"
        />
      ))}
      {clouds}
    </g>
  );
}

// Rolling hills band — 3 staggered hill silhouettes with grass texture
export function RollingHillsBand({ width = 900, top = 180, bottom = 360 }: { width?: number; top?: number; bottom?: number }) {
  const h = bottom - top;
  return (
    <g shapeRendering="crispEdges">
      {/* Farthest hills (lightest green) */}
      <path
        d={`M 0 ${top + h}
            Q 80 ${top + 30}  160 ${top + 60}
            Q 260 ${top + 10} 360 ${top + 50}
            Q 460 ${top + 20} 560 ${top + 60}
            Q 680 ${top + 30} 800 ${top + 50}
            Q 880 ${top + 20} ${width} ${top + 60}
            L ${width} ${top + h} Z`}
        fill="#9cd070"
      />
      {/* Mid hills */}
      <path
        d={`M 0 ${top + h}
            Q 100 ${top + 90} 220 ${top + 110}
            Q 340 ${top + 70} 460 ${top + 100}
            Q 580 ${top + 90} 700 ${top + 110}
            Q 820 ${top + 80} ${width} ${top + 100}
            L ${width} ${top + h} Z`}
        fill="#7cbc5c"
      />
      {/* Near hills (darkest, forms the grass floor base) */}
      <path
        d={`M 0 ${top + h}
            Q 120 ${top + 150} 260 ${top + 140}
            Q 400 ${top + 170} 540 ${top + 150}
            Q 680 ${top + 170} 820 ${top + 140}
            Q ${width} ${top + 160} ${width} ${top + h}
            Z`}
        fill="#5ea448"
      />
      {/* Grass tuft pixels on near hill */}
      {Array.from({ length: 60 }).map((_, i) => {
        const x = (i * 31 + 7) % width;
        const y = top + h - 14 - ((i * 7) % 30);
        return <rect key={i} x={x} y={y} width="2" height="1" fill="#3d8024" opacity="0.7" />;
      })}
    </g>
  );
}

// Meadow floor band — bright grass with flower accent pixels
// Supports an optional `x` offset so it can be bounded to a horizontal slice
export function MeadowBand({ x = 0, width = 900, top = 340, bottom = 700 }: { x?: number; width?: number; top?: number; bottom?: number }) {
  const h = bottom - top;
  const dots: React.ReactElement[] = [];
  const flowerColors = ["#ff80c0", "#ffe066", "#ffffff", "#c070e0"];
  for (let i = 0; i < 80; i++) {
    const dx = (i * 37 + 11) % width;
    const y = top + 12 + ((i * 19) % (h - 20));
    dots.push(<rect key={`g${i}`} x={x + dx} y={y} width="1" height="2" fill="#3d8024" opacity="0.6" />);
  }
  for (let i = 0; i < 40; i++) {
    const dx = (i * 47 + 23) % width;
    const y = top + 14 + ((i * 23) % (h - 30));
    dots.push(<rect key={`f${i}`} x={x + dx} y={y} width="2" height="2" fill={flowerColors[i % flowerColors.length]} opacity="0.8" />);
  }
  return (
    <g shapeRendering="crispEdges">
      <rect x={x} y={top} width={width} height={h} fill="#7cc850" />
      <rect x={x} y={top} width={width} height="4" fill="#8ed862" />
      {/* Tile seams */}
      {Array.from({ length: Math.floor(h / 20) }).map((_, r) => (
        <rect key={`hs${r}`} x={x} y={top + r * 20} width={width} height="1" fill="#6ab040" opacity="0.35" />
      ))}
      {dots}
    </g>
  );
}

// River band — horizontal flowing water with sparkle
export function RiverBand({ x = 0, y, width = 900, height = 50 }: { x?: number; y: number; width?: number; height?: number }) {
  return (
    <g shapeRendering="crispEdges">
      {/* Bank shadow top + bottom */}
      <rect x={x} y={y - 2} width={width} height="2" fill="#4a7020" />
      <rect x={x} y={y + height} width={width} height="2" fill="#4a7020" />
      {/* Water base */}
      <rect x={x} y={y} width={width} height={height} fill="#5ea0d8" />
      <rect x={x} y={y} width={width} height="3" fill="#74b4e8" />
      <rect x={x} y={y + height - 3} width={width} height="3" fill="#4a88c0" />
      {/* Sparkle + flow lines */}
      {Array.from({ length: 28 }).map((_, i) => {
        const sx = x + (i * 37 + 5) % width;
        const sy = y + 6 + ((i * 7) % (height - 10));
        return (
          <motion.rect
            key={i}
            x={sx} y={sy} width="3" height="1"
            fill="#ffffff"
            animate={{ x: [sx, sx + 20], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2 + (i % 3), repeat: Infinity, ease: "linear", delay: (i * 0.13) % 1.5 }}
          />
        );
      })}
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={`t${i}`} x={x} y={y + 10 + i * 5} width={width} height="1" fill="#4e8ac4" opacity="0.5" />
      ))}
    </g>
  );
}

// Rice paddy terrace — 4-step stacked paddies with rice plants
export function RicePaddyStack({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="80" rx="82" ry="7" fill="#000" opacity="0.3" />
      {[0, 1, 2, 3].map((i) => {
        const terraceW = 160 - i * 20;
        const terraceY = -30 + i * 22;
        return (
          <g key={i}>
            {/* Water/flooded paddy */}
            <rect
              x={-terraceW / 2}
              y={terraceY}
              width={terraceW}
              height="16"
              fill="#8cc8a0"
              stroke="#3a5a20"
              strokeWidth="1.5"
            />
            <rect
              x={-terraceW / 2 + 2}
              y={terraceY + 2}
              width={terraceW - 4}
              height="6"
              fill="#b4dcc4"
            />
            {/* Rice plants (vertical green ticks) */}
            {Array.from({ length: Math.floor(terraceW / 8) }).map((_, c) => (
              <rect
                key={c}
                x={-terraceW / 2 + 4 + c * 8}
                y={terraceY + 3}
                width="1"
                height="9"
                fill="#3d8024"
              />
            ))}
            {/* Paddy wall below */}
            <rect
              x={-terraceW / 2}
              y={terraceY + 16}
              width={terraceW}
              height="6"
              fill="#6b4020"
              stroke="#3a2010"
              strokeWidth="1"
            />
          </g>
        );
      })}
    </g>
  );
}

// Bamboo stilt hut — Filipino "bahay kubo" style
export function BambooHut({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="40" rx="40" ry="5" fill="#000" opacity="0.4" />
      {/* Stilts */}
      <rect x="-26" y="10"  width="4" height="30" fill="#8b5833" stroke="#3a2010" strokeWidth="1" />
      <rect x="22"  y="10"  width="4" height="30" fill="#8b5833" stroke="#3a2010" strokeWidth="1" />
      <rect x="-4"  y="10"  width="4" height="30" fill="#8b5833" stroke="#3a2010" strokeWidth="1" />
      {/* Floor */}
      <rect x="-34" y="6"   width="68" height="6"  fill="#5a3a1a" stroke="#3a2010" strokeWidth="1.5" />
      {/* Walls (bamboo strips) */}
      <rect x="-28" y="-18" width="56" height="24" fill="#c8a858" stroke="#3a2010" strokeWidth="1.5" />
      {[-24, -18, -12, -6, 0, 6, 12, 18, 24].map((xb, i) => (
        <rect key={i} x={xb} y={-18} width="1" height="24" fill="#8a7040" opacity="0.7" />
      ))}
      {/* Door */}
      <rect x="-6" y="-8" width="12" height="14" fill="#4a2a10" stroke="#3a2010" strokeWidth="1" />
      {/* Window */}
      <rect x="-22" y="-14" width="10" height="8" fill="#3a5a80" stroke="#3a2010" strokeWidth="1" />
      <rect x="10"  y="-14" width="10" height="8" fill="#3a5a80" stroke="#3a2010" strokeWidth="1" />
      {/* Thatched roof — triangle of brown strips */}
      <path d="M -36 -18 L 0 -42 L 36 -18 Z" fill="#b48040" stroke="#3a2010" strokeWidth="1.5" />
      {[-30, -22, -14, -6, 2, 10, 18, 26].map((xr, i) => (
        <rect key={i} x={xr} y={-24 + (i % 2) * 2} width="4" height="6" fill="#8b5833" opacity="0.75" />
      ))}
      <rect x="-4" y="-46" width="8" height="4" fill="#8b5833" />
    </g>
  );
}

// Carabao (water buffalo) — animated tail swish
export function Carabao({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="14" rx="20" ry="3" fill="#000" opacity="0.4" />
      {/* Body */}
      <rect x="-18" y="-4" width="36" height="14" fill="#3a3a44" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="-18" y="-4" width="36" height="3"  fill="#4a4a54" />
      {/* Legs */}
      <rect x="-16" y="10" width="4" height="6" fill="#2a2a34" />
      <rect x="-4"  y="10" width="4" height="6" fill="#2a2a34" />
      <rect x="6"   y="10" width="4" height="6" fill="#2a2a34" />
      <rect x="14"  y="10" width="4" height="6" fill="#2a2a34" />
      {/* Head */}
      <rect x="14" y="-10" width="14" height="10" fill="#3a3a44" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="14" y="-10" width="14" height="2"  fill="#4a4a54" />
      {/* Horns */}
      <path d="M 16 -10 Q 10 -20 24 -16 Z" fill="#d8c890" stroke="#1a1a2a" strokeWidth="1" />
      <path d="M 26 -10 Q 32 -20 18 -16 Z" fill="#d8c890" stroke="#1a1a2a" strokeWidth="1" />
      {/* Eye */}
      <rect x="22" y="-6" width="2" height="2" fill="#ffffff" />
      {/* Tail — animated swish */}
      <motion.g
        animate={{ rotate: [0, 18, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "-18px 0px" }}
      >
        <rect x="-26" y="-1" width="10" height="2" fill="#2a2a34" />
        <rect x="-28" y="-2" width="4"  height="4" fill="#2a2a34" />
      </motion.g>
    </g>
  );
}

// Wooden bridge — spans the river
export function WoodenArchBridge({ x, y, width = 120 }: { x: number; y: number; width?: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx={width / 2} cy="20" rx={width / 2 + 4} ry="4" fill="#000" opacity="0.3" />
      {/* Deck */}
      <path d={`M 0 10 Q ${width / 2} -14 ${width} 10 L ${width} 18 L 0 18 Z`} fill="#8b5833" stroke="#3a2010" strokeWidth="2" />
      {/* Planks */}
      {Array.from({ length: Math.floor(width / 10) }).map((_, i) => (
        <rect key={i} x={i * 10 + 2} y={10 - Math.round(Math.sin((i / (width / 10)) * Math.PI) * 10)} width="6" height="2" fill="#6b4020" />
      ))}
      {/* Railings */}
      <path d={`M 0 6 Q ${width / 2} -18 ${width} 6`} stroke="#6b4020" strokeWidth="2" fill="none" />
      {Array.from({ length: 6 }).map((_, i) => {
        const xp = (i / 5) * width;
        const yp = -Math.sin((xp / width) * Math.PI) * 20 + 10;
        return <rect key={i} x={xp - 1} y={yp - 8} width="2" height="10" fill="#6b4020" />;
      })}
    </g>
  );
}

// Willow tree — drooping branches
export function WillowTree({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="34" rx="28" ry="5" fill="#000" opacity="0.35" />
      {/* Trunk */}
      <rect x="-4" y="-6" width="8" height="40" fill="#6b4020" stroke="#3a2010" strokeWidth="1.5" />
      <rect x="-4" y="10" width="8" height="2" fill="#3a2010" />
      {/* Canopy */}
      <ellipse cx="0" cy="-24" rx="28" ry="18" fill="#9acc5c" stroke="#1a1a2a" strokeWidth="1.5" />
      <ellipse cx="-6" cy="-28" rx="16" ry="10" fill="#b4dc80" />
      {/* Drooping strands */}
      {[-24, -16, -8, 0, 8, 16, 24].map((dx, i) => (
        <g key={i}>
          <rect x={dx} y="-12" width="1" height={14 + (i % 3) * 4} fill="#9acc5c" />
          <rect x={dx} y={-12 + 14 + (i % 3) * 4 - 2} width="2" height="2" fill="#b4dc80" />
        </g>
      ))}
    </g>
  );
}

// Lily pad with frog — frog animated jump
export function LilyPadFrog({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      {/* Pad */}
      <ellipse cx="0" cy="0" rx="12" ry="6" fill="#3d8b3d" stroke="#1a4a1a" strokeWidth="1.5" />
      <rect x="-1" y="-5" width="2" height="10" fill="#5ea450" />
      {/* Small flower */}
      <circle cx="8" cy="-1" r="2" fill="#f0a0c0" />
      <circle cx="8" cy="-1" r="1" fill="#ffe066" />
      {/* Frog */}
      <motion.g
        animate={{ y: [0, -10, 0, 0], x: [0, 2, -1, 0] }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.2, 1], ease: "easeOut" }}
      >
        <ellipse cx="-3" cy="-3" rx="4" ry="3" fill="#40a040" stroke="#1a4a1a" strokeWidth="1" />
        <circle cx="-5" cy="-5" r="1.2" fill="#40a040" />
        <circle cx="-1" cy="-5" r="1.2" fill="#40a040" />
        <rect x="-5" y="-5" width="1" height="1" fill="#ffffff" />
        <rect x="-1" y="-5" width="1" height="1" fill="#ffffff" />
      </motion.g>
    </g>
  );
}

// Duck on water — animated bob + left-to-right swim
export function Duck({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <motion.g
      initial={{ x: x - 100 }}
      animate={{ x: x + 800 }}
      transition={{ duration: 35, repeat: Infinity, ease: "linear", delay }}
    >
      <motion.g
        animate={{ y: [y, y - 1, y] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <g shapeRendering="crispEdges">
          <ellipse cx="0" cy="2" rx="8" ry="3" fill="#000" opacity="0.3" />
          <rect x="-6" y="-4" width="12" height="6" fill="#ffffff" stroke="#1a1a2a" strokeWidth="1.5" />
          <rect x="-6" y="-4" width="12" height="2" fill="#f0f0f0" />
          <rect x="4"  y="-8" width="6" height="6" fill="#ffffff" stroke="#1a1a2a" strokeWidth="1.5" />
          <rect x="6"  y="-8" width="2" height="2" fill="#f0f0f0" />
          {/* Eye */}
          <rect x="7"  y="-6" width="1" height="1" fill="#1a1a2a" />
          {/* Bill */}
          <rect x="9"  y="-5" width="4" height="3" fill="#ffb040" stroke="#1a1a2a" strokeWidth="1" />
          {/* Wing */}
          <rect x="-4" y="-3" width="6" height="3" fill="#e0e0e0" />
        </g>
      </motion.g>
    </motion.g>
  );
}

// Tiny waterfall — pixel cascade
export function TinyWaterfall({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <rect x="-18" y="-40" width="36" height="8" fill="#6a7078" stroke="#1a1a2a" strokeWidth="1.5" />
      <motion.rect
        x="-14" y="-36" width="28" height="48" fill="#74b4e8"
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 1.1, repeat: Infinity }}
      />
      <rect x="-12" y="-32" width="2" height="44" fill="#ffffff" opacity="0.7" />
      <rect x="8"   y="-32" width="2" height="44" fill="#ffffff" opacity="0.7" />
      <ellipse cx="0" cy="14" rx="22" ry="4" fill="#5ea0d8" stroke="#4080b0" strokeWidth="1" />
      <rect x="-8" y="13" width="4" height="1" fill="#ffffff" opacity="0.6" />
      <rect x="4"  y="15" width="4" height="1" fill="#ffffff" opacity="0.6" />
    </g>
  );
}

// Reeds cluster
export function Reeds({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      {[-6, -2, 2, 6].map((xr, i) => (
        <g key={i}>
          <rect x={xr} y={-14 - (i % 2) * 2} width="1" height={14 + (i % 2) * 2} fill="#4a7020" />
          <rect x={xr - 1} y={-18 - (i % 2) * 2} width="3" height="3" fill="#8a6020" />
        </g>
      ))}
    </g>
  );
}

// Scarecrow — rural filler
export function Scarecrow({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="20" rx="10" ry="2" fill="#000" opacity="0.3" />
      <rect x="-1" y="-16" width="2" height="36" fill="#6b4020" />
      <rect x="-10" y="-10" width="20" height="2" fill="#6b4020" />
      {/* Sack head */}
      <rect x="-6" y="-24" width="12" height="10" fill="#d8b878" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="-4" y="-20" width="2" height="1" fill="#1a1a2a" />
      <rect x="2"  y="-20" width="2" height="1" fill="#1a1a2a" />
      <rect x="-3" y="-16" width="6" height="1" fill="#1a1a2a" />
      {/* Hat */}
      <path d="M -10 -24 L 10 -24 L 6 -30 L -6 -30 Z" fill="#5a3a1a" stroke="#1a1a2a" strokeWidth="1" />
      <rect x="-12" y="-24" width="24" height="2" fill="#5a3a1a" />
      {/* Shirt */}
      <rect x="-8" y="-14" width="16" height="16" fill="#c85050" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="-8" y="-14" width="16" height="2" fill="#e07070" />
      {/* Straw tufts */}
      <rect x="-11" y="-8" width="3" height="1" fill="#e0c040" />
      <rect x="8"   y="-8" width="3" height="1" fill="#e0c040" />
    </g>
  );
}

// Animation studio building — with big showcase window displaying cycling pixel art
export function AnimationStudio({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="46" rx="90" ry="7" fill="#000" opacity="0.45" />
      {/* Base */}
      <rect x="-80" y="-60" width="160" height="106" fill="#e8e4d0" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-78" y="-58" width="156" height="4"   fill="#f4f0dc" />
      <rect x="-80" y="42"  width="160" height="4"   fill="#a89c7c" />
      {/* Teal trim */}
      <rect x="-80" y="-16" width="160" height="4" fill="#30b0a0" />
      <rect x="-80" y="0"   width="160" height="2" fill="#30b0a0" />
      {/* Big showcase window — displays cycling pixel art */}
      <rect x="-60" y="-48" width="120" height="34" fill="#1a1a28" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-58" y="-46" width="116" height="30" fill="#50d0d0">
        <animate attributeName="fill" values="#50d0d0;#ffc060;#ff8080;#a080f0;#50d0d0" dur="6s" repeatCount="indefinite" />
      </rect>
      {/* Cartoon cat head pixels cycling inside window */}
      <g>
        <rect x="-30" y="-40" width="10" height="10" fill="#2a2a2a">
          <animate attributeName="x" values="-30;-10;10;-30" dur="6s" repeatCount="indefinite" />
        </rect>
        <rect x="-32" y="-42" width="2" height="4" fill="#2a2a2a">
          <animate attributeName="x" values="-32;-12;8;-32" dur="6s" repeatCount="indefinite" />
        </rect>
        <rect x="-20" y="-42" width="2" height="4" fill="#2a2a2a">
          <animate attributeName="x" values="-20;0;20;-20" dur="6s" repeatCount="indefinite" />
        </rect>
        <rect x="-28" y="-36" width="1" height="1" fill="#ffe066">
          <animate attributeName="x" values="-28;-8;12;-28" dur="6s" repeatCount="indefinite" />
        </rect>
        <rect x="-22" y="-36" width="1" height="1" fill="#ffe066">
          <animate attributeName="x" values="-22;-2;18;-22" dur="6s" repeatCount="indefinite" />
        </rect>
      </g>
      {/* Studio name sign */}
      <rect x="-48" y="-78" width="96" height="18" fill="#1a1a2a" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-46" y="-76" width="92" height="14" fill="#ffe066" />
      <text x="0" y="-67" textAnchor="middle" fontSize="7" fill="#1a1a2a"
            fontFamily="'Press Start 2P', monospace">ART STUDIO</text>
      {/* Door */}
      <rect x="-14" y="14" width="28" height="28" fill="#e05050" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-12" y="16" width="24" height="26" fill="#f06060" />
      <rect x="8"   y="24" width="2"  height="3"  fill="#ffe066" />
      {/* Side windows */}
      <rect x="34"  y="10"  width="26" height="22" fill="#50d0d0" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="36"  y="12"  width="22" height="18" fill="#80e0d0" />
      <rect x="-60" y="10"  width="26" height="22" fill="#50d0d0" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-58" y="12"  width="22" height="18" fill="#80e0d0" />
      {/* Rooftop decorations — paint cans */}
      <rect x="-70" y="-70" width="8" height="10" fill="#c85050" stroke="#1a1a2a" strokeWidth="1" />
      <rect x="-68" y="-72" width="4" height="3" fill="#f07070" />
      <rect x="62"  y="-72" width="8" height="12" fill="#6080e0" stroke="#1a1a2a" strokeWidth="1" />
      <rect x="64"  y="-74" width="4" height="3" fill="#a0b0ff" />
    </g>
  );
}

// Easel displaying pixel-art being drawn — animated drawing cycling
export function Easel({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="30" rx="20" ry="3" fill="#000" opacity="0.35" />
      {/* Legs */}
      <path d="M -4 -30 L -12 30" stroke="#6b4020" strokeWidth="3" />
      <path d="M 4  -30 L 12  30" stroke="#6b4020" strokeWidth="3" />
      <path d="M 0  -20 L 0   30" stroke="#6b4020" strokeWidth="3" />
      {/* Canvas */}
      <rect x="-18" y="-32" width="36" height="30" fill="#ffffff" stroke="#1a1a2a" strokeWidth="2" />
      {/* Drawing inside — cycles colors */}
      <rect x="-14" y="-28" width="28" height="22" fill="#a0e0ff">
        <animate attributeName="fill" values="#a0e0ff;#ffc0a0;#c0ffa0;#ffe0a0;#a0e0ff" dur="8s" repeatCount="indefinite" />
      </rect>
      {/* Mini scene: sun + hill (shifts color over time) */}
      <rect x="0" y="-20" width="4" height="4" fill="#ffe066" />
      <rect x="-10" y="-12" width="22" height="6" fill="#5ea448" />
      <rect x="-10" y="-6"  width="22" height="2" fill="#3d8024" />
      {/* Paint palette */}
      <ellipse cx="20" cy="20" rx="10" ry="6" fill="#c8a858" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="14" y="18" width="3" height="3" fill="#c85050" />
      <rect x="18" y="16" width="3" height="3" fill="#50c8d0" />
      <rect x="22" y="18" width="3" height="3" fill="#ffe066" />
      <rect x="20" y="22" width="3" height="3" fill="#a0d060" />
    </g>
  );
}

// Studio cat walking — tiny pixel cat moves left to right across the scene
export function StudioCat({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <motion.g
      initial={{ x: x - 50 }}
      animate={{ x: x + 900 }}
      transition={{ duration: 28, repeat: Infinity, ease: "linear", delay }}
    >
      <motion.g
        animate={{ y: [y, y - 1, y] }}
        transition={{ duration: 0.4, repeat: Infinity }}
      >
        <g shapeRendering="crispEdges">
          <ellipse cx="0" cy="8" rx="10" ry="2" fill="#000" opacity="0.3" />
          {/* Body */}
          <rect x="-8" y="-2" width="16" height="8" fill="#f0c070" stroke="#1a1a2a" strokeWidth="1" />
          <rect x="-8" y="-2" width="16" height="2" fill="#f8d080" />
          {/* Legs */}
          <rect x="-6" y="6" width="2" height="3" fill="#f0c070" />
          <rect x="-2" y="6" width="2" height="3" fill="#f0c070" />
          <rect x="4"  y="6" width="2" height="3" fill="#f0c070" />
          {/* Head */}
          <rect x="6"  y="-6" width="8" height="6" fill="#f0c070" stroke="#1a1a2a" strokeWidth="1" />
          {/* Ears */}
          <rect x="6"  y="-8" width="2" height="2" fill="#f0c070" />
          <rect x="12" y="-8" width="2" height="2" fill="#f0c070" />
          {/* Eye */}
          <rect x="11" y="-4" width="1" height="1" fill="#1a1a2a" />
          {/* Tail */}
          <motion.rect
            x="-11" y="-2" width="4" height="2" fill="#f0c070"
            animate={{ rotate: [0, 20, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ transformOrigin: "-8px 0px" }}
          />
          {/* Stripes */}
          <rect x="-4" y="-2" width="1" height="8" fill="#c89040" />
          <rect x="0"  y="-2" width="1" height="8" fill="#c89040" />
          <rect x="4"  y="-2" width="1" height="8" fill="#c89040" />
        </g>
      </motion.g>
    </motion.g>
  );
}

// Studio logo sign — "ART PEG" on a wooden post
export function StudioLogoSign({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="22" rx="20" ry="3" fill="#000" opacity="0.3" />
      {/* Post */}
      <rect x="-2" y="-8" width="4" height="30" fill="#6b4020" stroke="#1a1a2a" strokeWidth="1" />
      {/* Sign board */}
      <rect x="-24" y="-26" width="48" height="20" fill="#ffcc30" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-22" y="-24" width="44" height="4"  fill="#ffe060" />
      <text x="0" y="-13" textAnchor="middle" fontSize="7" fill="#3a2010"
            fontFamily="'Press Start 2P', monospace">ART PEG</text>
      {/* Paint splat decoration */}
      <rect x="-26" y="-28" width="3" height="3" fill="#c85050" />
      <rect x="23"  y="-10" width="3" height="3" fill="#50c8d0" />
    </g>
  );
}

// Kite in sky — drifts with gentle sway
export function Kite({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <motion.g
      initial={{ x: x - 100 }}
      animate={{ x: x + 1100 }}
      transition={{ duration: 45, repeat: Infinity, ease: "linear", delay }}
    >
      <motion.g
        animate={{ rotate: [-6, 6, -6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "0px 0px" }}
      >
        <g transform={`translate(0, ${y})`} shapeRendering="crispEdges">
          {/* Kite body */}
          <path d="M 0 -12 L 10 0 L 0 12 L -10 0 Z" fill="#ff6080" stroke="#1a1a2a" strokeWidth="1.5" />
          <path d="M 0 -12 L 0 12" stroke="#1a1a2a" strokeWidth="1" />
          <path d="M -10 0 L 10 0" stroke="#1a1a2a" strokeWidth="1" />
          <rect x="-1" y="-6" width="2" height="2" fill="#ffffff" />
          <rect x="-1" y="2"  width="2" height="2" fill="#ffffff" />
          {/* Tail — animated wiggle */}
          <motion.g
            animate={{ rotate: [-15, 15, -15] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ transformOrigin: "0px 12px" }}
          >
            <rect x="-1" y="12" width="2" height="6" fill="#ffe066" />
            <rect x="-3" y="16" width="6" height="2" fill="#ffe066" />
            <rect x="-1" y="20" width="2" height="4" fill="#50d0ff" />
            <rect x="-2" y="22" width="4" height="2" fill="#50d0ff" />
            <rect x="-1" y="26" width="2" height="4" fill="#ff60a0" />
            <rect x="-2" y="28" width="4" height="2" fill="#ff60a0" />
          </motion.g>
          {/* String */}
          <rect x="0" y="12" width="1" height="60" fill="#606068" opacity="0.5" />
        </g>
      </motion.g>
    </motion.g>
  );
}

// Animated floating animation cel — transparent paper drifting
export function FloatingCel({ x, y, delay = 0, duration = 18 }: { x: number; y: number; delay?: number; duration?: number }) {
  return (
    <motion.g
      initial={{ x: x, y: y, rotate: -6 }}
      animate={{
        x: [x, x + 40, x - 30, x + 20, x],
        y: [y, y - 20, y + 10, y - 30, y],
        rotate: [-6, 6, -3, 6, -6],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <g shapeRendering="crispEdges">
        <rect x="-10" y="-14" width="20" height="28" fill="#ffffff" opacity="0.8" stroke="#30b0a0" strokeWidth="1" />
        {/* Corner perforations */}
        <rect x="-8" y="-12" width="1" height="1" fill="#a0a0a0" />
        <rect x="-8" y="-8"  width="1" height="1" fill="#a0a0a0" />
        <rect x="-8" y="-4"  width="1" height="1" fill="#a0a0a0" />
        {/* Doodle on cel */}
        <rect x="-4" y="-10" width="2" height="2" fill="#1a1a2a" />
        <rect x="2"  y="-10" width="2" height="2" fill="#1a1a2a" />
        <rect x="-3" y="-5"  width="6" height="1" fill="#1a1a2a" />
        <rect x="-5" y="-3"  width="10" height="1" fill="#ff6080" />
      </g>
    </motion.g>
  );
}

// Firefly swarm — glowing yellow dots that twinkle in the scene
export function FireflySwarm({ width = 900, height = 700, count = 30, top = 380 }: { width?: number; height?: number; count?: number; top?: number }) {
  const flies: React.ReactElement[] = [];
  for (let i = 0; i < count; i++) {
    const baseX = (i * 37 + 13) % width;
    const baseY = top + ((i * 41) % Math.max(1, height - top - 40));
    const driftX = 10 + (i % 5) * 4;
    flies.push(
      <motion.g
        key={i}
        animate={{
          x: [0, driftX, -driftX, 0],
          y: [0, -12, 8, 0],
          opacity: [0.2, 1, 0.4, 1, 0.2],
        }}
        transition={{ duration: 3 + (i % 5), repeat: Infinity, ease: "easeInOut", delay: (i * 0.17) % 2 }}
      >
        <rect x={baseX} y={baseY} width="2" height="2" fill="#ffe066" />
        <rect x={baseX - 1} y={baseY - 1} width="4" height="4" fill="#ffe066" opacity="0.35" />
      </motion.g>
    );
  }
  return <g style={{ pointerEvents: "none" }}>{flies}</g>;
}

// Paint splatter tile — decorative ground prop outside the studio
export function PaintSplatter({ x, y, color = "#ff6080" }: { x: number; y: number; color?: string }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <rect x="-4" y="-2" width="8" height="4" fill={color} opacity="0.8" />
      <rect x="-2" y="-4" width="4" height="8" fill={color} opacity="0.8" />
      <rect x="-6" y="0"  width="2" height="2" fill={color} opacity="0.6" />
      <rect x="4"  y="2"  width="2" height="2" fill={color} opacity="0.6" />
      <rect x="0"  y="4"  width="1" height="1" fill={color} opacity="0.9" />
    </g>
  );
}

// ── Day 3 pixel-art landmark pack (neon cyberpunk night) ────────────────

// Neon sky band — deep navy with stars + pink/magenta horizon glow
export function NeonSkyBand({ width = 900, top = 0, bottom = 220 }: { width?: number; top?: number; bottom?: number }) {
  const h = bottom - top;
  const stars: React.ReactElement[] = [];
  for (let i = 0; i < 40; i++) {
    const x = (i * 47 + 13) % width;
    const y = top + (i * 17) % 80;
    stars.push(<rect key={`s${i}`} x={x} y={y} width="1" height="1" fill="#ffffff" opacity={0.4 + ((i % 5) * 0.12)} />);
  }
  // Occasional "bright" stars
  for (let i = 0; i < 8; i++) {
    const x = (i * 113 + 29) % width;
    const y = top + 10 + ((i * 23) % 60);
    stars.push(<rect key={`bs${i}`} x={x} y={y} width="2" height="2" fill="#ffffff" opacity="0.9" />);
  }
  return (
    <g shapeRendering="crispEdges">
      {/* Vertical gradient — simulated with banded rects */}
      <rect x="0" y={top} width={width} height={h * 0.4} fill="#0e0e2e" />
      <rect x="0" y={top + h * 0.4} width={width} height={h * 0.3} fill="#1a1040" />
      <rect x="0" y={top + h * 0.7} width={width} height={h * 0.3} fill="#2a1050" />
      {/* Horizon magenta city glow */}
      <rect x="0" y={bottom - 20} width={width} height="14" fill="#ff2ec8" opacity="0.15" />
      <rect x="0" y={bottom - 10} width={width} height="6"  fill="#ff60d0" opacity="0.22" />
      {stars}
    </g>
  );
}

// Neon city silhouette band — tall skyline with lit windows in 3 colors
export function NeonCityBand({ width = 900, top = 200, bottom = 360 }: { width?: number; top?: number; bottom?: number }) {
  const h = bottom - top;
  const buildings = [
    { w: 48, hr: 0.95, accent: "#ff2ec8" },
    { w: 72, hr: 0.58, accent: "#00e0ff" },
    { w: 56, hr: 0.82, accent: "#ffe066" },
    { w: 80, hr: 1.0,  accent: "#00e0ff" },
    { w: 60, hr: 0.66, accent: "#ff2ec8" },
    { w: 72, hr: 0.88, accent: "#ffe066" },
    { w: 56, hr: 0.48, accent: "#ff2ec8" },
    { w: 80, hr: 0.95, accent: "#00e0ff" },
    { w: 60, hr: 0.72, accent: "#ffe066" },
    { w: 72, hr: 0.56, accent: "#ff2ec8" },
    { w: 64, hr: 0.9,  accent: "#00e0ff" },
    { w: 80, hr: 0.66, accent: "#ffe066" },
    { w: 56, hr: 0.82, accent: "#ff2ec8" },
    { w: 72, hr: 1.0,  accent: "#00e0ff" },
  ];
  let x = 0;
  const colors = ["#ffe066", "#00e0ff", "#ff2ec8", "#ffffff"];
  return (
    <g shapeRendering="crispEdges">
      {buildings.map((b, i) => {
        if (x >= width) return null;
        const bh = h * b.hr;
        const bx = x;
        x += b.w;
        const windows: React.ReactElement[] = [];
        for (let row = 0; row < Math.floor(bh / 9); row++) {
          for (let col = 0; col < Math.floor(b.w / 7); col++) {
            if ((row * 5 + col * 3 + i * 7) % 4 < 3) {
              const c = colors[(row + col + i) % colors.length];
              windows.push(
                <rect
                  key={`${i}-${row}-${col}`}
                  x={bx + 2 + col * 7}
                  y={top + h - bh + 2 + row * 9}
                  width="3" height="3"
                  fill={c}
                  opacity={0.55 + ((row + col) % 3) * 0.15}
                />
              );
            }
          }
        }
        return (
          <g key={i}>
            <rect x={bx} y={top + h - bh} width={b.w} height={bh} fill="#0a0c28" stroke="#1a1a2a" strokeWidth="1.5" />
            <rect x={bx} y={top + h - bh} width={b.w} height="3" fill="#141838" />
            {/* Rooftop accent light */}
            <rect x={bx + b.w / 2 - 1} y={top + h - bh - 4} width="2" height="4" fill={b.accent}>
              <animate attributeName="opacity" values="1;0.3;1" dur={`${1.5 + (i % 3) * 0.6}s`} repeatCount="indefinite" />
            </rect>
            {windows}
          </g>
        );
      })}
    </g>
  );
}

// Neon street band — slick dark pavement with neon reflection streaks
export function NeonStreetBand({ width = 900, top = 360, bottom = 700 }: { width?: number; top?: number; bottom?: number }) {
  const h = bottom - top;
  const streaks: React.ReactElement[] = [];
  // Magenta reflection streaks
  for (let i = 0; i < 22; i++) {
    const x = (i * 47 + 13) % width;
    const y = top + 18 + ((i * 29) % (h - 40));
    streaks.push(<rect key={`m${i}`} x={x} y={y} width="10" height="1" fill="#ff2ec8" opacity="0.35" />);
  }
  // Cyan reflection streaks
  for (let i = 0; i < 22; i++) {
    const x = (i * 53 + 9) % width;
    const y = top + 22 + ((i * 31) % (h - 40));
    streaks.push(<rect key={`c${i}`} x={x} y={y} width="8" height="1" fill="#00e0ff" opacity="0.3" />);
  }
  // Amber streaks
  for (let i = 0; i < 14; i++) {
    const x = (i * 71 + 23) % width;
    const y = top + 12 + ((i * 41) % (h - 40));
    streaks.push(<rect key={`y${i}`} x={x} y={y} width="6" height="1" fill="#ffe066" opacity="0.35" />);
  }
  return (
    <g shapeRendering="crispEdges">
      <rect x="0" y={top} width={width} height={h} fill="#1a1a24" />
      {/* Tile seams */}
      {Array.from({ length: Math.floor(width / 28) }).map((_, i) => (
        <rect key={`v${i}`} x={i * 28} y={top} width="1" height={h} fill="#0a0a10" opacity="0.8" />
      ))}
      {Array.from({ length: Math.floor(h / 28) }).map((_, i) => (
        <rect key={`hh${i}`} x="0" y={top + i * 28} width={width} height="1" fill="#0a0a10" opacity="0.8" />
      ))}
      {streaks}
    </g>
  );
}

// MMDA building — government HQ with blue LED signage
export function MMDAHq({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="44" rx="90" ry="7" fill="#000" opacity="0.5" />
      {/* Base */}
      <rect x="-84" y="-60" width="168" height="104" fill="#2a3858" stroke="#0a0c18" strokeWidth="2" />
      <rect x="-82" y="-58" width="164" height="3"   fill="#405a80" />
      <rect x="-84" y="40"  width="168" height="4"   fill="#151e30" />
      {/* Columns */}
      {[-60, -30, 0, 30, 60].map((cx, i) => (
        <rect key={i} x={cx - 4} y="-58" width="8" height="100" fill="#1a2438" stroke="#0a0c18" strokeWidth="1" />
      ))}
      {/* Rows of lit windows between columns */}
      {Array.from({ length: 5 }).map((_, row) =>
        [-52, -22, 8, 38].map((gx, gi) => (
          <rect
            key={`${row}-${gi}`}
            x={gx}
            y={-50 + row * 18}
            width="18" height="12"
            fill={(row + gi) % 3 === 0 ? "#00e0ff" : "#405a80"}
            stroke="#0a0c18" strokeWidth="1"
            opacity={(row + gi) % 3 === 0 ? 0.9 : 1}
          />
        ))
      )}
      {/* Rooftop LED sign */}
      <rect x="-50" y="-76" width="100" height="16" fill="#0a0c18" stroke="#0a0c18" strokeWidth="2" />
      <rect x="-48" y="-74" width="96"  height="12" fill="#00b0e0" />
      <text x="0" y="-64" textAnchor="middle" fontSize="8" fill="#ffffff"
            fontFamily="'Press Start 2P', monospace" style={{ filter: "drop-shadow(0 0 3px #00e0ff)" }}>MMDA</text>
      {/* Flagpole */}
      <rect x="-1" y="-92" width="2"  height="20" fill="#a0a0a8" />
      <rect x="1"  y="-90" width="12" height="8"  fill="#d03030" stroke="#0a0c18" strokeWidth="1" />
      <rect x="1"  y="-86" width="12" height="4"  fill="#4080c8" />
      <rect x="1"  y="-90" width="4"  height="8"  fill="#ffe066" />
      {/* Security booth */}
      <rect x="-78" y="20" width="14" height="22" fill="#3a4a68" stroke="#0a0c18" strokeWidth="1.5" />
      <rect x="-76" y="22" width="10" height="8"  fill="#80d0f0" />
      {/* Entrance */}
      <rect x="-14" y="22" width="28" height="22" fill="#0a0c18" stroke="#0a0c18" strokeWidth="2" />
      <rect x="-12" y="24" width="24" height="20" fill="#00e0ff" opacity="0.4" />
      <rect x="0"   y="24" width="1"  height="20" fill="#ffffff" opacity="0.5" />
    </g>
  );
}

// BGC skyscraper variant A — tall glass tower with side billboard
export function BGCTowerA({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="80" rx="56" ry="7" fill="#000" opacity="0.5" />
      {/* Tower body */}
      <rect x="-48" y="-180" width="96" height="260" fill="#12162a" stroke="#000" strokeWidth="2" />
      <rect x="-46" y="-178" width="92" height="4"   fill="#1e2442" />
      {/* Vertical neon accent strips */}
      <rect x="-42" y="-176" width="2" height="252" fill="#ff2ec8" opacity="0.7">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
      </rect>
      <rect x="40"  y="-176" width="2" height="252" fill="#00e0ff" opacity="0.7">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" begin="1s" />
      </rect>
      {/* Window grid — 14 rows × 6 cols */}
      {Array.from({ length: 14 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => {
          const palette = ["#ffe066", "#00e0ff", "#ff80e0", "#ffffff"];
          const lit = (row * 3 + col * 7) % 5 < 3;
          return (
            <rect
              key={`${row}-${col}`}
              x={-38 + col * 13}
              y={-170 + row * 18}
              width="9" height="14"
              fill={lit ? palette[(row + col) % palette.length] : "#24284a"}
              stroke="#000" strokeWidth="0.5"
              opacity={lit ? 0.7 : 1}
            />
          );
        })
      )}
      {/* Side billboard */}
      <rect x="-68" y="-40" width="20" height="60" fill="#0a0a1a" stroke="#000" strokeWidth="2" />
      <rect x="-66" y="-38" width="16" height="56" fill="#ff2ec8">
        <animate attributeName="fill" values="#ff2ec8;#00e0ff;#ffe066;#ff2ec8" dur="4s" repeatCount="indefinite" />
      </rect>
      <text x="-58" y="-12" textAnchor="middle" fontSize="8" fill="#ffffff"
            fontFamily="'Press Start 2P', monospace" transform="rotate(-90 -58 -12)">BGC</text>
      {/* Roof + antenna */}
      <rect x="-48" y="-188" width="96" height="8" fill="#24284a" stroke="#000" strokeWidth="2" />
      <rect x="-2"  y="-208" width="4"  height="20" fill="#000" />
      <rect x="-1"  y="-214" width="2"  height="8"  fill="#ff2020">
        <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite" />
      </rect>
      {/* Entrance */}
      <rect x="-18" y="56" width="36" height="24" fill="#000" stroke="#000" strokeWidth="2" />
      <rect x="-16" y="58" width="32" height="22" fill="#ff60d0" opacity="0.5" />
    </g>
  );
}

// BGC skyscraper variant B — wider + shorter with rooftop crown
export function BGCTowerB({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="50" rx="56" ry="7" fill="#000" opacity="0.5" />
      <rect x="-48" y="-140" width="96" height="190" fill="#14182c" stroke="#000" strokeWidth="2" />
      <rect x="-46" y="-138" width="92" height="4"   fill="#20264a" />
      {Array.from({ length: 10 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => {
          const palette = ["#00e0ff", "#ffe066", "#ffffff", "#ff80e0"];
          const lit = (row * 5 + col * 11) % 4 < 3;
          return (
            <rect
              key={`${row}-${col}`}
              x={-38 + col * 13}
              y={-130 + row * 17}
              width="9" height="13"
              fill={lit ? palette[(row + col) % palette.length] : "#282c50"}
              stroke="#000" strokeWidth="0.5"
              opacity={lit ? 0.7 : 1}
            />
          );
        })
      )}
      {/* Crown (two stepped blocks) */}
      <rect x="-32" y="-160" width="64" height="22" fill="#14182c" stroke="#000" strokeWidth="2" />
      <rect x="-16" y="-176" width="32" height="16" fill="#14182c" stroke="#000" strokeWidth="2" />
      {/* Crown neon */}
      <rect x="-14" y="-172" width="28" height="2" fill="#00e0ff">
        <animate attributeName="fill" values="#00e0ff;#ff2ec8;#00e0ff" dur="3s" repeatCount="indefinite" />
      </rect>
      {/* Entrance */}
      <rect x="-16" y="26" width="32" height="24" fill="#000" stroke="#000" strokeWidth="2" />
      <rect x="-14" y="28" width="28" height="22" fill="#00e0ff" opacity="0.45" />
    </g>
  );
}

// Animated billboard — frame cycles through 3 colors
export function BillboardTV({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="36" rx="30" ry="3" fill="#000" opacity="0.5" />
      <rect x="-2" y="0" width="4" height="36" fill="#2a2a3a" />
      <rect x="-28" y="-32" width="56" height="32" fill="#0a0a14" stroke="#000" strokeWidth="2" />
      <rect x="-26" y="-30" width="52" height="28" fill="#ff2ec8">
        <animate attributeName="fill" values="#ff2ec8;#00e0ff;#ffe066;#ff60d0;#ff2ec8" dur="4s" repeatCount="indefinite" />
      </rect>
      <text x="0" y="-13" textAnchor="middle" fontSize="10" fill="#ffffff"
            fontFamily="'Press Start 2P', monospace"
            style={{ filter: "drop-shadow(0 0 3px #ffffff)" }}>NOW!</text>
    </g>
  );
}

// Small neon shop sign — compact glowing storefront text
export function NeonShopSign({ x, y, text = "OPEN", color = "#ff2ec8" }: { x: number; y: number; text?: string; color?: string }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <rect x="-22" y="-12" width="44" height="18" fill="#0a0a14" stroke="#000" strokeWidth="1.5" />
      <rect x="-20" y="-10" width="40" height="2"  fill={color} opacity="0.7" />
      <rect x="-20" y="4"   width="40" height="2"  fill={color} opacity="0.7" />
      <text x="0" y="2" textAnchor="middle" fontSize="8" fill={color}
            fontFamily="'Press Start 2P', monospace"
            style={{ filter: `drop-shadow(0 0 3px ${color})` }}>{text}
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
      </text>
    </g>
  );
}

// Neon screen-wide pulse (magenta ↔ cyan) at ~4s interval
export function NeonPulse({ width = 900, height = 700 }: { width?: number; height?: number }) {
  return (
    <g style={{ pointerEvents: "none" }}>
      <rect x="0" y="0" width={width} height={height} fill="#ff2ec8" opacity="0">
        <animate attributeName="opacity" values="0;0.06;0" dur="4s" repeatCount="indefinite" />
      </rect>
      <rect x="0" y="0" width={width} height={height} fill="#00e0ff" opacity="0">
        <animate attributeName="opacity" values="0;0.05;0" dur="4s" repeatCount="indefinite" begin="2s" />
      </rect>
    </g>
  );
}

// Neon sparkle — tiny twinkling pixels scattered on the street
export function NeonSparkle({ width = 900, height = 700, count = 40 }: { width?: number; height?: number; count?: number }) {
  const dots: React.ReactElement[] = [];
  const colors = ["#00e0ff", "#ff2ec8", "#ffe066", "#ffffff"];
  for (let i = 0; i < count; i++) {
    const x = (i * 67 + 13) % width;
    const y = 380 + ((i * 43) % (height - 400));
    const c = colors[i % colors.length];
    dots.push(
      <rect key={i} x={x} y={y} width="2" height="2" fill={c}>
        <animate attributeName="opacity" values="0;1;0" dur={`${1.5 + ((i % 5) * 0.4)}s`} repeatCount="indefinite" begin={`${(i * 0.13) % 2}s`} />
      </rect>
    );
  }
  return <g style={{ pointerEvents: "none" }}>{dots}</g>;
}

// ── Day 2 pixel-art landmark pack (rainy urban) ─────────────────────────

// Wide dormitory — 6 stories, rows of lit windows
export function PixelDorm({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="48" rx="110" ry="7" fill="#000" opacity="0.4" />
      {/* Base footprint */}
      <rect x="-104" y="-78" width="208" height="126" fill="#a06838" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-102" y="-76" width="204" height="4"  fill="#c08858" />
      <rect x="-104" y="44"  width="208" height="4"  fill="#705020" />
      {/* Roof strip */}
      <rect x="-108" y="-82" width="216" height="6" fill="#6b3010" stroke="#1a1a2a" strokeWidth="2" />
      {/* Sign */}
      <rect x="-38" y="-90" width="76" height="10" fill="#1a1a2a" />
      <rect x="-36" y="-88" width="72" height="6"  fill="#ffe066" />
      <text x="0" y="-82" textAnchor="middle" fontSize="6" fill="#1a1a2a"
            fontFamily="'Press Start 2P', monospace">DJM DORM</text>
      {/* 5x4 window grid (rows × cols) */}
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 12 }).map((_, col) => (
          <g key={`${row}-${col}`}>
            <rect
              x={-96 + col * 16}
              y={-66 + row * 20}
              width="12" height="14"
              fill={(row + col) % 3 === 0 ? "#ffe066" : "#3a5a78"}
              stroke="#1a1a2a" strokeWidth="1"
            />
            <rect
              x={-95 + col * 16}
              y={-65 + row * 20}
              width="10" height="2"
              fill={(row + col) % 3 === 0 ? "#fff080" : "#5078a0"}
            />
          </g>
        ))
      )}
      {/* Entrance */}
      <rect x="-14" y="28" width="28" height="20" fill="#3a2a1a" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-12" y="30" width="24" height="18" fill="#6b4020" />
      <rect x="0"   y="30" width="1"  height="18" fill="#a0a0a8" />
    </g>
  );
}

// Wide factory — two stacks with smoke, sheet-metal body
export function PixelFactory2({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="42" rx="110" ry="7" fill="#000" opacity="0.4" />
      {/* Main box */}
      <rect x="-100" y="-40" width="200" height="80" fill="#7a8090" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-98"  y="-38" width="196" height="4"  fill="#9aa0b0" />
      <rect x="-100" y="36"  width="200" height="4"  fill="#4a5060" />
      {/* Sawtooth roof */}
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={i}>
          <path
            d={`M ${-100 + i * 20} -40 L ${-90 + i * 20} -56 L ${-80 + i * 20} -40 Z`}
            fill="#5a6070" stroke="#1a1a2a" strokeWidth="1.5"
          />
          <rect x={-88 + i * 20} y={-54} width="6" height="8" fill="#80b0d8" stroke="#1a1a2a" strokeWidth="1" />
        </g>
      ))}
      {/* Sign */}
      <rect x="-40" y="-8" width="80" height="14" fill="#1a1a2a" />
      <rect x="-38" y="-6" width="76" height="10" fill="#c94040" />
      <text x="0" y="2" textAnchor="middle" fontSize="6" fill="#ffffff"
            fontFamily="'Press Start 2P', monospace">HYTEC POWER</text>
      {/* Roll-up doors */}
      <rect x="-82" y="10" width="26" height="26" fill="#3a3a4a" stroke="#1a1a2a" strokeWidth="2" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={-80} y={12 + i * 5} width="22" height="1" fill="#1a1a2a" />
      ))}
      <rect x="56" y="10" width="26" height="26" fill="#3a3a4a" stroke="#1a1a2a" strokeWidth="2" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={58} y={12 + i * 5} width="22" height="1" fill="#1a1a2a" />
      ))}
      {/* Chimney 1 */}
      <rect x="-60" y="-80" width="10" height="30" fill="#707080" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="-62" y="-82" width="14" height="4"  fill="#404048" />
      {/* Chimney 2 */}
      <rect x="34"  y="-78" width="10" height="28" fill="#707080" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="32"  y="-80" width="14" height="4"  fill="#404048" />
      {/* Smoke */}
      <motion.g
        animate={{ y: [-4, -26], opacity: [0.8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <rect x="-60" y="-94" width="10" height="6" fill="#b0b0c0" />
        <rect x="-58" y="-100" width="12" height="4" fill="#b0b0c0" />
      </motion.g>
      <motion.g
        animate={{ y: [-4, -26], opacity: [0.8, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
      >
        <rect x="34"  y="-92" width="10" height="6" fill="#b0b0c0" />
        <rect x="36"  y="-98" width="8" height="4" fill="#b0b0c0" />
      </motion.g>
    </g>
  );
}

// Wide glass office tower — corporate-style skyscraper
export function PixelOfficeTower2({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="66" rx="68" ry="7" fill="#000" opacity="0.45" />
      {/* Main shaft */}
      <rect x="-60" y="-120" width="120" height="186" fill="#3a5a80" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-58" y="-118" width="116" height="4"   fill="#5078a0" />
      <rect x="-60" y="62"   width="120" height="4"   fill="#1a3060" />
      {/* Glass grid — 10 rows × 8 cols */}
      {Array.from({ length: 10 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => (
          <rect
            key={`${row}-${col}`}
            x={-54 + col * 14}
            y={-108 + row * 18}
            width="10" height="14"
            fill={(row * 3 + col * 7) % 5 < 2 ? "#80c0ff" : "#4080c0"}
            stroke="#1a1a2a" strokeWidth="0.5"
          />
        ))
      )}
      {/* Horizontal seams */}
      {Array.from({ length: 11 }).map((_, row) => (
        <rect key={row} x="-60" y={-110 + row * 18} width="120" height="1" fill="#1a1a2a" opacity="0.5" />
      ))}
      {/* Logo panel */}
      <rect x="-30" y="-140" width="60" height="18" fill="#1a1a2a" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-28" y="-138" width="56" height="14" fill="#ffe066" />
      <text x="0" y="-129" textAnchor="middle" fontSize="7" fill="#1a1a2a"
            fontFamily="'Press Start 2P', monospace">OPENTEXT</text>
      {/* Antenna */}
      <rect x="-2" y="-156" width="4" height="16" fill="#1a1a2a" />
      <rect x="-1" y="-162" width="2" height="6"  fill="#c94040" />
      {/* Ground entrance */}
      <rect x="-14" y="46" width="28" height="20" fill="#1a1a2a" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-12" y="48" width="24" height="18" fill="#4080c8" />
      <rect x="0"   y="48" width="1"  height="18" fill="#a0a0a8" />
    </g>
  );
}

// Puddle on the ground — reflective pixel
export function Puddle({ x, y, w = 30 }: { x: number; y: number; w?: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="0" rx={w / 2} ry={w / 8} fill="#4a5a7a" />
      <ellipse cx="0" cy="-1" rx={w / 2 - 2} ry={w / 8 - 1} fill="#6a80a0" opacity="0.8" />
      <rect x={-w / 4} y="-1" width={w / 2} height="1" fill="#a0b0c8" opacity="0.6" />
    </g>
  );
}

// Rain overlay — animated vertical streaks covering the full viewBox
export function RainOverlay({ width = 900, height = 700, density = 80 }: { width?: number; height?: number; density?: number }) {
  const drops: React.ReactElement[] = [];
  for (let i = 0; i < density; i++) {
    const x = (i * 31 + 7) % width;
    const startY = -(i * 43 % 60) - 20;
    const duration = 0.6 + ((i % 5) * 0.12);
    const delay = (i * 0.08) % 1.5;
    drops.push(
      <motion.rect
        key={i}
        x={x}
        y={startY}
        width="1"
        height="8"
        fill="#c0d0e0"
        opacity="0.55"
        initial={{ y: startY }}
        animate={{ y: height + 10 }}
        transition={{ duration, repeat: Infinity, ease: "linear", delay }}
      />
    );
  }
  return (
    <g shapeRendering="crispEdges" style={{ pointerEvents: "none" }}>
      {drops}
    </g>
  );
}

// Overcast grey sky band — darker than the sunny sky for rainy vibe
export function OvercastSkyBand({ width = 900, top = 0, bottom = 200 }: { width?: number; top?: number; bottom?: number }) {
  const h = bottom - top;
  const flecks: React.ReactElement[] = [];
  for (let i = 0; i < 24; i++) {
    const x = (i * 41 + 9) % width;
    const y = top + 20 + (i * 11) % (h - 30);
    flecks.push(<rect key={i} x={x} y={y} width="3" height="1" fill="#909aab" opacity="0.7" />);
  }
  return (
    <g shapeRendering="crispEdges">
      <rect x="0" y={top} width={width} height={h} fill="#6c7a90" />
      <rect x="0" y={top} width={width} height="40" fill="#586880" />
      <rect x="0" y={top + 40} width={width} height="6" fill="#647490" />
      {flecks}
    </g>
  );
}

// Cityscape silhouette band — distant buildings behind the scene
export function CityscapeBand({ width = 900, top = 180, bottom = 300 }: { width?: number; top?: number; bottom?: number }) {
  const h = bottom - top;
  const buildings = [
    { w: 60, hRatio: 0.85 }, { w: 80, hRatio: 0.55 }, { w: 50, hRatio: 0.95 },
    { w: 70, hRatio: 0.7 },  { w: 90, hRatio: 0.45 }, { w: 60, hRatio: 0.75 },
    { w: 80, hRatio: 1.0 },  { w: 50, hRatio: 0.6 },  { w: 70, hRatio: 0.85 },
    { w: 60, hRatio: 0.5 },  { w: 90, hRatio: 0.75 }, { w: 70, hRatio: 0.9 },
    { w: 80, hRatio: 0.55 },
  ];
  let x = 0;
  return (
    <g shapeRendering="crispEdges">
      <rect x="0" y={top} width={width} height={h} fill="#6c7a90" opacity="0" />
      {buildings.map((b, i) => {
        if (x >= width) return null;
        const bh = h * b.hRatio;
        const bx = x;
        x += b.w;
        // Lit window pixels
        const windows: React.ReactElement[] = [];
        for (let row = 0; row < Math.floor(bh / 10); row++) {
          for (let col = 0; col < Math.floor(b.w / 8); col++) {
            if ((row * 7 + col * 3 + i) % 5 < 2) {
              windows.push(
                <rect
                  key={`${i}-${row}-${col}`}
                  x={bx + 3 + col * 8}
                  y={top + h - bh + 3 + row * 10}
                  width="3" height="3"
                  fill="#ffe066"
                  opacity="0.55"
                />
              );
            }
          }
        }
        return (
          <g key={i}>
            <rect x={bx} y={top + h - bh} width={b.w} height={bh} fill="#2a3a54" stroke="#1a2234" strokeWidth="1.5" />
            <rect x={bx} y={top + h - bh} width={b.w} height="2" fill="#405070" />
            {windows}
          </g>
        );
      })}
    </g>
  );
}

// Wet pavement band — grey tiled floor with occasional puddle sparkle
export function WetPavementBand({ width = 900, top = 300, bottom = 700 }: { width?: number; top?: number; bottom?: number }) {
  const h = bottom - top;
  const tiles: React.ReactElement[] = [];
  // Grey pavement base
  tiles.push(<rect key="base" x="0" y={top} width={width} height={h} fill="#767a82" />);
  // Tile seams
  for (let col = 0; col < Math.floor(width / 24); col++) {
    tiles.push(<rect key={`v${col}`} x={col * 24} y={top} width="1" height={h} fill="#5a5e66" opacity="0.7" />);
  }
  for (let row = 0; row < Math.floor(h / 24); row++) {
    tiles.push(<rect key={`hh${row}`} x="0" y={top + row * 24} width={width} height="1" fill="#5a5e66" opacity="0.7" />);
  }
  // Scattered darker wet-spot pixels
  for (let i = 0; i < 60; i++) {
    const x = (i * 37 + 5) % width;
    const y = top + 6 + (i * 13) % (h - 12);
    tiles.push(<rect key={`w${i}`} x={x} y={y} width="2" height="1" fill="#4a5460" opacity="0.7" />);
  }
  // Specular reflection streaks (bluish)
  for (let i = 0; i < 18; i++) {
    const x = (i * 57 + 11) % width;
    const y = top + 14 + (i * 29) % (h - 28);
    tiles.push(<rect key={`r${i}`} x={x} y={y} width="6" height="1" fill="#8ea0b8" opacity="0.5" />);
  }
  return <g shapeRendering="crispEdges">{tiles}</g>;
}

// ── Pixel-tile background bands (Phase 10) ──────────────────────────────
// All four bands are pure inline SVG, rendered as the first children of the
// overworld <svg>. No external images. shapeRendering="crispEdges" keeps
// every 1px rect hard-edged to match the landmark aesthetic.

// Sky band — solid sky blue with tiny cloud flecks + stars near the top.
export function SkyBand({ width = 900, top = 0, bottom = 200 }: { width?: number; top?: number; bottom?: number }) {
  const h = bottom - top;
  const flecks: React.ReactElement[] = [];
  // Stars near top
  for (let i = 0; i < 18; i++) {
    const x = ((i * 53 + 11) % width);
    const y = top + (i * 7) % 40;
    flecks.push(<rect key={`s${i}`} x={x} y={y} width="1" height="1" fill="#ffffff" opacity="0.7" />);
  }
  // Cloud fleck pixels mid-sky
  for (let i = 0; i < 28; i++) {
    const x = ((i * 37 + 5) % width);
    const y = top + 50 + ((i * 13) % (h - 80));
    flecks.push(<rect key={`c${i}`} x={x} y={y} width="2" height="1" fill="#ffffff" opacity="0.55" />);
  }
  return (
    <g shapeRendering="crispEdges">
      <rect x="0" y={top} width={width} height={h} fill="#8cc4e8" />
      <rect x="0" y={top} width={width} height="40" fill="#74b4dc" />
      <rect x="0" y={top + 40} width={width} height="4" fill="#80bce4" />
      {flecks}
    </g>
  );
}

// Water band — repeating water tiles with sparkle + tide lines
export function WaterBand({ width = 900, top = 200, bottom = 420 }: { width?: number; top?: number; bottom?: number }) {
  const h = bottom - top;
  const sparkles: React.ReactElement[] = [];
  // White sparkle dots
  for (let i = 0; i < 40; i++) {
    const x = ((i * 23 + 7) % width);
    const y = top + 8 + ((i * 17) % (h - 16));
    sparkles.push(<rect key={`sp${i}`} x={x} y={y} width="2" height="1" fill="#ffffff" opacity="0.55" />);
  }
  // Darker tide lines every 40px
  const tides: React.ReactElement[] = [];
  for (let row = 0; row < Math.floor(h / 40); row++) {
    const y = top + 20 + row * 40;
    tides.push(<rect key={`t${row}`} x="0" y={y} width={width} height="1" fill="#2e6ba8" opacity="0.5" />);
  }
  return (
    <g shapeRendering="crispEdges">
      <rect x="0" y={top} width={width} height={h} fill="#4080c8" />
      {/* Subtle vertical tile separators for a tiled feel */}
      {Array.from({ length: Math.floor(width / 16) }).map((_, i) => (
        <rect key={`vs${i}`} x={i * 16} y={top} width="1" height={h} fill="#3878bc" opacity="0.3" />
      ))}
      {tides}
      {sparkles}
    </g>
  );
}

// Sand band — repeating sand tiles with darker pebble accent pixels
export function SandBand({ width = 900, top = 420, bottom = 700 }: { width?: number; top?: number; bottom?: number }) {
  const h = bottom - top;
  const pebbles: React.ReactElement[] = [];
  for (let i = 0; i < 60; i++) {
    const x = ((i * 47 + 9) % width);
    const y = top + 6 + ((i * 19) % (h - 12));
    pebbles.push(<rect key={`p${i}`} x={x} y={y} width="2" height="1" fill="#c4a660" opacity="0.85" />);
  }
  // Scattered lighter highlights for tonal variation
  const highlights: React.ReactElement[] = [];
  for (let i = 0; i < 40; i++) {
    const x = ((i * 59 + 3) % width);
    const y = top + 10 + ((i * 29) % (h - 20));
    highlights.push(<rect key={`h${i}`} x={x} y={y} width="1" height="1" fill="#f4dfa0" opacity="0.7" />);
  }
  return (
    <g shapeRendering="crispEdges">
      <rect x="0" y={top} width={width} height={h} fill="#e8d088" />
      {/* Tile seam lines every 16px — subtle */}
      {Array.from({ length: Math.floor(h / 16) }).map((_, row) => (
        <rect key={`th${row}`} x="0" y={top + row * 16} width={width} height="1" fill="#d4bc70" opacity="0.35" />
      ))}
      {Array.from({ length: Math.floor(width / 16) }).map((_, col) => (
        <rect key={`tv${col}`} x={col * 16} y={top} width="1" height={h} fill="#d4bc70" opacity="0.25" />
      ))}
      {highlights}
      {pebbles}
    </g>
  );
}

// Shoreline foam — 4px transition between water and sand
export function ShorelineTile({ width = 900, y = 420 }: { width?: number; y?: number }) {
  return (
    <g shapeRendering="crispEdges">
      {/* Foam row */}
      <rect x="0" y={y - 2} width={width} height="2" fill="#ffffff" opacity="0.85" />
      {/* Fade into wet sand */}
      <rect x="0" y={y} width={width} height="3" fill="#d8b868" />
      {/* Broken foam texture — tiny gaps */}
      {Array.from({ length: Math.floor(width / 22) }).map((_, i) => (
        <rect key={i} x={6 + i * 22} y={y - 2} width="3" height="1" fill="#4080c8" />
      ))}
    </g>
  );
}

// ── Day 1 pixel-art landmark pack (Phase 9B) ────────────────────────────
// All drawn on an integer pixel grid with hard edges (no curves, no smooth
// shapes) to evoke handheld map-tile art.

// Airport terminal — wide white building with glass strip and rooftop sign
export function AirportTerminal({ x, y }: { x: number; y: number }) {
  const shapeRendering = "crispEdges";
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering={shapeRendering}>
      <ellipse cx="0" cy="36" rx="92" ry="7" fill="#000" opacity="0.35" />
      {/* Tarmac strip below */}
      <rect x="-100" y="30" width="200" height="10" fill="#505258" />
      <rect x="-96" y="34" width="8" height="2" fill="#ffe066" />
      <rect x="-80" y="34" width="8" height="2" fill="#ffe066" />
      <rect x="-64" y="34" width="8" height="2" fill="#ffe066" />
      <rect x="-48" y="34" width="8" height="2" fill="#ffe066" />
      <rect x="-32" y="34" width="8" height="2" fill="#ffe066" />
      <rect x="-16" y="34" width="8" height="2" fill="#ffe066" />
      <rect x="0"   y="34" width="8" height="2" fill="#ffe066" />
      <rect x="16"  y="34" width="8" height="2" fill="#ffe066" />
      <rect x="32"  y="34" width="8" height="2" fill="#ffe066" />
      <rect x="48"  y="34" width="8" height="2" fill="#ffe066" />
      <rect x="64"  y="34" width="8" height="2" fill="#ffe066" />
      <rect x="80"  y="34" width="8" height="2" fill="#ffe066" />
      {/* Terminal body — 3 color palette: shadow/main/highlight */}
      <rect x="-80" y="-30" width="160" height="60" fill="#d0d0d8" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-78" y="-28" width="156" height="6"  fill="#f0f0f8" />
      <rect x="-80" y="26"  width="160" height="4"  fill="#808088" />
      {/* Glass strip windows */}
      <rect x="-72" y="-10" width="144" height="10" fill="#4080c8" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="-72" y="-8"  width="144" height="2"  fill="#80c0f0" />
      {[...Array(17)].map((_, i) => (
        <rect key={i} x={-72 + i * 9} y={-10} width="1" height="10" fill="#1a1a2a" />
      ))}
      {/* Entrance */}
      <rect x="-12" y="8"  width="24" height="22" fill="#2a2a3a" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-10" y="10" width="20" height="20" fill="#3a5a80" />
      <rect x="0"   y="10" width="1"  height="20" fill="#808088" />
      {/* Rooftop sign */}
      <rect x="-40" y="-44" width="80" height="14" fill="#1a1a2a" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-36" y="-42" width="72" height="10" fill="#d03030" />
      <text x="0" y="-33" textAnchor="middle" fontSize="9" fill="#ffffff"
            fontFamily="'Press Start 2P', monospace">NAIA</text>
      {/* Antennas */}
      <rect x="-3" y="-50" width="2" height="6" fill="#1a1a2a" />
      <rect x="1"  y="-48" width="2" height="4" fill="#1a1a2a" />
    </g>
  );
}

// Airport control tower — tall cylindrical tower with blinking light
export function ControlTower({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="46" rx="20" ry="4" fill="#000" opacity="0.4" />
      {/* Shaft */}
      <rect x="-12" y="-20" width="24" height="66" fill="#b8b8c0" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-10" y="-18" width="4"  height="62" fill="#d0d0d8" />
      <rect x="-12" y="0"   width="24" height="2"  fill="#1a1a2a" />
      {/* Observation deck (wider) */}
      <rect x="-22" y="-36" width="44" height="18" fill="#2a2a3a" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-20" y="-34" width="40" height="4"  fill="#4a4a5a" />
      <rect x="-20" y="-30" width="40" height="10" fill="#60a0d0" />
      {[...Array(5)].map((_, i) => (
        <rect key={i} x={-20 + i * 9} y={-30} width="1" height="10" fill="#1a1a2a" />
      ))}
      {/* Antenna */}
      <rect x="-2" y="-52" width="4" height="16" fill="#1a1a2a" />
      <rect x="-5" y="-52" width="10" height="2" fill="#1a1a2a" />
      {/* Blinking red light */}
      <rect x="-3" y="-54" width="6" height="4" fill="#ff3030">
        <animate attributeName="fill" values="#ff3030;#5a0000;#ff3030" dur="1.2s" repeatCount="indefinite" />
      </rect>
    </g>
  );
}

// Intramuros stone gate — pixelated archway with wooden doors and flag
export function IntramurosGate({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="50" rx="60" ry="7" fill="#000" opacity="0.35" />
      {/* Wall base */}
      <rect x="-56" y="-10" width="112" height="60" fill="#807870" stroke="#1a1a2a" strokeWidth="2" />
      {/* Stone blocks pattern */}
      {[...Array(4)].map((_, row) =>
        [...Array(9)].map((_, col) => {
          const bx = -56 + col * 12 + (row % 2 === 0 ? 0 : 6);
          const by = -8 + row * 14;
          return (
            <rect key={`${row}-${col}`} x={bx} y={by} width="11" height="2" fill="#5a5248" />
          );
        })
      )}
      {[...Array(3)].map((_, row) =>
        [...Array(10)].map((_, col) => (
          <rect key={`v-${row}-${col}`} x={-56 + col * 12 + (row % 2 === 0 ? 6 : 0)} y={-8 + row * 14} width="2" height="14" fill="#5a5248" />
        ))
      )}
      {/* Crenellations on top */}
      {[...Array(9)].map((_, i) => (
        <rect key={i} x={-54 + i * 12} y={-18} width="8" height="8" fill="#807870" stroke="#1a1a2a" strokeWidth="1.5" />
      ))}
      {/* Archway opening */}
      <rect x="-14" y="10" width="28" height="40" fill="#2a1a10" />
      <rect x="-14" y="8"  width="28" height="6"  fill="#3d2a1a" />
      <rect x="-16" y="14" width="4"  height="36" fill="#5a4030" stroke="#1a1a2a" strokeWidth="1" />
      <rect x="12"  y="14" width="4"  height="36" fill="#5a4030" stroke="#1a1a2a" strokeWidth="1" />
      {/* Wooden doors */}
      <rect x="-11" y="14" width="10" height="34" fill="#6b4020" stroke="#1a1a2a" strokeWidth="1" />
      <rect x="1"   y="14" width="10" height="34" fill="#6b4020" stroke="#1a1a2a" strokeWidth="1" />
      <rect x="-10" y="20" width="2"  height="28" fill="#4a2a10" />
      <rect x="2"   y="20" width="2"  height="28" fill="#4a2a10" />
      <rect x="-6"  y="14" width="2"  height="34" fill="#4a2a10" />
      <rect x="4"   y="14" width="2"  height="34" fill="#4a2a10" />
      <rect x="-3"  y="30" width="2"  height="2"  fill="#ffe066" />
      <rect x="1"   y="30" width="2"  height="2"  fill="#ffe066" />
      {/* Flag */}
      <rect x="-1" y="-40" width="2" height="22" fill="#3a2a1a" />
      <rect x="1"  y="-38" width="14" height="10" fill="#4080c8" stroke="#1a1a2a" strokeWidth="1" />
      <rect x="1"  y="-33" width="14" height="5"  fill="#d03030" />
      <rect x="1"  y="-38" width="5"  height="10" fill="#ffe066" />
    </g>
  );
}

// Stone wall segment — tiles to extend the Intramuros wall across the zone
export function StoneWall({ x, y, length = 120 }: { x: number; y: number; length?: number }) {
  const n = Math.floor(length / 12);
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx={length / 2} cy="40" rx={length / 2 + 4} ry="4" fill="#000" opacity="0.3" />
      <rect x="0" y="-6" width={length} height="46" fill="#807870" stroke="#1a1a2a" strokeWidth="2" />
      {[...Array(3)].map((_, row) =>
        [...Array(n)].map((_, col) => {
          const bx = col * 12 + (row % 2 === 0 ? 0 : 6);
          const by = -4 + row * 14;
          return <rect key={`${row}-${col}`} x={bx} y={by} width="11" height="2" fill="#5a5248" />;
        })
      )}
      {[...Array(n)].map((_, i) => (
        <rect key={i} x={i * 12} y="-14" width="8" height="8" fill="#807870" stroke="#1a1a2a" strokeWidth="1.5" />
      ))}
    </g>
  );
}

// Shopping mall (MOA) — wide flat building with blue glass facade + sign
export function ShoppingMall({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="40" rx="100" ry="7" fill="#000" opacity="0.35" />
      {/* Base building */}
      <rect x="-90" y="-30" width="180" height="70" fill="#e0d0a0" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-88" y="-28" width="176" height="6"  fill="#f0e0b0" />
      <rect x="-90" y="36"  width="180" height="4"  fill="#a09060" />
      {/* Blue glass facade */}
      <rect x="-80" y="-18" width="160" height="20" fill="#4080c8" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="-80" y="-16" width="160" height="4"  fill="#80b0e0" />
      {[...Array(18)].map((_, i) => (
        <rect key={i} x={-80 + i * 9} y={-18} width="1" height="20" fill="#1a1a2a" />
      ))}
      {/* Second tier */}
      <rect x="-60" y="8"  width="120" height="14" fill="#60a0d0" stroke="#1a1a2a" strokeWidth="1.5" />
      {[...Array(13)].map((_, i) => (
        <rect key={i} x={-60 + i * 10} y={8} width="1" height="14" fill="#1a1a2a" />
      ))}
      {/* Entrance */}
      <rect x="-16" y="22" width="32" height="18" fill="#2a2a3a" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-14" y="24" width="28" height="16" fill="#5080b0" />
      <rect x="0"   y="24" width="1"  height="16" fill="#808088" />
      {/* Rooftop sign */}
      <rect x="-48" y="-48" width="96" height="18" fill="#1a1a2a" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-44" y="-46" width="88" height="14" fill="#4080c8" />
      <text x="0" y="-35" textAnchor="middle" fontSize="8" fill="#ffffff"
            fontFamily="'Press Start 2P', monospace">MALL OF ASIA</text>
    </g>
  );
}

// Pixel palm tree — hard-edge rects, no curves
export function PixelPalm({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="24" rx="16" ry="3" fill="#000" opacity="0.35" />
      {/* Trunk — alternating dark/light rects */}
      <rect x="-4" y="-6"  width="8" height="30" fill="#6b4020" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="-4" y="0"   width="8" height="2" fill="#4a2a10" />
      <rect x="-4" y="8"   width="8" height="2" fill="#4a2a10" />
      <rect x="-4" y="16"  width="8" height="2" fill="#4a2a10" />
      {/* Fronds — 6 chunky rect pairs */}
      <rect x="-24" y="-10" width="10" height="4" fill="#2d8b2d" stroke="#1a1a2a" strokeWidth="1" />
      <rect x="-20" y="-6"  width="6"  height="4" fill="#2d8b2d" />
      <rect x="14"  y="-10" width="10" height="4" fill="#2d8b2d" stroke="#1a1a2a" strokeWidth="1" />
      <rect x="14"  y="-6"  width="6"  height="4" fill="#2d8b2d" />
      <rect x="-16" y="-18" width="8"  height="4" fill="#4cb04c" stroke="#1a1a2a" strokeWidth="1" />
      <rect x="8"   y="-18" width="8"  height="4" fill="#4cb04c" stroke="#1a1a2a" strokeWidth="1" />
      <rect x="-6"  y="-22" width="4"  height="8" fill="#4cb04c" stroke="#1a1a2a" strokeWidth="1" />
      <rect x="2"   y="-22" width="4"  height="8" fill="#4cb04c" stroke="#1a1a2a" strokeWidth="1" />
      {/* Coconuts */}
      <rect x="-3" y="-8" width="3" height="3" fill="#2a1a0a" />
      <rect x="0"  y="-8" width="3" height="3" fill="#2a1a0a" />
    </g>
  );
}

// Hot air balloon — drifts across the sky band
export function HotAirBalloon({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <motion.g
      initial={{ x: x - 200 }}
      animate={{ x: x + 1100 }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear", delay }}
    >
      <g transform={`translate(0, ${y})`} shapeRendering="crispEdges">
        <ellipse cx="0" cy="30" rx="14" ry="2" fill="#000" opacity="0.25" />
        {/* Balloon — 3 vertical stripes */}
        <rect x="-16" y="-30" width="8"  height="26" fill="#e03030" stroke="#1a1a2a" strokeWidth="1.5" />
        <rect x="-8"  y="-32" width="8"  height="28" fill="#ffe066" stroke="#1a1a2a" strokeWidth="1.5" />
        <rect x="0"   y="-32" width="8"  height="28" fill="#4080c8" stroke="#1a1a2a" strokeWidth="1.5" />
        <rect x="8"   y="-30" width="8"  height="26" fill="#e03030" stroke="#1a1a2a" strokeWidth="1.5" />
        {/* Bottom taper */}
        <rect x="-12" y="-4"  width="24" height="4"  fill="#b02020" stroke="#1a1a2a" strokeWidth="1.5" />
        {/* Ropes */}
        <rect x="-8"  y="0"   width="1"  height="8"  fill="#2a2a3a" />
        <rect x="7"   y="0"   width="1"  height="8"  fill="#2a2a3a" />
        {/* Basket */}
        <rect x="-8"  y="8"   width="16" height="10" fill="#8b5833" stroke="#1a1a2a" strokeWidth="1.5" />
        <rect x="-8"  y="12"  width="16" height="1"  fill="#5a3a1a" />
        <rect x="-4"  y="8"   width="1"  height="10" fill="#5a3a1a" />
        <rect x="3"   y="8"   width="1"  height="10" fill="#5a3a1a" />
      </g>
    </motion.g>
  );
}

// Shopping bag — small filler prop near the mall
export function ShoppingBag({ x, y, color = "#e03030" }: { x: number; y: number; color?: string }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="14" rx="8" ry="2" fill="#000" opacity="0.3" />
      <rect x="-7" y="-4" width="14" height="16" fill={color} stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="-7" y="-2" width="14" height="2"  fill="#1a1a2a" opacity="0.3" />
      {/* Handles */}
      <rect x="-4" y="-9" width="2"  height="6" fill={color} stroke="#1a1a2a" strokeWidth="1" />
      <rect x="2"  y="-9" width="2"  height="6" fill={color} stroke="#1a1a2a" strokeWidth="1" />
      <rect x="-4" y="-9" width="8"  height="1" fill={color} />
    </g>
  );
}

// ── Pixel-art fillers (Phase 9B+) ───────────────────────────────────────

// Mailbox — pixel
export function PixelMailbox({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="14" rx="8" ry="2" fill="#000" opacity="0.3" />
      <rect x="-1" y="-4" width="2" height="18" fill="#404040" />
      <rect x="-9" y="-18" width="18" height="14" fill="#3060c0" stroke="#1a1a2a" strokeWidth="2" />
      <rect x="-9" y="-18" width="18" height="3"  fill="#4a80e0" />
      <rect x="-4" y="-12" width="8"  height="2"  fill="#1a1a2a" />
      <rect x="-6" y="-9"  width="4"  height="3"  fill="#e03030" />
    </g>
  );
}

// Fire hydrant — pixel
export function PixelFireHydrant({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="10" rx="6" ry="2" fill="#000" opacity="0.3" />
      <rect x="-5" y="-4" width="10" height="14" fill="#d03030" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="-5" y="-4" width="10" height="3"  fill="#ff5050" />
      <rect x="-3" y="-10" width="6" height="6"  fill="#d03030" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="-7" y="-1" width="2"  height="3"  fill="#a02020" />
      <rect x="5"  y="-1" width="2"  height="3"  fill="#a02020" />
    </g>
  );
}

// Street sign (stop / directional)
export function PixelStreetSign({ x, y, label = "STOP", bg = "#d03030" }: { x: number; y: number; label?: string; bg?: string }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="20" rx="8" ry="2" fill="#000" opacity="0.3" />
      <rect x="-1" y="-4" width="2" height="24" fill="#606068" />
      <rect x="-12" y="-20" width="24" height="16" fill={bg} stroke="#1a1a2a" strokeWidth="2" />
      <text x="0" y="-9" textAnchor="middle" fontSize="7" fill="#ffffff"
            fontFamily="'Press Start 2P', monospace">{label}</text>
    </g>
  );
}

// Wooden crate
export function PixelCrate({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="10" rx="10" ry="2" fill="#000" opacity="0.3" />
      <rect x="-10" y="-8" width="20" height="18" fill="#a06838" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="-10" y="-8" width="20" height="3"  fill="#c08858" />
      <rect x="-10" y="7"  width="20" height="3"  fill="#704020" />
      <rect x="-1"  y="-8" width="2"  height="18" fill="#5a3010" />
      <rect x="-10" y="-1" width="20" height="2"  fill="#5a3010" />
    </g>
  );
}

// Cobblestone patch — decorative ground tile cluster
export function PixelCobble({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <rect x="-10" y="-6" width="6" height="6" fill="#909098" stroke="#5a5a60" strokeWidth="1" />
      <rect x="-4"  y="-6" width="5" height="5" fill="#a0a0a8" stroke="#5a5a60" strokeWidth="1" />
      <rect x="2"   y="-6" width="6" height="6" fill="#909098" stroke="#5a5a60" strokeWidth="1" />
      <rect x="-8"  y="0"  width="5" height="5" fill="#a0a0a8" stroke="#5a5a60" strokeWidth="1" />
      <rect x="-3"  y="1"  width="6" height="5" fill="#909098" stroke="#5a5a60" strokeWidth="1" />
      <rect x="4"   y="0"  width="5" height="5" fill="#a0a0a8" stroke="#5a5a60" strokeWidth="1" />
    </g>
  );
}

// Road tile — horizontal dirt path segment (pixel-art, tileable)
export function RoadTile({ x, y, width = 60, vertical = false }: { x: number; y: number; width?: number; vertical?: boolean }) {
  const h = 18;
  if (vertical) {
    return (
      <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
        <rect x="-9" y="0" width="18" height={width} fill="#8a6834" stroke="#5a3a1a" strokeWidth="2" />
        <rect x="-7" y="0" width="2"  height={width} fill="#a08a50" />
        <rect x="-1" y="6" width="2"  height="4" fill="#704020" />
        <rect x="-1" y={width - 10} width="2" height="4" fill="#704020" />
        <rect x="3"  y="18" width="2" height="4" fill="#704020" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <rect x="0" y="-9" width={width} height={h} fill="#8a6834" stroke="#5a3a1a" strokeWidth="2" />
      <rect x="0" y="-7" width={width} height="2" fill="#a08a50" />
      <rect x="10" y="-1" width="4" height="2" fill="#704020" />
      <rect x={width - 14} y="-1" width="4" height="2" fill="#704020" />
      <rect x={width / 2 - 2} y="3" width="4" height="2" fill="#704020" />
    </g>
  );
}

// Pixel bush — small round green filler
export function PixelBush({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="8" rx="10" ry="2" fill="#000" opacity="0.3" />
      <rect x="-8" y="-4" width="16" height="10" fill="#2d8b2d" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="-10" y="-2" width="4"  height="6" fill="#2d8b2d" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="6"   y="-2" width="4"  height="6" fill="#2d8b2d" stroke="#1a1a2a" strokeWidth="1.5" />
      <rect x="-6" y="-2" width="12" height="3" fill="#4cb04c" />
      <rect x="-4" y="-6" width="8"  height="3" fill="#4cb04c" stroke="#1a1a2a" strokeWidth="1.5" />
    </g>
  );
}

// Pixel lamp post — tall
export function PixelLampPost({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="14" rx="6" ry="2" fill="#000" opacity="0.3" />
      <rect x="-1" y="-28" width="2" height="42" fill="#404040" />
      <rect x="-4" y="-32" width="8" height="4" fill="#404040" stroke="#1a1a2a" strokeWidth="1" />
      <rect x="-3" y="-30" width="6" height="2" fill="#ffe066">
        <animate attributeName="fill" values="#ffe066;#fff080;#ffe066" dur="3s" repeatCount="indefinite" />
      </rect>
    </g>
  );
}

// PokéAPI accent creature — drops a random Pokemon sprite as decoration
export function AccentCreature({ x, y, dexId, size = 64 }: { x: number; y: number; dexId: number; size?: number }) {
  const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dexId}.png`;
  return (
    <foreignObject x={x - size / 2} y={y - size / 2} width={size} height={size}>
      <img
        src={url}
        alt=""
        width={size}
        height={size}
        draggable={false}
        style={{
          width: size, height: size,
          imageRendering: "pixelated",
          filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.4))",
        }}
      />
    </foreignObject>
  );
}

// Day 6 — Strawberry row
export function StrawberryRow({ x, y, count = 5 }: { x: number; y: number; count?: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="6" rx={count * 10} ry="6" fill="#4d8b3d" stroke="#000" strokeWidth="1.5" />
      {Array.from({ length: count }).map((_, i) => (
        <g key={i} transform={`translate(${(i - (count - 1) / 2) * 16}, 0)`}>
          <path d="M -4 -4 L 4 -4 L 3 2 L 0 5 L -3 2 Z" fill="#e02020" stroke="#000" strokeWidth="1" />
          <path d="M -4 -5 L 4 -5 L 3 -3 L 0 -2 L -3 -3 Z" fill="#40a040" />
        </g>
      ))}
    </g>
  );
}
