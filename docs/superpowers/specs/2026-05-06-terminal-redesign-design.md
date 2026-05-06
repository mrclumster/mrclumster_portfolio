# Terminal/Dev Redesign — Design Spec

**Date:** 2026-05-06
**Author:** Aziz Tebbeng
**Status:** Approved by user, ready for planning
**Scope:** Homepage (`/`) + Resume page (`/resume`). Adventure mode (`/adventure`) is **untouched**.

---

## Goal

Redesign the portfolio homepage and resume page to a strict terminal/dev aesthetic in muted black-and-white that reads as opinionated, senior-taste, and HR-scannable. Replace the current bento-card system with a single-window terminal frame composed of typed prompts, ASCII dividers, and `key: value` data blocks. Preserve and feature one signature interaction — a highlight-to-reveal mechanic in the About paragraph — to give recruiters a memorable "wait, what?" moment without resorting to gimmicky motion.

## Non-goals

- No changes to `/adventure` or any of its components, providers, data, or assets.
- No changes to project data shapes (`@/data/projects`, `@/data/experience`, `@/data/education`, `@/data/tech-stack`) except `@/data/personal.ts` `bio` field and an optional `version?` field on tech-stack items.
- No new dependencies. Everything stays inside Next.js + Tailwind + the existing `next-themes` provider.
- No animation library churn. GSAP, Lenis, Framer Motion usage outside `/adventure` is removed; not replaced.

---

## Section 1 — Global aesthetic & chrome

### Tokens

Light (default):

| Token | Value | Role |
| --- | --- | --- |
| `--paper` | `#f4f2ed` | Background |
| `--ink` | `#1a1a1a` | Primary text |
| `--muted` | `rgba(26,26,26,0.55)` | Secondary text |
| `--alarm` | `#c0392b` | About-paragraph keywords only |

Dark:

| Token | Value |
| --- | --- |
| `--paper` | `#1a1a1a` |
| `--ink` | `#e8e4dc` |
| `--muted` | `rgba(232,228,220,0.55)` |
| `--alarm` | `#e74c3c` |

### Typography

- Single family across the whole homepage and resume: `Geist Mono` (already loaded in `layout.tsx` as `--font-mono`).
- Hierarchy via size + weight only. Remove `Geist` (sans) and `Instrument_Serif` from page-level usage. Keep the imports in `layout.tsx` only if `/adventure` references them — verify in implementation.
- Type scale (homepage):
  - Display (hero name): `clamp(2.5rem, 1.8rem + 3vw, 4.25rem)`, weight 700, tracking `-0.02em`.
  - Section ASCII rule label: 0.75rem, uppercase, weight 600.
  - Body: 0.95rem.
  - Caption / muted: 0.75rem.

### Borders & surfaces

- All radii are `0`.
- All borders are `1px solid var(--ink)`.
- No box shadows, no `backdrop-filter`, no gradients, no blur, no grain overlay, no blob atmosphere.

### Page chrome

- Top sticky line on every page (homepage and resume only):
  ```
  aziz@portfolio:~ %  cat index.md                   commands · about · work · contact · resume · [theme]
  ```
  - Implemented as a single-row flex container with a 1px hairline below.
  - Right side is the nav. Each command links to its anchor (homepage) or page. `[theme]` toggles light/dark via existing `next-themes` provider.
- Bottom of every page:
  ```
  aziz@portfolio:~ %  ▍
  ```
  - Block cursor blinks at 1s interval. **Only ambient motion on the page** other than the hero typing loop.
- Section dividers everywhere:
  ```
  ── 02 / about ─────────────────────────────────────────────────
  ```
  - Implemented by `<AsciiDivider number="02" label="about" />` filling its column with `─` characters via CSS `flex` + a pseudo-element rule (no JS measurement).

### Selection rule (global)

```css
::selection {
  background: var(--ink);
  color: var(--paper);
}
```

This makes the highlight-reveal mechanic free.

### Motion budget (final)

Kept:
- Typing loop on hero headline (existing `useTypingLoop`).
- Block cursor blink (chrome bottom).
- Underline-on-hover for links and `[ button ]` elements (instant, no easing).

Removed:
- Smooth scroll (Lenis).
- Scroll progress bar.
- Animated border on hero card.
- Magnetic CTAs and magnetic photo.
- Spotlight, cursor follower, grain overlay.
- Blob atmosphere divs in `layout.tsx`.

