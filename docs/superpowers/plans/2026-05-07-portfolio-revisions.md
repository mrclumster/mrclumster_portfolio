# Portfolio Revisions Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Round 2 polish — ASCII halftone portrait, skill tag cloud, divider/footer/copy polish, page-level grain+grid background.

**Architecture:** All changes are isolated component swaps + one CSS file change. No new dependencies.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind v4. (Three.js no longer needed for hero portrait.)

---

## Task 1: ASCII Halftone Portrait

**Files:**
- Create: `src/components/hero/ascii-portrait.tsx`
- Modify: `src/components/sections/hero-terminal.tsx`
- Delete: `src/components/hero/shattered-portrait.tsx`

- [ ] **Step 1: Create `src/components/hero/ascii-portrait.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const RAMP = " .:-=+*#%@";
const COLS = 60;
const ROWS = 75;

interface Props {
  imageSrc: string;
}

export function AsciiPortrait({ imageSrc }: Props) {
  const [ascii, setAscii] = useState("");
  const [hovering, setHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = COLS;
      canvas.height = ROWS;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, COLS, ROWS);
      const data = ctx.getImageData(0, 0, COLS, ROWS).data;
      let out = "";
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const i = (y * COLS + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const idx = Math.floor(lum * (RAMP.length - 1));
          out += RAMP[idx];
        }
        out += "\n";
      }
      setAscii(out);
    };
  }, [imageSrc]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Real photo — visible on hover */}
      <Image
        src={imageSrc}
        alt="Aziz Tebbeng"
        fill
        sizes="(min-width: 1024px) 400px, 100vw"
        className="object-cover object-top transition-opacity duration-400"
        style={{ opacity: hovering ? 1 : 0 }}
        priority
      />

      {/* ASCII overlay — visible by default */}
      <pre
        aria-hidden
        className="absolute inset-0 w-full h-full overflow-hidden m-0 p-0 leading-[1] transition-opacity duration-400 select-none pointer-events-none"
        style={{
          color: "var(--ink)",
          fontFamily: '"Courier New", ui-monospace, monospace',
          fontSize: "calc(100% / 12)",
          letterSpacing: 0,
          opacity: hovering ? 0 : 0.95,
          textAlign: "center",
          fontWeight: 700,
        }}
      >
        {ascii}
      </pre>

      {/* Scanline overlay (always on, faint) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 3px)",
        }}
      />
    </div>
  );
}
```

**Note on font-size:** This uses a percentage-based size that scales with container. May need tuning. Alternative: compute `fontSize = containerHeight / ROWS` via a ResizeObserver. Start with the percentage approach — if it doesn't fit, switch to ResizeObserver.

- [ ] **Step 2: Update `src/components/sections/hero-terminal.tsx`**

- Remove: `import { ShatteredPortrait } from "@/components/hero/shattered-portrait";`
- Add: `import { AsciiPortrait } from "@/components/hero/ascii-portrait";`
- Replace `<ShatteredPortrait imageSrc={personalInfo.profileImage} />` with `<AsciiPortrait imageSrc={personalInfo.profileImage} />`

- [ ] **Step 3: Delete the shattered portrait file**

```
git rm src/components/hero/shattered-portrait.tsx
```

- [ ] **Step 4: Type-check + commit**

```
npx tsc --noEmit
git add src/components/hero/ascii-portrait.tsx src/components/sections/hero-terminal.tsx
git commit -m "feat: replace shattered portrait with ASCII halftone hover-reveal"
```

---

## Task 2: Skill Tag Cloud

**Files:**
- Create: `src/components/sections/stack-cloud.tsx`
- Modify: `src/app/page.tsx`
- Delete: `src/components/sections/stack-tree.tsx`, `src/components/sections/neural-network.tsx`

- [ ] **Step 1: Create `src/components/sections/stack-cloud.tsx`**

```tsx
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
```

- [ ] **Step 2: Update `src/app/page.tsx`**

- Replace `import { StackTree } from "@/components/sections/stack-tree";` with `import { StackCloud } from "@/components/sections/stack-cloud";`
- Replace `<StackTree />` with `<StackCloud />`

- [ ] **Step 3: Delete unused files**

```
git rm src/components/sections/stack-tree.tsx
git rm src/components/sections/neural-network.tsx
```

- [ ] **Step 4: Type-check + commit**

```
npx tsc --noEmit
git add src/components/sections/stack-cloud.tsx src/app/page.tsx
git commit -m "feat: replace stack tree with category-aware tag cloud"
```

---

## Task 3: Career/Edu/Certs Polish — Divider + Footers + Clickable Hash

**Files:**
- Modify: `src/app/page.tsx` (add vertical divider)
- Modify: `src/components/sections/experience-log.tsx` (clickable hash + footer)
- Modify: `src/components/sections/education-block.tsx` (footer)
- Modify: `src/components/sections/certifications-list.tsx` (footer)

- [ ] **Step 1: Add vertical divider in `src/app/page.tsx`**

Find the existing grid:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12">
```

Change to:
```tsx
<div className="relative grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12">
  {/* Vertical divider with ASCII ticks — desktop only */}
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
    <span
      className="absolute -top-2 -left-1.5 font-mono text-[10px] leading-none"
      style={{ color: "var(--ink)", opacity: 0.6 }}
    >
      ┤
    </span>
    <span
      className="absolute -bottom-2 -left-1.5 font-mono text-[10px] leading-none"
      style={{ color: "var(--ink)", opacity: 0.6 }}
    >
      ├
    </span>
  </div>

  {/* ... rest of grid unchanged ... */}
