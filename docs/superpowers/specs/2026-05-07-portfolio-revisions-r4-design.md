# Portfolio Revisions Round 4 Design Spec

**Date:** 2026-05-07
**Status:** Approved — ready for implementation
**Branch:** feat/terminal-redesign

---

## Overview

Round 4 revisions:

1. **Hero Photo Configurator** — Josh Comeau-style Rainbow Configurator: hover the photo, chips slide in. Click a chip to apply a curated CSS filter "mood." Adapted to the brutalist terminal aesthetic.
2. **Stack Section** — Comment-grouped sections (`// frontend`, `// backend`, …) for cleaner category separation.
3. **Background** — Drop drifting typography + cursor spotlight. Replace with a single well-tuned static paper grain + soft vignette. No motion.

---

## 1. Hero Photo Configurator (Josh Comeau-style)

### Behavior summary
- The photo is visible and animated (existing float + breathe) by default.
- Filter chips are **hidden** by default.
- On hover of the photo container: chips fade/slide in below the photo (300ms ease).
- On mouse leave: chips fade/slide back out.
- Click a chip → photo's CSS `filter` transitions to that chip's filter (300ms ease). The chip becomes "active" (visually inverted) and stays selected until another is clicked.
- Default chip is `default` (grayscale) on mount.

### Chip set (7 chips)

| Chip | Filter | Square color |
|------|--------|--------------|
| `default` | `grayscale(1)` | `#888888` |
| `warm` | `sepia(0.7) saturate(1.4) hue-rotate(-10deg)` | `#c08060` |
| `cool` | `grayscale(0.3) hue-rotate(180deg) saturate(1.2)` | `#5b8fc7` |
| `rebel` | `grayscale(0.2) contrast(1.4) hue-rotate(-25deg) saturate(1.6)` | `#c0392b` |
| `matrix` | `grayscale(0.1) hue-rotate(80deg) saturate(2) contrast(1.2)` | `#2ecc40` |
| `noir` | `grayscale(1) contrast(1.6)` | `#1a1a1a` |
| `invert` | `invert(1)` | `#f4f2ed` (with thin border) |

### Chip visual style

