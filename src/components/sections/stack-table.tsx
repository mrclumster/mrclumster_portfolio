"use client";

import { useState } from "react";
import { techStack } from "@/data/tech-stack";

export function StackTable() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      className="font-mono text-[13px] leading-[1.6]"
      onMouseLeave={() => setHovered(null)}
    >
      <p className="opacity-50 mb-3">$ skill --list</p>

      {techStack.map((cat) => (
        <div key={cat.category} className="mb-4">
          <p className="opacity-40 mb-1 italic">// {cat.category.toLowerCase()}</p>
          {cat.items.map((it) => {
            const key = `${cat.category}-${it.name}`;
            const isHovered = hovered === key;
            const isDimmed = hovered !== null && hovered !== key;
            return (
              <div
                key={key}
                onMouseEnter={() => setHovered(key)}
                className="px-2 py-0.5 transition-all duration-150 cursor-default"
                style={{
                  background: isHovered ? "var(--ink)" : "transparent",
                  color: isHovered ? "var(--paper)" : "var(--ink)",
                  opacity: isDimmed ? 0.25 : 0.85,
                  fontWeight: isHovered ? 600 : 400,
                }}
              >
                {it.name.toLowerCase()}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
