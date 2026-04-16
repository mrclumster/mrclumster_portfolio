"use client";

import { ArrowUp } from "lucide-react";
import { personalInfo } from "@/data/personal";
import { navLinks } from "@/data/navigation";
import { VCardQR } from "@/components/shared/vcard-qr";

export function Footer() {
  return (
    <footer className="border-t border-border/50 px-4 py-6 mt-8">
      <div className="mx-auto max-w-6xl flex flex-col items-center gap-6 sm:flex-row sm:justify-between sm:items-end">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {personalInfo.name}
          </p>
          <p className="text-[10px] text-muted-foreground/60">
            Built with Next.js &amp; Tailwind
          </p>
        </div>
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
        <div className="flex flex-col items-center gap-3 sm:items-end">
          <VCardQR />
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors duration-200 hover:text-accent-brand cursor-pointer"
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp className="h-3 w-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
