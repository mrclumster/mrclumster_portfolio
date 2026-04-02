"use client";

import { ArrowUp } from "lucide-react";
import { personalInfo } from "@/data/personal";
import { navLinks } from "@/data/navigation";

export function Footer() {
  return (
    <footer className="border-t border-border/50 px-4 py-6 mt-8">
      <div className="mx-auto max-w-6xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {personalInfo.name}
        </p>
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs text-muted-foreground transition-colors duration-200 hover:text-accent-brand"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors duration-200 hover:text-accent-brand cursor-pointer"
          aria-label="Back to top"
        >
          Back to top
          <ArrowUp className="h-3 w-3" />
        </button>
      </div>
    </footer>
  );
}
