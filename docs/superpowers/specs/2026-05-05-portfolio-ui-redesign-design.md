# Portfolio UI Redesign — Design Spec

> Drafted 2026-05-05. Implementation deferred — this document is the source of truth for the redesign work to be picked up later.

## 1. Goal & Non-Goals

### Goal

Elevate the visual quality of the portfolio (`/` and `/resume`) from "clean minimal but default-looking" to a **distinctive editorial-bento + premium-product** design with a small set of high-impact motion moments — without rebuilding the foundation, without sacrificing professionalism, and without touching adventure mode.

### Style direction (locked)

**Editorial bento + Apple/Stripe restraint, with surgical aceternity-style effects.**

- Editorial composition: asymmetric bento, strong scale hierarchy, generous whitespace, numbered eyebrow labels, pull-quote moments
- Premium-product feel: restrained color, hairline borders, intentional motion, lifted-glass surfaces
- All-sans typography (Geist family). One optional italic-serif accent word in the hero/section headlines.
- Single cool-blue accent color, near-black on warm-white (and inverted in dark mode)

### Non-goals

- No new pages; no rewriting copy; no new content sections
- No backend changes (Resend contact API stays as-is)
- No touching adventure mode internals (`src/components/adventure/**`, `src/game/**`, `public/images/trip/**`, `public/adventure/**`, `scripts/build-trip-manifest.mjs`)
- No removing existing functionality (typing loop, magnetic photo, GitHub calendar, copyable email, certificate modals all stay — restyled, not removed)
- No CMS, no MDX blog, no analytics setup
- No Playwright/E2E test additions in this pass (pure visual work)

### Constraints

- Must respect `prefers-reduced-motion` (already wired in `globals.css` — must stay wired)
- Must work in light and dark themes; both must feel intentional, not "dark-first, light-second"
- Must build cleanly under Next.js 16 — read `node_modules/next/dist/docs/` before any Next-specific code
- Bundle budget: landing page < 150kb gzipped JS (per project rules)
- Cannot break the contact form submission flow

---

## 2. Library Stack

| Purpose | Library | Status |
|---|---|---|
| Component primitives | `shadcn/ui` (Button, Card, Dialog, Sheet, Badge, Tooltip, Tabs, Form, Input, Textarea, Label) | Partly present — extend |
| Animation | `motion` (framer-motion successor) | Already partly used — extend |
| Smooth scroll | `lenis` | New |
| Typography | `next/font/google` — Geist Sans + Geist Mono | New (currently Inter) |
| Icons | `lucide-react` | Already present |
| Tailwind v4 + tokens | OKLCH custom properties in `globals.css` | Already present — refactor |
| Vendored effects (no new dep) | Spotlight, AnimatedBorder, Magnetic, CursorFollower, GrainOverlay | Plain files into `src/components/ui/` |
| Class merging | `cn` / `tailwind-merge` | Already present |

### New dependencies to install

```
motion                 ^11
lenis                  ^1
geist                  latest (or use next/font/google for Geist — verify against Next 16 docs)
@radix-ui/react-tooltip            (transitive via shadcn add tooltip)
@radix-ui/react-tabs               (transitive via shadcn add tabs)
@radix-ui/react-label              (transitive via shadcn add form)
react-hook-form                    (transitive via shadcn add form)
zod                                (likely already present; used by shadcn form)
```

No removals.

---

## 3. Design System

### 3.1 Color tokens (OKLCH, light + dark)

**Light theme:**
```
--color-bg          oklch(98% 0.005 80)        warm off-white, not pure white
--color-fg          oklch(18% 0 0)             near-black, not pure black
--color-muted       oklch(45% 0 0)             secondary text
--color-subtle      oklch(92% 0.005 80)        hairline borders, dividers
--color-surface     oklch(100% 0 0 / 0.5)      bento card surface, glassy
--color-accent      oklch(60% 0.18 250)        cool electric blue, ONE accent
```

**Dark theme:**
```
--color-bg          oklch(14% 0.01 250)        deep charcoal w/ slight cool tint
--color-fg          oklch(96% 0.005 80)        warm off-white
--color-muted       oklch(62% 0.01 250)
--color-subtle      oklch(22% 0.01 250)
--color-surface     oklch(20% 0.01 250 / 0.6)
--color-accent      oklch(68% 0.20 250)        slightly brighter for dark mode
```

