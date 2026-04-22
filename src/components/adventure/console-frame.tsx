"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "./use-is-mobile";

interface Props {
  children: ReactNode;
  muted?: boolean;
  onMuteToggle?: () => void;
}

// BSIT jacket-green palette — forest green dominant, white accent line
const GREEN_TOP    = "#3a8050";
const GREEN_MID    = "#2a6c40";
const GREEN_DARK   = "#1a4a2a";
const GREEN_BORDER = "#0f3520";
const GREEN_HI     = "#6bc88a";   // bright LED-green accent
const GREEN_LINE   = "#a8e0b8";   // light stripe on top of bar
// Legacy alias — older refs in this file still use these names
const NAVY_TOP    = GREEN_TOP;
const NAVY_MID    = GREEN_MID;
const NAVY_DARK   = GREEN_DARK;
const NAVY_BORDER = GREEN_BORDER;
const GREEN       = "#e8d9a0";   // cream-gold accent for button borders on green bar

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

const BAR_HEIGHT         = 210; // desktop
const BAR_HEIGHT_MOBILE  = 260; // mobile — taller so the two-row layout fits

export function ConsoleFrame({ children, muted = true, onMuteToggle }: Props) {
  const router = useRouter();
  const { isMobile } = useIsMobile();
  const barH       = isMobile ? BAR_HEIGHT_MOBILE : BAR_HEIGHT;
  const dpadSize   = isMobile ? 92  : 140;
  const aSize      = isMobile ? 64  : 104;
  const bSize      = isMobile ? 50  : 82;
  // Default = docked mode with bottom controller bar always visible
  const [docked, setDocked] = useState(true);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") setDocked((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── UNDOCKED (legacy floating overlay mode) ─────────────────────
  if (!docked) {
    return (
      <div
        className="fixed inset-0 bg-black overflow-hidden"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        <div className="absolute inset-0">{children}</div>
        <ControlsCorner />
        <div className="absolute inset-0 pointer-events-none crt-overlay" />
        <button
          onClick={() => setDocked(true)}
          className="absolute top-3 right-3 z-50 px-3 py-1.5 bg-black/80 border border-white/40 text-white/80 text-[8px] hover:bg-white/20"
        >
          [F] DOCK
        </button>
      </div>
    );
  }

  // ── DOCKED (default): game area on top, fixed controller bar at bottom ─
  return (
    <div
      className="fixed inset-0 bg-black overflow-hidden flex flex-col"
      style={{ fontFamily: "'Press Start 2P', monospace" }}
    >
      {/* Game area — everything above the bar */}
      <div
        className="relative flex-1 min-h-0"
        style={{ marginBottom: barH }}
      >
        <div className="absolute inset-0">{children}</div>
        <div className="absolute inset-0 pointer-events-none crt-overlay" />
      </div>

      {/* GBA1 — authentic Game Boy Advance-inspired housing.
          Desktop: single-row layout.  Mobile: two-row (cartridge banner on top,
          control clusters below) so nothing overlaps on narrow screens. */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 border-t-4"
        style={{
          height: barH,
          paddingLeft:  isMobile ? 10 : 30,
          paddingRight: isMobile ? 10 : 30,
          paddingTop:    isMobile ? 8  : 0,
          paddingBottom: isMobile ? 10 : 0,
          background: `
            radial-gradient(ellipse at 50% -20%, ${GREEN_TOP} 0%, ${GREEN_MID} 40%, ${GREEN_DARK} 100%)`,
          borderColor: GREEN_BORDER,
          boxShadow: `
            inset 0 3px 0 rgba(255,255,255,0.22),
            inset 0 -3px 6px rgba(0,0,0,0.55),
            0 -3px 0 ${GREEN_BORDER}`,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: isMobile ? "space-between" : "space-between",
          gap: isMobile ? 8 : 0,
        }}
      >
        {/* Plastic shine on the top edge */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: 2, background: `linear-gradient(90deg, transparent, ${GREEN_LINE}, transparent)` }}
        />

        {/* ── MOBILE ROW 1: cartridge label banner ─────────────── */}
        {isMobile && <CartridgeLabel mobile />}

        {/* ── CONTROLS ROW ─────────────────────────────────────── */}
        <div
          className="flex items-center w-full"
          style={{
            justifyContent: "space-between",
            flex: isMobile ? "1 1 auto" : undefined,
          }}
        >
          {/* LEFT: D-pad cluster */}
          <DpadWell size={dpadSize} />

          {/* CENTER: on desktop, cartridge + pills + icons stack here.
              On mobile, cartridge lives up top so this column only holds
              SELECT/START + icon row. */}
          <div
            className="flex flex-col items-center"
            style={{ gap: isMobile ? 8 : 10, flexShrink: 1, minWidth: 0 }}
          >
            {!isMobile && <CartridgeLabel mobile={false} />}
            <div
              className={isMobile ? "flex flex-col items-stretch" : "flex items-center"}
              style={{ gap: isMobile ? 5 : 14 }}
            >
              <PixelButton label="SELECT" onPress={() => emit("Tab", "Tab")}    mobile={isMobile} />
              <PixelButton label="START"  onPress={() => emit("Enter", "Enter")} mobile={isMobile} />
            </div>
            <div className="flex items-center" style={{ gap: isMobile ? 8 : 10 }}>
              <IconButton title="Portfolio" onClick={() => router.push("/")} mobile={isMobile}>
                ←
              </IconButton>
              {onMuteToggle && (
                <IconButton
                  title={muted ? "Unmute" : "Mute"}
                  onClick={onMuteToggle}
                  mobile={isMobile}
                  active={!muted}
                >
                  ♪
                </IconButton>
              )}
              {!isMobile && (
                <IconButton title="Fullscreen" onClick={() => setDocked(false)} mobile={isMobile}>
                  ⛶
                </IconButton>
              )}
            </div>
          </div>

          {/* RIGHT: A/B buttons with GBA geometry */}
          <ButtonCluster
            aSize={aSize}
            bSize={bSize}
            mobile={isMobile}
            onA={() => emit("Enter", "Enter")}
            onB={() => emit("Escape", "Escape")}
          />
        </div>
      </div>

      <style jsx global>{`
        .crt-overlay {
          background: repeating-linear-gradient(to bottom,
            rgba(0,255,156,0.035) 0px,
            rgba(0,255,156,0.035) 1px,
            transparent 1px,
            transparent 3px);
          mix-blend-mode: overlay;
        }
      `}</style>
    </div>
  );
}

