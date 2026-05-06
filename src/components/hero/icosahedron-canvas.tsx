"use client";

import { useEffect, useRef } from "react";

const PHI = (1 + Math.sqrt(5)) / 2;

const RAW_VERTS: [number, number, number][] = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
];

const VERTS: [number, number, number][] = RAW_VERTS.map((v) => {
  const l = Math.hypot(...v);
  return [v[0] / l, v[1] / l, v[2] / l];
});

const EDGES: [number, number][] = [
  [0, 1], [0, 5], [0, 7], [0, 10], [0, 11],
  [1, 5], [1, 7], [1, 8], [1, 9],
  [2, 3], [2, 4], [2, 6], [2, 10], [2, 11],
  [3, 4], [3, 6], [3, 8], [3, 9],
  [4, 5], [4, 9], [4, 11],
  [5, 9], [5, 11],
  [6, 7], [6, 8], [6, 10],
  [7, 8], [7, 10],
  [8, 9], [10, 11],
];

function project(
  v: [number, number, number],
  rx: number,
  ry: number,
  cx: number,
  cy: number,
  r: number,
  w: number,
  h: number
): [number, number] {
  const [x0, y0, z0] = v;
  const cos1 = Math.cos(ry), sin1 = Math.sin(ry);
  const x1 = x0 * cos1 + z0 * sin1;
  const z1 = -x0 * sin1 + z0 * cos1;
  const cos2 = Math.cos(rx), sin2 = Math.sin(rx);
  const y2 = y0 * cos2 - z1 * sin2;
  const z2 = y0 * sin2 + z1 * cos2;
  const scale = (r * 1.4) / (2 + z2);
  return [cx + x1 * scale * w * 0.9, cy + y2 * scale * h * 0.9];
}

export function IcosahedronCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rx = 0, ry = 0;

    function getInk() {
      return document.documentElement.classList.contains("dark")
        ? "rgba(232,228,220,"
        : "rgba(26,26,26,";
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.scale(dpr, dpr);
    }

    function draw() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      const cx = w / 2, cy = h / 2;
      const r = Math.min(w, h) * 0.28;
      const ink = getInk();

      ctx!.clearRect(0, 0, w, h);
      ry += 0.008;
      rx += 0.004;

      const projected = VERTS.map((v) => project(v, rx, ry, cx, cy, r, w, h));

      ctx!.strokeStyle = ink + "0.55)";
      ctx!.lineWidth = 0.8;
      EDGES.forEach(([a, b]) => {
        ctx!.beginPath();
        ctx!.moveTo(...projected[a]);
        ctx!.lineTo(...projected[b]);
        ctx!.stroke();
      });

      ctx!.fillStyle = ink + "0.9)";
      projected.forEach(([x, y]) => {
        ctx!.beginPath();
        ctx!.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx!.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      aria-hidden
    />
  );
}
