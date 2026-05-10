# Portfolio Revisions Round 7 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero right column (CursorEyes row + PhotoFrame stack) with a clustered ASCII-art frame around the photo (~14 individually click-cyclable bits + 5 cursor-tracking eye-pairs + global shuffle), and replace the Three.js `<ParticleConstellation />` hero background with a Linear/Render-style cursor-spotlight grid reveal.

**Architecture:** Three new components — `<HeroBackdrop />` (single positioned div with masked grid, one pointermove listener writing CSS vars), `<AsciiBit />` (clickable bit primitive with optional cursor-tracking pupil rendering), `<AsciiFrame />` (composition root: owns hue state map, shuffle button, photo via existing `<PhotoFrame />`, and renders all bits at curated positions). `hero-terminal.tsx` swaps imports/usage. `globals.css` gains two custom properties for bit color (`--bit-l`, `--bit-c`).

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4. No new deps.

---

## Task 1: Color tokens for ASCII bits

**Files:**
- Modify: `src/app/globals.css`

Add two CSS custom properties used by `<AsciiBit />` to render `oklch(L C H)` colors with a fixed lightness/chroma per theme. This lets bits cycle through hues without contrast surprises.

- [ ] **Step 1: Edit `src/app/globals.css`**

Find the `:root` block (starts around line 11). After the existing `--alarm: #c0392b;` line and before the `Editorial palette` comment, add:

```css
  /* R7 — ASCII bit color: fixed L/C, only hue varies */
  --bit-l: 35%;
  --bit-c: 0.18;
```

Find the `.dark` block (starts around line 48). After `--alarm: #e74c3c;` add:

```css
  --bit-l: 80%;
  --bit-c: 0.18;
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit`
Expected: no new errors. (Pre-existing pokeball errors continue to be ignored.)

- [ ] **Step 3: Commit**

```
git add src/app/globals.css
git commit -m "feat(theme): add --bit-l and --bit-c tokens for round 7"
```

---

## Task 2: HeroBackdrop component (cursor-spotlight grid reveal)

**Files:**
- Create: `src/components/hero/hero-backdrop.tsx`

Pure-CSS grid hidden behind a radial-gradient mask that follows the cursor inside the hero section. One `pointermove` listener writes `--mx`/`--my` to the wrapper element. Reduced-motion users get a static low-opacity grid instead.

- [ ] **Step 1: Create `src/components/hero/hero-backdrop.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";

const GRID_SIZE = 32;
const REVEAL_INNER_PCT = 12;
const REVEAL_OUTER_PCT = 60;

export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const section = el.parentElement;
    if (!section) return;

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };

    const onLeave = () => {
      el.style.setProperty("--mx", "-9999px");
      el.style.setProperty("--my", "-9999px");
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const gridImage = `
    repeating-linear-gradient(0deg, var(--ink) 0 1px, transparent 1px ${GRID_SIZE}px),
    repeating-linear-gradient(90deg, var(--ink) 0 1px, transparent 1px ${GRID_SIZE}px)
  `;

  const maskImage = `radial-gradient(circle at var(--mx) var(--my), black 0%, black ${REVEAL_INNER_PCT}%, transparent ${REVEAL_OUTER_PCT}%)`;

  return (
    <div
      ref={ref}
      aria-hidden
      className="motion-safe:opacity-100 motion-reduce:!opacity-[0.04] absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: gridImage,
        WebkitMaskImage: maskImage,
        maskImage,
        // Fallback values so first paint isn't a giant grid
        ["--mx" as string]: "-9999px",
        ["--my" as string]: "-9999px",
      }}
    />
  );
}
```

Notes for the implementer:
- The component reads `el.parentElement` for the listener target — the consumer (`hero-terminal.tsx`) is already a `<section className="relative">`, so this just works without prop drilling.
- `motion-reduce:!opacity-[0.04]` is the reduced-motion fallback: the grid is shown statically at 4% opacity. The mask remains attached but with the cursor stuck at `-9999px` it would normally hide everything; the opacity rule overrides to make a visible-but-quiet grid even when the mouse is offscreen. Test with `prefers-reduced-motion` enabled to confirm.
- `pointer-events: none` so foreground bits/buttons receive clicks.
- The grid lines are drawn at full `var(--ink)` opacity in the gradient — visibility is entirely controlled by the mask. This keeps grid line color theme-aware.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS. Pokeball errors ignored.

