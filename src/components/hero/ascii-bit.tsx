"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

const PUPIL_MAX_OFFSET = 3;
const EYE_SIZE = 14;

export type BitPosition = Pick<CSSProperties, "top" | "right" | "bottom" | "left" | "transform">;

interface AsciiBitProps {
  hue: number;
  onClick: () => void;
  position: BitPosition;
  ariaLabel: string;
  glyph?: ReactNode;
  eyePair?: boolean;
  className?: string;
}

export function AsciiBit({
  hue,
  onClick,
  position,
  ariaLabel,
  glyph,
  eyePair,
  className = "",
}: AsciiBitProps) {
  const color = `oklch(var(--bit-l) var(--bit-c) ${hue})`;

  const baseClass =
    "absolute font-mono whitespace-nowrap select-none transition-colors duration-150 hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] focus-visible:bg-[color:var(--ink)] focus-visible:text-[color:var(--paper)] focus-visible:outline-none cursor-pointer";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${baseClass} ${className}`}
      style={{ ...position, color, background: "transparent", border: "none", padding: "0 2px" }}
    >
      {eyePair ? <EyePairContent /> : glyph}
    </button>
  );
}

function EyePairContent() {
  const leftRef = useRef<HTMLSpanElement | null>(null);
  const rightRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const update = (e: PointerEvent) => {
      [leftRef.current, rightRef.current].forEach((eye) => {
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
    window.addEventListener("pointermove", update);
    return () => window.removeEventListener("pointermove", update);
  }, []);

  const eyeStyle: CSSProperties = {
    width: EYE_SIZE,
    height: EYE_SIZE,
    border: "1px solid currentColor",
    borderRadius: "50%",
    background: "var(--paper)",
  };
  const pupilStyle: CSSProperties = {
    width: 4,
    height: 4,
    background: "currentColor",
    borderRadius: "50%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <span className="inline-flex items-center gap-1.5 text-[14px]">
      <span aria-hidden>[</span>
      <span ref={leftRef} className="relative inline-block" style={eyeStyle}>
        <span className="pupil absolute" style={pupilStyle} />
      </span>
      <span ref={rightRef} className="relative inline-block" style={eyeStyle}>
        <span className="pupil absolute" style={pupilStyle} />
      </span>
      <span aria-hidden>]</span>
    </span>
  );
}
