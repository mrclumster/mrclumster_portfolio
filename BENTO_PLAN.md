# Bento Card Improvements Plan

> Handoff doc for picking this work back up on another machine.
> Drafted 2026-04-15. Builds on top of [VISUAL_PLAN.md](VISUAL_PLAN.md) and [HERO_PLAN.md](HERO_PLAN.md).

## Context

The user wants their bento cards to feel more visually rich while staying professional. Inspired by two reference images:

1. **Reference 1** — Cards with subtle radial glow accents at corners (top-left + bottom-right). Adds depth and color hints.
2. **Reference 2** — Project card with a 3D perspective tilt on hover, plus a floating URL pill above the card showing the GitHub link.

Goal: bring those two effects in without going overboard. Keep all current functionality intact.

## Current state (already in place)

- **Shared card** [src/components/shared/bento-card.tsx](src/components/shared/bento-card.tsx) — has glassmorphism (`bg-card/70 backdrop-blur-md`), thin top sheen line, mouse-tracking radial glow via `useMousePosition`, ring color shift on hover, subtle lift on hover.
- **Project card** [src/components/shared/bento-project-card.tsx](src/components/shared/bento-project-card.tsx) — wraps a Modal trigger. Has image thumbnail with `group-hover:scale-105` zoom, gradient bottom-fade overlay, tags row.
- **Reusable hook** [src/hooks/use-mouse-position.ts](src/hooks/use-mouse-position.ts) — RAF-throttled cursor tracking. Pattern is reusable for tilt.
- **Color tokens already in palette:** `accent-brand` (blue), `accent-warm` (warm amber). Both have light + dark variants.

## Confirmed scope (user-selected)

1. **Corner glow accents** — Blue + warm using **existing** palette (no new color tokens). Static glows at top-left + bottom-right of every bento card.
2. **3D tilt on hover** — **Project cards only**. Subtle (~5-7° max), follows cursor.
3. **URL pill on hover** — **Project cards only**. Small floating pill above the card showing the GitHub URL, fades in on hover.

## Implementation

### 1. Corner glow accents — `BentoCard`

Add two absolutely-positioned blurred radial-gradient divs inside the existing card div:
- **Top-left:** `accent-brand` glow (blue)
- **Bottom-right:** `accent-warm` glow (amber)

```tsx
// inside the card div, after the top sheen line, before mouse-tracking glow
<div aria-hidden className="pointer-events-none absolute -top-12 -left-12 h-40 w-40 rounded-full bg-accent-brand/15 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
<div aria-hidden className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-accent-warm/12 blur-3xl opacity-50 group-hover:opacity-90 transition-opacity duration-500" />
```

The card needs `group` class added to the outer `<div>` so children can use `group-hover:`. Glows brighten on hover for subtle feedback.

**Tone control:** Test in both light + dark. Light mode may need lower opacity (`/8` instead of `/15`).

**Optional `glowColor` prop:** Add `glowColor?: "brand" | "warm" | "none"` to `BentoCardProps`. Lets specific cards (e.g., contact CTA, which already has its own gradient) opt out. Default = both glows visible. Skip if not needed.

### 2. 3D tilt on hover — `BentoProjectCard` only

Add a new hook in `src/hooks/use-tilt.ts`:
- Tracks cursor position via `mousemove` on the element ref
- Computes `rotateX` from vertical position (-7° to +7°), `rotateY` from horizontal position
- RAF-throttled like `useMousePosition`
- Returns `{ ref, transform, handleMouseMove, handleMouseLeave }` where `transform` is a CSS string like `"perspective(1000px) rotateX(3deg) rotateY(-2deg)"`

Apply to the `ModalTrigger` element:
```tsx
style={{
  transform,
  transformStyle: "preserve-3d",
  transition: "transform 200ms ease-out",
}}
```

The grid that contains the project cards needs `perspective: 1000px` (or just put `perspective(1000px)` inline in the transform, simpler).

