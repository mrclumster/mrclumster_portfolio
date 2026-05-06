# Portfolio Revisions Round 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Round 3 polish — animated photo, terminal skill table, git-graph divider, cursor spotlight + drifting typography background.

**Architecture:** Four isolated tasks. Each touches 1-3 files. No new dependencies.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind v4, CSS keyframes.

---

## Task 1: Animated Photo (Float + Border Breathe)

**Files:**
- Create: `src/components/hero/animated-photo.tsx`
- Modify: `src/components/sections/hero-terminal.tsx`
- Modify: `src/app/globals.css` (add keyframes)
- Delete: `src/components/hero/ascii-portrait.tsx`

- [ ] **Step 1: Add keyframes to `src/app/globals.css`**

Append at the end of the file:

```css
/* ==========================================================================
   Animated photo (hero) — float + border breathe
   ========================================================================== */
@keyframes photo-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}

@keyframes photo-breathe-light {
  0%, 100% { box-shadow: 0 0 0 1px rgba(26, 26, 26, 0.6); }
  50%      { box-shadow: 0 0 0 1px rgba(26, 26, 26, 1.0); }
}

@keyframes photo-breathe-dark {
  0%, 100% { box-shadow: 0 0 0 1px rgba(232, 228, 220, 0.6); }
  50%      { box-shadow: 0 0 0 1px rgba(232, 228, 220, 1.0); }
}

.photo-anim {
  animation: photo-float 4s ease-in-out infinite, photo-breathe-light 3s ease-in-out infinite;
}

.dark .photo-anim {
  animation: photo-float 4s ease-in-out infinite, photo-breathe-dark 3s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .photo-anim { animation: none; }
}
```

- [ ] **Step 2: Create `src/components/hero/animated-photo.tsx`**

```tsx
"use client";

import Image from "next/image";

interface Props {
  imageSrc: string;
}

export function AnimatedPhoto({ imageSrc }: Props) {
  return (
    <div className="photo-anim relative w-full h-full overflow-hidden">
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

- [ ] **Step 3: Update `src/components/sections/hero-terminal.tsx`**

Read the current file. Find these two lines:
1. `import { AsciiPortrait } from "@/components/hero/ascii-portrait";`
2. `<AsciiPortrait imageSrc={personalInfo.profileImage} />`

Change them to:
1. `import { AnimatedPhoto } from "@/components/hero/animated-photo";`
2. `<AnimatedPhoto imageSrc={personalInfo.profileImage} />`

Also: the right-column div currently has a `border border-[color:var(--ink)]` class. The breathe animation animates `box-shadow`, which sits OUTSIDE the border. To avoid both rendering, REMOVE the existing `border border-[color:var(--ink)]` class from the wrapper div but keep `overflow-hidden`. The box-shadow now provides the visual border.

Updated wrapper:
```tsx
<div
  className="overflow-hidden relative"
  style={{ height: 400 }}
>
  <AnimatedPhoto imageSrc={personalInfo.profileImage} />
</div>
```

- [ ] **Step 4: Delete the old ASCII portrait file**

```
git rm src/components/hero/ascii-portrait.tsx
```

- [ ] **Step 5: Type-check**

```
npx tsc --noEmit
```
Expected: no new errors. Pre-existing pokeball/postprocessing errors are fine.

- [ ] **Step 6: Commit**

```
git add src/app/globals.css src/components/hero/animated-photo.tsx src/components/sections/hero-terminal.tsx
git commit -m "feat: animated hero photo with float and border breathe"
```

---

## Task 2: Stack Section — Terminal `skill --list` Table

**Files:**
- Create: `src/components/sections/stack-table.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/resume/page.tsx`
- Delete: `src/components/sections/stack-cloud.tsx`

- [ ] **Step 1: Create `src/components/sections/stack-table.tsx`**

```tsx
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
```

- [ ] **Step 2: Update `src/app/page.tsx`**

Find: `import { StackCloud } from "@/components/sections/stack-cloud";`
Replace with: `import { StackTable } from "@/components/sections/stack-table";`

Find: `<StackCloud />`
Replace with: `<StackTable />`

- [ ] **Step 3: Update `src/app/resume/page.tsx`**

Same swap. If `StackCloud` is imported and used there, change to `StackTable`. If not present, skip this step.

- [ ] **Step 4: Delete `stack-cloud.tsx`**

```
git rm src/components/sections/stack-cloud.tsx
```

- [ ] **Step 5: Type-check + commit**

```
npx tsc --noEmit
git add src/components/sections/stack-table.tsx src/app/page.tsx src/app/resume/page.tsx
git commit -m "feat: replace tag cloud with terminal skill --list table"
```

---

## Task 3: Vertical Divider — Git Log Graph

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Read current divider in `src/app/page.tsx`**

Find the existing divider block (added in round 2):

```tsx
<div
  aria-hidden
  className="hidden lg:block absolute top-0 bottom-0 pointer-events-none"
  style={{
    left: "calc(60% - 0.75rem)",
    width: 1,
    background: "var(--ink)",
    opacity: 0.3,
  }}
>
  <span ...>┤</span>
  <span ...>├</span>
