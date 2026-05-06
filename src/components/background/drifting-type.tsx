"use client";

const ROW_TEXT = " AZIZ · TEBBENG · FULLSTACK · ML · ".repeat(8);

const ROW_STYLE = {
  fontFamily: "var(--font-display, 'Courier New', monospace)",
  fontSize: "clamp(8rem, 18vw, 22rem)",
  fontWeight: 900,
  color: "var(--ink)",
  opacity: 0.04,
  letterSpacing: "-0.05em",
} as const;

export function DriftingType() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <div
        className="drift-row absolute left-0 right-0 whitespace-nowrap"
        style={{
          ...ROW_STYLE,
          top: "10%",
          animation: "drift-left 50s linear infinite",
        }}
      >
        {ROW_TEXT}
      </div>
      <div
        className="drift-row absolute left-0 right-0 whitespace-nowrap"
        style={{
          ...ROW_STYLE,
          top: "42%",
          animation: "drift-right 70s linear infinite",
        }}
      >
        {ROW_TEXT}
      </div>
      <div
        className="drift-row absolute left-0 right-0 whitespace-nowrap"
        style={{
          ...ROW_STYLE,
          top: "74%",
          animation: "drift-left 60s linear infinite",
        }}
      >
        {ROW_TEXT}
      </div>
    </div>
  );
}