On `mouseLeave`, reset to identity. Smooth return to flat.

Keep the existing image `scale-105` on hover — combines nicely with tilt.

### 3. URL pill on hover — `BentoProjectCard`

Small absolutely-positioned pill above the card image, only when `project.githubUrl` (or `liveUrl`) exists. Use mono font for that "code/terminal" feel from the reference.

```tsx
{project.githubUrl && (
  <div className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md bg-card ring-1 ring-foreground/15 px-2 py-1 text-[10px] font-mono text-muted-foreground shadow-lg max-w-[90%] truncate">
    {project.githubUrl.replace(/^https?:\/\//, "")}
  </div>
)}
```

`pointer-events-none` so it doesn't block the modal click. Use `font-mono` (already a token).

## Files to be modified

| File | Status | Change |
|------|--------|--------|
| [src/components/shared/bento-card.tsx](src/components/shared/bento-card.tsx) | edit | Add `group` class + two corner glow divs. Optional `glowColor` prop. |
| [src/components/shared/bento-project-card.tsx](src/components/shared/bento-project-card.tsx) | edit | Wire up `useTilt` to ModalTrigger, add URL pill, ensure perspective. |
| `src/hooks/use-tilt.ts` | NEW | Mouse-tracking hook returning a CSS transform string. RAF-throttled. |
| [src/app/globals.css](src/app/globals.css) | edit | Extend `prefers-reduced-motion` block to disable tilt (set transform to `none !important`). |
| [src/app/page.tsx](src/app/page.tsx) | edit (optional) | If `glowColor` prop is added, pass `glowColor="none"` to contact CTA card. |

## Critical constraints (do not violate)

- **Next.js 16 has breaking changes** — read `node_modules/next/dist/docs/` before writing any Next-specific code. See [AGENTS.md](AGENTS.md).
- **Respect `prefers-reduced-motion`** — disable tilt entirely (return identity transform). Glows are static, no issue. URL pill fade is short, no issue.
- **No tilt on mobile / touch** — gate the hook with a `(pointer: fine)` matchMedia check, OR don't attach handlers if touch detected. Touch screens shouldn't tilt.
- **Keep mouse-tracking glow intact** — don't replace it. Corner glows + cursor glow layer well together.
- **No new dependencies** — pure CSS + React + existing patterns.
- **Performance** — corner glows use `blur-3xl` (GPU-cheap on modern devices but can stack badly). Test scrolling on a mid-range device. If laggy, swap to `blur-2xl`.

## Verification

1. `npm run dev` → http://localhost:3000
2. **Corner glows:** every bento card shows a soft blue glow top-left + warm glow bottom-right. They brighten subtly on hover.
3. **Project card tilt:** hover a project card — it tilts toward cursor (max ~7°). Smooth return when leaving.
4. **URL pill:** hover FishFresh card — small mono-font pill appears above showing `github.com/chirdnek/2025-CP_Fishfresh`. Click still opens the modal.
5. Toggle dark/light theme — both look intentional.
6. DevTools → Rendering → enable `prefers-reduced-motion` → tilt is disabled, glows still visible.
7. Mobile width (375px) — no tilt on touch. Glows still visible but don't dominate.
8. `npm run build` — no TS or ESLint errors.
9. Lighthouse — Performance shouldn't drop more than 1-2 points.

## How to start (for the Claude session on the other PC)

1. `npm install` (if `node_modules` doesn't exist)
2. `npm run dev` — confirm baseline works
3. Read this file + [VISUAL_PLAN.md](VISUAL_PLAN.md) + [HERO_PLAN.md](HERO_PLAN.md) for full context
4. Start with **Step 1 (corner glows)** — easiest win, immediately visible
5. Then **Step 2 (tilt)** — needs the new hook
6. Then **Step 3 (URL pill)** — pure JSX addition
7. Commit each step separately so you can roll back if one feels off