function ControlsCorner() {
  return (
    <>
      <div className="absolute left-4 bottom-4 z-40" style={{ width: 130, height: 130 }}>
        <Dpad />
      </div>
      <div className="absolute right-4 bottom-4 z-40 flex items-end gap-3">
        <ActionButton label="B" colorBg="#2a1a5a" onPress={() => emit("Escape", "Escape")} size={56} />
        <ActionButton label="A" colorBg="#c73030" onPress={() => emit("Enter", "Enter")} size={72} />
      </div>
    </>
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
  const btn = "absolute bg-gradient-to-b from-neutral-800 to-neutral-950 border border-black/60 select-none cursor-pointer flex items-center justify-center text-white/80 text-[14px]";
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
  label, colorBg, onPress, size,
}: {
  label: string; colorBg: string; onPress: () => void; size: number;
}) {
  return (
    <button
      onClick={onPress}
      className="rounded-full flex items-center justify-center font-bold select-none active:translate-y-0.5 transition-transform"
      style={{
        width: size, height: size,
        background: `radial-gradient(circle at 30% 30%, ${colorBg}, #000)`,
        color: "#ffffff",
        fontSize: Math.floor(size * 0.38),
        boxShadow: "0 3px 0 rgba(0,0,0,0.8), inset 0 -3px 4px rgba(0,0,0,0.5), inset 0 2px 2px rgba(255,255,255,0.2)",
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      {label}
    </button>
  );
}

// ── GBA-style D-pad inside a recessed cross-shaped well ────────────────
function DpadWell({ size }: { size: number }) {
  const pad = Math.round(size * 0.14);
  return (
    <div
      className="relative"
      style={{
        width: size + pad * 2,
        height: size + pad * 2,
        padding: pad,
        borderRadius: "50%",
        background: `radial-gradient(circle at 30% 30%, ${GREEN_DARK}, ${GREEN_BORDER} 80%, #000)`,
        boxShadow: `inset 0 3px 6px rgba(0,0,0,0.75), inset 0 -1px 2px rgba(255,255,255,0.1), 0 1px 0 rgba(255,255,255,0.1)`,
      }}
    >
      <div style={{ width: size, height: size }}>
        <Dpad />
      </div>
    </div>
  );
}

// ── Premium cartridge-label: cream sticker with gold-foil border ───────
function CartridgeLabel({ mobile }: { mobile: boolean }) {
  const w  = mobile ? 168 : 238;
  const h  = mobile ? 40  : 54;
  const fs = mobile ? 8   : 11;
  const ss = mobile ? 5   : 7;
  return (
    <div
      className="relative"
      style={{
        width: w, height: h,
        background: "linear-gradient(180deg, #fbf3d9 0%, #efe0b0 100%)",
        borderRadius: 4,
        boxShadow: `
          inset 0 0 0 1.5px #2a6c40,
          inset 0 0 0 3px #e8d9a0,
          inset 0 0 0 4.5px #1a2550,
          0 2px 0 rgba(0,0,0,0.35),
          0 4px 8px rgba(0,0,0,0.35)`,
        padding: mobile ? "3px 10px" : "5px 14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      {/* Gold-foil rivet dots at each corner */}
      {[
        { top: 3,  left: 3 },
        { top: 3,  right: 3 },
        { bottom: 3, left: 3 },
        { bottom: 3, right: 3 },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: 4, height: 4, borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, #fff5c2, #caa030 80%)",
            boxShadow: "0 0 0 0.5px rgba(0,0,0,0.4)",
            ...pos,
          }}
        />
      ))}

      {/* Pokéball emblem to the left of the title */}
      <div
        className="absolute"
        style={{
          left: mobile ? 16 : 24,
          top: "50%",
          transform: "translateY(-50%)",
          width: mobile ? 12 : 16, height: mobile ? 12 : 16,
          borderRadius: "50%",
          background: "linear-gradient(180deg, #d03030 0%, #d03030 45%, #1a1a2a 45%, #1a1a2a 55%, #fdfaed 55%, #fdfaed 100%)",
          boxShadow: "0 0 0 1px #1a1a2a, inset 0 -1px 0 rgba(0,0,0,0.3)",
        }}
      >
        <div
          className="absolute"
          style={{
            top: "50%", left: "50%",
            width: mobile ? 4 : 6, height: mobile ? 4 : 6,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: "#fdfaed",
            boxShadow: "inset 0 0 0 1px #1a1a2a",
          }}
        />
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: fs,
          color: "#1a2550",
          letterSpacing: 2,
          textShadow: "1px 1px 0 rgba(200, 160, 48, 0.35)",
        }}
      >
        {mobile ? "AZIZ BOY" : "AZIZ BOY ADVANCE"}
      </div>
      {/* Hairline divider */}
      <div
        style={{
          width: "60%", height: 1,
          background: "linear-gradient(90deg, transparent, #caa030, transparent)",
          margin: mobile ? "2px 0" : "3px 0",
        }}
      />
      {/* Subtitle */}
      <div
        style={{
          fontSize: ss,
          color: "#6a5a30",
          letterSpacing: 2,
        }}
      >
        © MRCLUMSTER · 2026
      </div>
    </div>
  );
}

