# Portfolio Revisions Round 6 — Design Spec

**Date:** 2026-05-07
**Branch:** `feat/terminal-redesign`
**Scope:** Hero left column typography only. Hero right column (CursorEyes + PhotoFrame) untouched. No other sections touched.

---

## Goal

Replace the plain `<h1>Aziz Tebbeng</h1>` in the hero left column with a hand-set ASCII-art banner of the full name, and tighten the supporting elements (key-value list and button row) so the banner remains the focal point.

## Why

The hero left column is currently the weakest part of the page — a plain bold sans-serif name + typing line + key-value list. Every other section of the portfolio commits to the brutalist terminal aesthetic; the hero name does not. An ASCII banner anchors the page in the same visual language as the rest of the site and gives the first-fold a strong identity.

## Non-goals

- No changes to right column (CursorEyes, PhotoFrame).
- No changes to bio (`<AboutTerminal />`), career, education, projects, contact, divider, or background.
- No changes to data files (`src/data/personal.ts`).
- No new fonts.
- No animation on the banner (banner appears instantly; existing typing headline below it stays animated).

---

## Design

### 1. ASCII banner (replaces the current `<h1>`)

**Content:** "AZIZ TEBBENG" rendered in blocky ANSI-shadow ASCII (Unicode block chars `█ ╗ ╔ ╝ ═` etc.) — same family as the option A1/A2 mockups shown in brainstorming.

**Layout — responsive shape:**

| Breakpoint        | Layout                             | Reason |
|-------------------|------------------------------------|--------|
| `≥ lg` (1024px+)  | **Single line** (AZIZ TEBBENG side by side) | Hero look — uses full column width |
| `< lg`            | **Stacked** (AZIZ above TEBBENG)   | Single line overflows narrower columns |

Implementation: render two pre-formatted strings — `BANNER_SINGLE` and `BANNER_STACKED` — and use Tailwind responsive classes (`hidden lg:block` / `lg:hidden`) to swap. Avoids JS-driven layout logic.

**Sizing:**
- `font-family`: existing project monospace (inherit, do not introduce a new font).
- `font-size`: `clamp(0.45rem, 0.3rem + 0.55vw, 0.85rem)` for single-line at `lg+`.
- `font-size`: `clamp(0.55rem, 0.45rem + 0.4vw, 0.85rem)` for stacked at `< lg`. At the minimum (320px mobile) the stacked banner is ~6rem / ~96px wide — fits with margin to spare.
- `line-height`: `1.0` (block characters need tight line-height to read as letters).
- `letter-spacing`: `0` (any kerning breaks the block art).

**Color & decoration:**
- `color: var(--ink)` — same as existing text.
- No background, no border, no shadow.
- `aria-hidden="true"` on the `<pre>`.
- Visually-hidden `<h1 id="hero-heading">Aziz Tebbeng</h1>` for screen readers and SEO. Use the existing `sr-only` Tailwind utility (or equivalent) so the page still has exactly one h1 and the `aria-labelledby="hero-heading"` on the section keeps working.

**No animation.** Banner renders instantly on mount.

### 2. Tightened headline + key-values + buttons (K2)

The three elements below the banner stay but lose visual weight so the banner holds focus.

**Typing headline** (`> Full-Stack Developer▮`): unchanged. Same `useTypingLoop`, same blinking caret. This is the only motion in the left column and it carries enough.

**KeyValue list:**
- Drop the existing `KeyValueList` component spacing one notch — currently has comfortable line-height; new visual weight should be `text-sm` (14px) or `clamp(0.78rem, 0.75rem + 0.15vw, 0.875rem)`.
- Remove the `last-build` row entirely. It was a "make the page feel alive" filler; the banner makes it feel alive now without needing a date stamp. Three rows is enough: `location`, `email`, `status`.

**Button row:**
- Replace the current `<TerminalButton>` (chunky bordered button) usage in the hero with a single line of bracketed text-buttons: `[ view_work ]  [ resume.pdf ]  [ github ]  [ linkedin ]  [ facebook ]  [ instagram ]`.
- Same `var(--ink)` color, hover inverts (background → ink, color → paper).
- Same `font-size` as KeyValue list (`text-sm`).
- Same href targets and external-link attrs as today.
- Icons are dropped from the hero buttons (the `[ ]` brackets carry the terminal feel; icons + brackets is too noisy at the new tightened weight). Icons remain everywhere else they're used.

