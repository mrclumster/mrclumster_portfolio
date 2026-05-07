# Portfolio Revisions Round 7 — Design Spec

**Date:** 2026-05-07
**Branch:** `feat/terminal-redesign`
**Scope:** Hero **right column** ASCII frame around the photo, plus the hero **section background**. No other sections, no left column changes.

---

## Goal

Replace the single row of cursor-tracking eyes above the photo with a structured composition of ~14 ASCII art "bits" arranged in clusters around the photo, each click-cyclable through 12 hues, with a global `[ shuffle ]` button that randomizes everything at once. Replace the existing `<ParticleConstellation />` Three.js background with a CSS-only "subtle grid + drifting fake code comments" background.

## Why

- The single row of eyes is one note. The right column has more vertical space than the eyes need; the photo can become an anchor inside a small composition instead of just a header element with a photo below.
- The Three.js particle constellation is heavy (R3F + drei pulled into the hero) for what reads as faint dots. A CSS-only background drops the bundle weight and matches the brutalist terminal vibe more honestly.
- "Click to cycle hue + shuffle" gives the page a discoverable toy without committing to a full theme switcher. Session-only persistence keeps fresh visitors seeing the curated composition first.

## Non-goals

- No left column changes (banner, key-values, buttons stay).
- No data file changes (`personal.ts` etc.).
- No new fonts.
- No localStorage persistence — refresh resets to defaults.
- No animation on the ASCII bits beyond an existing cursor-track for the eye-pair bits.
- No removal or rewrite of `ParticleConstellation`, `CursorEyes`, or `PhotoFrame` files — only the *usage* in `hero-terminal.tsx` is removed/replaced. Files remain in the repo in case a future round wants them back. (Exception: if any of these files are unreferenced after R7, the cleanup commit can `git rm` them — verify in plan stage.)

---

## Design

### 1. ASCII frame around the photo (right column composition)

Right column wrapper changes from a vertical flex stack (`CursorEyes` above `PhotoFrame`) to a single positioned container that fills the column. Photo sits centered. ASCII bits are absolutely positioned at intentional offsets relative to the container.

**Composition (Layout F — "Structured clusters", ~14 bits):**

| Region              | Bits (default)                                              |
|---------------------|-------------------------------------------------------------|
| Top eye-row (full width, centered) | `[ o o ]   [ ◉ ◉ ]   [ * * ]   [ ▪ ▪ ]   [ - - ]` (5 eye-pairs) |
| Top-left cluster    | `// 01` over `(´ω`)`                                        |
| Top-right cluster   | `// 02` over `ʕ•ᴥ•ʔ`                                        |
| Left mid cluster    | `{*}` `~~~` `[+]` (vertical stack)                          |
| Right mid cluster   | `[!]` `░▒▓` `▮▮▮` (vertical stack)                          |
| Bottom-left         | `(>‿<)`                                                     |
| Bottom-right        | `(◕‿◕)`                                                     |
| Bottom footer (centered) | `└─ aziz_v1.0 — online ─┘`                            |

