"use client";

import { useEffect, useRef } from "react";

const EYE_COUNT = 5;
const PUPIL_MAX_OFFSET = 3;
const EYE_SIZE = 14;

export function CursorEyes() {
  const eyeRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      eyeRefs.current.forEach((eye) => {
        if (!eye) return;
        const rect = eye.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const ratio = Math.min(1, dist / 200);
        const tx = (dx / (dist || 1)) * PUPIL_MAX_OFFSET * ratio;
        const ty = (dy / (dist || 1)) * PUPIL_MAX_OFFSET * ratio;
        const pupil = eye.querySelector(".pupil") as HTMLElement | null;
        if (pupil) {
          pupil.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
        }
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const eyeStyle = {
    width: EYE_SIZE,
    height: EYE_SIZE,
    border: "1px solid var(--ink)",
    borderRadius: "50%",
    background: "var(--paper)",
  } as const;

  const pupilStyle = {
    width: 4,
    height: 4,
    background: "var(--ink)",
    borderRadius: "50%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  } as const;

  return (
    <div className="flex justify-center gap-3 select-none" aria-hidden>
      {Array.from({ length: EYE_COUNT }).map((_, i) => (
        <div key={i} className="font-mono text-[14px] flex items-center gap-1.5" style={{ color: "var(--ink)" }}>
          <span>[</span>
          <span
            ref={(el) => { eyeRefs.current[i * 2] = el; }}
            className="relative inline-block"
            style={eyeStyle}
          >
            <span className="pupil absolute" style={pupilStyle} />
          </span>
          <span
            ref={(el) => { eyeRefs.current[i * 2 + 1] = el; }}
            className="relative inline-block"
            style={eyeStyle}
          >
            <span className="pupil absolute" style={pupilStyle} />
          </span>
          <span>]</span>
        </div>
      ))}
    </div>
  );
}
