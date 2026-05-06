"use client";

import { useState } from "react";
import { techStack } from "@/data/tech-stack";

type FlatItem = { name: string; category: string; version?: string };

export function StackCloud() {
  const [hovered, setHovered] = useState<string | null>(null);

  const items: FlatItem[] = techStack.flatMap((cat) =>
    cat.items.map((it) => ({ name: it.name, category: cat.category, version: it.version }))
  );

  return (
    <div
      className="flex flex-wrap gap-2"
      onMouseLeave={() => setHovered(null)}
    >
      {items.map((it) => {
        const isMatch = hovered === null || hovered === it.category;
        const isHovered = hovered === it.category;
        return (
          <span
            key={it.name}
            data-category={it.category}
            onMouseEnter={() => setHovered(it.category)}
            className="font-mono text-[0.8125rem] px-2 py-1 border cursor-default transition-all duration-200 select-none"
            style={{
              borderColor: "var(--ink)",
              opacity: isMatch ? (isHovered ? 1 : 0.85) : 0.2,
              background: isHovered ? "var(--ink)" : "transparent",
              color: isHovered ? "var(--paper)" : "var(--ink)",
              transform: isHovered ? "scale(1.04)" : "scale(1)",
            }}
          >
            [{it.name}]
          </span>
        );
      })}
    </div>
  );
}