- [ ] **Step 3: Commit**

```
git add src/components/hero/hero-backdrop.tsx
git commit -m "feat(hero): add HeroBackdrop cursor-spotlight grid reveal"
```

---

## Task 3: AsciiBit primitive

**Files:**
- Create: `src/components/hero/ascii-bit.tsx`

A single clickable ASCII element. Two glyph modes:
- **Static:** renders a `string` glyph as plain text inside a `<button>`.
- **Eye-pair:** renders two trackable eye circles (the existing R5 cursor-eyes shape) inside a `<button>` so the whole pair clicks as one bit.

Both share: hue-driven color via `oklch(var(--bit-l) var(--bit-c) hue)`, hover/focus invert, absolute positioning via prop.

- [ ] **Step 1: Create `src/components/hero/ascii-bit.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

const PUPIL_MAX_OFFSET = 3;
const EYE_SIZE = 14;

export type BitPosition = Pick<CSSProperties, "top" | "right" | "bottom" | "left" | "transform">;

interface AsciiBitProps {
  hue: number;
  onClick: () => void;
  position: BitPosition;
  ariaLabel: string;
  glyph?: ReactNode;       // Static glyph (string or JSX). Used when eyePair is false.
  eyePair?: boolean;       // If true, render two trackable eyes instead of glyph.
  className?: string;      // Extra utility classes; merged with the base.
}

export function AsciiBit({
  hue,
  onClick,
  position,
  ariaLabel,
  glyph,
  eyePair,
  className = "",
}: AsciiBitProps) {
  const color = `oklch(var(--bit-l) var(--bit-c) ${hue})`;

  const baseClass =
    "absolute font-mono whitespace-nowrap select-none transition-colors duration-150 hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] focus-visible:bg-[color:var(--ink)] focus-visible:text-[color:var(--paper)] focus-visible:outline-none cursor-pointer";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${baseClass} ${className}`}
      style={{ ...position, color, background: "transparent", border: "none", padding: "0 2px" }}
    >
      {eyePair ? <EyePairContent /> : glyph}
    </button>
  );
}

function EyePairContent() {
  const leftRef = useRef<HTMLSpanElement | null>(null);
  const rightRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const update = (e: PointerEvent) => {
      [leftRef.current, rightRef.current].forEach((eye) => {
        if (!eye) return;
        const rect = eye.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const ratio = Math.min(1, dist / 200);
        const tx = (dx / (dist || 1)) * PUPIL_MAX_OFFSET * ratio;
        const ty = (dy / (dist || 1)) * PUPIL_MAX_OFFSET * ratio;
        const pupil = eye.querySelector(".pupil") as HTMLElement | null;
        if (pupil) {
          pupil.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
        }
      });
    };
    window.addEventListener("pointermove", update);
    return () => window.removeEventListener("pointermove", update);
  }, []);

  const eyeStyle: CSSProperties = {
    width: EYE_SIZE,
    height: EYE_SIZE,
    border: "1px solid currentColor",
    borderRadius: "50%",
    background: "var(--paper)",
  };
  const pupilStyle: CSSProperties = {
    width: 4,
    height: 4,
    background: "currentColor",
    borderRadius: "50%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <span className="inline-flex items-center gap-1.5 text-[14px]">
      <span aria-hidden>[</span>
      <span ref={leftRef} className="relative inline-block" style={eyeStyle}>
        <span className="pupil absolute" style={pupilStyle} />
      </span>
      <span ref={rightRef} className="relative inline-block" style={eyeStyle}>
        <span className="pupil absolute" style={pupilStyle} />
      </span>
      <span aria-hidden>]</span>
    </span>
  );
}
```

Notes:
- The `EyePairContent` component reuses the math from existing `cursor-eyes.tsx` line-for-line. Each pair has its own `pointermove` listener — that's intentional (eye pairs are now bits, owned individually). The total listener count is 5 + 1 (backdrop) = 6 listeners on `window`/section. Acceptable for a hero.
- `border: "1px solid currentColor"` and `background: "currentColor"` (on pupil) make the eye border/pupil pick up the bit's hue from the parent button's `color`. So when you click the pair, the eye outline + pupil shift hue together.
- The eye-pair is rendered inside a `<button>`, which is what we want for click-to-cycle hue.
- `aria-label` prop is required by the consumer — each bit is an interactive element, screen readers need to know it does something even if the glyph is decorative.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS. Pokeball errors ignored.

- [ ] **Step 3: Commit**

```
git add src/components/hero/ascii-bit.tsx
git commit -m "feat(hero): add AsciiBit primitive for round 7"
```

---

## Task 4: AsciiFrame composition root

**Files:**
- Create: `src/components/hero/ascii-frame.tsx`

Owns the bit list, the hue state map, the shuffle button, and the photo. This is what `hero-terminal.tsx` consumes for its right column.

- [ ] **Step 1: Create `src/components/hero/ascii-frame.tsx`**

```tsx
"use client";