Total = 14 bits + 5 eye-pairs = effectively ~19 individually-themable elements. (The 5 eye-pairs are one *bit type* but each pair has its own hue state, since they're already individually rendered — see Cursor Eyes section below.)

**Container size:** The right column already has `height: 400` from R6. Keep it. The photo inside is bounded so the composition has a consistent canvas at the `lg+` breakpoint.

**Below `lg`** (mobile / tablet): the right column collapses below the left column (existing behavior). On those widths, the ASCII frame still renders but the photo shrinks to fit the now full-width column. The bits stay at their absolute offsets — they're % or pixel-anchored to the container edges, not to the photo. This means on small widths the bits frame an emptier-looking column. Acceptable for R7; if it looks bad we'll revisit in R8 (mobile pass).

### 2. Per-bit click-to-cycle hue + global shuffle

**Color model:** each bit owns one piece of state — a `hue: number` (0–360, integer). Saturation and lightness are fixed at the component level so contrast stays readable in both light and dark themes:

```
color = oklch(var(--bit-l) var(--bit-c) ${hue})
```

Where `--bit-l` / `--bit-c` are CSS custom properties tuned per theme:
- light theme: `--bit-l: 35%; --bit-c: 0.18;` (medium-dark, vivid enough to stand out)
- dark theme: `--bit-l: 80%; --bit-c: 0.18;` (light, vivid enough to stand out)

(Project already swaps theme via `--paper`/`--ink` — these new vars piggyback on that.)

**Click behavior:** clicking a bit advances its hue by 30° (i.e., 360° / 12 = 12 evenly-spaced positions). Modulo 360. No drag, no slider.

**Initial hues:** each bit starts at a curated default hue, listed in the spec config (see Architecture section). The defaults are intentionally varied (red, blue, green, purple, neutral ink) so the page lands looking composed, not monochrome. After click, the bit advances from its current hue.

**Global shuffle:** a small `[ shuffle ]` text button lives in the top-eye-row (e.g., to the right of the 5 eye-pairs, or below the bottom-footer — final position decided in plan stage based on what fits without crowding). Clicking it sets every bit's hue to a fresh random value 0–359. Each click rerolls.

**Persistence:** none. State lives in React state in a single hero-right-column context. Refresh resets to defaults.

**Hover:** each bit shows a subtle background invert on hover (same hover style as `HeroButtons`) to make clickability discoverable. No tooltip; the cursor changes to pointer.

### 3. Cursor Eyes — keep the tracking, gain the hue

The 5 eye-pairs from R5 keep their existing pupil-tracks-cursor behavior. The change is:
- They're now part of the "top eye-row" cluster of the new frame, not in their own dedicated `<CursorEyes />` slot.
- Each pair gets its own hue (cyclable on click of the pair, separate from the cursor tracking). Clicking an eye-pair advances ITS hue only — does not affect the other 4 pairs. The 5 eye-pairs are independently themable like any other bit.
- The 5 pairs use 5 *different* eye glyphs to create the variety you said you wanted — `[ o o ]   [ ◉ ◉ ]   [ * * ]   [ ▪ ▪ ]   [ - - ]`. Each glyph still has trackable "pupils"; the implementation in plan stage will need to handle 5 glyph variants instead of 1 shared one.

### 4. Hero background — grid + drifting comments

**Replaces:** `<ParticleConstellation />` in `hero-terminal.tsx`. Imports of `particle-constellation` and the absolute-positioned wrapper for it are removed.

**New background component:** `<HeroBackdrop />` — pure CSS, no canvas, no Three.js.

Two layers stacked behind the hero content:

**Layer A — grid:**
- Pure CSS background-image with two repeating-linear-gradients (vertical + horizontal lines) at 32px spacing.
- Color: `var(--ink)` at `4%` opacity (very faint).
- Positioned absolute, fills the hero section.

**Layer B — drifting fake comments:**
- 4 hardcoded fake-comment strings, each absolutely positioned with a CSS animation that translates them slowly across the section.
- Strings: `// rendering hero...` / `/* TODO: hire me */` / `# uptime: 99.97%` / `// build #4421 — ok`.
- Color: `var(--ink)` at `8%` opacity.
- Each starts at a different vertical offset and animates `translateX` from `-40%` → `120%` over 60–90s, looping. Different durations per comment so they don't sync.
- `prefers-reduced-motion: reduce` → animations paused.
- `pointer-events: none` so nothing in the bg interferes with clicks.

This is a hero-section-only background. Other sections are unaffected.

### 5. Spacing / layout

The right column wrapper currently uses `flex flex-col gap-3` with `height: 400`. Change to `relative` (no flex), keep `height: 400`. ASCII bits are children with `position: absolute` at their cluster positions. Photo is its own absolutely-positioned child centered in the container.

---

## Architecture

### New files

- `src/components/hero/ascii-frame.tsx` — the whole right-column composition. Owns:
  - The list of ~14 bits as a const array `BITS = [{ id, glyph, position, defaultHue }, ...]`.
  - The eye-pair sub-list (5 entries) with their cursor-tracking glyphs.
  - One `useState<Record<string, number>>` keyed by bit id → hue.
  - The `[ shuffle ]` button.
  - Renders the photo (delegated to existing `<PhotoFrame />`).
- `src/components/hero/ascii-bit.tsx` — single bit primitive. Props: `id`, `glyph` (string or React node for the eye-pair variants), `hue` (number), `position` (CSS object: top/left/right/bottom), `onClick`. Renders `<button>` for a11y. The eye-pair variant accepts a render-prop or known glyph type so it can hook up its own cursor-track effect — implementation detail decided in plan.
- `src/components/hero/hero-backdrop.tsx` — the grid + drifting comments. No props.
- `src/components/hero/cursor-eye-pair.tsx` (optional, plan-stage decision) — extracted single eye-pair logic so `AsciiBit` can compose it for the 5 eye-pair entries. Or keep it inlined in `ascii-bit.tsx`. Plan picks one.

### Changed files

- `src/components/sections/hero-terminal.tsx`:
  - Remove imports: `CursorEyes`, `PhotoFrame` (now used inside `AsciiFrame` instead), `ParticleConstellation`.
  - Add imports: `AsciiFrame`, `HeroBackdrop`.
  - Replace the `<div className="absolute inset-0 ...">` wrapper containing `<ParticleConstellation />` with `<HeroBackdrop />`.
  - Replace the right-column `<div className="flex flex-col gap-3" style={{ height: 400 }}>` (and its children CursorEyes + photo) with `<AsciiFrame imageSrc={personalInfo.profileImage} />`.

- `src/app/globals.css`:
  - Add `--bit-l` and `--bit-c` custom properties under `:root` (light defaults) and the dark-mode override block.
  - Add the keyframes for the 4 drifting comments (`@keyframes drift-1`, `drift-2`, `drift-3`, `drift-4`).

### Possibly-removed files (plan to verify)

If `<CursorEyes />` and `<ParticleConstellation />` are no longer imported anywhere after R7, the plan should `git rm` them in a final cleanup commit.

### Boundaries

- `<HeroBackdrop />` knows nothing about the foreground content. Pure visual layer.
- `<AsciiFrame />` owns the right-column composition end-to-end (state, layout, photo). It's a single unit you can swap out without touching the background.
- `<AsciiBit />` is a generic primitive — it doesn't know about other bits or about shuffle. The frame component owns coordination.
- `personalInfo` is read once in `<AsciiFrame />` (for the photo). All other strings (the ASCII glyphs) are co-located in `ascii-frame.tsx` because they're presentational, not data.

---

## Data flow

**Hue state:**
- `<AsciiFrame />` holds `useState<Record<string, number>>(defaultHues)`.
- Each `<AsciiBit id="...">` receives `hue` and an `onClick` that calls `setHues(prev => ({ ...prev, [id]: (prev[id] + 30) % 360 }))`.
- `[ shuffle ]` button calls `setHues(Object.fromEntries(BITS.map(b => [b.id, Math.floor(Math.random() * 360)])))`.

No effects, no localStorage, no global store. Pure local React state.

**Cursor tracking:**
- The 5 eye-pair bits use the same approach as the existing `cursor-eyes.tsx` — a single `pointermove` listener registered once at the component that owns them, fanning out to per-eye refs.
- The plan should reuse the existing math from `cursor-eyes.tsx` line-for-line; only the surrounding rendering changes (different glyphs, individual hue per pair).

---

## Error handling

No new failure modes. Static composition + local state + CSS animation. No network, no async.

If `Math.random()` is somehow unavailable (it isn't) the shuffle would no-op — not worth defending against.

---

## Testing / verification

- `npx tsc --noEmit` clean (ignore pre-existing pokeball errors).
- Visual at desktop: composition reads as designed, photo is centered, ~14 bits visible at their cluster positions.
- Click each bit type at least once — hue advances, color changes, theme-readable in both light and dark.
- Click `[ shuffle ]` — every bit (including the 5 eye-pairs) recolors.
- Move mouse across hero — pupils in the 5 eye-pairs track cursor.
- Hover bits — background inverts (matches `HeroButtons` hover).
- Refresh — defaults return.
- Background grid + 4 drifting comments visible at low opacity, motion looks calm not noisy.
- `prefers-reduced-motion: reduce` — comment drifting paused.
- Mobile (375px): right column stacks below left column, frame still renders without horizontal scroll, photo still visible.
- No new console errors / warnings.

---

## Risks

- **Bit collisions on narrow widths:** mid-cluster side bits use `left: 2px` / `right: 2px` against a 400px-tall container. At very narrow column widths (e.g., 320px) the side clusters may overlap the photo. Plan should pick offsets that survive the project's `min-w` for the right column at `lg+`. Below `lg` is acceptable to be looser.
- **Eye-pair tracking with hue:** the existing `cursor-eyes.tsx` writes `transform` directly on a pupil ref. We're now layering a `color` change on the parent for hue. These two should be orthogonal (different DOM nodes, different properties) but the plan should call this out as a verification point.
- **Bundle weight win** is real but unmeasured — `<ParticleConstellation />` pulls Three.js + R3F. Removing its usage doesn't remove the imports if the file still exists; the plan should check whether tree-shaking actually drops them, or whether `git rm` of the file is needed for the bundle benefit.
- **Random shuffle producing low-contrast hues** — fixed S/L mitigates but doesn't eliminate. If a particular hue lands on near-paper background, it may be hard to read for one click cycle. Acceptable cost; the shuffle is a toy.

---

## Out of scope (future rounds)

- About / bio section redesign (deferred from R6 plan, was R7 originally — now R8)
- Mobile responsive pass (was R8, now R9)
- Resume page redesign (was R9, now R10)
- Persistent customization (would require localStorage + a "reset" affordance — explicitly chose against)
- Continuous hue slider per bit (chose 12 stops for tap-friendliness)
- Drag-to-rearrange bits (out of scope; positions are fixed)
- A "theme picker" for `--bit-l` / `--bit-c` themselves (out of scope; values are fixed per light/dark mode)
