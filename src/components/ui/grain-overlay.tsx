export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{
        opacity: 0.035,
        mixBlendMode: "overlay",
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        backgroundSize: "320px 320px",
      }}
    />
  );
}
