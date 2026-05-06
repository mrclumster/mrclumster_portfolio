# Portfolio Revisions Round 3 Design Spec

**Date:** 2026-05-07
**Status:** Approved — ready for implementation
**Branch:** feat/terminal-redesign

---

## Overview

Round 3 revisions. Replaces effects from round 2 that didn't land, plus a serious upgrade to the page background.

Four discrete changes:
1. Hero photo — drop ASCII halftone, return to static photo with subtle float + border-breathe animations
2. Stack section — replace tag cloud with terminal `skill --list` two-column table
3. Career/Edu/Certs vertical divider — replace plain line with `git log --graph` style line + commit dots
4. Page background — replace grain+grid with cursor spotlight + drifting giant typography

---

## 1. Hero Photo — Float + Border Breathe

### Replaces
- `src/components/hero/ascii-portrait.tsx` (delete)
- Hero right column currently renders `<AsciiPortrait />`

### New component
`src/components/hero/animated-photo.tsx`

### Behavior
- Static profile photo using Next.js `<Image>`, `fill object-cover object-top`, grayscale.
- Two CSS keyframe animations always running:
  - **Float:** `transform: translateY(0)` → `translateY(-6px)` → `translateY(0)` over 4s, `ease-in-out infinite`.
  - **Border breathe:** Border `opacity` 0.6 → 1.0 → 0.6 over 3s loop. Apply to the container's border via animating `border-color` (or use `box-shadow` ring with animated alpha).
- Respect `prefers-reduced-motion`: disable both animations.

### Implementation sketch
```tsx
"use client";

import Image from "next/image";

interface Props {
  imageSrc: string;
}

export function AnimatedPhoto({ imageSrc }: Props) {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        animation: "photo-float 4s ease-in-out infinite, photo-breathe 3s ease-in-out infinite",
      }}
    >
      <Image
        src={imageSrc}
        alt="Aziz Tebbeng"
        fill
        sizes="(min-width: 1024px) 400px, 100vw"
        className="object-cover object-top grayscale"
        priority
      />
    </div>
  );
}
```

Add keyframes to `globals.css`:
```css
@keyframes photo-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}

@keyframes photo-breathe {
  0%, 100% { box-shadow: 0 0 0 1px rgba(26,26,26,0.6); }
  50%      { box-shadow: 0 0 0 1px rgba(26,26,26,1.0); }
}

.dark @keyframes photo-breathe {
  0%, 100% { box-shadow: 0 0 0 1px rgba(232,228,220,0.6); }
  50%      { box-shadow: 0 0 0 1px rgba(232,228,220,1.0); }
}

@media (prefers-reduced-motion: reduce) {
  [style*="photo-float"] { animation: none !important; }
}
```

