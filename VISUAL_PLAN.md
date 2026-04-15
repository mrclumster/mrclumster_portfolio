# Visual Improvements Plan — Portfolio

> Handoff doc for picking this work back up on another machine.
> Drafted 2026-04-15 after a full visual review of the site.

## Context

The portfolio at `c:\aziztebbeng\mrclumster_portfolio` (Next.js 16, Tailwind v4, OKLCH tokens) has a clean minimalist foundation but reads as **"default-looking"** — it undersells the work. Goal: elevate the visual design without rebuilding anything. The code is solid; this is purely visual polish.

**Non-goals:** No new pages, no framework changes, no content rewrites, no major refactors. Keep accessibility (`prefers-reduced-motion` is already respected — keep it that way).

## Current visual weaknesses (identified during review)

1. **Single accent color** (`accent-brand` blue in [src/app/globals.css](src/app/globals.css)) used everywhere → visual fatigue, no section identity.
2. **Only Inter font** loaded in [src/app/layout.tsx](src/app/layout.tsx) → no typographic personality or hierarchy.
3. **Stats bar** in [src/app/page.tsx:135-151](src/app/page.tsx#L135-L151) is plain text with dividers → no icons, no color, no impact.
4. **Project cards** in [src/components/shared/bento-project-card.tsx:25-53](src/components/shared/bento-project-card.tsx#L25-L53) use emoji-only gradient headers → no preview of actual work, looks juvenile.
5. **Background blobs** in [src/app/globals.css:204-221](src/app/globals.css#L204-L221) animate but use opacity `/5` to `/15` → too faint to be visible.
6. **Cards** in [src/components/shared/bento-card.tsx:33-36](src/components/shared/bento-card.tsx#L33-L36) use a single thin `ring-1 ring-foreground/10` → flat, no depth.
7. **Animations exist but are too subtle** to feel purposeful.

## Implementation order (do these in sequence)

### Task 1 — Display font for headings (HIGHEST ROI, do first)
**Why:** Biggest perceived quality jump for the least code.
**Where:** [src/app/layout.tsx](src/app/layout.tsx) — currently only loads Inter.
**What to do:**
- Add a display font from `next/font/google`. Recommended options to try (in order of preference):
  1. **Sora** (modern geometric, good for tech portfolios)
  2. **Geist** (clean, Vercel-aligned)
  3. **Instrument Serif** (more editorial/distinctive)
- Expose it as a CSS variable (e.g. `--font-display`) like Inter is currently exposed.
- Add a `font-display` Tailwind utility in [src/app/globals.css](src/app/globals.css) `@theme` block.
- Apply `font-display tracking-tighter` to all `<h1>` and `<h2>` elements in [src/app/page.tsx](src/app/page.tsx) and [src/app/resume/page.tsx](src/app/resume/page.tsx).
- Body text stays Inter.

**Verify:** Run `npm run dev`, check that headings visibly differ from body text and load without FOUT. Test both light and dark themes.

---

### Task 2 — Project thumbnails (BIGGEST "professional" upgrade)
**Why:** Currently the weakest section visually. Recruiters/visitors want to see the work.
**Where:**
- [src/data/projects.ts](src/data/projects.ts) — add `image` field to project type/data
- [src/components/shared/bento-project-card.tsx:25-53](src/components/shared/bento-project-card.tsx#L25-L53) — replace emoji header with image
- [public/images/](public/images/) — drop screenshots here (currently only has `profile.jpg`)

**What to do:**
- Add an optional `image: string` field to the project data structure. Keep the existing emoji as a fallback.
- In the card, render a `next/image` thumbnail in the header area with a gradient overlay (`bg-gradient-to-t from-background via-background/40 to-transparent`) so text stays readable.
- Use `aspect-video` or `aspect-[16/10]` for consistent sizing.
- If user hasn't provided screenshots yet, **stop and ask** — do not generate placeholder images.
- Keep the modal behavior intact.

**Verify:** Cards show a real preview, text is still readable over the image, no layout shift on load, hover transitions still work.

---

### Task 3 — Redesign stats bar
**Why:** Quick win, immediately more visually interesting.
**Where:** [src/app/page.tsx:135-151](src/app/page.tsx#L135-L151)
**What to do:**
- Replace the inline divider layout with a row of small cards (or a single subtle background block).
- Add a Lucide icon per stat (e.g. `Code2`, `Briefcase`, `Award`, `Sparkles` — from `lucide-react` already in deps).
- Make the stat numbers larger and use `font-display` (from Task 1).
- Add a soft accent-tinted background: `bg-accent-brand/5 ring-1 ring-accent-brand/10 rounded-2xl`.
- Optional: subtle hover lift on each stat.

**Verify:** Stats look like a deliberate component, not afterthought text.

---

### Task 4 — Secondary accent color
**Why:** Breaks the visual monotony of one-blue-everywhere.
**Where:** [src/app/globals.css](src/app/globals.css) (color tokens around lines 52-125)
**What to do:**
- Add a secondary accent in OKLCH — recommend a warm tone (coral/amber) that complements the existing blue. Add tokens for both light and dark modes.
- Add Tailwind utility via `@theme`: `--color-accent-warm: ...` so it's usable as `bg-accent-warm`, `text-accent-warm`, etc.
- Apply strategically (don't overuse):
  - Stats numbers (from Task 3)
  - "Featured" / status badges on projects
  - Hover glow on project cards (override the blue mouse-tracking glow)
  - Maybe certification icons
- Keep `accent-brand` (blue) as the primary CTA/link color.

**Verify:** Sections feel distinct without looking chaotic. Test light + dark.

---

### Task 5 — Card glassmorphism polish
**Why:** Cards look flat. Adds depth without visual noise.
**Where:** [src/components/shared/bento-card.tsx:33-36](src/components/shared/bento-card.tsx#L33-L36)
**What to do:**
- Add `backdrop-blur-md` to card className.
- Add an inset top highlight via box-shadow: `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]` (tweak alpha for theme).
- Subtle gradient overlay: very low-opacity radial gradient from top.
- Keep the existing mouse-tracking glow effect intact.
- Don't overdo blur — the page background isn't busy enough to need heavy blur.

**Verify:** Cards have a subtle "lifted glass" feel. Doesn't tank performance on mid-range devices.

---

## Smaller polish wins (do after the 5 above, optional)

- Crank blob opacity in [src/app/globals.css:204-221](src/app/globals.css#L204-L221) from `/5` → `/15`, add a 4th blob using the new secondary accent.
- Gradient text on section headings using `bg-clip-text text-transparent`.
- Animated underline on nav links in [src/components/layout/header.tsx](src/components/layout/header.tsx).
- Active section highlight in nav as user scrolls (also in [IMPROVEMENTS.md](IMPROVEMENTS.md)).
- Thin scroll progress bar at top of viewport.
- Generate a custom OG image using the [src/app/icon.tsx](src/app/icon.tsx) `ImageResponse` pattern.

## Verification (end-to-end)

After each task:
1. `npm run dev` — visual check at http://localhost:3000
2. Toggle dark/light theme — confirm both look intentional
3. Resize to mobile width — confirm layout still holds
4. Check `npm run build` succeeds (no TS or ESLint errors)
5. Submit the contact form once — confirm Task 1-5 didn't break the API route

After all tasks done:
- Run Lighthouse in Chrome DevTools — confirm Performance/Accessibility scores haven't regressed.
- Test with `prefers-reduced-motion` enabled (DevTools → Rendering tab) — animations should still degrade gracefully.

## Critical constraints (do not violate)

- **Read `node_modules/next/dist/docs/` before writing Next.js code** — this project uses Next.js 16 (breaking changes from older versions). Don't rely on training data for Next.js APIs. See [AGENTS.md](AGENTS.md).
- Keep `prefers-reduced-motion` respected (currently handled in [globals.css:283-295](src/app/globals.css#L283-L295)).
- Don't commit `.env.local` (it has the real Resend API key — already gitignored).
- Don't add new dependencies unless absolutely necessary. Everything above can be done with what's already in [package.json](package.json) (`lucide-react`, `next/font`, Tailwind v4, `tw-animate-css`).
- Don't refactor unrelated code while making visual changes.

## Files most likely to be touched

| File | Tasks |
|------|-------|
| [src/app/layout.tsx](src/app/layout.tsx) | 1 |
| [src/app/globals.css](src/app/globals.css) | 1, 4, 5, polish |
| [src/app/page.tsx](src/app/page.tsx) | 1, 3 |
| [src/app/resume/page.tsx](src/app/resume/page.tsx) | 1 |
| [src/components/shared/bento-card.tsx](src/components/shared/bento-card.tsx) | 5 |
| [src/components/shared/bento-project-card.tsx](src/components/shared/bento-project-card.tsx) | 2, 4 |
| [src/data/projects.ts](src/data/projects.ts) | 2 |
| [src/components/layout/header.tsx](src/components/layout/header.tsx) | polish |
| [public/images/](public/images/) | 2 (add screenshots) |
