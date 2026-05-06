"use client";

import { useEffect, useRef, useState } from "react";

type BootLine = {
  text: string;
  status?: "OK" | "WARN" | "ERR" | null;
  delay: number;
};

const BOOT_LINES: BootLine[] = [
  { text: "BIOS v2.6.1 — Aziz Tebbeng Portfolio", status: null, delay: 0 },
  { text: "Initializing memory modules............", status: "OK", delay: 180 },
  { text: "Loading personality kernel...............", status: "OK", delay: 340 },
  { text: "Mounting /skills/frontend.................  ", status: "OK", delay: 500 },
  { text: "Mounting /skills/backend..................  ", status: "OK", delay: 640 },
  { text: "Mounting /skills/ml.......................  ", status: "OK", delay: 760 },
  { text: "Checking caffeine levels..................  ", status: "WARN", delay: 900 },
  { text: "Spawning dev server.......................  ", status: "OK", delay: 1060 },
  { text: "Running git pull origin main..............  ", status: "OK", delay: 1200 },
  { text: "Ready. Welcome to the terminal.", status: null, delay: 1420 },
];

export function BootSequence({ onComplete }: { onComplete?: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [done, setDone] = useState(false);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  function start() {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
    setVisibleCount(0);
    setDone(false);

    BOOT_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleCount(i + 1);
        if (i === BOOT_LINES.length - 1) {
          setTimeout(() => {
            setDone(true);
            onComplete?.();
          }, 400);
        }
      }, line.delay);
      timerRefs.current.push(t);
    });
  }

  useEffect(() => {
    start();
    return () => timerRefs.current.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="font-mono text-[13px] leading-[1.8] select-none cursor-pointer"
      onClick={start}
      title="Click to replay"
      aria-label="Terminal boot sequence animation"
    >
      {BOOT_LINES.slice(0, visibleCount).map((line, i) => (
        <div key={i} className="flex items-baseline gap-2">
          <span
            className="opacity-70"
            style={{ whiteSpace: "pre" }}
          >
            {line.text}
          </span>
          {line.status && (
            <span
              className="text-[11px] font-bold tracking-widest shrink-0"
              style={{
                color:
                  line.status === "OK"
                    ? "var(--ink)"
                    : line.status === "WARN"
                    ? "var(--alarm)"
                    : "#e74c3c",
                opacity: line.status === "OK" ? 0.55 : 1,
              }}
            >
              [{line.status}]
            </span>
          )}
        </div>
      ))}
      {!done && visibleCount > 0 && (
        <span
          className="inline-block w-[0.55em] h-[1.1em] align-[-0.15em] animate-[blink_1s_steps(2,end)_infinite]"
          style={{ background: "var(--ink)" }}
        />
      )}
      {done && (
        <p className="mt-1 opacity-30 text-[11px] tracking-widest">
          — click to replay —
        </p>
      )}
    </div>
  );
}
