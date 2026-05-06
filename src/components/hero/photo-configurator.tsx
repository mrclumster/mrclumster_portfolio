"use client";

import { useState } from "react";
import Image from "next/image";

interface FilterPreset {
  name: string;
  filter: string;
  swatch: string;
  border?: boolean;
}

const FILTERS: FilterPreset[] = [
  { name: "default", filter: "grayscale(1)", swatch: "#888888" },
  { name: "warm",    filter: "sepia(0.7) saturate(1.4) hue-rotate(-10deg)", swatch: "#c08060" },
  { name: "cool",    filter: "grayscale(0.3) hue-rotate(180deg) saturate(1.2)", swatch: "#5b8fc7" },
  { name: "rebel",   filter: "grayscale(0.2) contrast(1.4) hue-rotate(-25deg) saturate(1.6)", swatch: "#c0392b" },
  { name: "matrix",  filter: "grayscale(0.1) hue-rotate(80deg) saturate(2) contrast(1.2)", swatch: "#2ecc40" },
  { name: "noir",    filter: "grayscale(1) contrast(1.6)", swatch: "#1a1a1a" },
  { name: "invert",  filter: "invert(1)", swatch: "#f4f2ed", border: true },
];

interface Props {
  imageSrc: string;
}

export function PhotoConfigurator({ imageSrc }: Props) {
  const [active, setActive] = useState<FilterPreset>(FILTERS[0]);
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="photo-anim relative w-full h-full overflow-hidden">
        <Image
          src={imageSrc}
          alt="Aziz Tebbeng"
          fill
          sizes="(min-width: 1024px) 400px, 100vw"
          className="object-cover object-top transition-[filter] duration-300 ease-out"
          style={{ filter: active.filter }}
          priority
        />
      </div>

      <div
        className="absolute left-0 right-0 top-full mt-3 flex flex-wrap gap-2 transition-all duration-300 ease-out"
        style={{
          opacity: hovering ? 1 : 0,
          transform: hovering ? "translateY(0)" : "translateY(-4px)",
          pointerEvents: hovering ? "auto" : "none",
          zIndex: 5,
        }}
      >
        {FILTERS.map((f) => {
          const isActive = active.name === f.name;
          return (
            <button
              key={f.name}
              type="button"
              onClick={() => setActive(f)}
              className="font-mono text-[11px] flex items-center gap-1.5 px-2 py-1 border transition-colors duration-200"
              style={{
                borderColor: "var(--ink)",
                background: isActive ? "var(--ink)" : "transparent",
                color: isActive ? "var(--paper)" : "var(--ink)",
              }}
            >
              <span
                aria-hidden
                className="inline-block"
                style={{
                  width: 10,
                  height: 10,
                  background: f.swatch,
                  border: f.border ? "1px solid var(--ink)" : "none",
                }}
              />
              [ {f.name} ]
            </button>
          );
        })}
      </div>
    </div>
  );
}
