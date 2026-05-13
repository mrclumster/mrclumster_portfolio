"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface TerminalFrameProps {
  children: React.ReactNode;
}

const NAV = [
  { href: "/#about", label: "about" },
  { href: "/#projects", label: "work" },
  { href: "/#contact", label: "contact" },
  { href: "/resume", label: "resume" },
];

export function TerminalFrame({ children }: TerminalFrameProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = mounted ? resolvedTheme : "light";
  const next = current === "dark" ? "light" : "dark";

  return (
    <div>
      <header className="sticky top-0 z-30 flex items-center justify-between gap-6 border-b border-[color:var(--ink)] bg-[color:var(--paper)] px-4 py-3 text-[13px] sm:px-6 lg:px-8">
        <div className="font-bold tracking-tight">
          @aziztebbeng
        </div>
        <nav className="flex items-center gap-3 sm:gap-6">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:underline underline-offset-4 font-bold uppercase tracking-wider sm:tracking-widest text-[11px]">
              {n.label}
            </Link>
          ))}
          <button 
            type="button" 
            onClick={() => setTheme(next)} 
            className="hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] px-1.5 py-0.5 border border-[color:var(--ink)] transition-colors text-[10px] uppercase font-bold" 
            aria-label="Toggle color theme"
          >
            {mounted ? current : "…"}
          </button>
        </nav>
      </header>

      {children}

      <footer className="mt-24 border-t border-[color:var(--ink)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-2">
            <div className="text-[13px] font-bold tracking-tight">@aziztebbeng</div>
            <div className="text-[11px] opacity-70 leading-relaxed">
              Hand-crafted with code.
            </div>
          </div>
          <div className="md:text-right space-y-4">
            <div className="flex flex-wrap md:justify-end gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-widest">
              <a href="https://github.com/mrclumster" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">Github</a>
              <a href="https://www.linkedin.com/in/aziztebbengthemrclumster/" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">Linkedin</a>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[color:var(--ink)] text-[10px] font-bold uppercase tracking-tighter">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Available for new projects
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
