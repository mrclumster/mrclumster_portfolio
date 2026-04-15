# Hero Improvements Plan

> Handoff doc for picking this work back up on another machine.
> Drafted 2026-04-15. Builds on top of [VISUAL_PLAN.md](VISUAL_PLAN.md) (which is now mostly done).

## Context

The hero section needs to feel more alive and creative. The user mentioned wanting a typing animation on the headline — **that already exists** ([src/hooks/use-typing.ts](src/hooks/use-typing.ts) used at [src/app/page.tsx:32](src/app/page.tsx#L32)). The plan below builds on top of it.

**If you can't see the typing animation yet:** `node_modules` isn't installed. Run `npm install` first, then `npm run dev`.

## Current hero structure

[src/app/page.tsx:38-132](src/app/page.tsx#L38-L132) — two-card layout:
- **Left card** (3-col on desktop): "Hi, I'm" → name (font-display, h1) → typing headline → location → email → 3 action buttons. Wrapped in `.hero-stagger` which fades each direct child in with 100ms delays ([globals.css:234-243](src/app/globals.css#L234-L243)).
- **Right card** (1-col): profile photo with breathing glow ([globals.css:246-249](src/app/globals.css#L246-L249)) + 5 social icons.

Reusable utilities to leverage (don't duplicate):
- `useTyping` ([src/hooks/use-typing.ts](src/hooks/use-typing.ts)) — single-string typer
- `useMousePosition` ([src/hooks/use-mouse-position.ts](src/hooks/use-mouse-position.ts)) — already powers card glow, can power magnetic photo hover
- `AnimateIn` ([src/components/shared/animate-in.tsx](src/components/shared/animate-in.tsx)) — fade-in/up wrapper
- `font-display` (Sora) — already loaded, ready to use
- `accent-warm` (warm amber) — already in tokens, currently only used on stats bar

## Confirmed scope (all 8 features approved)

Implementation order — low-risk to highest impact:

### 1. Time-aware greeting
Replace static `"Hi, I'm"` with `Good morning / afternoon / evening, I'm` based on visitor's local time.
- **Where:** [src/app/page.tsx:46](src/app/page.tsx#L46)
- **SSR-safe:** Compute on client in `useEffect`, fall back to `"Hi, I'm"` on server. Avoid hydration mismatch.

### 2. Cycling typing animation
Headline cycles through 3 short roles instead of typing one and stopping.
- **Roles:** `["Full-Stack Developer", "ML Enthusiast", "Computer Vision Engineer"]` — store in [src/data/personal.ts](src/data/personal.ts) as new `headlines: string[]` field. Keep existing `headline` field too — it's used by [src/app/resume/page.tsx:12](src/app/resume/page.tsx#L12) and the metadata.
- **Hook:** Add new `useTypingLoop(strings, opts)` exported from [src/hooks/use-typing.ts](src/hooks/use-typing.ts) alongside the existing `useTyping`. Don't modify the original — keeps single-string usage clean.
- **Behavior:** Type → pause ~1.5s → backspace → pause ~300ms → type next. Loop forever.
- **Use it at:** [src/app/page.tsx:32](src/app/page.tsx#L32) (replace the existing `useTyping` call) and render at [src/app/page.tsx:50-52](src/app/page.tsx#L50-L52).

### 3. Animated gradient name
"Aziz Tebbeng" gets a subtle flowing horizontal gradient.
- **Where:** [src/app/page.tsx:47-49](src/app/page.tsx#L47-L49) (the `<h1>`)
- **Classes:** `bg-gradient-to-r from-foreground via-accent-brand to-accent-warm bg-clip-text text-transparent`
- **Animation:** Add `@keyframes gradient-flow` in [globals.css](src/app/globals.css) that shifts `background-position` from `0% 50%` → `100% 50%` → `0% 50%` over ~6s. Apply to the h1.
- Make sure to use `bg-[length:200%_auto]` so the gradient has room to slide.

### 4. Live status pill
Small pill above the "Hi, I'm" line: pulsing green dot + "Available for opportunities" (or similar — let user customize).
- **New file:** `src/components/shared/live-status.tsx`
- **Structure:** `<div class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 ring-1 ring-emerald-500/20">` with a tiny pulsing green dot (use `@keyframes pulse-dot` for soft scale + opacity pulse).
- **Where to render:** First child inside `.hero-stagger` div in [src/app/page.tsx:45](src/app/page.tsx#L45), so it auto-staggers in first.

### 5. Scroll-down indicator
Bouncing chevron at the bottom of the hero card area, fades out as user scrolls.
- **New file:** `src/components/shared/scroll-down-indicator.tsx`
- **Icon:** `ChevronDown` from `lucide-react`
- **Animation:** `@keyframes scroll-bounce` (translateY 0 → 6px → 0 over 1.5s, ease-in-out, infinite)
- **Fade logic:** `useEffect` with scroll listener, set opacity based on `window.scrollY` (0→1 inverse over first 200px).
- **Where to render:** Below the entire hero grid, e.g. inside the hero `<section>` after the photo card.

### 6. Photo rotating ring
Decorative thin ring around the profile photo that slowly rotates.
- **Where:** [src/app/page.tsx:90-103](src/app/page.tsx#L90-L103) (the photo container)
- **How:** Wrap photo with an extra `<div>` that has a conic gradient border (`background: conic-gradient(...)` with a mask trick) OR simpler: an absolute-positioned ring with `border` and `border-dashed` + `@keyframes ring-spin` (rotate 0deg → 360deg over 20s linear infinite).
- Don't replace the existing breathing glow; layer on top.

### 7. Photo magnetic hover
Photo gently follows cursor when hovered (subtle, max ~6-10px translation).
- **Where:** [src/app/page.tsx:90-103](src/app/page.tsx#L90-L103)
- **How:** Convert the photo container to a client component (or extract to its own file, e.g. `src/components/shared/magnetic-photo.tsx`). Use `useMousePosition` to get cursor x/y relative to element, apply `transform: translate(x*0.1, y*0.1)` capped at small magnitude.

### 8. Tech-stack ticker
Horizontal marquee of tech names below the photo card.
- **New file:** `src/components/shared/tech-ticker.tsx`
- **Data source:** [src/data/tech-stack.ts](src/data/tech-stack.ts) — flatten and reuse. Don't duplicate names.
- **Animation:** `@keyframes marquee` — translate child container `0%` → `-50%` linearly. Duplicate the list 2× inside container so it loops seamlessly.
- **Where to render:** Inside the photo BentoCard, below the social icons row at [src/app/page.tsx:129](src/app/page.tsx#L129).
- Use `mask-image` linear gradient on left+right edges so badges fade in/out at the boundaries.

## Files to create / modify

| File | Status | Change |
|------|--------|--------|
| [src/data/personal.ts](src/data/personal.ts) | edit | Add `headlines: string[]`. Keep `headline`. |
| [src/hooks/use-typing.ts](src/hooks/use-typing.ts) | edit | Add `useTypingLoop` export. Don't modify `useTyping`. |
| [src/app/page.tsx](src/app/page.tsx) | edit | Apply all 8 features in the hero section. |
| [src/app/globals.css](src/app/globals.css) | edit | Add keyframes: `gradient-flow`, `pulse-dot`, `scroll-bounce`, `ring-spin`, `marquee`. Extend `prefers-reduced-motion` block. |
| `src/components/shared/live-status.tsx` | NEW | Pulsing dot pill |
| `src/components/shared/scroll-down-indicator.tsx` | NEW | Bouncing chevron, fades on scroll |
| `src/components/shared/tech-ticker.tsx` | NEW | Horizontal marquee |
| `src/components/shared/magnetic-photo.tsx` | NEW (optional) | Extract photo+ring+magnetic logic for cleanliness |

## Critical constraints (do not violate)

- **Next.js 16 has breaking changes** — read `node_modules/next/dist/docs/` before writing any Next-specific code. See [AGENTS.md](AGENTS.md).
- **Respect `prefers-reduced-motion`** — every new keyframe (`gradient-flow`, `pulse-dot`, `scroll-bounce`, `ring-spin`, `marquee`) and the typing loop's auto-cycling must stop when reduced-motion is on. Pattern is at [globals.css:283-295](src/app/globals.css#L283-L295).
- **Don't break `.hero-stagger`** — it auto-cascades direct children. Adding the live pill as a new first child shifts the rest by one position. That's fine, but verify the timing still feels good.
- **No new dependencies** — everything is doable with what's already in [package.json](package.json).
- **SSR-safe** — `Date()` for greeting and `window.scrollY` for scroll indicator must run in `useEffect` only, never at module scope.
- **`.env.local` is gitignored** — has the real Resend API key. Don't commit it.
- **Don't refactor unrelated code** while doing this work.

## Verification

After implementation:

1. `npm install` (if needed) → `npm run dev`
2. Open http://localhost:3000 — confirm:
   - Greeting matches local time
   - Headline cycles through the 3 roles smoothly with backspace
   - Name has a gentle flowing gradient
   - Live pill pulses softly
   - Scroll indicator bounces and fades when scrolling down
   - Photo has a slowly-rotating decorative ring
   - Photo gently follows cursor on hover
   - Tech ticker scrolls horizontally below social icons
3. Toggle dark / light theme — both look intentional
4. DevTools → Rendering → enable `prefers-reduced-motion` → all new animations stop
5. Mobile width (375px) — layout still holds, ticker doesn't break, no horizontal overflow
6. `npm run build` — no TS or ESLint errors
7. Run Lighthouse — Performance shouldn't drop more than 2-3 points

## How to start (for the Claude session on the other PC)

Run these in order:

1. `npm install` (if `node_modules` doesn't exist)
2. `npm run dev` — confirm baseline works and existing typing animation is visible
3. Read this file + [VISUAL_PLAN.md](VISUAL_PLAN.md) for full context
4. Start with **Task 1 (time-aware greeting)** — smallest win
5. Mark each task as done with a brief commit so progress is checkpointed
