"use client";

import { ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
}

const emit = (key: string, code: string) => {
  window.dispatchEvent(new KeyboardEvent("keydown", { key, code, bubbles: true }));
  setTimeout(() => {
    window.dispatchEvent(new KeyboardEvent("keyup", { key, code, bubbles: true }));
  }, 120);
};
const emitHold = (key: string, code: string) => {
  window.dispatchEvent(new KeyboardEvent("keydown", { key, code, bubbles: true }));
};
const releaseHold = (key: string, code: string) => {
  window.dispatchEvent(new KeyboardEvent("keyup", { key, code, bubbles: true }));
};

export function ConsoleFrame({ children }: Props) {
  // Default to fullscreen for maximum screen real estate
  const [fullscreen, setFullscreen] = useState(true);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") setFullscreen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── FULLSCREEN MODE ─────────────────────────────────────────────
  if (fullscreen) {
    return (
      <div
        className="fixed inset-0 bg-black overflow-hidden"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        <div className="absolute inset-0">{children}</div>

        {/* Corner-overlay virtual controls */}
        <div className="absolute left-4 bottom-4 z-40" style={{ width: 130, height: 130 }}>
          <Dpad />
        </div>
        <div className="absolute right-4 bottom-4 z-40 flex items-end gap-3">
          <ActionButton label="B" colorBg="#2a1a5a" onPress={() => emit("Escape", "Escape")} size={56} />
          <ActionButton label="A" colorBg="#c73030" onPress={() => emit("Enter", "Enter")} size={72} />
        </div>

        {/* CRT scanlines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(to bottom, rgba(0,255,156,0.04) 0px, rgba(0,255,156,0.04) 1px, transparent 1px, transparent 3px)",
            mixBlendMode: "overlay",
          }}
        />

        {/* F toggle hint (top-right) */}
        <button
          onClick={() => setFullscreen(false)}
          className="absolute top-3 right-3 z-50 px-3 py-1.5 bg-black/80 border border-white/40 text-white/80 text-[8px] hover:bg-white/20"
        >
          [F] CONSOLE
        </button>
      </div>
    );
  }

  // ── CONSOLE MODE (purple GBA frame) ─────────────────────────────
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden"
      style={{ fontFamily: "'Press Start 2P', monospace" }}
    >
      <Starfield />

      <div className="relative" style={{ width: "min(96vw, 1600px)", height: "min(94vh, 900px)" }}>
        <div
          className="absolute inset-0 rounded-[28px]"
          style={{
            background: "linear-gradient(160deg, #6a4ac5 0%, #4528a3 40%, #2d1a78 100%)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.7), inset 0 2px 2px rgba(255,255,255,0.2), inset 0 -4px 8px rgba(0,0,0,0.4)",
            border: "2px solid #3a1f7a",
          }}
        />

        <div className="absolute top-2 left-0 right-0 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "#ff3838", boxShadow: "0 0 6px #ff3838, inset 0 0 2px rgba(255,255,255,0.8)" }}
            />
            <span className="text-[7px] text-white/70">POWER</span>
          </div>
          <span className="text-[8px] text-white/80 tracking-widest">AZIZ BOY ADVANCE</span>
          <button
            onClick={() => setFullscreen(true)}
            className="text-[7px] text-white/60 hover:text-white/90 cursor-pointer"
          >
            [F] FULLSCREEN
          </button>
        </div>

        <div
          className="absolute"
          style={{
            top: "6%", left: "8%", right: "8%", bottom: "18%",
            background: "#141428",
            borderRadius: "12px",
            padding: "10px",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.9), inset 0 0 2px rgba(0,255,156,0.3)",
          }}
        >
          <div className="relative w-full h-full overflow-hidden bg-black"
               style={{ borderRadius: "4px", boxShadow: "inset 0 0 30px rgba(0,255,156,0.08)" }}>
            {children}
            <div className="absolute inset-0 pointer-events-none"
                 style={{
                   background: "repeating-linear-gradient(to bottom, rgba(0,255,156,0.04) 0px, rgba(0,255,156,0.04) 1px, transparent 1px, transparent 3px)",
                   mixBlendMode: "overlay",
                 }} />
            <div className="absolute inset-0 pointer-events-none"
                 style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)" }} />
          </div>
        </div>

        <div className="absolute" style={{ left: "2.5%", bottom: "3%", width: "11%", aspectRatio: "1/1" }}>
          <Dpad />
        </div>

        <div className="absolute" style={{ right: "2.5%", bottom: "3.5%", width: "14%", aspectRatio: "1.4/1" }}>
          <div className="relative w-full h-full">
            <ActionButton label="B" colorBg="#2a1a5a" onPress={() => emit("Escape", "Escape")}
              style={{ position: "absolute", left: "0%", top: "35%", width: "40%", aspectRatio: "1/1" }} />
            <ActionButton label="A" colorBg="#c73030" onPress={() => emit("Enter", "Enter")}
              style={{ position: "absolute", right: "0%", top: "0%", width: "40%", aspectRatio: "1/1" }} />
          </div>
        </div>

        <div className="absolute flex gap-3" style={{ left: "50%", bottom: "4%", transform: "translateX(-50%)" }}>
          <SmallTab label="SELECT" onPress={() => emit("Tab", "Tab")} />
          <SmallTab label="START"  onPress={() => emit("Enter", "Enter")} />
        </div>

        <div className="absolute flex gap-1" style={{ right: "19%", bottom: "3.5%" }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-1 h-8 rounded-full" style={{ background: "rgba(0,0,0,0.5)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Dpad() {
  const press = (key: string, code: string) => ({
    onMouseDown: () => emitHold(key, code),
    onMouseUp:   () => releaseHold(key, code),
    onMouseLeave:() => releaseHold(key, code),
    onTouchStart:(e: React.TouchEvent) => { e.preventDefault(); emitHold(key, code); },
    onTouchEnd:  (e: React.TouchEvent) => { e.preventDefault(); releaseHold(key, code); },
  });
  const btn = "absolute bg-gradient-to-b from-neutral-800 to-neutral-950 border border-black/60 select-none cursor-pointer flex items-center justify-center text-white/70 text-[14px]";
  return (
    <div className="relative w-full h-full" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))" }}>
      <div className={`${btn} rounded-t`} style={{ left: "33%", top: "0%", width: "34%", height: "34%" }} {...press("ArrowUp", "ArrowUp")}>▲</div>
      <div className={`${btn} rounded-b`} style={{ left: "33%", bottom: "0%", width: "34%", height: "34%" }} {...press("ArrowDown", "ArrowDown")}>▼</div>
      <div className={`${btn} rounded-l`} style={{ top: "33%", left: "0%", width: "34%", height: "34%" }} {...press("ArrowLeft", "ArrowLeft")}>◀</div>
      <div className={`${btn} rounded-r`} style={{ top: "33%", right: "0%", width: "34%", height: "34%" }} {...press("ArrowRight", "ArrowRight")}>▶</div>
      <div className="absolute bg-neutral-900" style={{ left: "33%", top: "33%", width: "34%", height: "34%" }} />
    </div>
  );
}