This is a hero-only treatment. `TerminalButton` itself is not changed; we just don't use it in the hero. `terminal-button.tsx` is referenced from other places (verified in plan stage).

### 3. Layout / spacing

The left column wrapper currently uses `space-y-6 py-4`. Keep `py-4` but reduce inter-element spacing to `space-y-5` to compensate for the visual heaviness the banner adds.

Banner sits in its own block; everything else (headline, KeyValueList, buttons) keeps current source order.

---

## Architecture

### New files

- `src/components/hero/ascii-banner.tsx` — exports `<AsciiBanner />`. Self-contained client component (no props). Owns both the single-line and stacked banner strings as module-level consts and the responsive `<pre>` rendering.
- `src/components/hero/hero-buttons.tsx` — exports `<HeroButtons />`. The flat bracketed button row used only in the hero. Pulls `personalInfo.socialLinks` directly (same import pattern as `HeroTerminal`). No props.

### Changed files

- `src/components/sections/hero-terminal.tsx`:
  - Replace `<h1 id="hero-heading">{personalInfo.name}</h1>` with `<><h1 id="hero-heading" className="sr-only">{personalInfo.name}</h1><AsciiBanner /></>`.
  - Replace the `<div className="flex flex-wrap gap-3 ...">` containing `<TerminalButton>` instances with `<HeroButtons />`.
  - Drop the `last-build` row and the `now` state + `useEffect` that produced it.
  - Drop unused imports: `TerminalButton`, `useState`, `useEffect`, the four icon components, and `KeyValue` if `KeyValueList` no longer uses individual `KeyValue` from this file (verify in plan).
  - Change `space-y-6` → `space-y-5`.

### Unchanged

- `src/data/personal.ts`
- `src/components/hero/cursor-eyes.tsx`, `photo-frame.tsx`, `particle-constellation.tsx`
- `src/components/terminal/key-value.tsx`, `terminal-button.tsx`
- `src/hooks/use-typing.ts`
- All other sections, `app/page.tsx`, `app/globals.css`

### Boundaries

- `<AsciiBanner />` knows nothing about the rest of the hero. Pure presentational. Could be lifted to `/resume` later if we want.
- `<HeroButtons />` is hero-specific by design — it imports `personalInfo` directly because the hero already does. If we ever need this row elsewhere we'll generalize then (YAGNI).

---

## Data flow

None new. `<AsciiBanner />` is static. `<HeroButtons />` reads from the same `personalInfo` import. The hero typing loop already runs in `HeroTerminal` and is unchanged.

---

## Error handling

No new failure modes. ASCII banner is static text, button hrefs come from existing data. No network, no async.

---

## Testing / verification

- `npx tsc --noEmit` (ignore pre-existing pokeball/postprocessing errors per AGENTS.md note).
- Visual verification at three widths: `1440px` (single-line banner), `1024px` boundary (single-line still), `900px` (should now be stacked), `375px` (stacked, no horizontal scroll on the column).
- Keyboard: tab through hero buttons — focus ring visible, hrefs work.
- Screen reader: `<h1>Aziz Tebbeng</h1>` is the only h1 announced; banner `<pre>` is silent.
- Dark mode (theme toggle): banner ink color flips with `var(--ink)`.

---

## Risks

- **Banner readability at 900–1023px:** the breakpoint switch from single-line to stacked happens exactly at `lg`. If `lg` (1024px) feels too late and the single-line banner gets cramped at 1100–1199px, we'd raise the breakpoint to `xl` (1280px). Plan flags this as a manual check.
- **`sr-only` class:** project uses Tailwind v4. If `sr-only` isn't enabled by default, plan will add the standard utility (`absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0`) inline.
- **Font hinting on Windows / Mac:** ANSI-shadow blocks render slightly differently across OSes. The chosen font family is whatever monospace the project already uses, which is acceptable — the goal is "looks like terminal output," not pixel-perfect.

---

## Out of scope (future rounds)

- About / bio section redesign (R7).
- Mobile responsive pass for the rest of the page (R8).
- Resume page redesign (R9).
- Banner typing animation, scanline/CRT shader, or any other motion treatment.
