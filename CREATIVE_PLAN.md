# Creative Portfolio Enhancements Plan

> Handoff doc for picking this work back up on another machine.
> Drafted 2026-04-15. Builds on top of [VISUAL_PLAN.md](VISUAL_PLAN.md), [HERO_PLAN.md](HERO_PLAN.md), [BENTO_PLAN.md](BENTO_PLAN.md).

## Context

A menu of 8 creative features that go beyond standard polish — designed to make the portfolio memorable. Plays to the user's identity: ML/CV engineer, Filipino BSIT student, FishFresh creator. Each entry includes effort + impact + implementation hints. Pick what to implement and in what order.

(A 9th idea — Live FishFresh demo widget — was considered and **excluded**: requires deploying a model. Maybe later.)

## Codebase context (relevant for all features)

- All hero state lives in [src/app/page.tsx](src/app/page.tsx) (`"use client"`)
- Layout shell: [src/app/layout.tsx](src/app/layout.tsx) — wraps everything, good place for global event listeners
- Profile photo: [src/components/shared/magnetic-photo.tsx](src/components/shared/magnetic-photo.tsx) — already wraps the photo + ring
- Contact form: [src/components/shared/contact-form.tsx](src/components/shared/contact-form.tsx) — has success state already
- Email shown at [src/app/page.tsx:80-83](src/app/page.tsx#L80-L83)
- Personal data: [src/data/personal.ts](src/data/personal.ts) — `personalInfo.email`, `socialLinks`, `headlines`
- Footer: [src/components/layout/footer.tsx](src/components/layout/footer.tsx) — natural home for QR code
- Reusable hook pattern: [src/hooks/use-mouse-position.ts](src/hooks/use-mouse-position.ts) (RAF-throttled)
- Modal primitive: [src/components/ui/modal.tsx](src/components/ui/modal.tsx)

## Features (pick & choose)

### 1. 🎯 Face-detection brackets on profile photo
**Effort:** S (~30 min) | **Impact:** High — most on-brand for a CV/ML engineer

Four L-shaped corner brackets (CSS-only) absolutely positioned around the profile photo with a soft pulse. Optional tiny `[ DETECTED ]` mono-font label below.

- **Where:** [src/components/shared/magnetic-photo.tsx](src/components/shared/magnetic-photo.tsx) — wrap the photo with brackets
- **How:** 4 absolutely-positioned divs at corners with `border-top` + `border-left` (or right/bottom) — creates L-shape. Use `accent-brand` color. Add `@keyframes detect-pulse` for soft scale + opacity.
- **No new files / deps.**

### 2. 🐟 Konami code → fish rain
**Effort:** M (~1 hr) | **Impact:** High — devs always try Konami, payoff is unique to FishFresh

Listen for `↑↑↓↓←→←→BA` globally. On match: rain 30-50 fish emojis from top of viewport for ~5s, then fade out. Optional toast: "🎣 FishFresh activated".

- **New files:**
  - `src/hooks/use-konami.ts` — keystroke buffer + sequence matcher, fires callback
  - `src/components/shared/fish-rain.tsx` — array of falling fish with random `left`, `animation-delay`, `animation-duration`
- **Wire in:** [src/app/layout.tsx](src/app/layout.tsx) (works on any page)
- **CSS:** `@keyframes fish-fall` (translateY 0 → 110vh, opacity stays then fades)
- **No new deps.**

### 3. 💬 Console easter egg
**Effort:** XS (~10 min) | **Impact:** Medium-high (for the right audience)

Styled `console.log` greeting on first page load.
```
👋 Hi! You opened the console — I respect that.
📧 aziztebbeng@gmail.com
🔗 github.com/mrclumster
```
Use `%c` for CSS — big text, brand colors.

- **New file:** `src/components/shared/console-greeting.tsx` (`"use client"`, single `useEffect`, returns `null`)
- **Wire in:** [src/app/layout.tsx](src/app/layout.tsx) inside `<body>`
- **No new deps.**

### 4. ⌨️ Terminal mode (press `~` or `/`)
**Effort:** L (~3-4 hr) | **Impact:** Very high for dev recruiters

Press `~` (or click button) → fullscreen overlay opens with fake terminal. Commands:
- `help` — list commands
- `whoami` — name + headline + location
- `ls projects` — list projects from [src/data/projects.ts](src/data/projects.ts)
- `cat about.md` — bio paragraphs
- `open <project>` — opens project modal or external link
- `theme dark|light` — toggle theme
- `clear` — clear output
- `exit` (or Esc) — close terminal

- **New files:**
  - `src/components/shared/terminal.tsx` — overlay + prompt + history + command parser
  - `src/lib/terminal-commands.ts` — command registry
- **Trigger:** Global keydown in [src/app/layout.tsx](src/app/layout.tsx) for `~` (`Backquote`). Skip if input is focused.
- **State:** Local for command history + scrollback
- **Styling:** Mono font (already loaded), green-on-black aesthetic
- **No new deps.** Reuse Modal styling tokens.

### 5. 🇵🇭 Tagalog/English toggle
**Effort:** L (~4-5 hr, structural) | **Impact:** Unique heritage touch

Flag toggle in header swaps key UI strings. **Most invasive** feature — touches every text in the app.

**Phased approach:**
- **Phase A (small):** Translate hero + nav strings only. Use a Context provider + `useT(key)` hook reading from a flat JSON.
- **Phase B (full):** Translate all data files + all UI text.

- **New files:**
  - `src/lib/i18n/locales/en.ts`, `tl.ts`
  - `src/providers/locale-provider.tsx` — Context + `useT()` + localStorage persistence
  - `src/components/layout/locale-toggle.tsx` — flag-icon button
- **Edit:** Wrap [src/app/layout.tsx](src/app/layout.tsx) in `<LocaleProvider>`. Update [src/components/layout/header.tsx](src/components/layout/header.tsx).
- **No new deps** (skip i18next — overkill).
- **Recommend Phase A first** — see if it feels good before translating everything.

### 6. ✉️ Click-to-copy email
**Effort:** XS (~15 min) | **Impact:** Universal small win

Email line in hero becomes a button. Click → `navigator.clipboard.writeText(email)` → swap icon `Mail` → `Check` + show "Copied!" tooltip 2s.

- **New file:** `src/components/shared/copyable-email.tsx`
- **Edit:** Replace [src/app/page.tsx:80-83](src/app/page.tsx#L80-L83) with `<CopyableEmail email={personalInfo.email} />`
- **No new deps** (Lucide already has `Copy`, `Check`)

### 7. 🎉 Confetti on contact form submit
**Effort:** S (~20 min) | **Impact:** Memorable micro-delight

After successful contact form submit, burst of confetti from the submit button.

- **New dep:** `canvas-confetti` (~6kb, MIT)
- **Edit:** [src/components/shared/contact-form.tsx](src/components/shared/contact-form.tsx) — call `confetti({ origin: { x, y } })` in success handler
- **Respect reduced-motion** — skip the burst if `prefers-reduced-motion` is set.

### 8. 📊 GitHub contribution heatmap
**Effort:** S (~30 min) | **Impact:** Medium — proves activity

Real contribution graph in About section.

- **Option A:** `<img src="https://ghchart.rshah.org/<username>" />` — third-party, image-based, zero deps. Less customizable.
- **Option B (recommended):** `react-github-calendar` (~30kb gz) — themeable to match site
- **Edit:** Add to About BentoCard at [src/app/page.tsx:171-181](src/app/page.tsx#L171-L181). Theme to `accent-brand`.

### 10. 💼 vCard QR code in footer
**Effort:** S (~30 min) | **Impact:** Premium practical touch

QR in footer. Recruiter scans → adds to phone contacts.

- **Option A:** Pre-generate `aziz.vcf` in `public/`, link with `<Download>` icon. QR via `https://api.qrserver.com/v1/create-qr-code/?data=...`. Zero deps.
- **Option B (recommended):** `qrcode.react` (~12kb) — generates QR client-side from vCard string
- **New file:** `src/components/shared/vcard-qr.tsx`
- **Edit:** [src/components/layout/footer.tsx](src/components/layout/footer.tsx) — add to a corner

## Recommended phasing

**Quickest wins first (~1-2 hr total):**
1. #3 Console easter egg (XS)
2. #6 Click-to-copy email (XS)
3. #1 Face-detection brackets (S)
4. #7 Confetti on form submit (S)

**Then medium-effort flexes (~2-3 hr):**
5. #2 Konami fish rain (M)
6. #8 GitHub heatmap (S)
7. #10 vCard QR (S)

**Save for later (bigger builds):**
8. #4 Terminal mode (L)
9. #5 Tagalog toggle (L) — Phase A only at first

## Critical constraints (do not violate)

- **Next.js 16 has breaking changes** — read `node_modules/next/dist/docs/` before writing any Next-specific code. See [AGENTS.md](AGENTS.md).
- **Respect `prefers-reduced-motion`** — fish rain, bracket pulse, confetti, terminal fade-in all degrade. Pattern in [globals.css:283-295](src/app/globals.css#L283-L295).
- **Easter eggs must not break a11y** — no audio without opt-in, no flashing >3Hz, no blocking nav, all keyboard-accessible.
- **`navigator.clipboard` only works on HTTPS / localhost** — fine for dev + Vercel.
- **Console message runs once** per page load.
- **Konami listener** must clean up on unmount.
- **Terminal must not capture `~` when input is focused** — check `document.activeElement.tagName !== 'INPUT'` (and TEXTAREA).
- **Bundle size watch** — `canvas-confetti` ~6kb, `qrcode.react` ~12kb, `react-github-calendar` ~30kb. Three small deps total if all chosen — fine.

## Verification (per feature)

1. **#1 Brackets:** photo has visible animated brackets, tasteful, no layout shift.
2. **#2 Fish rain:** Konami → 5s of falling fish → cleans up. Both themes.
3. **#3 Console:** open DevTools on first load → styled greeting once.
4. **#4 Terminal:** press `~` outside input → opens. All commands work. `Esc` closes. Doesn't trigger when typing.
5. **#5 Locale:** click flag → strings swap. Refresh → preserved (localStorage).
6. **#6 Copy email:** click → "Copied!" tooltip → paste elsewhere to confirm.
7. **#7 Confetti:** submit test message → confetti → email arrives.
8. **#8 Heatmap:** real GitHub data renders, themed correctly.
9. **#10 QR:** scan with phone camera → contact card opens.
10. Lighthouse — Performance shouldn't drop more than 3-5 points total.

## How to start (for the Claude session on the other PC)

1. `npm install` (if needed) → `npm run dev`
2. Read this file + the other 3 plan docs for full context
3. Start with the **Quickest wins** section (do all 4 in order)
4. Commit each feature separately so progress is checkpointed