The current `--accent-warm` (coral secondary) is **removed**. Every reference to `accent-brand` and `accent-warm` migrates to a single `accent` token.

### 3.2 Typography tokens

```
--font-sans          Geist Sans
--font-mono          Geist Mono
--font-display       Geist Sans (used at display scale + tight tracking)
--font-serif-italic  Instrument Serif italic   ONE optional accent in hero/section headlines

--text-eyebrow       clamp(0.6875rem, 0.65rem + 0.2vw, 0.75rem)
--text-body          clamp(0.9375rem, 0.9rem + 0.2vw, 1rem)
--text-lead          clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)
--text-h3            clamp(1.25rem, 1.1rem + 0.7vw, 1.75rem)
--text-h2            clamp(2rem, 1.5rem + 2.5vw, 3.5rem)
--text-display-xl    clamp(3rem, 1rem + 7vw, 7.5rem)    hero name only
```

Tracking strategy: large display gets `tracking-tighter` (~-0.04em). Eyebrow labels get `tracking-widest` (~+0.18em). The contrast is the editorial signature.

### 3.3 Spacing & rhythm

```
--space-section   clamp(4rem, 3rem + 4vw, 8rem)    vertical gap between major bento groups
--space-card      clamp(1.25rem, 1rem + 0.8vw, 2rem)
--radius-card     1rem
--radius-pill     9999px
```

### 3.4 Motion tokens

```
--ease-out-expo    cubic-bezier(0.16, 1, 0.3, 1)
--ease-out-quart   cubic-bezier(0.25, 1, 0.5, 1)
--duration-fast    150ms
--duration-normal  320ms
--duration-slow    600ms
```

All motion uses these. No magic-number durations anywhere.

### 3.5 Surface & depth

Each bento card:

- `bg-surface` (semi-transparent warm white in light, semi-transparent deep gray in dark)
- `backdrop-blur-md` (soft, not heavy)
- `ring-1 ring-fg/8` hairline border
- `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]` inset top highlight (the lift-in-dark-mode trick)
- No drop shadow at rest. Spotlight glow only on hover, only on project cards.

---

## 4. Page Composition (Homepage `/`)

### 4.1 Bento grid map

Reading top-to-bottom:

1. **Group 1 — Hero**
   - **Hero card** (3 cols × 2 rows): eyebrow `01 / INTRODUCTION`, greeting (small muted), name in display-xl with `tracking-tighter`, headline with typing loop, location + copyable email, magnetic CTA pair (View Work + Resume), animated gradient border around card edge.
   - **Photo card** (1 col × 2 rows): magnetic profile photo, live-status pill, social row, tech ticker.

2. **Group 2 — Stats ribbon**
   - Single pill-bar, 4 stats, mono numerals, hairline section dividers between stats. Replaces the current 4-card grid.

3. **Group 3 — About + Tech Stack**
   - **About card**: eyebrow `02 / WHO`, headline with one italic-serif accent word, **redacted-text bio** (highlight-to-reveal), GitHub heatmap below.
   - **Tech Stack card**: eyebrow `03 / STACK`, categories, TechBadge grid (outline-only), tech ticker at bottom.

4. **Group 4 — Experience / Education / Certifications**
   - **Experience card** (2 rows tall): vertical hairline timeline with animated dots on enter-view; refreshed `ExperienceItem`.
   - **Education card** (top right): hairline list with grad-cap icon.
   - **Certifications card** (bottom right): grid of cert tiles, modal preview kept as-is.

5. **Group 5 — Projects**
   - Eyebrow `04 / SELECTED WORK`. Asymmetric grid: 1 large feature card + 2 standard cards. Each card has image thumbnail header, spotlight-on-hover, cursor-following "VIEW PROJECT →" label. Adventure tile lives here as one of the cards (clicks through to unchanged `/adventure`).

6. **Group 6 — Contact**
   - Eyebrow `05 / CONTACT`. Display headline. shadcn `Form` + `Input` + `Textarea`. Magnetic primary submit button.