Each chip is rendered as: filled square `■` (10×10px, the chip's representative color) followed by a bracketed monospace name `[ <name> ]`.

Chips wrap into 2 rows beneath the photo. They have a small gap (8px) and a flex-wrap container.

```
■ [ default ]   ■ [ warm ]   ■ [ cool ]   ■ [ rebel ]
■ [ matrix ]    ■ [ noir ]   ■ [ invert ]
```

### Active state

Active chip: ink background, paper text, square stays its representative color.
Inactive chip: transparent background, ink text.
Both states have transitions on `background-color`, `color`, `opacity`.

### Reveal animation

The chips container has these states:
- Hidden: `opacity: 0`, `transform: translateY(-4px)`, `pointer-events: none`.
- Visible: `opacity: 1`, `transform: translateY(0)`, `pointer-events: auto`.

Triggered by container hover. CSS transition `300ms ease`.

### Component design

`src/components/hero/photo-configurator.tsx`:

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";

interface Filter {
  name: string;
  filter: string;
  swatch: string;
  border?: boolean;
}

const FILTERS: Filter[] = [
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
  const [active, setActive] = useState(FILTERS[0]);
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className="relative w-full h-full flex flex-col"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Photo block — keeps the existing animation */}
      <div className="photo-anim relative w-full overflow-hidden flex-1">
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

      {/* Chips — hidden until hover */}
      <div
        className="absolute left-0 right-0 top-full mt-2 flex flex-wrap gap-2 transition-all duration-300 ease-out"
        style={{
          opacity: hovering ? 1 : 0,
          transform: hovering ? "translateY(0)" : "translateY(-4px)",
          pointerEvents: hovering ? "auto" : "none",
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
```

### Hero file change

`src/components/sections/hero-terminal.tsx`:
- Remove `import { AnimatedPhoto } from "@/components/hero/animated-photo";`
- Add `import { PhotoConfigurator } from "@/components/hero/photo-configurator";`
- Replace `<AnimatedPhoto imageSrc={personalInfo.profileImage} />` with `<PhotoConfigurator imageSrc={personalInfo.profileImage} />`

The right-column wrapper height (`400px`) needs to leave room for the chips. The chips are absolute-positioned BELOW the wrapper, so visually they appear in the gap between the photo and the next section. This is the "reveal in space below" effect.

If the gap is too tight, consider reducing wrapper height to `360px` so the chip row has natural breathing room.

### Delete
- `src/components/hero/animated-photo.tsx` — its logic is now inside `PhotoConfigurator`.

---

## 2. Stack Section — Comment-Grouped Sections

### File: `src/components/sections/stack-table.tsx` (rewrite)

### New output
```
$ skill --list

// frontend
react
typescript
next.js
tailwindcss

// backend
node.js
express

// languages
python
java

// tools
git
docker
…
```

### Behavior
- Single header `$ skill --list` at top, faint.
- One `// <category>` line per group, faint, italic-feeling (still monospace).
- Skills listed under each group, one per line.
- Hover any skill row: that row inverts (ink bg, paper text). Other rows fade to 25%.
- The `// <category>` comment lines stay at full opacity even when other rows are dimmed (they're labels, not content).

### Implementation sketch

```tsx
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
```

### No file deletions — just rewrite the component body.

---

## 3. Background — Static Paper Grain + Vignette

### Replaces
- `src/components/background/drifting-type.tsx` (delete)
- `src/components/background/cursor-spotlight.tsx` (delete)
- All round-3 keyframes (`drift-left`, `drift-right`) and the `--spotlight-color` variable in `globals.css`.

### `src/app/globals.css` changes

**Delete:**
- `@keyframes drift-left` block
- `@keyframes drift-right` block
- `:root { --spotlight-color: ... }` and `.dark { --spotlight-color: ... }`
- `@media (prefers-reduced-motion: reduce) { .drift-row { animation: none !important; } }`

**Add (or restore in tuned form):**

```css
/* ==========================================================================
   Static paper texture — denser noise + soft vignette
   ========================================================================== */
body.terminal-route::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.08;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}

body.terminal-route::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.05) 100%);
}

.dark body.terminal-route::before {
  mix-blend-mode: screen;
  opacity: 0.06;
}

.dark body.terminal-route::after {
  background: radial-gradient(ellipse at center, transparent 55%, rgba(255,255,255,0.04) 100%);
}
```

### `src/app/page.tsx` changes
- Remove `<DriftingType />` and `<CursorSpotlight />` and their imports.
- Drop the fragment wrapper if it was only there for those two, returning to a single `<TerminalFrame>` root.

### `src/components/terminal/terminal-frame.tsx` change
- Remove the `relative z-[2]` that was added in round 3 for stacking. The static bg sits in `::before` and `::after` (z-index 0), and content sits naturally above. No explicit z-index needed.

### File deletions
- `src/components/background/drifting-type.tsx`
- `src/components/background/cursor-spotlight.tsx`
- (Keep the `src/components/background/` folder if other files exist; otherwise it can be removed too.)

---

## Files Summary

### Create
| File | Purpose |
|------|---------|
| `src/components/hero/photo-configurator.tsx` | Photo + hover-reveal filter chips |

### Modify
| File | Change |
|------|--------|
| `src/components/sections/hero-terminal.tsx` | Use `PhotoConfigurator` |
| `src/components/sections/stack-table.tsx` | Comment-grouped sections |
| `src/app/globals.css` | Restore tuned grain + vignette; remove drift keyframes + spotlight var |
| `src/app/page.tsx` | Remove `<DriftingType />` + `<CursorSpotlight />` |
| `src/components/terminal/terminal-frame.tsx` | Drop `relative z-[2]` |

### Delete
| File | Reason |
|------|--------|
| `src/components/hero/animated-photo.tsx` | Replaced by PhotoConfigurator |
| `src/components/background/drifting-type.tsx` | Background changed |
| `src/components/background/cursor-spotlight.tsx` | Background changed |

---

## Open Questions
None.

---

## How to Continue on Your Laptop
1. `git pull origin feat/terminal-redesign`
2. `docs/superpowers/plans/2026-05-07-portfolio-revisions-r4.md` has the step-by-step plan
3. Tell Claude: *"Execute the round 4 portfolio revisions plan with subagent-driven-development."*
