"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface TerminalFrameProps {
  prompt?: string;
  children: React.ReactNode;
}

const NAV = [
  { href: "/#about", label: "about" },
  { href: "/#projects", label: "work" },
  { href: "/#contact", label: "contact" },
  { href: "/resume", label: "resume" },
];

export function TerminalFrame({ prompt = "cat index.md", children }: TerminalFrameProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = mounted ? resolvedTheme : "light";
  const next = current === "dark" ? "light" : "dark";

  return (
    <div className="relative z-[2]">
      <header className="sticky top-0 z-30 flex items-baseline justify-between gap-6 border-b border-[color:var(--ink)] bg-[color:var(--paper)] px-4 py-2 text-[12px] sm:px-6 lg:px-8">
        <span className="truncate">
          <span className="opacity-70">aziz@portfolio</span>
          <span className="opacity-50">:~ %</span>
          <span className="ml-2">{prompt}</span>
        </span>
        <nav className="flex items-center gap-3 sm:gap-5">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:underline underline-offset-4">
              {n.label}
            </Link>
          ))}
          <button type="button" onClick={() => setTheme(next)} className="hover:underline underline-offset-4" aria-label="Toggle color theme">
            [{mounted ? current : "…"}]
          </button>
        </nav>
      </header>

      {children}

      <footer className="mt-24 border-t border-[color:var(--ink)] px-4 py-3 text-[12px] sm:px-6 lg:px-8">
        <span className="opacity-70">aziz@portfolio</span>
        <span className="opacity-50">:~ %</span>
        <span className="ml-2 inline-block w-[0.6em] animate-[blink_1s_steps(2,end)_infinite] bg-[color:var(--ink)] align-[-0.1em] h-[1em]" />
      </footer>
    </div>
  );
}