7. **Footer** — minimal, mono, eyebrow style, magnetic "back to top" via Lenis `scrollTo(0)`.

### 4.2 Editorial composition rules applied

- **Numbered mono eyebrow labels** per section (`01 / …`, `02 / …`, etc.) — replaces the current small muted subheads.
- **Display-size headline per section** with `tracking-tighter`, replacing small `text-xl` h2s. Each headline gets one italic-serif accent word (e.g., "Selected *work.*", "Tech *stack.*").
- **Hairline dividers** replace the current accent-gradient bar under headings.
- **Asymmetric grid weight** — hero spans 3 cols/2 rows, experience spans 2 rows, projects feature card spans 2 cols.
- **Vertical rhythm** — major groups separated by `--space-section` (clamp 4rem→8rem), tightening on mobile.

### 4.3 Resume page

`/resume` gets the same eyebrow + display-headline treatment for visual continuity. Sections wrapped in shadcn `Tabs` (Experience, Education, Skills, Certifications). Download CTA becomes magnetic. Inherits all global chrome automatically.

---

## 5. The Highlight-to-Reveal Effect (About section)

Signature interaction. New `RedactedText` component.

### 5.1 Behavior

- About-section paragraph(s) are rendered with `color: transparent` so text is invisible by default.
- Small accent-colored I-beam markers (one per line) hint at the presence of text.
- When the user click-drags to select, the OS selection paints chosen characters with the foreground color → text reveals as the cursor sweeps.
- A small mono caption underneath: `// click and drag to reveal` — visible only on first viewport entry, fades out after ~4s or on user interaction.

### 5.2 Implementation (CSS-only, no JS for the reveal)

- `.redacted-line { color: transparent; position: relative; }`
- I-beam markers via `::before` pseudo-element: `2px × 1.2em` accent bar at line start, opacity 60%
- `::selection { color: var(--color-fg); background: var(--color-accent); }`

### 5.3 Accessibility

- Text is **selectable**, **copyable**, and **read by screen readers** (real DOM text, just visually transparent).
- Reduced-motion users: mechanic still works (no animation involved).
- Keyboard users: alternate path — `Tab` onto the section reveals the text permanently (`focus-within` toggles `color` to `fg`).

### 5.4 API

```ts
interface RedactedTextProps {
  bio: string[];   // same shape as current personalInfo.bio — no content rewrite
}
```

---

## 6. Motion, Effects & Interactions

### 6.1 The 3 surgical aceternity-style effects

**Spotlight-on-hover (project cards only)**
- Vendored `Spotlight` into `src/components/ui/spotlight.tsx`
- Tracks pointer; renders a soft radial gradient (accent at 8% opacity in light, 14% in dark) following the cursor inside the card
- Replaces the current mouse-tracking glow on `BentoProjectCard`

**Animated gradient border (hero card only)**
- Vendored `AnimatedBorder` into `src/components/ui/animated-border.tsx`
- Pseudo-element with conic-gradient + CSS `@property` for animatable angle
- Stops: `accent → accent/0 → fg/5 → accent/0 → accent`, full rotation over 8s
- Applied only on hero card

**Magnetic CTA buttons (3 buttons total)**
- New `src/components/ui/magnetic-button.tsx` wrapping shadcn `Button`
- `motion`'s `useMotionValue` + `useSpring`
- Pull radius ~120px, max displacement ~12px. Spring: stiffness 150, damping 15.
- Used on: hero "View My Work", hero "Resume", contact form submit. Outline/ghost buttons stay still.

### 6.2 Additional motion moments (added for "WOW" within editorial discipline)

**Custom cursor**
- 6px accent-colored dot follows the cursor with spring lag (~80ms trail)
- Over interactive elements scales to 32px, semi-transparent
- Disabled on touch devices and reduced-motion
- Disabled on `/adventure*` routes

**First-load page enter transition**
- Thin accent vertical line sweeps left → right over ~700ms, simultaneously wiping page content into view via `clip-path: inset()`
- Implemented in `src/app/template.tsx` (Next.js 16 template per-route mount)
- One-time per session (gate via sessionStorage if necessary)

