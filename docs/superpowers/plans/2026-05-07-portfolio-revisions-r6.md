# Portfolio Revisions Round 6 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero left column `<h1>` with an ASCII-art banner of "AZIZ TEBBENG" (single-line desktop, stacked under `lg`), and tighten the supporting elements (drop `last-build`, swap chunky `<TerminalButton>` for bracketed text buttons).

**Architecture:** Two new client components — `<AsciiBanner />` (self-contained, owns both banner string variants and responsive swap via Tailwind classes) and `<HeroButtons />` (hero-specific bracketed link row, pulls `personalInfo.socialLinks` directly). `hero-terminal.tsx` is updated to consume them and drop now-unused state/imports. `TerminalButton` itself is untouched (still used by `contact-terminal.tsx` and `resume/page.tsx`).

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4. No new deps.

---

## Task 1: AsciiBanner component

**Files:**
- Create: `src/components/hero/ascii-banner.tsx`

This component is pure presentation. No props. Renders both a single-line banner (visible at `lg+`) and a stacked banner (visible below `lg`) — Tailwind responsive classes do the swap; no JS or matchMedia. The h1 is NOT inside this component (the consumer owns the visually-hidden h1).

- [ ] **Step 1: Create `src/components/hero/ascii-banner.tsx`**

```tsx
const BANNER_SINGLE = String.raw`
 █████╗ ███████╗██╗███████╗     ████████╗███████╗██████╗ ██████╗ ███████╗███╗   ██╗ ██████╗ 
██╔══██╗╚══███╔╝██║╚══███╔╝     ╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔════╝████╗  ██║██╔════╝ 
███████║  ███╔╝ ██║  ███╔╝         ██║   █████╗  ██████╔╝██████╔╝█████╗  ██╔██╗ ██║██║  ███╗
██╔══██║ ███╔╝  ██║ ███╔╝          ██║   ██╔══╝  ██╔══██╗██╔══██╗██╔══╝  ██║╚██╗██║██║   ██║
██║  ██║███████╗██║███████╗        ██║   ███████╗██████╔╝██████╔╝███████╗██║ ╚████║╚██████╔╝
╚═╝  ╚═╝╚══════╝╚═╝╚══════╝        ╚═╝   ╚══════╝╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝ `;

const BANNER_STACKED = String.raw`
 █████╗ ███████╗██╗███████╗
██╔══██╗╚══███╔╝██║╚══███╔╝
███████║  ███╔╝ ██║  ███╔╝ 
██╔══██║ ███╔╝  ██║ ███╔╝  
██║  ██║███████╗██║███████╗
╚═╝  ╚═╝╚══════╝╚═╝╚══════╝
████████╗███████╗██████╗ ██████╗ ███████╗███╗   ██╗ ██████╗ 
╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔════╝████╗  ██║██╔════╝ 
   ██║   █████╗  ██████╔╝██████╔╝█████╗  ██╔██╗ ██║██║  ███╗
   ██║   ██╔══╝  ██╔══██╗██╔══██╗██╔══╝  ██║╚██╗██║██║   ██║
   ██║   ███████╗██████╔╝██████╔╝███████╗██║ ╚████║╚██████╔╝
   ╚═╝   ╚══════╝╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝ `;

export function AsciiBanner() {
  return (
    <div aria-hidden className="font-mono select-none" style={{ color: "var(--ink)" }}>
      <pre
        className="hidden lg:block leading-none"
        style={{
          fontSize: "clamp(0.45rem, 0.3rem + 0.55vw, 0.85rem)",
          letterSpacing: 0,
          margin: 0,
        }}
      >
        {BANNER_SINGLE}
      </pre>
      <pre
        className="block lg:hidden leading-none"
        style={{
          fontSize: "clamp(0.55rem, 0.45rem + 0.4vw, 0.85rem)",
          letterSpacing: 0,
          margin: 0,
        }}
      >
        {BANNER_STACKED}
      </pre>
    </div>
  );
}
```

Notes for the implementer:
- The leading newline in each `String.raw` template intentionally pushes the first row of art down so it doesn't collide with the parent's top padding. Keep it.
- Trailing space on each line is significant — it preserves the box characters' alignment. Do not strip whitespace.
- Use `String.raw` so backslashes (none right now, but safe for future tweaks) are literal.
- `aria-hidden` is on the wrapper, not each `<pre>`, so a screen reader skips the whole banner. The visually-hidden `<h1>` lives in the consumer (`hero-terminal.tsx`) — see Task 3.

- [ ] **Step 2: Type-check the new file in isolation**