import { useState } from "react";
import { PhotoFrame } from "@/components/hero/photo-frame";
import { AsciiBit, type BitPosition } from "@/components/hero/ascii-bit";

interface BitDef {
  id: string;
  position: BitPosition;
  ariaLabel: string;
  defaultHue: number;
  // Either a static glyph or eyePair: true.
  glyph?: string;
  eyePair?: boolean;
  className?: string;
}

const HUE_STEP = 30;

// Top eye-row — 5 pairs, each different glyph, side-by-side centered at the top.
const EYE_PAIRS: BitDef[] = [
  { id: "eye-1", position: { top: 0, left: 0 }, ariaLabel: "Eye pair 1, click to recolor", defaultHue: 0, eyePair: true },
  { id: "eye-2", position: { top: 0, left: 56 }, ariaLabel: "Eye pair 2, click to recolor", defaultHue: 60, eyePair: true },
  { id: "eye-3", position: { top: 0, left: 112 }, ariaLabel: "Eye pair 3, click to recolor", defaultHue: 120, eyePair: true },
  { id: "eye-4", position: { top: 0, left: 168 }, ariaLabel: "Eye pair 4, click to recolor", defaultHue: 200, eyePair: true },
  { id: "eye-5", position: { top: 0, left: 224 }, ariaLabel: "Eye pair 5, click to recolor", defaultHue: 280, eyePair: true },
];

const FRAME_BITS: BitDef[] = [
  // Top-left cluster
  { id: "tl-label", glyph: "// 01", position: { top: 28, left: 4 }, ariaLabel: "Cluster 01 label", defaultHue: 0 },
  { id: "tl-face", glyph: "(´ω`)", position: { top: 44, left: 4 }, ariaLabel: "Face: cute", defaultHue: 350 },
  // Top-right cluster
  { id: "tr-label", glyph: "// 02", position: { top: 28, right: 4 }, ariaLabel: "Cluster 02 label", defaultHue: 220 },
  { id: "tr-face", glyph: "ʕ•ᴥ•ʔ", position: { top: 44, right: 4 }, ariaLabel: "Face: bear", defaultHue: 220 },
  // Left mid cluster
  { id: "lm-1", glyph: "{*}", position: { top: 140, left: 0 }, ariaLabel: "Symbol asterisk", defaultHue: 140 },
  { id: "lm-2", glyph: "~~~", position: { top: 156, left: 0 }, ariaLabel: "Symbol waves", defaultHue: 0 },
  { id: "lm-3", glyph: "[+]", position: { top: 172, left: 0 }, ariaLabel: "Symbol plus", defaultHue: 280 },
  // Right mid cluster
  { id: "rm-1", glyph: "[!]", position: { top: 140, right: 0 }, ariaLabel: "Symbol bang", defaultHue: 0 },
  { id: "rm-2", glyph: "░▒▓", position: { top: 156, right: 0 }, ariaLabel: "Symbol shading", defaultHue: 220 },
  { id: "rm-3", glyph: "▮▮▮", position: { top: 172, right: 0 }, ariaLabel: "Symbol blocks", defaultHue: 60 },
  // Bottom corners
  { id: "bl-face", glyph: "(>‿<)", position: { bottom: 28, left: 4 }, ariaLabel: "Face: smiling", defaultHue: 200 },
  { id: "br-face", glyph: "(◕‿◕)", position: { bottom: 28, right: 4 }, ariaLabel: "Face: happy", defaultHue: 280 },
  // Bottom footer
  { id: "footer", glyph: "└─ aziz_v1.0 — online ─┘", position: { bottom: 4, left: "50%", transform: "translateX(-50%)" }, ariaLabel: "Status footer", defaultHue: 0 },
];