// ── Flat pixel SELECT/START button ─────────────────────────────────────
function PixelButton({
  label, onPress, mobile,
}: { label: string; onPress: () => void; mobile: boolean }) {
  return (
    <button
      onClick={onPress}
      className="select-none active:translate-y-0.5 transition-transform"
      style={{
        padding: mobile ? "3px 10px" : "8px 22px",
        fontSize: mobile ? 7 : 10,
        letterSpacing: mobile ? 1 : 2,
        minWidth: mobile ? 76 : undefined,
        textAlign: "center",
        color: "#fef7d8",
        background: "linear-gradient(180deg, #1f2a50 0%, #0c132b 100%)",
        border: "2px solid #000",
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.15),
          inset 0 0 0 1px #e8d9a0,
          inset 0 -2px 0 rgba(0,0,0,0.5),
          0 3px 0 rgba(0,0,0,0.6)`,
        fontFamily: "'Press Start 2P', monospace",
        textShadow: "1px 1px 0 #000",
      }}
    >
      {label}
    </button>
  );
}

// ── Tiny square icon button (portfolio / music / fullscreen) ───────────
function IconButton({
  children, onClick, title, mobile, active,
}: {
  children: React.ReactNode; onClick: () => void;
  title: string; mobile: boolean; active?: boolean;
}) {
  const size = mobile ? 22 : 26;
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="select-none cursor-pointer hover:brightness-110 transition-all active:translate-y-0.5"
      style={{
        width: size, height: size,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: mobile ? 10 : 12,
        color: active ? "#ffd93a" : "#e8d9a0",
        background: "linear-gradient(180deg, #1a2550 0%, #0a1230 100%)",
        border: `1.5px solid #e8d9a0`,
        borderRadius: 4,
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.15),
          0 2px 0 rgba(0,0,0,0.5)`,
        fontFamily: "'Press Start 2P', monospace",
        lineHeight: 1,
      }}
    >
      {children}
    </button>
  );
}

// ── GBA-style A/B button cluster — A sits higher-right and is bigger ────
function ButtonCluster({
  aSize, bSize, onA, onB, mobile,
}: { aSize: number; bSize: number; onA: () => void; onB: () => void; mobile: boolean }) {
  const gap      = Math.round(aSize * 0.18);
  const clusterW = aSize + bSize + gap + 16;
  const clusterH = aSize + Math.round(aSize * 0.22);
  return (
    <div
      className="relative"
      style={{
        width: clusterW,
        height: clusterH,
        padding: 8,
        flexShrink: 0,
        borderRadius: 22,
        background: `radial-gradient(ellipse at 40% 30%, ${GREEN_TOP}, ${GREEN_DARK} 80%, ${GREEN_BORDER})`,
        boxShadow: `inset 0 2px 4px rgba(255,255,255,0.18), inset 0 -3px 6px rgba(0,0,0,0.55), 0 2px 0 ${GREEN_BORDER}`,
        // Keep the iconic GBA tilt on desktop; flat on mobile so the rotated
        // right edge doesn't push the A button off-screen in narrow viewports.
        transform: mobile ? "none" : "rotate(-12deg)",
      }}
    >
      {/* B — smaller, lower-left of the cluster */}
      <div className="absolute" style={{ left: 6, bottom: 4 }}>
        <ActionButton label="B" colorBg="#22306a" onPress={onB} size={bSize} />
      </div>
      {/* A — bigger, upper-right */}
      <div className="absolute" style={{ right: 6, top: 4 }}>
        <ActionButton label="A" colorBg="#c73030" onPress={onA} size={aSize} />
      </div>
    </div>
  );
}
