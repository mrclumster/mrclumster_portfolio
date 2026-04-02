"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { navLinks } from "@/data/navigation";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function Header() {
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.href.replace("#", ""));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <nav className="flex items-center gap-1 rounded-full bg-card/60 backdrop-blur-lg ring-1 ring-foreground/10 px-2 py-1.5 shadow-lg shadow-black/10">
        <a
          href="#"
          className="px-2 text-xs font-bold tracking-tight text-foreground transition-colors hover:text-accent-brand"
        >
          AT
        </a>
        <div className="h-3 w-px bg-border" />

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "px-2 py-1 text-[11px] font-medium rounded-full transition-all duration-200",
                activeSection === link.href.replace("#", "")
                  ? "text-accent-brand bg-accent-brand/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="hidden sm:block h-3 w-px bg-border" />

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="sm:hidden" />
            }
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px]">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <nav className="mt-8 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                    activeSection === link.href.replace("#", "")
                      ? "text-accent-brand bg-accent-brand/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <ThemeToggle />
      </nav>
    </div>
  );
}