const ALL_BITS: BitDef[] = [...EYE_PAIRS, ...FRAME_BITS];

function buildDefaultHues(): Record<string, number> {
  return Object.fromEntries(ALL_BITS.map((b) => [b.id, b.defaultHue]));
}

interface AsciiFrameProps {
  imageSrc: string;
}

export function AsciiFrame({ imageSrc }: AsciiFrameProps) {
  const [hues, setHues] = useState<Record<string, number>>(buildDefaultHues);

  const cycleHue = (id: string) => {
    setHues((prev) => ({ ...prev, [id]: (prev[id] + HUE_STEP) % 360 }));
  };

  const shuffleAll = () => {
    setHues(Object.fromEntries(ALL_BITS.map((b) => [b.id, Math.floor(Math.random() * 360)])));
  };

  return (
    <div className="relative w-full" style={{ height: 400 }}>
      {/* Centered photo */}
      <div
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 200,
          height: 260,
        }}
      >
        <PhotoFrame imageSrc={imageSrc} />
      </div>

      {/* Shuffle button — top-right of the eye-row strip */}
      <button
        type="button"
        onClick={shuffleAll}
        className="absolute font-mono text-[12px] transition-colors duration-150 hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] focus-visible:bg-[color:var(--ink)] focus-visible:text-[color:var(--paper)] focus-visible:outline-none cursor-pointer"
        style={{ top: 4, right: 4, color: "var(--ink)", background: "transparent", border: "none", padding: "2px 4px" }}
        aria-label="Shuffle all bit colors"
      >
        [ shuffle ]
      </button>

      {/* All bits */}
      {ALL_BITS.map((b) => (
        <AsciiBit
          key={b.id}
          hue={hues[b.id]}
          onClick={() => cycleHue(b.id)}
          position={b.position}
          ariaLabel={b.ariaLabel}
          glyph={b.glyph}
          eyePair={b.eyePair}
          className={b.className}
        />
      ))}
    </div>
  );
}
```

Notes:
- `useState<Record<string, number>>(buildDefaultHues)` uses the function form so the default object is built once on mount, not on every render.
- `Math.random()` runs on the client only (component is `"use client"` and shuffleAll is in a click handler). Safe from hydration mismatches.
- The 5 eye-pair positions use `left: 0/56/112/168/224` to lay them out at fixed pixel offsets centered horizontally — at column width ~280px with 5 pairs of ~56px each, this fits without overflow. If the container is narrower the pairs may clip; this is acceptable per the spec (right column is `lg+` only).
- The photo size (200×260) sits inside the 400px-tall container with comfortable space top and bottom for the eye row, clusters, and footer.
- `glyph` is rendered as `string` text (React renders it inside the button as a text node). The eye-pair branch ignores `glyph` and renders `<EyePairContent />` from `ascii-bit.tsx`.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS. Pokeball errors ignored.

- [ ] **Step 3: Commit**

```
git add src/components/hero/ascii-frame.tsx
git commit -m "feat(hero): add AsciiFrame composition root for round 7"
```

---

## Task 5: Wire HeroTerminal to use HeroBackdrop + AsciiFrame

**Files:**
- Modify: `src/components/sections/hero-terminal.tsx`

Swap the existing `<ParticleConstellation />` for `<HeroBackdrop />`, and swap the right column (`<CursorEyes />` + `<PhotoFrame />` stack) for a single `<AsciiFrame />`.

- [ ] **Step 1: Re-read `src/components/sections/hero-terminal.tsx` to confirm current state**

It should match the R6 final version: imports `personalInfo`, `AsciiBanner`, `HeroButtons`, `CursorEyes`, `PhotoFrame`, `useTypingLoop`, `KeyValue`/`KeyValueList`, `ParticleConstellation`. If something has drifted, stop and re-check before editing.

- [ ] **Step 2: Replace the file**

```tsx
"use client";

