"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

const PUPIL_MAX_OFFSET = 3;
const EYE_SIZE = 14;

export type BitPosition = Pick<CSSProperties, "top" | "right" | "bottom" | "left" | "transform">;

type EyeVariant = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

interface AsciiBitProps {
  hue: number;
  onClick: () => void;
  position: BitPosition;
  ariaLabel: string;
  glyph?: ReactNode;
  eyePair?: boolean;
  eyeVariant?: EyeVariant;
  className?: string;
}

export function AsciiBit({
  hue,
  onClick,
  position,
  ariaLabel,
  glyph,
  eyePair,
  eyeVariant = 1,
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
      {eyePair ? <EyePairContent variant={eyeVariant} /> : glyph}
    </button>
  );
}

interface EyePairContentProps {
  variant: EyeVariant;
}

function EyePairContent({ variant }: EyePairContentProps) {
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
    position: "relative",
    display: "inline-block",
    ...getEyeSocketStyle(variant),
  };

  const pupilStyle: CSSProperties = {
    ...getPupilStyle(variant),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    position: "absolute",
  };

  const [openBracket, closeBracket] = getBrackets(variant);

  return (
    <span className="inline-flex items-center gap-1.5 text-[14px]">
      <span aria-hidden>{openBracket}</span>
      <span ref={leftRef} style={eyeStyle}>
        <span className="pupil" style={pupilStyle} />
      </span>
      <span ref={rightRef} style={eyeStyle}>
        <span className="pupil" style={pupilStyle} />
      </span>
      <span aria-hidden>{closeBracket}</span>
    </span>
  );
}

function getBrackets(variant: EyeVariant): [string, string] {
  switch (variant) {
    case 1:  return ["[", "]"];
    case 2:  return ["(", ")"];
    case 3:  return ["{", "}"];
    case 4:  return ["<", ">"];
    case 5:  return ["|", "|"];
    case 6:  return ["«", "»"];
    case 7:  return ["/", "/"];
    case 8:  return ["*", "*"];
    case 9:  return ["~", "~"];
    case 10: return ["⟨", "⟩"];
  }
}

function getEyeSocketStyle(variant: EyeVariant): CSSProperties {
  switch (variant) {
    case 1:
      // round outline
      return { border: "1px solid currentColor", borderRadius: "50%", background: "var(--paper)" };
    case 2:
      // double-ring ⊙
      return { border: "1px solid currentColor", borderRadius: "50%", background: "var(--paper)", boxShadow: "inset 0 0 0 3px var(--paper), inset 0 0 0 4px currentColor" };
    case 3:
      // square
      return { border: "1px solid currentColor", borderRadius: "2px", background: "var(--paper)" };
    case 4:
      // diamond
      return { border: "1px solid currentColor", borderRadius: "2px", background: "var(--paper)", transform: "rotate(45deg)", width: 11, height: 11 };
    case 5:
      // filled circle, white pupil
      return { border: "1.5px solid currentColor", borderRadius: "50%", background: "currentColor" };
    case 6:
      // tall oval
      return { border: "1px solid currentColor", borderRadius: "50%", background: "var(--paper)", width: 10, height: 15 };
    case 7:
      // half-circle (flat bottom)
      return { border: "1px solid currentColor", borderRadius: "50% 50% 0 0 / 100% 100% 0 0", background: "var(--paper)" };
    case 8:
      // thick round, no fill — just a heavy ring
      return { border: "2.5px solid currentColor", borderRadius: "50%", background: "transparent" };
    case 9:
      // squircle
      return { border: "1px solid currentColor", borderRadius: "30%", background: "var(--paper)" };
    case 10:
      // concentric: outer ring + mid ring + pupil
      return { border: "1px solid currentColor", borderRadius: "50%", background: "var(--paper)", boxShadow: "inset 0 0 0 2px var(--paper), inset 0 0 0 3px currentColor, inset 0 0 0 5px var(--paper)" };
  }
}

function getPupilStyle(variant: EyeVariant): CSSProperties {
  switch (variant) {
    case 1:
      return { width: 4, height: 4, background: "currentColor", borderRadius: "50%" };
    case 2:
      return { width: 3, height: 3, background: "currentColor", borderRadius: "50%" };
    case 3:
      return { width: 4, height: 4, background: "currentColor", borderRadius: "0" };
    case 4:
      // counter-rotate so pupil stays upright inside diamond
      return { width: 3, height: 3, background: "currentColor", borderRadius: "50%", transform: "translate(-50%, -50%) rotate(-45deg)" };
    case 5:
      return { width: 4, height: 4, background: "var(--paper)", borderRadius: "50%" };
    case 6:
      // elongated vertical pupil (cat-eye)
      return { width: 3, height: 6, background: "currentColor", borderRadius: "50%" };
    case 7:
      // dot stays in lower half of semicircle
      return { width: 4, height: 4, background: "currentColor", borderRadius: "50%", top: "60%" };
    case 8:
      // dot inside the open ring
      return { width: 3, height: 3, background: "currentColor", borderRadius: "50%" };
    case 9:
      // square pupil inside squircle
      return { width: 4, height: 4, background: "currentColor", borderRadius: "1px" };
    case 10:
      // tiny dot in center of triple ring
      return { width: 2, height: 2, background: "currentColor", borderRadius: "50%" };
  }
}