Run: `npx tsc --noEmit`
Expected: PASS for `src/components/hero/ascii-banner.tsx`. Pre-existing errors in `src/components/adventure/pokeball-3d.tsx` (postprocessing types) are unrelated and may continue to appear — ignore them.

- [ ] **Step 3: Commit**

```
git add src/components/hero/ascii-banner.tsx
git commit -m "feat(hero): add AsciiBanner component for round 6"
```

---

## Task 2: HeroButtons component

**Files:**
- Create: `src/components/hero/hero-buttons.tsx`

The hero needs a flat row of bracketed text-buttons in place of the chunky `<TerminalButton>`s. We don't generalize this into the existing `TerminalButton` — it's hero-specific styling and keeping it isolated avoids breaking `contact-terminal.tsx` and `resume/page.tsx` which already depend on `TerminalButton`.

- [ ] **Step 1: Create `src/components/hero/hero-buttons.tsx`**

```tsx
import Link from "next/link";
import { personalInfo } from "@/data/personal";

interface BracketLinkProps {
  href: string;
  external?: boolean;
  children: string;
}

function BracketLink({ href, external, children }: BracketLinkProps) {
  const className =
    "font-mono whitespace-nowrap transition-colors duration-150 hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] focus-visible:bg-[color:var(--ink)] focus-visible:text-[color:var(--paper)] focus-visible:outline-none";

  const content = `[ ${children} ]`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export function HeroButtons() {
  const { socialLinks } = personalInfo;
  return (
    <nav
      aria-label="Primary actions"
      className="flex flex-wrap gap-x-3 gap-y-2"
      style={{ fontSize: "clamp(0.78rem, 0.75rem + 0.15vw, 0.875rem)" }}
    >
      <BracketLink href="#projects">view_work</BracketLink>
      <BracketLink href="/resume">resume.pdf</BracketLink>
      {socialLinks.github && <BracketLink href={socialLinks.github} external>github</BracketLink>}
      {socialLinks.linkedin && <BracketLink href={socialLinks.linkedin} external>linkedin</BracketLink>}
      {socialLinks.facebook && <BracketLink href={socialLinks.facebook} external>facebook</BracketLink>}
      {socialLinks.instagram && <BracketLink href={socialLinks.instagram} external>instagram</BracketLink>}
    </nav>
  );
}
```

Notes:
- `next/link` for internal hrefs (`#projects`, `/resume`); plain `<a>` with `target="_blank"` for external. Mirrors the original `TerminalButton` behavior.
- `whitespace-nowrap` on each button keeps `[ view_work ]` from breaking into `[ view_work` / `]` on narrow widths.
- Hover and focus inverts the link via paper/ink color swap. No border, no padding box — the brackets ARE the visual frame.
- `aria-label="Primary actions"` on the `<nav>` so screen readers know what this row is.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS for the new file. Pokeball errors still ignored.

- [ ] **Step 3: Commit**

```
git add src/components/hero/hero-buttons.tsx
git commit -m "feat(hero): add HeroButtons component (bracketed text buttons)"
```

---

## Task 3: Update HeroTerminal to use the new components

**Files:**
- Modify: `src/components/sections/hero-terminal.tsx`

This task replaces the `<h1>` block, the button row, and removes the `last-build` row + the `now`/`useEffect` state that fed it. It also removes now-unused imports (`useState`, `useEffect`, `TerminalButton`, the four icon components).

- [ ] **Step 1: Re-read the current file to confirm current line content**

Run: `Read src/components/sections/hero-terminal.tsx`
Expected: matches the file shown in the spec's analysis (no surprise changes since the spec was written).

- [ ] **Step 2: Replace the entire file with the new version**

Replace `src/components/sections/hero-terminal.tsx` contents with:

```tsx
"use client";

import { personalInfo } from "@/data/personal";
import { AsciiBanner } from "@/components/hero/ascii-banner";
import { HeroButtons } from "@/components/hero/hero-buttons";
import { CursorEyes } from "@/components/hero/cursor-eyes";
import { PhotoFrame } from "@/components/hero/photo-frame";
import { useTypingLoop } from "@/hooks/use-typing";
import { KeyValue, KeyValueList } from "@/components/terminal/key-value";
import { ParticleConstellation } from "@/components/hero/particle-constellation";

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
      {/* B — Particle constellation: full-section background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <ParticleConstellation />
      </div>

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

        {/* Right column — cursor-tracking eyes + colored photo */}
        <div className="flex flex-col gap-3" style={{ height: 400 }}>
          <CursorEyes />
          <div className="relative flex-1">
            <PhotoFrame imageSrc={personalInfo.profileImage} />
          </div>
        </div>
      </div>
    </section>
  );
}
```