import { personalInfo } from "@/data/personal";
import { AsciiBanner } from "@/components/hero/ascii-banner";
import { HeroButtons } from "@/components/hero/hero-buttons";
import { AsciiFrame } from "@/components/hero/ascii-frame";
import { useTypingLoop } from "@/hooks/use-typing";
import { KeyValue, KeyValueList } from "@/components/terminal/key-value";
import { HeroBackdrop } from "@/components/hero/hero-backdrop";

export function HeroTerminal() {
  const { displayText: headline } = useTypingLoop([...personalInfo.headlines], {
    typeSpeed: 55,
    deleteSpeed: 30,
    holdAfterType: 1600,
    holdAfterDelete: 250,
    startDelay: 500,
  });

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative"
    >
      <HeroBackdrop />

      <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[7fr_5fr] lg:items-start">
        {/* Left column — identity */}
        <div className="space-y-5 py-4">
          <h1 id="hero-heading" className="sr-only">
            {personalInfo.name}
          </h1>

          <AsciiBanner />

          <p style={{ fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.25rem)" }}>
            <span aria-hidden>{"> "}</span>
            <span>{headline}</span>
            <span className="ml-0.5 inline-block w-[0.55em] h-[1em] align-[-0.1em] bg-[color:var(--ink)] animate-[blink_1s_steps(2,end)_infinite]" />
          </p>

          <KeyValueList>
            <KeyValue k="location">{personalInfo.location}</KeyValue>
            <KeyValue k="email">
              <a href={`mailto:${personalInfo.email}`} className="hover:underline underline-offset-4">
                {personalInfo.email}
              </a>
            </KeyValue>
            <KeyValue k="status">{personalInfo.status.label}</KeyValue>
          </KeyValueList>

          <HeroButtons />
        </div>

        {/* Right column — ASCII frame around photo */}
        <AsciiFrame imageSrc={personalInfo.profileImage} />
      </div>
    </section>
  );
}
```

Key changes:
- Removed imports: `CursorEyes`, `PhotoFrame`, `ParticleConstellation`.
- Removed wrapping `<div className="absolute inset-0 pointer-events-none overflow-hidden"><ParticleConstellation /></div>` — `<HeroBackdrop />` is self-positioning.
- Removed `<div className="flex flex-col gap-3" style={{ height: 400 }}>...</div>` wrapping the right column — `<AsciiFrame />` owns its own size now.
- Added `<HeroBackdrop />` and `<AsciiFrame />` imports.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS. Pokeball errors ignored.

- [ ] **Step 4: Verify dev server (the implementer should run this if possible)**

Run: `npm run dev`
Open: `http://localhost:3000`

Expected:
- Hero left column unchanged (banner, typing line, key-values, bracketed buttons).
- Hero right column shows: 5 different eye-pair glyphs across the top (clickable), photo centered in the column, ~14 ASCII bits at curated cluster positions around it (`// 01`, `// 02`, faces, symbols, footer), and a `[ shuffle ]` button top-right.
- Each bit is clickable; clicking advances its hue 30°. The eye-pair pupils still track the cursor.
- `[ shuffle ]` recolors everything at once.
- Background: at rest no grid visible (unless reduced-motion is on — then a static low-opacity grid). Moving the cursor over the hero reveals a soft circular grid spotlight. Moving outside the section hides it.
- No console errors.

If the dev server is not available in the implementer's environment, run `npm run build` instead to surface build-time errors.

- [ ] **Step 5: Commit**

```
git add src/components/sections/hero-terminal.tsx
git commit -m "feat(hero): wire HeroBackdrop + AsciiFrame (round 7)"
```

---

## Task 6: Cleanup of unreferenced files

**Files:**
- Delete (if unreferenced): `src/components/hero/cursor-eyes.tsx`
- Delete (if unreferenced): `src/components/hero/particle-constellation.tsx`