---

## Section 2 — Page structure

The homepage is a single column at < 1024px and a primarily 7/5 asymmetric grid at ≥ 1024px, with subsection-specific ratios.

### 01 / Introduction

Layout: 7/5 grid (text left, photo right) at desktop, stacked at mobile.

Left column:
- `$ whoami` prompt → name in display size (no animated reveal — it's there immediately).
- `$ cat ~/headline.txt` → typing loop (existing component, reused) outputs the rotating headlines from `personalInfo.headlines`. Cursor `▍` follows the last character.
- `key: value` block: `location`, `email` (mailto), `status` (from `personalInfo.status.label`).
- Action row: `[ view_work ]` `[ resume.pdf ]` `[ github ]` `[ linkedin ]` rendered as `<TerminalButton>` components. Hover inverts (ink bg, paper text). Focus-visible inverts plus a 1px outline offset.

Right column:
- Plain framed `<Image>`. 1px ink border, no rounding, no shadow. Optional CSS `filter: grayscale(1) contrast(1.05)` for printout feel. Decision: include the duotone filter; can be removed in a 1-line revert if it reads wrong.
- Below the photo: 4-icon socials row, mono SVGs in `currentColor`, no buttons — just inline links separated by ` · `.

### Stats line (replaces `StatsRibbon`)

```
uptime ── 9 projects · 42 technologies · 1 internship · 5 certifications
```

Single full-width mono line, muted. Counts come from existing data sources (`projects.length`, `techStack` reduce, etc.).

### 02 / About + Stack

Two columns at desktop, stacked at mobile. 1px hairline divides the columns at desktop.

Left — About:
- Caption: `// select to reveal hidden notes` in muted mono, 0.7rem.
- `── about ───────`
- `<HighlightReveal segments={personalInfo.bio} />` — see Section 3.
- Below the paragraph: GitHub calendar via existing `GithubCalendarClient`, restyled by overriding the library's CSS variables to an opacity ramp on `--ink` (no greens). Wrap in a horizontal scroll container as today.

Right — Stack:
- `── stack ───────`
- `$ ls -la ~/stack`
- Render `techStack` (categories with items) as a directory tree:
  ```
  drwxr-xr-x  frontend/
  ├── react              v19
  ├── nextjs             v15
  ├── tailwind           v4
  └── framer-motion
  drwxr-xr-x  backend/
  ├── node
  ├── python
  └── postgres
  ```
- Components: `<StackTree categories={techStack} />`. Items are pure text rendered with mono alignment via CSS `display: grid; grid-template-columns: max-content 1fr` so version columns line up without manual padding.
- No version numbers are invented. Versions come from a new optional `version?: string` field on tech-stack items; items without a version simply render the name. Field is added; existing data left at `undefined`.

### 03 / Experience + Education + Certs

Single column.

Experience as `git log`:
```
commit a1b2c3d  (HEAD -> current)
Author: Nexzys Intelligence
Date:   2025-06 → present

    Web Developer Intern

    - Built X using Y
    - Shipped Z that did W
```
- `commit` hashes are deterministic per entry: `crypto.createHash('sha1').update(entry.title + entry.company).digest('hex').slice(0,7)` computed at build time (server component or static helper). No randomness — must be stable across renders.
- Component: `<ExperienceLog entries={experiences} />`.
- Bullet body uses the existing `bullets` array on each experience entry (verify field name during implementation; rename our prop if it differs).

Education:
- `── education ──`
- `$ cat ~/education.txt`
- Rendered as plain text blocks, one per `education[]` entry: degree on first line, school on second, period in muted mono on third. No icons.

Certifications:
- `── certifications ──`
- `$ ls cert/`
- Rendered as `ls` output, one row per cert:
  ```
  -rw-r--r--  google-data-analytics.pdf       2024
  ```
- Filename slug derived from `cert.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.pdf'`. Not displayed file names — the slug is purely visual flavor; the click target opens the existing modal with `cert.pdfUrl`.
- Click opens existing `<Modal>`/`<ModalContent>` with the PDF iframe — modal logic preserved verbatim, only the trigger styling changes.

### 04 / Selected Work

Replaces `<ProjectList>` (the file just created in this session) and `<ProjectCard>`.

- `── selected work ──`
- For each `featuredProjects` entry, render a project block:
  ```
  ── project_01 ─────────────────────────────
  name:    FishFresh
  stack:   python · tensorflow · opencv · react
  year:    2024
  status:  shipped
  desc:    Computer-vision freshness classifier...
  links:   [ github ]   [ demo ]

  [thumbnail, 1px ink frame, lazy-loaded]
  ```
- Block index is the loop index padded to 2 digits.
- Thumbnail is 1px-bordered, no rounding. Click thumbnail opens the existing project Modal (logic moved over from `project-card.tsx`).
- Component: `<ProjectsLog projects={featuredProjects} />`.

### 05 / Contact

- `── contact ──`
- `$ contact --send`
- `<ContactTerminalForm />` — wraps existing `<ContactForm />` submit logic; only the input styling changes:
  - Inputs: 1px hairline bottom border, no top/side borders, no rounding, mono, `var(--ink)` text on `var(--paper)` bg, focus = full 1px box + offset.
  - Labels above inputs in muted mono uppercase.
  - Submit: `[ submit ]` `<TerminalButton>`.
- All existing form state, validation, and submit handler are preserved.

### Resume page (`/resume`)

- Same chrome (terminal frame) — but the prompt reads `$ less resume.txt`.
- Single column, max-width tighter than homepage (≈ 720px) for printout feel.
- Sections: `── education ──`, `── experience ──`, `── certifications ──`, `── skills ──`, `── contact ──`. Same formatting rules as homepage subsections.
- `@media print`:
  - Force light tokens regardless of theme.
  - Hide chrome (top prompt, bottom cursor).
  - **Force secret spans visible** (`color: var(--ink)`) so printed/PDF resumes contain the full bio.
  - Page margins via `@page { margin: 0.6in; }`.

---

## Section 3 — Highlight-reveal mechanic

### Authoring format

`@/data/personal.ts` `bio` becomes a structured array:

```ts
export type BioSegment =
  | { type: "text"; value: string }
  | { type: "keyword"; value: string }
  | { type: "secret"; value: string };

export const bio: BioSegment[] = [
  { type: "text", value: "I'm a " },
  { type: "keyword", value: "Bachelor of Science in Information Technology" },
  { type: "text", value: " student at WMSU, currently a " },
  { type: "keyword", value: "Web Developer Intern" },
  { type: "text", value: " at Nexzys Intelligence." },
  { type: "secret", value: " (Most days I'm convincing TypeScript I know what I'm doing.)" },
  // ...the user authors the rest
];
```

The plain-string `bio` field is replaced by this structured array. Any consumer that previously read `personalInfo.bio` as a string is updated to either join the segments back into plain text (e.g. for SEO / metadata) or to consume the structured form (for the About component).

A helper `bioAsPlainText(bio: BioSegment[]): string` lives in `src/lib/bio.ts` and returns all segments concatenated with secrets included — used by the JSON-LD script in `layout.tsx` and any meta description.

### Component

`src/components/shared/highlight-reveal.tsx`:

```tsx
interface Props {
  segments: BioSegment[];
}

export function HighlightReveal({ segments }: Props) {
  return (
    <p className="leading-relaxed text-[0.95rem]">
      {segments.map((seg, i) => {
        if (seg.type === "text") return <span key={i}>{seg.value}</span>;
        if (seg.type === "keyword")
          return <span key={i} className="hr-keyword">{seg.value}</span>;
        return <span key={i} className="hr-secret">{seg.value}</span>;
      })}
    </p>
  );
}
```

CSS in `globals.css`:

```css
.hr-keyword { color: var(--alarm); }
.hr-secret  { color: var(--paper); }   /* invisible until selected */

@media print {
  .hr-secret { color: var(--ink); }
}
```

Global `::selection` rule already handles reveal — no JS, no listeners, no `prefers-reduced-motion` branch needed.

### Affordance

`// select to reveal hidden notes` caption above the paragraph, 0.7rem mono, muted. Subtle tell.

### Accessibility

- Secret content is **not** hidden from screen readers — it's read normally because the text is in the DOM with only a color rule masking it visually. Selection-based reveal is a sighted-user enhancement; assistive tech gets the full bio by default. This is the desired behavior.
- Keyboard users can still select via Shift+Arrow or Cmd/Ctrl+A. The trick is not mouse-locked.

---

## Section 4 — Files affected

### New files

```
src/components/terminal/terminal-frame.tsx
src/components/terminal/ascii-divider.tsx
src/components/terminal/terminal-button.tsx
src/components/terminal/terminal-input.tsx
src/components/terminal/key-value.tsx
src/components/sections/hero-terminal.tsx
src/components/sections/uptime-line.tsx
src/components/sections/about-terminal.tsx
src/components/sections/stack-tree.tsx
src/components/sections/experience-log.tsx
src/components/sections/education-block.tsx
src/components/sections/certifications-list.tsx
src/components/sections/projects-log.tsx
src/components/sections/contact-terminal.tsx
src/components/shared/highlight-reveal.tsx
src/lib/bio.ts
```

### Modified

```
src/data/personal.ts                          (bio: string → BioSegment[])
src/app/globals.css                           (tokens, ::selection, kill old keyframes)
src/app/layout.tsx                            (drop blob atmosphere, JSON-LD reads bioAsPlainText)
src/app/page.tsx                              (compose new sections)
src/app/resume/page.tsx                       (restyle + print stylesheet)
src/components/layout/portfolio-chrome.tsx    (replaced by terminal-frame)
```

Tailwind v4 theme tokens live inside `globals.css` `@theme` — no separate JS config. Sans/serif font variables stay registered (so `/adventure` keeps working) but the homepage and resume use mono only.

### Deleted (after migration verified)

```
src/components/shared/bento-card.tsx
src/components/ui/animated-border.tsx
src/components/ui/magnetic-button.tsx
src/components/shared/magnetic-cta.tsx
src/components/shared/magnetic-photo.tsx
src/components/ui/spotlight.tsx
src/components/ui/cursor-follower.tsx
src/components/ui/grain-overlay.tsx
src/components/shared/animated-name.tsx
src/components/shared/stats-ribbon.tsx
src/components/shared/sticky-eyebrow.tsx
src/components/shared/eyebrow-label.tsx
src/components/layout/scroll-progress.tsx
src/components/layout/lenis-provider.tsx
src/components/shared/section-heading.tsx
src/components/shared/tech-ticker.tsx
src/components/shared/experience-timeline.tsx
src/components/shared/project-list.tsx
src/components/shared/project-card.tsx
src/components/shared/redacted-text.tsx
```

Each deletion is gated on a final grep across `src/` (excluding `src/app/adventure/**` and any adventure-only components) to confirm no remaining importers. If `/adventure` imports any of the above, that file is **kept** and only the homepage stops importing it.

### Untouched

- All of `src/app/adventure/**`.
- Adventure-only components, providers, hooks, data, public assets.
- `src/data/projects.ts`, `src/data/experience.ts`, `src/data/education.ts`, `src/data/tech-stack.ts` (only `personal.ts` `bio` changes shape; an optional `version?` field is added to tech-stack item type).

---

## Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| `bio` shape change breaks consumers (SEO, metadata, meta description) | `bioAsPlainText()` helper used wherever a string is required; verified by grep before merging. |
| GitHub calendar library colors override our tokens | Override via CSS custom property mapping in `globals.css`; smoke-test in both themes. |
| Adventure mode unintentionally affected by global CSS changes | New `globals.css` rules are scoped to `body:not(.adventure-route)` where ambiguity exists; `/adventure` route adds the class via its layout. Grep test confirms no shared class names. |
| Print stylesheet renders inconsistently across browsers | Test in Chrome and Firefox (Safari best-effort); document any unavoidable divergence in the resume page comments. |
| Deleting `magnetic-photo` etc. breaks adventure | Each deletion preceded by `grep "magnetic-photo"` across repo; if adventure uses it, file stays and only homepage stops importing. |
| Highlight-reveal looks broken on touch devices | Long-press still triggers selection on iOS/Android; verified manually. Caption explicitly says "select", not "drag". |

---

## Implementation order (high level — full plan goes in writing-plans skill)

1. Token + chrome foundation (globals.css, terminal-frame, ascii-divider).
2. Data layer change (`bio` → `BioSegment[]`, `bioAsPlainText`, optional `version?` on tech-stack).
3. Shared terminal primitives (button, input, key-value).
4. About + HighlightReveal (the signature interaction — verify before building rest).
5. Hero, stats line, stack tree.
6. Experience log, education block, certifications list.
7. Projects log (replaces just-created `project-list.tsx`).
8. Contact terminal form (preserves existing submit logic).
9. Resume page redesign + print stylesheet.
10. Cleanup pass: delete superseded files (gated on grep), verify `/adventure` untouched, run build.
