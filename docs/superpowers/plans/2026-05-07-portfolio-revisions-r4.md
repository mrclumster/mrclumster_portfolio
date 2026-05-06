# Portfolio Revisions Round 4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`).

**Goal:** Round 4 — Josh Comeau-style photo configurator (hover-reveal chips), comment-grouped stack list, static paper background.

**Architecture:** Three isolated tasks. No new dependencies.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind v4, CSS keyframes.

---

## Task 1: Photo Configurator (Josh Comeau-style)

**Files:**
- Create: `src/components/hero/photo-configurator.tsx`
- Modify: `src/components/sections/hero-terminal.tsx`
- Delete: `src/components/hero/animated-photo.tsx`

- [ ] **Step 1: Create `src/components/hero/photo-configurator.tsx`**

```tsx
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

      {/* Chips — appear below the photo on hover */}
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
```

- [ ] **Step 2: Update `src/components/sections/hero-terminal.tsx`**

Read the file. Find:
- Import: `import { AnimatedPhoto } from "@/components/hero/animated-photo";`
- Usage: `<AnimatedPhoto imageSrc={personalInfo.profileImage} />`

Replace with:
- Import: `import { PhotoConfigurator } from "@/components/hero/photo-configurator";`
- Usage: `<PhotoConfigurator imageSrc={personalInfo.profileImage} />`

The right-column wrapper currently has `style={{ height: 400 }}`. Reduce to `360` to leave room for the chip row that appears below:

```tsx
<div
  className="overflow-hidden relative"
  style={{ height: 360 }}
>
  <PhotoConfigurator imageSrc={personalInfo.profileImage} />
</div>
```

Also: the chips need to render OUTSIDE the wrapper's `overflow-hidden` clipping. Remove `overflow-hidden` from the wrapper. The photo is full-size inside `<PhotoConfigurator>` and uses its own `overflow-hidden` div. The wrapper just provides positioning context.

Final wrapper:
```tsx
<div
  className="relative"
  style={{ height: 360 }}
>
  <PhotoConfigurator imageSrc={personalInfo.profileImage} />
</div>
```

- [ ] **Step 3: Delete `src/components/hero/animated-photo.tsx`**

```
git rm src/components/hero/animated-photo.tsx
```

- [ ] **Step 4: Type-check + commit**

```
npx tsc --noEmit
git add src/components/hero/photo-configurator.tsx src/components/sections/hero-terminal.tsx
git commit -m "feat: add Josh Comeau-style photo filter configurator"
```

Ignore pre-existing pokeball/postprocessing TS errors.

---

## Task 2: Stack Section — Comment-Grouped

**Files:**
- Modify: `src/components/sections/stack-table.tsx`

- [ ] **Step 1: Rewrite `src/components/sections/stack-table.tsx`**

Replace the entire file content with:

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

- [ ] **Step 2: Type-check + commit**

```
npx tsc --noEmit
git add src/components/sections/stack-table.tsx
git commit -m "feat: group skill list by category with comment headers"
```

---

## Task 3: Background — Static Paper + Vignette (remove drift/spotlight)

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/page.tsx`
- Modify: `src/components/terminal/terminal-frame.tsx`
- Delete: `src/components/background/drifting-type.tsx`
- Delete: `src/components/background/cursor-spotlight.tsx`

- [ ] **Step 1: Edit `src/app/globals.css`**

Read the file to locate the round-3 background rules.

**1a.** DELETE these blocks (added in round 3):

```css
@keyframes drift-left {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@keyframes drift-right {
  from { transform: translateX(-50%); }
  to   { transform: translateX(0); }
}

:root { --spotlight-color: rgba(26, 26, 26, 0.10); }
.dark { --spotlight-color: rgba(232, 228, 220, 0.10); }

@media (prefers-reduced-motion: reduce) {
  .drift-row { animation: none !important; }
}
```

Find them and remove all five blocks above. The text `drift`, `spotlight-color`, and `drift-row` should not appear in `globals.css` after this edit.

**1b.** APPEND at the end of the file:

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

- [ ] **Step 2: Edit `src/app/page.tsx`**

Remove these two imports:
```tsx
import { DriftingType } from "@/components/background/drifting-type";
import { CursorSpotlight } from "@/components/background/cursor-spotlight";
```

Find the return statement which currently looks like:
```tsx
return (
  <>
    <DriftingType />
    <CursorSpotlight />
    <TerminalFrame prompt="cat index.md">
      ...
    </TerminalFrame>
  </>
);
```

Simplify to:
```tsx
return (
  <TerminalFrame prompt="cat index.md">
    ...
  </TerminalFrame>
);
```

(Remove the fragment wrapper and the two background components.)

- [ ] **Step 3: Edit `src/components/terminal/terminal-frame.tsx`**

Remove the `relative z-[2]` that was added in round 3 to the root div. If the className contains those tokens, delete them. Examples:

If currently:
```tsx
<div className="relative z-[2] some-other-classes">
```
Change to:
```tsx
<div className="some-other-classes">
```

If `relative` was already needed for other reasons before round 3, keep it. Only delete the `z-[2]` part. Use judgment based on the existing structure.

- [ ] **Step 4: Delete background files**

```
git rm src/components/background/drifting-type.tsx
git rm src/components/background/cursor-spotlight.tsx
```

- [ ] **Step 5: Type-check + commit**

```
npx tsc --noEmit
git add src/app/globals.css src/app/page.tsx src/components/terminal/terminal-frame.tsx
git commit -m "feat: replace drift/spotlight bg with static paper grain and vignette"
```

Ignore pre-existing pokeball/postprocessing TS errors.

---

## Final Verification

- [ ] Photo shows by default with grayscale, gently floats, border breathes.
- [ ] Hovering the photo reveals 7 chips below it: default / warm / cool / rebel / matrix / noir / invert.
- [ ] Clicking a chip shifts the photo's filter and inverts the chip's colors.
- [ ] Stack section shows `$ skill --list` header, then `// frontend`, `// backend`, etc., with skills grouped under each.
- [ ] Hovering a skill row inverts it and dims others; comment lines stay visible.
- [ ] Background has visible paper grain + soft vignette around viewport edges. No drifting typography. No cursor spotlight.
- [ ] No TypeScript errors (ignore pokeball/postprocessing pre-existing).
- [ ] No console errors in browser.