After Task 5, these two files should have no consumers. Verify before deleting.

- [ ] **Step 1: Verify no remaining references**

Run:
```
grep -rn "from \"@/components/hero/cursor-eyes\"\|from \"@/components/hero/particle-constellation\"" src/
```
Expected: NO matches. (If there are matches, do NOT proceed — investigate the matching file and either remove its usage or skip the deletion of that file. Report this back.)

- [ ] **Step 2: Delete the files**

```
git rm src/components/hero/cursor-eyes.tsx src/components/hero/particle-constellation.tsx
```

- [ ] **Step 3: Type-check + build**

Run: `npx tsc --noEmit`
Expected: PASS. Pokeball errors still expected.

(Optional, if available) Run: `npm run build`
Expected: build succeeds. The bundle should no longer include Three.js code paths from the particle constellation.

- [ ] **Step 4: Commit**

```
git commit -m "chore(hero): remove unreferenced cursor-eyes + particle-constellation"
```

---

## Task 7: Cross-width + interaction verification

This is a manual check. No code changes.

- [ ] **Step 1: Verify at 1440px**

Set viewport to 1440px wide.
Expected: hero displays correctly. Right column shows the photo centered, 5 eye-pairs across the top, ~14 bits at their cluster positions. No bit overlaps the photo. `[ shuffle ]` button is in the top-right of the right column.

- [ ] **Step 2: Click interactions**

- Click any non-eye bit (e.g., `// 01`, `[+]`, `(>‿<)`). Its color advances; the rest are unaffected.
- Click an eye-pair. Its eye-outline + pupil change color together. Pupils still track the cursor.
- Click `[ shuffle ]`. Every bit (eye-pairs included) gets a fresh random hue.
- Tab through: each bit (and shuffle) receives keyboard focus with the paper/ink invert.
- Press Enter on a focused bit — should also advance hue.

- [ ] **Step 3: Hover + cursor-spotlight**

- Move cursor across the hero section: a soft circular grid pattern reveals under the cursor and follows it.
- Move cursor outside the hero section (or above it, or below): grid hides.
- Cursor inside hero but over the photo or a bit: backdrop still updates, foreground items remain clickable.

- [ ] **Step 4: Reduced motion**

Enable `prefers-reduced-motion: reduce` (browser settings or DevTools rendering pane).
Expected: the grid is shown statically at low opacity covering the section, no cursor follow.

- [ ] **Step 5: Dark mode**

Toggle dark mode.
Expected: grid lines and bits flip to ink-on-paper accordingly. Bit hues remain readable (lighter `--bit-l: 80%` in dark theme).

- [ ] **Step 6: Mobile (375px)**

Resize to 375px wide.
Expected: right column collapses below the left column. The frame (height 400) renders; the photo is still visible centered. Bits at side positions (`left: 0`/`right: 0`) sit at the column edges. Layout is acceptable but not deliberately optimized — that's R8 (mobile pass) work.

- [ ] **Step 7: Refresh resets**

Customize a few bits, click shuffle, then refresh the page.
Expected: bits return to their default hues. No localStorage involved.

---

## Verification Summary

After all tasks complete:

- [ ] Hero left column unchanged from R6
- [ ] Hero right column shows clustered ASCII frame around the centered photo (~14 bits + 5 eye-pairs + shuffle button)
- [ ] Each bit click-cycles through 12 hues; shuffle re-rolls all
- [ ] Eye-pair pupils still track the cursor; eye outline color follows the pair's current hue
- [ ] Hero background reveals grid only inside ~280px circle following the cursor; reduced-motion shows static low-opacity grid
- [ ] Other sections (career, projects, contact, etc.) have NO grid backdrop applied
- [ ] `npx tsc --noEmit` passes (ignoring pre-existing pokeball errors)
- [ ] `npm run build` (if run) succeeds
- [ ] `cursor-eyes.tsx` and `particle-constellation.tsx` removed from the repo
- [ ] No `git push` performed (per user request — local-only)

Right column foreground state is reset on every page load. Customization is a discoverable toy, not persisted.