(Alternative simpler approach: animate `border-color` opacity directly on the container's existing `border border-[color:var(--ink)]`. Either works.)

### Hero file change
In `src/components/sections/hero-terminal.tsx`:
- Remove `import { AsciiPortrait } from "@/components/hero/ascii-portrait";`
- Add `import { AnimatedPhoto } from "@/components/hero/animated-photo";`
- Replace `<AsciiPortrait imageSrc={personalInfo.profileImage} />` with `<AnimatedPhoto imageSrc={personalInfo.profileImage} />`
- Delete `src/components/hero/ascii-portrait.tsx`.

---

## 2. Stack Section — Terminal `skill --list` Table

### Replaces
- `src/components/sections/stack-cloud.tsx` (delete)
- `<StackCloud />` usage in `page.tsx`

### New component
`src/components/sections/stack-table.tsx`

### Output (visual reference)

```
$ skill --list

NAME                                CATEGORY
─────────────────────────────────────────────────
react                               frontend
typescript                          frontend
next.js                             frontend
tailwindcss                         frontend
node.js                             backend
python                              languages
…
```

### Behavior
- Header line: `$ skill --list` in muted color, then a blank line.
- Column headers: `NAME` and `CATEGORY` in uppercase, `--muted-fg` color.
- A horizontal rule under headers using `─` characters or a `border-bottom`.
- One row per skill, flattened from `techStack` (same as the cloud).
- Two columns per row: name (left) and category (right).
- Layout: use CSS grid `grid-cols-[1fr_1fr]` or `grid-cols-[max-content_1fr]` with consistent gap.
- All monospace. `text-[13px]`.

### Hover behavior
- Track `hovered` state (row index OR null).
- On `mouseenter` of a row, set `hovered` to that index.
- On `mouseleave` of the table, set `hovered` to null.
- Hovered row: `background: var(--ink)`, `color: var(--paper)`, both columns inverted.
- Non-hovered rows when `hovered !== null`: opacity 0.25.
- Default state (`hovered === null`): all rows at opacity 0.85.
- Transition: `transition-all duration-150`.

### Implementation sketch
```tsx
"use client";

import { useState } from "react";
import { techStack } from "@/data/tech-stack";

export function StackTable() {
  const [hovered, setHovered] = useState<number | null>(null);

  const rows = techStack.flatMap((cat) =>
    cat.items.map((it) => ({ name: it.name.toLowerCase(), category: cat.category.toLowerCase() }))
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
```

### Page change
`src/app/page.tsx`:
- Replace `import { StackCloud } from "@/components/sections/stack-cloud";` with `import { StackTable } from "@/components/sections/stack-table";`
- Replace `<StackCloud />` with `<StackTable />`
- Delete `src/components/sections/stack-cloud.tsx`

Also check `src/app/resume/page.tsx` — earlier work added `StackCloud` there. Update to `StackTable` too.

---

## 3. Vertical Divider — Git Log Graph Style

### Replaces
The current minimal divider in `src/app/page.tsx`:
```tsx
<div ...><span>┤</span><span>├</span></div>
```

### New visual
- Vertical 1px line, full height of the grid, `--ink` at 35% opacity.
- 5-6 commit-dots (`●` characters) positioned at irregular vertical positions along the line, in `--ink` at 70% opacity, ~12px font-size.
- Each dot has a small commit hash + label to its left in monospace 10px, `--muted-fg` color, `opacity: 0.5`.
- Topmost dot has a `(HEAD)` label after the hash, like the experience-log's git styling.
- Visible only on `lg` breakpoint.

### Static positions (hardcoded)
Dots placed at fixed top-percentage positions to roughly align with section starts:
- 4% from top: `a3f9c10  career  (HEAD)`
- 22% from top: `7e4b2d8  experience-1`
- 48% from top: `5d8c4b1  experience-2`
- 65% from top: `c1d9f2a  education`
- 88% from top: `f4a8e21  end`

(Hashes are static decorative strings — they don't need to match real data.)

### Implementation sketch
Inside the existing `<div className="relative grid grid-cols-1 lg:grid-cols-[3fr_2fr] ...">`:

```tsx
<div
  aria-hidden
  className="hidden lg:block absolute top-0 bottom-0 pointer-events-none"
  style={{
    left: "calc(60% - 0.75rem)",
    width: 1,
    background: "var(--ink)",
    opacity: 0.35,
  }}
>
  {[
    { top: "4%", hash: "a3f9c10", label: "career", head: true },
    { top: "22%", hash: "7e4b2d8", label: "experience-1" },
    { top: "48%", hash: "5d8c4b1", label: "experience-2" },
    { top: "65%", hash: "c1d9f2a", label: "education" },
    { top: "88%", hash: "f4a8e21", label: "end" },
  ].map((d, i) => (
    <div key={i} className="absolute" style={{ top: d.top, left: "-5px" }}>
      {/* Dot */}
      <span
        className="font-mono leading-none"
        style={{
          fontSize: "12px",
          color: "var(--ink)",
          opacity: 0.7,
        }}
      >
        ●
      </span>
      {/* Label */}
      <span
        className="absolute font-mono whitespace-nowrap leading-none"
        style={{
          right: "16px",
          top: "2px",
          fontSize: "10px",
          color: "var(--muted-fg)",
          opacity: 0.6,
        }}
      >
        {d.hash} {d.label}{d.head ? " (HEAD)" : ""}
      </span>
    </div>
  ))}
</div>
```

The `right: 16px` puts labels to the LEFT of the divider line. If the layout would be cleaner with labels on the right side, use `left: 16px` with `right: auto` instead — pick whichever doesn't crash into the certifications content.

---

## 4. Background — Cursor Spotlight + Drifting Typography

### Replaces
The grain + grid pseudo-elements added in round 2:
```css
body.terminal-route::before { /* grain */ }
body.terminal-route::after  { /* grid */ }
```
Both are removed entirely.

### New components
- `src/components/background/drifting-type.tsx` — fullscreen fixed div with horizontally scrolling giant typography.
- `src/components/background/cursor-spotlight.tsx` — fullscreen fixed div with mouse-tracked radial gradient.

These get rendered once at the layout level (in `app/layout.tsx`) so they appear behind every page that uses `body.terminal-route`. Alternative: render in `app/page.tsx` only, scoped to the home page.

**Decision for this spec:** render in `app/page.tsx` only (home page). If we want them on resume page too, it's a one-line addition.

### 4a. Drifting Typography

```tsx
// src/components/background/drifting-type.tsx
"use client";

const ROW_TEXT = " AZIZ · TEBBENG · FULLSTACK · ML · ".repeat(8);

export function DriftingType() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <div className="absolute top-[10%] left-0 right-0 whitespace-nowrap"
           style={{
             fontFamily: "var(--font-display, 'Courier New', monospace)",
             fontSize: "clamp(8rem, 18vw, 22rem)",
             fontWeight: 900,
             color: "var(--ink)",
             opacity: 0.04,
             animation: "drift-left 50s linear infinite",
             letterSpacing: "-0.05em",
           }}>
        {ROW_TEXT}
      </div>
      <div className="absolute top-[42%] left-0 right-0 whitespace-nowrap"
           style={{
             fontFamily: "var(--font-display, 'Courier New', monospace)",
             fontSize: "clamp(8rem, 18vw, 22rem)",
             fontWeight: 900,
             color: "var(--ink)",
             opacity: 0.04,
             animation: "drift-right 70s linear infinite",
             letterSpacing: "-0.05em",
           }}>
        {ROW_TEXT}
      </div>
      <div className="absolute top-[74%] left-0 right-0 whitespace-nowrap"
           style={{
             fontFamily: "var(--font-display, 'Courier New', monospace)",
             fontSize: "clamp(8rem, 18vw, 22rem)",
             fontWeight: 900,
             color: "var(--ink)",
             opacity: 0.04,
             animation: "drift-left 60s linear infinite",
             letterSpacing: "-0.05em",
           }}>
        {ROW_TEXT}
      </div>
    </div>
  );
}
```

Keyframes in `globals.css`:
```css
@keyframes drift-left {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes drift-right {
  from { transform: translateX(-50%); }
  to   { transform: translateX(0); }
}

@media (prefers-reduced-motion: reduce) {
  .drifting-type-row { animation: none !important; }
}
```

(Add a `drifting-type-row` class to the three divs if we want the reduced-motion override.)

### 4b. Cursor Spotlight

```tsx
// src/components/background/cursor-spotlight.tsx
"use client";

import { useEffect, useRef } from "react";

export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onMove(e: MouseEvent) {
      el!.style.setProperty("--mx", `${e.clientX}px`);
      el!.style.setProperty("--my", `${e.clientY}px`);
    }

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        background:
          "radial-gradient(circle 400px at var(--mx, 50%) var(--my, 50%), rgba(26,26,26,0.10), transparent 70%)",
      }}
    />
  );
}
```

The dark mode variant — adjust the `rgba(26,26,26,…)` to a light tone in dark mode. Easiest: render two stacked divs, one for `:not(.dark) body` and one for `.dark body`, toggled by `dark:` Tailwind classes. OR use a CSS variable for the spotlight color.

Recommended: define a `--spotlight-color` variable in `globals.css`:
```css
:root      { --spotlight-color: rgba(26,26,26,0.10); }
.dark      { --spotlight-color: rgba(232,228,220,0.10); }
```
Then the gradient uses `var(--spotlight-color)`.

### Page integration

`src/app/page.tsx`:
```tsx
import { DriftingType } from "@/components/background/drifting-type";
import { CursorSpotlight } from "@/components/background/cursor-spotlight";

export default function Home() {
  return (
    <>
      <DriftingType />
      <CursorSpotlight />
      <TerminalFrame ...>
        ...
      </TerminalFrame>
    </>
  );
}
```

The `<TerminalFrame>` content needs `position: relative; z-index: 2` (or higher) to sit above the two background layers.

### Remove old background CSS

In `src/app/globals.css`, **delete** these blocks added in round 2:
```css
body.terminal-route { isolation: isolate; }
body.terminal-route::before { /* grain */ }
body.terminal-route::after  { /* grid */ }
body.terminal-route > * { position: relative; z-index: 1; }
```

Replace with just:
```css
body.terminal-route { isolation: isolate; }
```
(keeps the stacking context for safety, drops the grain/grid).

---

## Files Summary

### Create
| File | Purpose |
|------|---------|
| `src/components/hero/animated-photo.tsx` | Float + breathe photo |
| `src/components/sections/stack-table.tsx` | Terminal-style two-column skill table |
| `src/components/background/drifting-type.tsx` | Giant scrolling typography background |
| `src/components/background/cursor-spotlight.tsx` | Cursor-tracking radial gradient |

### Modify
| File | Change |
|------|--------|
| `src/components/sections/hero-terminal.tsx` | Swap AsciiPortrait → AnimatedPhoto |
| `src/app/page.tsx` | Swap StackCloud → StackTable, replace divider with git-graph version, add DriftingType + CursorSpotlight, ensure TerminalFrame sits above |
| `src/app/resume/page.tsx` | Update StackCloud → StackTable |
| `src/app/globals.css` | Add @keyframes (photo-float, photo-breathe, drift-left, drift-right), add `--spotlight-color`, REMOVE old grain/grid pseudo-elements |

### Delete
| File | Reason |
|------|--------|
| `src/components/hero/ascii-portrait.tsx` | Replaced by AnimatedPhoto |
| `src/components/sections/stack-cloud.tsx` | Replaced by StackTable |

---

## Open Questions
None — all decisions confirmed during brainstorming.

---

## How to Continue on Your Laptop

1. `git pull origin feat/terminal-redesign`
2. Open this spec at `docs/superpowers/specs/2026-05-07-portfolio-revisions-r3-design.md`
3. Tell Claude: *"Execute the round 3 portfolio revisions plan."* — Claude will run `writing-plans` to generate the implementation plan and then execute.