function ActionButton({
  label, colorBg, onPress, style, size,
}: {
  label: string; colorBg: string; onPress: () => void;
  style?: React.CSSProperties; size?: number;
}) {
  const sizeStyle: React.CSSProperties = size ? { width: size, height: size } : {};
  return (
    <button
      onClick={onPress}
      className="rounded-full flex items-center justify-center font-bold select-none active:translate-y-0.5 transition-transform"
      style={{
        background: `radial-gradient(circle at 30% 30%, ${colorBg}, #000)`,
        color: "#ffffff",
        fontSize: size ? Math.floor(size * 0.38) : "18px",
        boxShadow: "0 3px 0 rgba(0,0,0,0.8), inset 0 -3px 4px rgba(0,0,0,0.5), inset 0 2px 2px rgba(255,255,255,0.2)",
        fontFamily: "'Press Start 2P', monospace",
        ...sizeStyle,
        ...style,
      }}
    >
      {label}
    </button>
  );
}

function SmallTab({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <button
      onClick={onPress}
      className="px-4 py-1.5 rounded-full bg-neutral-900 border border-black/60 text-white/70 text-[8px] select-none active:translate-y-0.5"
      style={{ boxShadow: "0 2px 0 rgba(0,0,0,0.6)" }}
    >
      {label}
    </button>
  );
}

function Starfield() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-70">
      <svg className="w-full h-full">
        {Array.from({ length: 60 }).map((_, i) => (
          <circle
            key={i}
            cx={`${(i * 37) % 100}%`}
            cy={`${(i * 73) % 100}%`}
            r={((i % 3) + 1) * 0.6}
            fill="#ffffff"
          >
            <animate
              attributeName="opacity"
              values="0.15;1;0.15"
              dur={`${2.5 + (i % 5)}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
}
