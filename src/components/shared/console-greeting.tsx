"use client";

import { useEffect } from "react";

export function ConsoleGreeting() {
  useEffect(() => {
    const brand = "color: #6366f1; font-size: 14px; font-weight: bold;";
    const muted = "color: #94a3b8; font-size: 12px;";
    const accent = "color: #818cf8; font-size: 12px;";

    console.log(
      "%c👋 Hi! You opened the console — I respect that.\n",
      brand
    );
    console.log(
      "%c📧  aziztebbeng@gmail.com\n%c🔗  github.com/mrclumster\n%c💼  linkedin.com/in/aziztebbengthemrclumster",
      accent,
      accent,
      accent
    );
    console.log(
      "%c\nBuilt with Next.js · Tailwind · A lot of caffeine ☕",
      muted
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