</div>
```

- [ ] **Step 2: Replace with git-graph divider**

Replace the entire block above with:

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
    { top: "22%", hash: "7e4b2d8", label: "experience-1", head: false },
    { top: "48%", hash: "5d8c4b1", label: "experience-2", head: false },
    { top: "65%", hash: "c1d9f2a", label: "education", head: false },
    { top: "88%", hash: "f4a8e21", label: "end", head: false },
  ].map((d, i) => (
    <div key={i} className="absolute" style={{ top: d.top, left: "-5px" }}>
      <span
        className="font-mono leading-none"
        style={{ fontSize: "12px", color: "var(--ink)", opacity: 0.7 }}
      >
        ●
      </span>
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

- [ ] **Step 3: Commit**

```
git add src/app/page.tsx
git commit -m "feat: replace minimal divider with git log graph dots and labels"
```

---

## Task 4: Background — Cursor Spotlight + Drifting Typography

**Files:**
- Create: `src/components/background/drifting-type.tsx`
- Create: `src/components/background/cursor-spotlight.tsx`
- Modify: `src/app/globals.css` (add keyframes + spotlight color, remove old grain/grid)
- Modify: `src/app/page.tsx` (mount the two components)

- [ ] **Step 1: Create `src/components/background/drifting-type.tsx`**

```tsx
"use client";

const ROW_TEXT = " AZIZ · TEBBENG · FULLSTACK · ML · ".repeat(8);

const ROW_STYLE = {
  fontFamily: "var(--font-display, 'Courier New', monospace)",
  fontSize: "clamp(8rem, 18vw, 22rem)",
  fontWeight: 900,
  color: "var(--ink)",
  opacity: 0.04,
  letterSpacing: "-0.05em",
} as const;

export function DriftingType() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <div
        className="drift-row absolute left-0 right-0 whitespace-nowrap"
        style={{
          ...ROW_STYLE,
          top: "10%",
          animation: "drift-left 50s linear infinite",
        }}
      >
        {ROW_TEXT}
      </div>
      <div
        className="drift-row absolute left-0 right-0 whitespace-nowrap"
        style={{
          ...ROW_STYLE,
          top: "42%",
          animation: "drift-right 70s linear infinite",
        }}
      >
        {ROW_TEXT}
      </div>
      <div
        className="drift-row absolute left-0 right-0 whitespace-nowrap"
        style={{
          ...ROW_STYLE,
          top: "74%",
          animation: "drift-left 60s linear infinite",
        }}
      >
        {ROW_TEXT}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/background/cursor-spotlight.tsx`**

```tsx
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
          "radial-gradient(circle 400px at var(--mx, 50%) var(--my, 50%), var(--spotlight-color, rgba(26,26,26,0.10)), transparent 70%)",
      }}
    />
  );
}
```

- [ ] **Step 3: Update `src/app/globals.css`**

Two edits in this file:

**3a.** REMOVE the round 2 background pseudo-elements. Find and delete this entire block:

```css
body.terminal-route::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}

body.terminal-route::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.04;
  background-image:
    linear-gradient(to right, var(--ink) 1px, transparent 1px),
    linear-gradient(to bottom, var(--ink) 1px, transparent 1px);
  background-size: 32px 32px;
}

body.terminal-route > * {
  position: relative;
  z-index: 1;
}
```

KEEP the `body.terminal-route { isolation: isolate; }` rule.

**3b.** APPEND at the end of the file:

```css
/* ==========================================================================
   Background — drifting typography keyframes + spotlight color token
   ========================================================================== */
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

- [ ] **Step 4: Mount both components in `src/app/page.tsx`**

Add imports:
```tsx
import { DriftingType } from "@/components/background/drifting-type";
import { CursorSpotlight } from "@/components/background/cursor-spotlight";
```

Wrap the existing `<TerminalFrame ...>...</TerminalFrame>` in a fragment so the two new components render alongside it. The Home component's return becomes:

```tsx
return (
  <>
    <DriftingType />
    <CursorSpotlight />
    <TerminalFrame prompt="cat index.md">
      {/* ... all existing children unchanged ... */}
    </TerminalFrame>
  </>
);
```

- [ ] **Step 5: Ensure TerminalFrame sits above background layers**

Read `src/components/terminal/terminal-frame.tsx`. The root element of `TerminalFrame` should have `position: relative; z-index: 2` to render above the spotlight (z-index 1) and drifting type (z-index 0).

If the root is a `<div>` like:
```tsx
<div className="some-classes">
```
Add `relative z-[2]` to the className:
```tsx
<div className="relative z-[2] some-classes">
```

If `TerminalFrame` already has `position: relative` somewhere via classes or styles, just add `zIndex: 2` (or `z-[2]`) to its className.

- [ ] **Step 6: Type-check**

```
npx tsc --noEmit
```
Expected: no new errors.

- [ ] **Step 7: Commit**

```
git add src/components/background/drifting-type.tsx src/components/background/cursor-spotlight.tsx src/app/globals.css src/app/page.tsx src/components/terminal/terminal-frame.tsx
git commit -m "feat: cursor spotlight + drifting typography background"
```

---

## Final Verification Checklist

- [ ] Hero photo gently floats up/down and the border opacity pulses
- [ ] Stack section shows two-column terminal table; hovering a row highlights it and dims others
- [ ] Vertical divider on desktop shows commit dots with hash + label, top one marked `(HEAD)`
- [ ] Background has subtle giant drifting AZIZ TEBBENG typography
- [ ] Cursor spotlight follows mouse across the whole viewport, lighting up the typography
- [ ] Old grain + grid background is gone
- [ ] No TypeScript errors (ignore pokeball/postprocessing pre-existing)
- [ ] No console errors

---

## How to Continue on Your Laptop

1. `git pull origin feat/terminal-redesign`
2. Tell Claude: *"Execute the round 3 portfolio revisions plan at `docs/superpowers/plans/2026-05-07-portfolio-revisions-r3.md` using subagent-driven-development."*
