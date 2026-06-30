"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { navLinks } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { useAdventureTrigger } from "@/hooks/use-adventure-trigger";
import {
  AdventureTransition,
  preloadAdventureTransition,
} from "@/components/shared/adventure-transition";
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
  const { state: adventureState, trigger: triggerAdventure, skip: skipAdventure } = useAdventureTrigger();

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
    <>
      <AdventureTransition
        active={adventureState === "animating" || adventureState === "triggered"}
        onSkip={skipAdventure}
      />
    <div className="fixed top-4 right-4 z-50">
      <nav className="flex items-center gap-1 rounded-full bg-card/60 backdrop-blur-lg ring-1 ring-foreground/10 px-2 py-1.5 shadow-lg shadow-black/10">
        {/* Adventure mode trigger — subtle, discoverable on hover */}
        <button
          onClick={triggerAdventure}
          onMouseEnter={preloadAdventureTransition}
          onFocus={preloadAdventureTransition}
          title="???"
          aria-label="Enter adventure mode"
          className="px-1.5 py-0.5 text-xs rounded-full text-muted-foreground/40 hover:text-accent-brand transition-colors duration-200 cursor-pointer"
        >
          🎮
        </button>
        <div className="h-3 w-px bg-border" />
        <a
          href="#"
          className="px-2 text-xs font-bold tracking-tight text-foreground transition-colors hover:text-accent-brand"
        >
          AT
        </a>
        <div className="h-3 w-px bg-border" />

        <ThemeToggle />
      </nav>
    </div>
    </>
  );
}