Key changes from the previous version:
- Removed `useState`, `useEffect`, `now`, `setNow`, and the `last-build` `<KeyValue>` row.
- Removed `TerminalButton` import and the entire `<div className="flex flex-wrap gap-3 pt-1" ...>` button block — replaced by `<HeroButtons />`.
- Removed the four icon imports (`GithubIcon`, `LinkedinIcon`, `FacebookIcon`, `InstagramIcon`) — they're no longer used here.
- Added `<AsciiBanner />` and `<HeroButtons />` imports.
- The `<h1 id="hero-heading">` is now `sr-only` so `aria-labelledby="hero-heading"` on the section still resolves.
- The `<p>` for the typing headline lost its surrounding `<div>` wrapper — the wrapper only existed to group h1 + p, and we now want the h1 hidden + banner + p as separate children of the `space-y-5` stack.
- `space-y-6` → `space-y-5`.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS for `hero-terminal.tsx`. Pokeball errors still ignored. If TypeScript flags an unused-import warning for any of the removed icons, that means the replacement wasn't complete — re-check Step 2.

- [ ] **Step 4: Verify the dev server renders without runtime errors**

Run (in a separate terminal you keep open): `npm run dev`
Open: `http://localhost:3000`
Expected:
- ASCII banner of "AZIZ TEBBENG" appears in the hero left column.
- At ≥1024px window width, banner is on a single line.
- At <1024px, banner is two stacked lines (AZIZ above TEBBENG).
- Below the banner: typing headline `> Full-Stack Developer▮` (cycling), then 3 key-value rows (location / email / status — NO `last-build`), then a flat row of bracketed buttons `[ view_work ] [ resume.pdf ] [ github ] [ linkedin ] [ facebook ] [ instagram ]`.
- Right column (cursor eyes + photo) is unchanged.
- Hovering a bracketed button inverts its colors (paper background → ink background, ink text → paper text).
- Browser console has no new errors.

If any of these fail, fix before committing.

- [ ] **Step 5: Commit**

```
git add src/components/sections/hero-terminal.tsx
git commit -m "feat(hero): swap h1 for AsciiBanner + bracketed HeroButtons (round 6)"
```

---

## Task 4: Cross-width verification

This is a manual check, no code changes. Catches the breakpoint risks called out in the spec.

- [ ] **Step 1: Verify at 1440px width**

In the browser, set viewport to 1440px wide.
Expected: single-line banner fits comfortably in the left column with breathing room. No horizontal scrollbar on the column or the page.

- [ ] **Step 2: Verify at 1100px width**

Resize to ~1100px wide.
Expected: still single-line banner (lg breakpoint is 1024px). If the banner looks cramped or overlaps the right column, document the actual width at which it breaks — we'll consider raising the breakpoint to `xl` (1280px) in a follow-up. Do not change the breakpoint in this round; just note it.

- [ ] **Step 3: Verify at 900px width**

Resize to ~900px wide.
Expected: banner switches to stacked (AZIZ above TEBBENG). No horizontal scroll.

- [ ] **Step 4: Verify at 375px width (mobile)**

Resize to 375px wide.
Expected: stacked banner fits without horizontal scroll. The whole hero collapses to a single column (right column appears below left column) — that's existing behavior, unchanged.

- [ ] **Step 5: Verify dark mode**

Toggle dark mode (whatever the project's existing toggle is — check the header if unsure).
Expected: banner color flips with `var(--ink)` (light banner on dark `--paper`). No hardcoded colors.

- [ ] **Step 6: Verify keyboard navigation**

Tab through the page from the URL bar.
Expected: each bracketed button receives a visible focus state (background inverts via `focus-visible`). Enter/Space activates the link.

- [ ] **Step 7: Note any deferred follow-ups**

If any width felt wrong (Step 2 risk) or anything else surprised you, write a one-line note in the commit message of any follow-up commit, or open a TODO for round 7's spec. Do not extend round 6's scope.

---

## Verification Summary

After all tasks complete, the hero left column should:
- [ ] Show "AZIZ TEBBENG" as ASCII art (single-line ≥1024px, stacked below)
- [ ] Have an `sr-only` `<h1>Aziz Tebbeng</h1>` for a11y/SEO
- [ ] Show typing headline `> Full-Stack Developer▮` below the banner
- [ ] Show 3 key-value rows (location / email / status), NOT `last-build`
- [ ] Show a single line of bracketed buttons with hover/focus invert
- [ ] Render correctly in both light and dark mode
- [ ] Pass `npx tsc --noEmit` (ignoring pre-existing pokeball errors)
- [ ] Have NO `git push` performed (per user request — local-only until they review)

Right column (cursor eyes + photo) and all other sections must be visually identical to before round 6.