**Sticky section eyebrows**
- As each section enters the viewport, its mono eyebrow label sticks to the viewport top until the next section scrolls in
- CSS `position: sticky` + IntersectionObserver to add `is-active` class
- Mobile: eyebrows un-stick (CSS media query) — desktop signature only

**Hero name char-by-char reveal + parallax**
- On first paint: name reveals letter-by-letter, 25ms stagger, fade up from `translateY(20px)` with `--ease-out-expo`
- On scroll: hero name translates Y at 0.88× scroll speed, photo card at 1.06× (subtle depth)
- Implementation: split name into spans + `motion` stagger; parallax via `useScroll` + `useTransform`

**SVG grain overlay**
- ~3% opacity SVG noise texture, `position: fixed; pointer-events: none; mix-blend-mode: overlay`
- One inline SVG data URI in `globals.css`, mounted via `<GrainOverlay />` in `layout.tsx`

**Cursor-following "VIEW PROJECT →" label**
- When hovering a project card, small mono caption appears next to cursor, offset ~16px, fading in over 200ms
- Frees up composition (no visible "View" button needed on the card)

### 6.3 Section reveal motion

On viewport entry, each major bento group does a subtle stagger:
- Translate Y `8px → 0`, opacity `0 → 1`
- Stagger children by 60ms
- Duration `--duration-slow` (600ms) with `--ease-out-expo`
- Triggered via `motion`'s `whileInView` with `once: true, margin: "-10%"`
- Replaces the current `AnimateIn` / `hero-stagger` ad-hoc animations

### 6.4 Smooth scroll (Lenis)

- Wrap app in Lenis provider (`src/components/layout/lenis-provider.tsx`) inside `layout.tsx`
- Default config: `duration: 1.1`, `easing: easeOutExpo`, `smoothWheel: true`
- Auto-disabled when `prefers-reduced-motion` is on
- Disabled on `/adventure*` routes (route-based check inside provider)
- Anchor links (`<a href="#projects">`) use Lenis's `scrollTo()` instead of native

### 6.5 Micro-interactions (catalog)

| Element | Interaction |
|---|---|
| Section eyebrow labels | Fade in 80ms before headline on scroll-reveal |
| `CopyableEmail` | Mono "copied" state slides up on click, springs back after 1.5s |
| `LiveStatus` dot | Accent pulse, 2s cycle, opacity 0.6 → 1 → 0.6 |
| `TechBadge` hover | Hairline ring brightens to accent, no fill |
| Experience timeline | Dots scale 0 → 1 + accent fill on enter-view, staggered |
| Magnetic photo | Existing behavior preserved, frame restyle only |
| Theme toggle | Existing behavior preserved |
| Footer "back to top" | Magnetic, triggers Lenis `scrollTo(0)` |
| Typing loop in hero | Preserved; cursor restyled to a thin `1px × 1em` accent bar |
| Project card hover | Spotlight + image inside card scales `scale(1.02)` over 600ms |

### 6.6 What deliberately gets no motion

- Stats numbers — no count-up (reads gimmicky in editorial)
- TechBadge grid — single fade-in only
- GitHub heatmap — static
- Modal contents (cert previews) — existing behavior preserved

### 6.7 Reduced-motion behavior (mandatory)

