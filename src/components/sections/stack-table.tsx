"use client";

import { useState } from "react";
import { techStack } from "@/data/tech-stack";

export function StackTable() {
  const [hovered, setHovered] = useState<number | null>(null);

  const rows = techStack.flatMap((cat) =>
    cat.items.map((it) => ({
      name: it.name.toLowerCase(),
      category: cat.category.toLowerCase(),
    }))
  );

  return (
    <div
      className="font-mono text-[13px] leading-[1.6]"
      onMouseLeave={() => setHovered(null)}
    >
      <p className="opacity-50 mb-3">$ skill --list</p>

      <div className="grid grid-cols-[1fr_1fr] gap-x-6 mb-1 text-[11px] uppercase tracking-widest opacity-50">
        <span>name</span>
        <span>category</span>
      </div>
      <div className="border-b border-[color:var(--ink)]/30 mb-2" />

      <div>
        {rows.map((row, i) => {
          const isHovered = hovered === i;
          const isDimmed = hovered !== null && hovered !== i;
          return (
            <div
              key={`${row.name}-${i}`}
              onMouseEnter={() => setHovered(i)}
              className="grid grid-cols-[1fr_1fr] gap-x-6 px-1 py-0.5 transition-all duration-150 cursor-default"
              style={{
                background: isHovered ? "var(--ink)" : "transparent",
                color: isHovered ? "var(--paper)" : "var(--ink)",
                opacity: isDimmed ? 0.25 : 0.85,
                fontWeight: isHovered ? 600 : 400,
              }}
            >
              <span>{row.name}</span>
              <span style={{ opacity: isHovered ? 1 : 0.7 }}>{row.category}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
