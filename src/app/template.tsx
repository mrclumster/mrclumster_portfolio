"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const SESSION_KEY = "portfolio:enter-wipe-played";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [played, setPlayed] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      setPlayed(true);
      return;
    }
    const already = sessionStorage.getItem(SESSION_KEY) === "1";
    setPlayed(already);
    if (!already) {
      const t = window.setTimeout(() => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setPlayed(true);
      }, 750);
      return () => window.clearTimeout(t);
    }
  }, []);

  const skip = reduced || pathname?.startsWith("/adventure") || played !== false;

  return (
    <>
      {!skip && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[120]"
          style={{ animation: "page-enter-line 700ms cubic-bezier(0.16,1,0.3,1) forwards" }}
        >
          <div
            className="absolute top-0 bottom-0 w-px"
            style={{ left: 0, background: "var(--color-accent)", boxShadow: "0 0 12px var(--color-accent)" }}
          />
        </div>
      )}
      <div
        className={skip ? undefined : "page-enter-clip"}
      >
        {children}
      </div>
    </>
  );
}