CSS rule already in `globals.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

JS-side guards (via `useReducedMotion` hook):
- Lenis disabled
- Magnetic buttons stationary
- Spotlight gradient still renders (positional, not animated) but no fade-in
- Animated border on hero pauses (static state)
- Section reveals instant
- Custom cursor static (or hidden, falling back to native cursor)

The redacted-text effect still works under reduced motion — pure selection state.

---

## 7. File-Level Architecture

### 7.1 New files

```
src/
├── app/
│   └── template.tsx                          NEW — first-load page enter transition
├── components/
│   ├── ui/
│   │   ├── spotlight.tsx                     NEW — vendored, ~80 lines
│   │   ├── animated-border.tsx               NEW — conic-gradient border, ~50 lines
│   │   ├── magnetic-button.tsx               NEW — wraps shadcn Button, ~60 lines
│   │   ├── cursor-follower.tsx               NEW — global accent-dot cursor, ~80 lines
│   │   ├── grain-overlay.tsx                 NEW — fixed SVG-noise overlay, ~30 lines
│   │   ├── tooltip.tsx                       NEW — shadcn primitive
│   │   └── tabs.tsx                          NEW — shadcn primitive
│   ├── shared/
│   │   ├── eyebrow-label.tsx                 NEW
│   │   ├── sticky-eyebrow.tsx                NEW — sticky-to-viewport eyebrow w/ IO
│   │   ├── redacted-text.tsx                 NEW — highlight-to-reveal about block
│   │   ├── magnetic-cta.tsx                  NEW — pre-styled magnetic primary button
│   │   ├── animated-name.tsx                 NEW — hero name char reveal + parallax
│   │   ├── stats-ribbon.tsx                  NEW — pill-bar with mono numerals
│   │   ├── experience-timeline.tsx           NEW — vertical hairline timeline + dots
│   │   └── project-card.tsx                  NEW — replaces bento-project-card.tsx
│   └── layout/
│       └── lenis-provider.tsx                NEW — global smooth-scroll wrapper
├── hooks/
│   ├── use-reduced-motion.ts                 NEW — single source of truth
│   ├── use-section-active.ts                 NEW — IO-based active section
│   └── use-magnetic.ts                       NEW — extracted magnetic spring logic
└── lib/
    └── motion.ts                             NEW — shared motion variants + ease/duration
```

### 7.2 Modified files

```
src/
├── app/
│   ├── layout.tsx                            font swap (Inter → Geist Sans + Mono); add Lenis + grain + cursor
│   ├── page.tsx                              full restructure to new bento map
│   ├── resume/page.tsx                       eyebrows + display headlines; tabs for content
│   ├── icon.tsx                              regenerate w/ new tokens
│   └── globals.css                           full token rewrite
├── components/
│   ├── shared/
│   │   ├── bento-card.tsx                    surface treatment; loses warm accent
│   │   ├── section-heading.tsx               REPLACED — display headline + italic accent word
│   │   ├── tech-badge.tsx                    outline-only treatment
│   │   ├── tech-ticker.tsx                   restyle (mono labels, hairline borders)
│   │   ├── live-status.tsx                   restyle (mono label + pulsing dot)
│   │   ├── magnetic-photo.tsx                frame restyle only (behavior unchanged)
│   │   ├── copyable-email.tsx                mono font; sprung "copied" state
│   │   ├── contact-form.tsx                  shadcn Input/Textarea primitives; magnetic submit
│   │   ├── github-calendar-client.tsx        token-color refresh (single accent for cells)
│   │   └── experience-item.tsx               (optionally absorbed into experience-timeline.tsx)
│   ├── layout/
│   │   ├── header.tsx                        restyle; active-section nav highlight
│   │   ├── mobile-nav.tsx                    restyle to match new aesthetic
│   │   ├── theme-toggle.tsx                  micro-interaction polish
│   │   └── scroll-progress.tsx               thin accent bar, restyled
│   └── ui/
│       ├── button.tsx                        variants extended (ghost-mono, link-mono)
│       ├── card.tsx                          surface tokens
│       └── badge.tsx                         outline becomes default variant
└── data/
    └── projects.ts                           add `image: string` field per project
