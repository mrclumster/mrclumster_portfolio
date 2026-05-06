# Portfolio Revisions Design Spec

**Date:** 2026-05-07
**Status:** Approved — ready for implementation
**Branch:** feat/terminal-redesign

---

## Overview

Round 2 revisions to the terminal portfolio. Replaces effects the user disliked, adds page-level atmosphere, and polishes the career/education/certifications layout.

Four discrete changes:
1. Hero portrait → ASCII halftone with hover-to-reveal photo
2. Skills/stack → tag cloud with category-highlight on hover
3. Career/Edu/Certs → vertical divider with ASCII tick markers + log-end footers + clickable commit hash
4. Page background → grain + grid texture

---

## 1. Hero Portrait — ASCII Halftone

### Replaces
- `src/components/hero/shattered-portrait.tsx` (delete)
- Hero right column currently renders `<ShatteredPortrait />`

### New component
`src/components/hero/ascii-portrait.tsx`

### Behavior
- On mount: load profile photo into hidden canvas, sample brightness in a grid of cells (e.g. 60 cols × 75 rows), map each cell's average brightness to a character from the ramp:
  ```
  ' .:-=+*#%@'
  ```
  (dark → light or inverted depending on theme).
- Render the resulting string in a `<pre>` element. Monospace, leading 1, character-by-character — the face is recognizable as text.
- The real `<img>` sits absolute-positioned beneath the `<pre>`, opacity 0 by default.
- On `mouseenter` of the container: `<pre>` fades to opacity 0, `<img>` fades to opacity 1 (300–400ms ease).
- On `mouseleave`: reverse.
- Optional: faint static scanline overlay (`repeating-linear-gradient`) always present for CRT vibe.

### Sizing
- Container is the existing right-column div: `border border-[color:var(--ink)] overflow-hidden relative`, `height: 400px`.
- ASCII font-size auto-fits container: `font-size = container_height / rows`.
- Image uses `next/image` with `fill object-cover object-top`, grayscale on hover-out (for symmetry with current design — but optional).

### Tech
- React + Canvas 2D for sampling.
- No Three.js. Drop the texture loader and shattered logic entirely.
- Sampling runs once on image-load; cached as a string in state.

### Color
- ASCII text color = `var(--ink)`.
- Background of `<pre>` transparent so the bordered container shows through.

### Hero file change
In `src/components/sections/hero-terminal.tsx`:
- Remove `import { ShatteredPortrait } from "@/components/hero/shattered-portrait";`
- Add `import { AsciiPortrait } from "@/components/hero/ascii-portrait";`
- Replace `<ShatteredPortrait imageSrc={personalInfo.profileImage} />` with `<AsciiPortrait imageSrc={personalInfo.profileImage} />`
- Delete the file `src/components/hero/shattered-portrait.tsx`.

---

## 2. Stack Section — Tag Cloud

### Replaces
- `src/components/sections/neural-network.tsx` (delete)
- `src/components/sections/stack-tree.tsx` directory listing (delete the inner tree, keep the file but rewrite its return)

### New component (or rewrite stack-tree.tsx)
`src/components/sections/stack-cloud.tsx` — preferred new file. Then `stack-tree.tsx` can be deleted entirely and `page.tsx` updated to import `StackCloud` instead of `StackTree`.

### Behavior
- Render every `cat.items[*].name` from `techStack` as a bracketed tag: `[name]`.
- All tags in a single `flex flex-wrap gap-2` container — no category headings shown.
- Each tag has a `data-category` attribute matching its parent category name.
- On hover of a tag (mouseenter):
  - Set state `hoveredCategory = tag.dataset.category`.
  - Tags with matching category: opacity 1, slight `scale(1.05)`, ink background + paper text (inverted).
  - Tags with different category: opacity 0.25.
- On mouseleave of the container: all tags return to default (opacity 0.85, no scale, no inversion).
- Smooth transitions: `transition-all duration-200`.

### Default tag style
```tsx
<span
  data-category={cat}
  className="font-mono text-[0.8125rem] px-2 py-1 border border-[color:var(--ink)]/40
             cursor-default transition-all duration-200"
>
  [{name}]
</span>
```

### Page change
`src/app/page.tsx`:
- Replace `import { StackTree } from "@/components/sections/stack-tree";` with `import { StackCloud } from "@/components/sections/stack-cloud";`
- Replace `<StackTree />` with `<StackCloud />`.
- Delete `stack-tree.tsx` and `neural-network.tsx` files entirely.

---

## 3. Career / Education / Certifications — Divider + Polish

### Three sub-changes

#### 3a. Vertical divider with ASCII ticks

In `src/app/page.tsx`, the career/education/certs grid currently looks like:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12">
  <div className="space-y-10"> {/* left column */} </div>
  <section> {/* certifications */} </section>