</div>
```

Note: `60%` corresponds to the 3fr/2fr ratio (3/(3+2) = 60%) and `0.75rem` is half the desktop gap (`gap-12` = 3rem; midpoint is 1.5rem from each side, so left of certs column is at `60% - 1.5rem`, but visually centering the divider in the gap gives `60% - 0.75rem`). Tune visually if needed.

- [ ] **Step 2: Update `src/components/sections/experience-log.tsx`**

Add `"use client";` directive at top of the file.

Add at the top of the file:
```tsx
"use client";
import { useState } from "react";
```

Inside `ExperienceLog` parent component, manage copy state:
```tsx
export function ExperienceLog() {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  return (
    <div className="space-y-6">
      {experiences.map((entry, i) => (
        <ExperienceEntry
          key={i}
          entry={entry}
          index={i}
          total={experiences.length}
          copied={copiedIdx === i}
          onCopy={(hash) => {
            navigator.clipboard.writeText(hash);
            setCopiedIdx(i);
            setTimeout(() => setCopiedIdx(null), 1200);
          }}
        />
      ))}
      <p className="font-mono text-[10px] mt-6 select-none" style={{ opacity: 0.3 }}>
        └─ end of log ─┘
      </p>
    </div>
  );
}
```

Update `ExperienceEntry` to accept `copied` and `onCopy`:
```tsx
function ExperienceEntry({
  entry,
  index,
  total,
  copied,
  onCopy,
}: {
  entry: Experience;
  index: number;
  total: number;
  copied: boolean;
  onCopy: (hash: string) => void;
}) {
  const head = index === 0;
  const hash = shortHash(entry.title + entry.company);
  return (
    <article className="space-y-1 text-[13px] leading-[1.6]">
      <p>
        <span className="opacity-60">commit </span>
        <button
          type="button"
          onClick={() => onCopy(hash)}
          className="hover:underline underline-offset-4 cursor-pointer font-mono"
        >
          {hash}
        </button>
        {copied && <span className="ml-2 opacity-60 text-[11px]">(copied)</span>}
        {head ? <span className="ml-2 opacity-60">(HEAD -&gt; current)</span> : null}
        {!head && index === total - 1 ? <span className="ml-2 opacity-60">(initial)</span> : null}
      </p>
      {/* ... rest unchanged ... */}
    </article>
  );
}
```

- [ ] **Step 3: Update `src/components/sections/education-block.tsx`**

Add at the very end of the returned `<div>`:
```tsx
<p className="font-mono text-[10px] mt-4 select-none" style={{ opacity: 0.3 }}>
  └─ end of log ─┘
</p>
```

- [ ] **Step 4: Update `src/components/sections/certifications-list.tsx`**

Add at the end of the outer `<div>`:
```tsx
<p className="font-mono text-[10px] mt-4 select-none" style={{ opacity: 0.3 }}>
  └─ end of log ─┘
</p>
```

- [ ] **Step 5: Type-check + commit**

```
npx tsc --noEmit
git add src/app/page.tsx src/components/sections/experience-log.tsx src/components/sections/education-block.tsx src/components/sections/certifications-list.tsx
git commit -m "feat: add divider, log-end footers, clickable commit hash"
```

---

## Task 4: Page Background — Grain + Grid

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add background pseudo-elements**

Find the `body.terminal-route` rule in `src/app/globals.css`. Add these new rules anywhere after it (or append to the end of the file):

```css
body.terminal-route {
  isolation: isolate;
}

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

- [ ] **Step 2: Verify in browser**

Run `pnpm dev` and check:
- Faint grid lines visible across the entire page background.
- Subtle paper-grain texture visible on close inspection.
- All content (terminal frame, hero, sections) renders ABOVE the texture, not below.
- Dark mode: grid lines stay visible (using `--ink` which adapts).
- No content is faded or covered.

- [ ] **Step 3: Commit**

```
git add src/app/globals.css
git commit -m "feat: add paper grain and grid texture to page background"
```

---

## Final Verification Checklist

- [ ] Hero portrait shows ASCII text by default; hovering reveals real photo
- [ ] Stack section shows tag cloud; hovering a tag highlights same-category tags
- [ ] Vertical divider visible between career/education and certifications on desktop
- [ ] `┤` and `├` ticks visible at top/bottom of divider
- [ ] Each of ExperienceLog, EducationBlock, CertificationsList ends with `└─ end of log ─┘`
- [ ] Commit hashes in experience-log are clickable; clicking copies to clipboard with "(copied)" indicator
- [ ] Page background has subtle grain + grid lines visible
- [ ] No TypeScript errors (ignore pre-existing `pokeball-3d.tsx` errors)
- [ ] No console errors in browser

---

## How to Continue on Your Laptop

1. `git pull origin feat/terminal-redesign`
2. Open this plan: `docs/superpowers/plans/2026-05-07-portfolio-revisions.md`
3. Open the spec: `docs/superpowers/specs/2026-05-07-portfolio-revisions-design.md`
4. Tell Claude: *"Execute the portfolio revisions plan at `docs/superpowers/plans/2026-05-07-portfolio-revisions.md` using subagent-driven-development."*
5. Claude will run each task in sequence with reviews.