```

### 7.3 Deleted files

```
src/components/shared/bento-project-card.tsx  superseded by project-card.tsx
src/components/shared/animate-in.tsx          superseded by lib/motion + motion's whileInView
```

`IMPROVEMENTS.md` and `VISUAL_PLAN.md` stay in place as historical context.

### 7.4 Adventure mode files (NOT TOUCHED)

```
src/components/adventure/**/*               NOT TOUCHED
src/game/**/*                               NOT TOUCHED
src/app/adventure/**/*                      NOT TOUCHED
public/images/trip/**/*                     NOT TOUCHED
public/adventure/**/*                       NOT TOUCHED
scripts/build-trip-manifest.mjs             NOT TOUCHED
```

The Adventure project tile in the homepage projects grid uses the new `project-card.tsx` styling like every other project. Clicking it routes to `/adventure` exactly as today.

### 7.5 Bundle impact estimate

| Addition | Approx. gzipped JS |
|---|---|
| `motion` | +20kb (already partly used) |
| `lenis` | +4kb |
| Geist fonts | +0kb JS (font files lazy-loaded) |
| Vendored effects (5 components) | +3kb |
| New shadcn primitives (Tooltip + Tabs + Form) | +6kb |
| **Net delta** | **~+33kb gzipped JS** |

Stays under the 150kb landing-page budget.

---

## 8. Implementation Phasing

Sequenced so each phase ends with a deployable site — no half-broken intermediate states.

### Phase 0 — Foundation (no visual change yet)

- Install `lenis`, verify `motion` version, set up Geist Sans + Mono via `next/font/google`
- Rewrite `globals.css` `@theme` block with new OKLCH tokens (light + dark)
- Add `lib/motion.ts` with shared variants and ease/duration constants
- Add `hooks/use-reduced-motion.ts`
- `npx shadcn@latest add tooltip tabs form input textarea label`
- Vendor: `spotlight.tsx`, `animated-border.tsx`, `magnetic-button.tsx`, `cursor-follower.tsx`, `grain-overlay.tsx` (files exist but not yet wired)

**Verification:**
- `pnpm build` succeeds
- `pnpm dev` — site looks **identical** to before (intentional)
- Light + dark theme toggle still works
- No console errors
- Baseline bundle size measured

### Phase 1 — Global chrome (cursor, scroll, grain, page transition)

- Add `LenisProvider` to `layout.tsx` (with `/adventure*` route check)
- Mount `CursorFollower` and `GrainOverlay` in `layout.tsx`
- Add `app/template.tsx` with first-load enter transition
- Restyle `scroll-progress.tsx` with new accent token

**Verification:**
- Cursor follows on desktop; disabled on touch/reduced-motion
- Smooth scroll feels right; anchor links work via Lenis
- Grain visible but not intrusive in both themes
- Page enter transition fires on first load (or per route — confirm Next 16 template behavior)
- Reduced-motion: cursor static, no smooth scroll, no entrance wipe
- `/adventure` is unaffected (cursor + Lenis disabled there)

### Phase 2 — Typography & color migration (no layout change)

- Apply Geist Sans to body, Geist Mono to eyebrow + numerals across whole site
- Migrate every `accent-brand` and `accent-warm` reference to `accent`
- Delete `--accent-warm` token
- Apply `tracking-tighter` to display sizes, `tracking-widest` to eyebrow labels
- Bento card surface treatment update (backdrop-blur, hairline ring, inset top highlight)

**Verification:**
- Light + dark: walk every section, both feel intentional, no orphan coral
- Resume page also migrated
- Existing `bento-card.tsx` consumers all render correctly
- Lighthouse contrast still passes WCAG AA

### Phase 3 — Section-by-section restructure (homepage)

One commit per subsection.

1. Hero card — `AnimatedName`, `AnimatedBorder`, magnetic CTAs, `EyebrowLabel`, redesigned `SectionHeading`
2. Photo card — frame restyle, social row restyle
3. Stats ribbon — replace 4-card grid with single pill-bar, mono numerals
4. About + Tech Stack group — `RedactedText`, eyebrow, tech badge restyle, `TechTicker` moves into Tech Stack
5. Experience / Education / Certs — `ExperienceTimeline`, hairline timeline + animated dots; cert modal preserved
6. Projects group — new `ProjectCard` with image thumbnails, Spotlight, cursor-following label, asymmetric grid
7. Contact group — shadcn Form + Input + Textarea, magnetic submit
8. Footer + sticky eyebrows wired — IO-driven sticky eyebrow per section, footer mono restyle, magnetic "back to top"

**Verification (after each subsection):**
- `pnpm dev` visual check
- 320px, 375px, 768px, 1440px breakpoints — no overflow, composition holds
- Both themes
- Keyboard nav: all CTAs reachable
- Screen reader spot-check on `RedactedText` (text announced)
- Reduced-motion simulation: section reveals instant, no parallax, no magnetic

### Phase 4 — Resume page

- Eyebrow + display-headline header
- Tabs primitive for sections (Experience, Education, Skills, Certifications)
- Inherits all global chrome automatically
- Download CTA becomes magnetic

**Verification:**
- `/resume` looks like a sibling to `/`
- PDF download still works
- Tabs are keyboard-navigable

### Phase 5 — Polish

- Walk every page in both themes at every breakpoint
- Lighthouse on `/` — Performance / Accessibility / Best Practices / SEO
- `axe` accessibility check on `/` and `/resume`
- Verify CWV: LCP < 2.5s, INP < 200ms, CLS < 0.1
- Verify bundle: landing page < 150kb gzipped JS
- Test contact form end-to-end
- Test reduced-motion path full page
- Cross-browser: Chrome, Firefox, Safari (Lenis is the historical Safari pain point)
- Verify adventure mode untouched: navigate `/adventure`, full play-through (title → menu → world → arena → photo viewer → exit). Audio + photos work.

**Final acceptance:**
- `pnpm build` clean: no TypeScript errors, no ESLint errors
- All Phase 5 checks pass
- Side-by-side before/after screenshots show clear elevation
- Contact form submission still routes to Resend correctly
- Adventure mode unchanged

---

## 9. Risk Register

| Risk | Mitigation |
|---|---|
| Lenis breaks anchor-link UX or Safari behavior | Feature-detect; fall back to native scroll on detected issues |
| Geist font load causes FOUT/FOIT | `next/font` with `display: 'swap'`; preload only needed weights |
| Magnetic effect feels nauseating | Displacement < 12px, high spring damping |
| Custom cursor feels laggy on lower-end machines | CSS transforms only; throttle pointer updates to RAF |
| Redacted-text reveal confusing | 4s mono caption "// click and drag to reveal" handles discovery |
| Sticky eyebrows fight with mobile nav header | Mobile: eyebrows un-stick (CSS media query) |
| Page enter transition runs on every route change | Use `template.tsx` carefully; gate with sessionStorage if needed |
| Adventure mode regressed by global chrome | Disable cursor + Lenis on `/adventure*` routes via path check |
| Bundle size creep beyond 150kb budget | Measure after each phase; lazy-load heavy components if needed |

---

## 10. Acceptance Checklist (use at end)

- [ ] Both themes feel intentional, no orphan coral or default-blue
- [ ] All section eyebrows numbered + mono + accent
- [ ] All section headlines display-size + tracking-tighter + (optional italic word)
- [ ] Hero: animated border + magnetic CTAs + char-by-char name + parallax
- [ ] About: redacted-text reveals on selection + screen-reader accessible + keyboard reveal works
- [ ] Stats: single pill-bar, mono numerals, hairline dividers
- [ ] Projects: image thumbnails + spotlight + cursor-following "VIEW PROJECT →" label
- [ ] Contact: shadcn Form, magnetic submit, API still works
- [ ] Custom cursor active on desktop, hidden on touch + reduced-motion + `/adventure*`
- [ ] Lenis smooth scroll active site-wide except `/adventure*` and reduced-motion
- [ ] Grain overlay subtle in both themes
- [ ] Page enter transition fires (verify scope: per-load vs per-route)
- [ ] Sticky eyebrows behave on desktop, un-stick on mobile
- [ ] Reduced-motion: nothing animates, redacted-text still works
- [ ] Adventure mode unchanged — full play-through works
- [ ] Bundle < 150kb gzipped on `/`
- [ ] Lighthouse Accessibility ≥ 95
- [ ] CWV all green
- [ ] No TypeScript errors, no ESLint errors

---

## 11. Open Questions / TBD During Implementation

- **Next.js 16 `template.tsx` semantics** — Verify whether `template.tsx` re-mounts on every navigation (which would re-run the enter transition) or only on initial load. If it re-mounts every time, gate the transition with a sessionStorage flag so it only runs once per session. Read `node_modules/next/dist/docs/` before implementing.
- **Geist font delivery** — Decide between `geist` package vs `next/font/google` — confirm against Next 16 recommendations at implementation time.
- **`motion` version** — Verify the version already installed (used by adventure mode) is compatible with `motion` v11 features used here (`useScroll`, `useTransform`, `whileInView`).
- **Lenis + Next.js 16 App Router** — Verify Lenis client-component setup works under Next 16 RSC boundaries; standard pattern is to use a `'use client'` provider.
- **Project image assets** — User must supply actual project screenshots before Phase 3 subsection 6 ships. Until then, fallback to current emoji headers.