</div>
```

Add divider:
- Wrap the grid in a `relative` container.
- Add a vertical 1px line as a pseudo-element OR an absolutely-positioned `<span>` between the columns.
- Add small `┤` tick at the top of that line and `├` at the bottom — these are absolutely-positioned `<span>` elements with the ASCII character.
- Visible only on `lg` breakpoint (when grid is two columns).
- Line color: `var(--ink)` at 30% opacity.

Implementation sketch:
```tsx
<div className="relative grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12">
  {/* Vertical divider — desktop only */}
  <div
    aria-hidden
    className="hidden lg:block absolute top-0 bottom-0 pointer-events-none"
    style={{
      left: "calc((100% / 5) * 3 + 1.5rem)",
      width: 1,
      background: "var(--ink)",
      opacity: 0.3,
    }}
  >
    <span className="absolute -top-2 -left-1.5 font-mono text-[10px]" style={{ opacity: 0.6 }}>┤</span>
    <span className="absolute -bottom-2 -left-1.5 font-mono text-[10px]" style={{ opacity: 0.6 }}>├</span>
  </div>

  {/* left column */}
  <div className="space-y-10">...</div>

  {/* certs */}
  <section>...</section>
</div>
```

Note: The exact `left` position calc may need tuning; alternatively use `border-l` on the certifications section with negative margin and pseudo-elements for ticks. Both work — the absolute approach gives the cleanest tick placement.

#### 3b. Log-end footers

Add a small ASCII footer at the bottom of these three components:
- `ExperienceLog`
- `EducationBlock`
- `CertificationsList`

Footer markup:
```tsx
<p className="font-mono text-[10px] opacity-30 mt-4 select-none">
  └─ end of log ─┘
</p>
```

(For certifications use "end of cert/" or just the same generic footer — pick generic for consistency.)

#### 3c. Clickable commit hash

In `src/components/sections/experience-log.tsx`, the line:
```tsx
<span>{shortHash(entry.title + entry.company)}</span>
```

Change to:
```tsx
<button
  type="button"
  onClick={() => {
    navigator.clipboard.writeText(hash);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 1200);
  }}
  className="hover:underline underline-offset-4 cursor-pointer"
>
  {hash}
</button>
{copiedIdx === index && <span className="ml-2 opacity-60 text-[11px]">copied</span>}
```

Add `useState` for `copiedIdx` at the parent component level. Hash variable extracted into a `const hash = shortHash(entry.title + entry.company)` for reuse.

---

## 4. Page Background — Grain + Grid

### File: `src/app/globals.css`

Add new CSS rules. Target: `body.terminal-route` (already used by terminal route).

#### Grain (SVG noise data URI)
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
```

#### Grid lines
```css
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
```

#### Ensure content sits above
The `<TerminalFrame>` and main page `div` should have `position: relative; z-index: 1` (or use `isolate` on the terminal-route body) so they render above the grain/grid layers.

Add to `body.terminal-route`:
```css
body.terminal-route { isolation: isolate; }
body.terminal-route > * { position: relative; z-index: 1; }
```

#### Dark mode
The `var(--ink)` variable already swaps in dark mode, so the grid lines will adapt automatically. Grain stays the same.

---

## Files Summary

### Create
| File | Purpose |
|------|---------|
| `src/components/hero/ascii-portrait.tsx` | New ASCII halftone hero portrait |
| `src/components/sections/stack-cloud.tsx` | New tag cloud component |

### Modify
| File | Change |
|------|--------|
| `src/components/sections/hero-terminal.tsx` | Swap ShatteredPortrait → AsciiPortrait |
| `src/app/page.tsx` | Swap StackTree → StackCloud, add vertical divider div + ticks |
| `src/components/sections/experience-log.tsx` | Clickable commit hash + copy state, add log-end footer |
| `src/components/sections/education-block.tsx` | Add log-end footer |
| `src/components/sections/certifications-list.tsx` | Add log-end footer |
| `src/app/globals.css` | Add grain + grid background pseudo-elements + isolation |

### Delete
| File | Reason |
|------|--------|
| `src/components/hero/shattered-portrait.tsx` | Replaced by ASCII halftone |
| `src/components/sections/stack-tree.tsx` | Replaced by tag cloud |
| `src/components/sections/neural-network.tsx` | No longer used |

---

## Open Questions

None — all design decisions confirmed during brainstorming.

---

## How to Continue on Your Laptop

1. `git pull origin feat/terminal-redesign`
2. Open this spec at `docs/superpowers/specs/2026-05-07-portfolio-revisions-design.md`.
3. Tell Claude: *"Continue from the portfolio revisions spec. Create the implementation plan and start executing."*
4. Claude will run `writing-plans` to produce a step-by-step task list, then execute.

