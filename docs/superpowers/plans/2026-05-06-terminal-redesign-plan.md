# Terminal/Dev Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the bento-card homepage and resume page with a strict terminal/dev aesthetic in muted black-and-white, preserving a highlight-to-reveal mechanic in the About paragraph. `/adventure` route is untouched.

**Architecture:** New `src/components/terminal/*` primitives (frame, divider, button, input, key-value) compose with `src/components/sections/*` page-section components. Tokens move to `--paper / --ink / --muted-fg / --alarm` in `globals.css`. Bio data shape changes from `string[]` to `BioSegment[][]` to support visible/keyword/secret span types. Selection-based CSS reveal — no JS for the reveal mechanic.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4 (`@theme inline` in globals.css), `next-themes`.

---

## Spec reference

Full design spec: `docs/superpowers/specs/2026-05-06-terminal-redesign-design.md`. Re-read it before each phase.

## Conventions for every task

- Run `pnpm tsc --noEmit` after each task that changes TypeScript files.
- Run `pnpm dev` and visually verify the affected page once per phase (not per task).
- Commit at the end of each task with a `feat:` / `refactor:` / `chore:` prefix.
- Never edit `src/app/adventure/**`. Before any deletion, run a grep gate (Task 0.1) and confirm no adventure importer.
- Tests are scoped to behavioral logic only (`HighlightReveal` segment renderer and `bioAsPlainText` helper). Visual sections are verified manually in `pnpm dev`. If `vitest` is not configured, skip the test steps and remove the test file with `git rm`.

---

## Phase 0 — Foundation safety checks

### Task 0.1: Confirm /adventure has no dependencies on deletion candidates

**Files:**
- Read-only verification

- [ ] **Step 1: Run grep gate**

```bash
grep -rE "magnetic|spotlight|grain|cursor-follower|animated-border|bento|stats-ribbon|sticky-eyebrow|eyebrow-label|scroll-progress|lenis|section-heading|tech-ticker|experience-timeline|project-card|project-list|redacted-text|animated-name" src/app/adventure || echo "CLEAN"
```

Expected: `CLEAN`

- [ ] **Step 2: List all adventure-only imports**

```bash
grep -rh "^import" src/app/adventure | sort -u
```

Expected: imports of `next`, `react`, `framer-motion`, `@react-three/fiber`, `lottie-react`, `@/data/adventure*` and similar — no shared portfolio components.

- [ ] **Step 3: Record the audit**

Write `docs/superpowers/plans/.adventure-audit-2026-05-06.txt` with the grep outputs.

```bash
git add docs/superpowers/plans/.adventure-audit-2026-05-06.txt
git commit -m "chore: record /adventure dependency audit before terminal redesign"
```

### Task 0.2: Create a working branch

- [ ] **Step 1: Branch off main**

```bash
git checkout -b feat/terminal-redesign
```

- [ ] **Step 2: Push the branch**

```bash
git push -u origin feat/terminal-redesign
```

---

## Phase 1 — Tokens & global CSS

### Task 1.1: Add new tokens (additive)

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Append the new tokens to the existing `:root` block**

```css
  /* Terminal redesign tokens (paper / ink / alarm) */
  --paper: #f4f2ed;
  --ink: #1a1a1a;
  --muted-fg: rgba(26, 26, 26, 0.55);
  --alarm: #c0392b;
```

Append to the existing `.dark` block:

```css
  --paper: #1a1a1a;
  --ink: #e8e4dc;
  --muted-fg: rgba(232, 228, 220, 0.55);
  --alarm: #e74c3c;
```

- [ ] **Step 2: Add global selection rule and reveal classes**

Append at the bottom of `globals.css`:

```css
::selection {
  background: var(--ink);
  color: var(--paper);
}

.hr-keyword { color: var(--alarm); }
.hr-secret  { color: var(--paper); }

@media print {
  .hr-secret { color: var(--ink); }
}
```

- [ ] **Step 3: Verify**

Run: `pnpm dev`
Expected: server starts, existing pages still render with the old palette (no consumer switched yet).

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(css): add terminal redesign tokens, selection rule, reveal classes"
```

### Task 1.2: Add a body class hook for terminal aesthetic

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Append the body rule**

```css
body.terminal-route {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-mono), ui-monospace, monospace;
}

body.terminal-route a:hover { text-decoration: underline; text-underline-offset: 0.18em; }

@keyframes blink {
  0%, 50% { opacity: 1; }
  50.01%, 100% { opacity: 0; }
}
```

The class is applied later in Task 8.1. `/adventure` does not opt in.

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(css): add .terminal-route body class and blink keyframe"
```

---

## Phase 2 — Data layer migration

### Task 2.1: Migrate `bio` from `string[]` to `BioSegment[][]`

**Files:**
- Modify: `src/data/personal.ts`

- [ ] **Step 1: Replace contents**

```ts
export type BioSegment =
  | { type: "text"; value: string }
  | { type: "keyword"; value: string }
  | { type: "secret"; value: string };

export type Bio = BioSegment[][];

export const personalInfo = {
  name: "Aziz Tebbeng",
  headline: "Aspiring Full-Stack Developer & ML Enthusiast",
  headlines: [
    "Full-Stack Developer",
    "ML Enthusiast",
    "Professional Bug Creator",
    "Powered by Caffeine ☕",
  ],
  status: {
    label: "Available for opportunities",
  },
  location: "Zamboanga City, Philippines",
  bio: [
    [
      { type: "text", value: "I am a fourth-year " },
      { type: "keyword", value: "Bachelor of Science in Information Technology" },
      { type: "text", value: " student with a strong passion for web development and machine learning. I am currently completing my " },
      { type: "keyword", value: "internship at Nexzys Intelligence" },
      { type: "text", value: " under Vintazk Outsourcing, where I contribute to building full-stack digital solutions for local government systems." },
      { type: "secret", value: " (Translation: I write SQL on Mondays and pretend I understood it by Friday.)" },
    ],
    [
      { type: "text", value: "As the Machine Learning Engineer for our " },
      { type: "keyword", value: "Capstone Project" },
      { type: "text", value: ", " },
      { type: "keyword", value: "FishFresh" },
      { type: "text", value: ", I developed the computer vision model for real-time fish freshness assessment. I am also actively working on " },
      { type: "keyword", value: "Barangay Connect" },
      { type: "text", value: ", a comprehensive digital barangay system. I am driven by the goal of creating technology that delivers meaningful impact to communities." },
      { type: "secret", value: " (Also driven by 3 cups of coffee and a slowly degrading sleep schedule.)" },
    ],
  ] satisfies Bio,
  email: "aziztebbeng@gmail.com",
  socialLinks: {
    github: "https://github.com/mrclumster",
    linkedin: "https://www.linkedin.com/in/aziztebbengthemrclumster/",
    facebook: "https://www.facebook.com/goyyyyyy/",
    instagram: "https://www.instagram.com/aziztebbeng_/",
  },
  profileImage: "/images/profile.jpg",
} as const;
```

(Secret/keyword content is a working baseline. The user authors the final tone later.)

- [ ] **Step 2: Type-check**

Run: `pnpm tsc --noEmit`
Expected: errors only at sites that consumed `bio` as `string[]`. Note them — fixed in 2.4.

- [ ] **Step 3: Commit**

```bash
git add src/data/personal.ts
git commit -m "refactor(data): migrate bio from string[] to BioSegment[][]"
```

### Task 2.2: Add `bioAsPlainText` helper

**Files:**
- Create: `src/lib/bio.ts`
- Test: `src/lib/bio.test.ts` (skip if vitest absent)

- [ ] **Step 1: Test**

`src/lib/bio.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { bioAsPlainText } from "./bio";
import type { Bio } from "@/data/personal";

describe("bioAsPlainText", () => {
  it("joins segments and paragraphs", () => {
    const bio: Bio = [
      [
        { type: "text", value: "I am a " },
        { type: "keyword", value: "BSIT student" },
        { type: "text", value: "." },
      ],
      [
        { type: "text", value: "I built " },
        { type: "keyword", value: "FishFresh" },
        { type: "secret", value: " (with caffeine)" },
        { type: "text", value: "." },
      ],
    ];
    expect(bioAsPlainText(bio)).toBe("I am a BSIT student.\n\nI built FishFresh (with caffeine).");
  });

  it("returns empty for empty bio", () => {
    expect(bioAsPlainText([])).toBe("");
  });
});
```

- [ ] **Step 2: Run failing test**

Run: `pnpm vitest run src/lib/bio.test.ts`
Expected: FAIL — module missing. (If vitest is not installed, run `git rm src/lib/bio.test.ts` and skip to step 3.)

- [ ] **Step 3: Implement**

`src/lib/bio.ts`:

```ts
import type { Bio } from "@/data/personal";

export function bioAsPlainText(bio: Bio): string {
  return bio
    .map((paragraph) => paragraph.map((seg) => seg.value).join(""))
    .join("\n\n");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/lib/bio.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/bio.ts src/lib/bio.test.ts
git commit -m "feat(lib): add bioAsPlainText helper"
```

### Task 2.3: Add optional `version?` to `TechItem`

**Files:**
- Modify: `src/data/tech-stack.ts`

- [ ] **Step 1: Extend the type**

Replace the `TechItem` type in `src/data/tech-stack.ts`:

```ts
export type TechItem = {
  name: string;
  color: string;
  version?: string;
};
```

- [ ] **Step 2: Type-check**

Run: `pnpm tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/data/tech-stack.ts
git commit -m "refactor(data): add optional version field to TechItem"
```

### Task 2.4: Route legacy `bio` consumers through `bioAsPlainText`

**Files:**
- Modify: every file that did `personalInfo.bio.join` or treated `bio` as a string.

- [ ] **Step 1: Find consumers**

```bash
grep -rn "personalInfo.bio" src/
```

- [ ] **Step 2: For each consumer that expects a string**

Replace `personalInfo.bio.join("\n\n")` (or similar) with `bioAsPlainText(personalInfo.bio)` and add the import: `import { bioAsPlainText } from "@/lib/bio";`. Consumers that map paragraphs to JSX (`personalInfo.bio.map(p => <p>{p}</p>)`) get rewritten in their own task (Phase 4 / 9 — those are page-level, replaced wholesale).

- [ ] **Step 3: Type-check**

Run: `pnpm tsc --noEmit`
Expected: zero `bio`-related errors remaining outside files that get fully rewritten in Phases 4–9.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: route legacy bio consumers through bioAsPlainText"
```

---

## Phase 3 — Terminal primitives

### Task 3.1: `<TerminalFrame>`

**Files:**
- Create: `src/components/terminal/terminal-frame.tsx`

- [ ] **Step 1: Create**

```tsx
"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface TerminalFrameProps {
  prompt?: string;
  children: React.ReactNode;
}

const NAV = [
  { href: "/#about", label: "about" },
  { href: "/#projects", label: "work" },
  { href: "/#contact", label: "contact" },
  { href: "/resume", label: "resume" },
];

export function TerminalFrame({ prompt = "cat index.md", children }: TerminalFrameProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = mounted ? resolvedTheme : "light";
  const next = current === "dark" ? "light" : "dark";

  return (
    <>
      <header className="sticky top-0 z-30 flex items-baseline justify-between gap-6 border-b border-[color:var(--ink)] bg-[color:var(--paper)] px-4 py-2 text-[12px] sm:px-6 lg:px-8">
        <span className="truncate">
          <span className="opacity-70">aziz@portfolio</span>
          <span className="opacity-50">:~ %</span>
          <span className="ml-2">{prompt}</span>
        </span>
        <nav className="flex items-center gap-3 sm:gap-5">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:underline underline-offset-4">
              {n.label}
            </Link>
          ))}
          <button type="button" onClick={() => setTheme(next)} className="hover:underline underline-offset-4" aria-label="Toggle color theme">
            [{mounted ? current : "…"}]
          </button>
        </nav>
      </header>

      {children}

      <footer className="mt-24 border-t border-[color:var(--ink)] px-4 py-3 text-[12px] sm:px-6 lg:px-8">
        <span className="opacity-70">aziz@portfolio</span>
        <span className="opacity-50">:~ %</span>
        <span className="ml-2 inline-block w-[0.6em] animate-[blink_1s_steps(2,end)_infinite] bg-[color:var(--ink)] align-[-0.1em] h-[1em]" />
      </footer>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/terminal/terminal-frame.tsx
git commit -m "feat(terminal): add TerminalFrame chrome"
```

### Task 3.2: `<AsciiDivider>`

**Files:**
- Create: `src/components/terminal/ascii-divider.tsx`

- [ ] **Step 1: Create**

```tsx
interface AsciiDividerProps {
  number?: string;
  label: string;
  className?: string;
}

export function AsciiDivider({ number, label, className }: AsciiDividerProps) {
  return (
    <h2
      className={`flex items-center gap-3 text-[12px] uppercase tracking-[0.08em] font-semibold ${className ?? ""}`.trim()}
      style={{ color: "var(--ink)" }}
    >
      <span aria-hidden>──</span>
      <span>
        {number ? <span className="opacity-60">{number} / </span> : null}
        {label}
      </span>
      <span aria-hidden className="flex-1 border-t border-[color:var(--ink)]" />
    </h2>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/terminal/ascii-divider.tsx
git commit -m "feat(terminal): add AsciiDivider"
```

### Task 3.3: `<TerminalButton>`

**Files:**
- Create: `src/components/terminal/terminal-button.tsx`

- [ ] **Step 1: Create**

```tsx
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Common = { children: ReactNode; className?: string };
type AnchorProps = Common & { href: string } & Omit<ComponentProps<"a">, "href" | "className" | "children">;
type ButtonProps = Common & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

const baseClass =
  "inline-flex items-center gap-1 px-1 transition-[background-color,color] duration-150 " +
  "border border-transparent hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] " +
  "focus-visible:outline-none focus-visible:bg-[color:var(--ink)] focus-visible:text-[color:var(--paper)]";

export function TerminalButton(props: AnchorProps | ButtonProps) {
  const { children, className } = props;
  const inner = (
    <>
      <span aria-hidden>[</span>
      <span>{children}</span>
      <span aria-hidden>]</span>
    </>
  );
  if ("href" in props && props.href) {
    const { href, ...rest } = props as AnchorProps;
    const cls = `${baseClass} ${className ?? ""}`.trim();
    if (href.startsWith("/") && !href.includes(".pdf")) {
      return (
        <Link href={href} className={cls} {...(rest as ComponentProps<"a">)}>
          {inner}
        </Link>
      );
    }
    return (
      <a href={href} className={cls} {...(rest as ComponentProps<"a">)}>
        {inner}
      </a>
    );
  }
  const rest = props as ButtonProps;
  return (
    <button type="button" className={`${baseClass} ${className ?? ""}`.trim()} {...rest}>
      {inner}
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/terminal/terminal-button.tsx
git commit -m "feat(terminal): add TerminalButton"
```

### Task 3.4: `<KeyValueList>` and `<KeyValue>`

**Files:**
- Create: `src/components/terminal/key-value.tsx`

- [ ] **Step 1: Create**

```tsx
import type { ReactNode } from "react";

export function KeyValueList({ children }: { children: ReactNode }) {
  return <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-[14px]">{children}</dl>;
}

export function KeyValue({ k, children }: { k: string; children: ReactNode }) {
  return (
    <>
      <dt className="opacity-60">{k}:</dt>
      <dd>{children}</dd>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/terminal/key-value.tsx
git commit -m "feat(terminal): add KeyValue list primitives"
```

### Task 3.5: `<TerminalInput>`, `<TerminalTextarea>`, `<TerminalLabel>`

**Files:**
- Create: `src/components/terminal/terminal-input.tsx`

- [ ] **Step 1: Create**

```tsx
import type { ComponentProps } from "react";

const fieldBase =
  "w-full bg-transparent border-0 border-b border-[color:var(--ink)]/40 " +
  "px-0 py-2 text-[14px] font-mono text-[color:var(--ink)] " +
  "placeholder:text-[color:var(--ink)]/40 outline-none focus:border-[color:var(--ink)]";

export function TerminalInput(props: ComponentProps<"input">) {
  const { className, ...rest } = props;
  return <input className={`${fieldBase} ${className ?? ""}`.trim()} {...rest} />;
}

export function TerminalTextarea(props: ComponentProps<"textarea">) {
  const { className, ...rest } = props;
  return <textarea className={`${fieldBase} resize-none ${className ?? ""}`.trim()} rows={4} {...rest} />;
}

export function TerminalLabel({ children }: { children: React.ReactNode }) {
  return <span className="block text-[11px] uppercase tracking-[0.08em] opacity-60 mb-1">{children}</span>;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/terminal/terminal-input.tsx
git commit -m "feat(terminal): add TerminalInput, TerminalTextarea, TerminalLabel"
```

---

## Phase 4 — Highlight-reveal & About section

### Task 4.1: `<HighlightReveal>` paragraph component

**Files:**
- Create: `src/components/shared/highlight-reveal.tsx`
- Test: `src/components/shared/highlight-reveal.test.tsx` (skip if vitest absent)

- [ ] **Step 1: Test**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { HighlightReveal } from "./highlight-reveal";

describe("HighlightReveal", () => {
  it("renders text without classes, keywords with hr-keyword, secrets with hr-secret", () => {
    const { container } = render(
      <HighlightReveal
        paragraph={[
          { type: "text", value: "I am a " },
          { type: "keyword", value: "BSIT" },
          { type: "text", value: " student" },
          { type: "secret", value: " (caffeinated)" },
          { type: "text", value: "." },
        ]}
      />,
    );
    expect(container.innerHTML).toContain('class="hr-keyword">BSIT');
    expect(container.innerHTML).toContain('class="hr-secret"> (caffeinated)');
    expect(container.textContent).toBe("I am a BSIT student (caffeinated).");
  });
});
```

- [ ] **Step 2: Run failing test**

Run: `pnpm vitest run src/components/shared/highlight-reveal.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

```tsx
import type { BioSegment } from "@/data/personal";

interface Props {
  paragraph: BioSegment[];
  className?: string;
}

export function HighlightReveal({ paragraph, className }: Props) {
  return (
    <p className={`leading-relaxed text-[15px] ${className ?? ""}`.trim()}>
      {paragraph.map((seg, i) => {
        if (seg.type === "text") return <span key={i}>{seg.value}</span>;
        if (seg.type === "keyword") return <span key={i} className="hr-keyword">{seg.value}</span>;
        return <span key={i} className="hr-secret">{seg.value}</span>;
      })}
    </p>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/components/shared/highlight-reveal.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/highlight-reveal.tsx src/components/shared/highlight-reveal.test.tsx
git commit -m "feat: add HighlightReveal segment renderer"
```

### Task 4.2: `<AboutTerminal>` section

**Files:**
- Create: `src/components/sections/about-terminal.tsx`

- [ ] **Step 1: Create**

```tsx
import { personalInfo } from "@/data/personal";
import { AsciiDivider } from "@/components/terminal/ascii-divider";
import { HighlightReveal } from "@/components/shared/highlight-reveal";
import { GithubCalendarClient } from "@/components/shared/github-calendar-client";

export function AboutTerminal() {
  return (
    <section id="about" aria-labelledby="about-heading" className="space-y-4">
      <AsciiDivider number="02" label="about" />
      <p className="text-[11px] opacity-50">// select to reveal hidden notes</p>
      <div className="space-y-4">
        {personalInfo.bio.map((paragraph, i) => (
          <HighlightReveal key={i} paragraph={paragraph} />
        ))}
      </div>
      <div className="overflow-x-auto pt-4">
        <GithubCalendarClient />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/about-terminal.tsx
git commit -m "feat(sections): add AboutTerminal"
```

### Task 4.3: Sandbox-verify the About section

**Files:**
- Create (throwaway): `src/app/sandbox/about/page.tsx`

- [ ] **Step 1: Create the sandbox page**

```tsx
import { AboutTerminal } from "@/components/sections/about-terminal";

export default function SandboxAbout() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12" style={{ background: "var(--paper)", color: "var(--ink)" }}>
      <AboutTerminal />
    </main>
  );
}
```

- [ ] **Step 2: Verify in browser**

Run: `pnpm dev` and open `http://localhost:3000/sandbox/about`.
Expected:
  - Bio renders with red keywords visible.
  - Secret spans invisible by default.
  - Drag-selecting reveals secrets in inverted colors.
  - Toggle `.dark` on `<html>` via DevTools to verify dark inversion.

- [ ] **Step 3: Commit**

```bash
git add src/app/sandbox/about/page.tsx
git commit -m "chore: throwaway sandbox to verify highlight-reveal"
```

---

## Phase 5 — Hero, stats, stack tree

### Task 5.1: `<HeroTerminal>`

**Files:**
- Create: `src/components/sections/hero-terminal.tsx`

- [ ] **Step 1: Create**

```tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { personalInfo } from "@/data/personal";
import { useTypingLoop } from "@/hooks/use-typing";
import { TerminalButton } from "@/components/terminal/terminal-button";
import { KeyValue, KeyValueList } from "@/components/terminal/key-value";
import { GithubIcon, LinkedinIcon } from "@/components/shared/icons";

export function HeroTerminal() {
  const { displayText: headline } = useTypingLoop(personalInfo.headlines, {
    typeSpeed: 55,
    deleteSpeed: 30,
    holdAfterType: 1600,
    holdAfterDelete: 250,
    startDelay: 500,
  });
  const [now, setNow] = useState("");
  useEffect(() => {
    setNow(new Date().toISOString().slice(0, 10));
  }, []);

  return (
    <section aria-labelledby="hero-heading" className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_5fr] lg:items-start">
      <div className="space-y-5">
        <div>
          <p className="text-[12px] opacity-60">$ whoami</p>
          <h1 id="hero-heading" className="font-bold leading-[1.05] tracking-[-0.02em]" style={{ fontSize: "clamp(2.5rem, 1.8rem + 3vw, 4.25rem)" }}>
            {personalInfo.name}
          </h1>
        </div>

        <div>
          <p className="text-[12px] opacity-60">$ cat ~/headline.txt</p>
          <p className="text-[18px]">
            <span aria-hidden>{"> "}</span>
            <span>{headline}</span>
            <span className="ml-0.5 inline-block w-[0.55em] h-[1em] align-[-0.1em] bg-[color:var(--ink)] animate-[blink_1s_steps(2,end)_infinite]" />
          </p>
        </div>

        <KeyValueList>
          <KeyValue k="location">{personalInfo.location}</KeyValue>
          <KeyValue k="email">
            <a href={`mailto:${personalInfo.email}`} className="hover:underline underline-offset-4">{personalInfo.email}</a>
          </KeyValue>
          <KeyValue k="status">{personalInfo.status.label}</KeyValue>
          {now && <KeyValue k="last-build">{now}</KeyValue>}
        </KeyValueList>

        <div className="flex flex-wrap gap-3 pt-3 text-[14px]">
          <TerminalButton href="#projects">view_work</TerminalButton>
          <TerminalButton href="/resume">resume.pdf</TerminalButton>
          {personalInfo.socialLinks.github && (
            <TerminalButton href={personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer">
              <GithubIcon className="h-3.5 w-3.5" /> github
            </TerminalButton>
          )}
          {personalInfo.socialLinks.linkedin && (
            <TerminalButton href={personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedinIcon className="h-3.5 w-3.5" /> linkedin
            </TerminalButton>
          )}
        </div>
      </div>

      <div className="border border-[color:var(--ink)]">
        <Image
          src={personalInfo.profileImage}
          alt={personalInfo.name}
          width={520}
          height={680}
          priority
          className="block w-full h-auto"
          style={{ filter: "grayscale(1) contrast(1.05)" }}
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/hero-terminal.tsx
git commit -m "feat(sections): add HeroTerminal"
```

### Task 5.2: `<UptimeLine>`

**Files:**
- Create: `src/components/sections/uptime-line.tsx`

- [ ] **Step 1: Create**

```tsx
import { projects } from "@/data/projects";
import { techStack } from "@/data/tech-stack";
import { experiences } from "@/data/experience";
import { certifications } from "@/data/education";

export function UptimeLine() {
  const techCount = techStack.reduce((acc, cat) => acc + cat.items.length, 0);
  const parts = [
    `${projects.length} projects`,
    `${techCount} technologies`,
    `${experiences.length} internship${experiences.length === 1 ? "" : "s"}`,
    `${certifications.length} certifications`,
  ];
  return (
    <p className="text-[13px] opacity-70">
      <span className="opacity-50">uptime ──</span> {parts.join(" · ")}
    </p>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/uptime-line.tsx
git commit -m "feat(sections): add UptimeLine"
```

### Task 5.3: `<StackTree>`

**Files:**
- Create: `src/components/sections/stack-tree.tsx`

- [ ] **Step 1: Create**

```tsx
import { techStack } from "@/data/tech-stack";

function categoryDir(name: string) {
  return name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function StackTree() {
  return (
    <div className="font-mono text-[13px] leading-[1.6]">
      <p className="opacity-60 mb-2">$ ls -la ~/stack</p>
      <div className="space-y-3">
        {techStack.map((cat) => (
          <div key={cat.category}>
            <p>
              <span className="opacity-60">drwxr-xr-x</span>{" "}
              <span>{categoryDir(cat.category)}/</span>
            </p>
            <ul className="ml-4 grid grid-cols-[max-content_1fr] gap-x-4">
              {cat.items.map((item, idx) => {
                const isLast = idx === cat.items.length - 1;
                return (
                  <li key={item.name} className="contents">
                    <span className="opacity-50">{isLast ? "└──" : "├──"}</span>
                    <span>
                      {item.name}
                      {item.version ? <span className="opacity-50 ml-3">{item.version}</span> : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/stack-tree.tsx
git commit -m "feat(sections): add StackTree"
```

---

## Phase 6 — Experience, education, certifications

### Task 6.1: `<ExperienceLog>`

**Files:**
- Create: `src/components/sections/experience-log.tsx`

- [ ] **Step 1: Create**

```tsx
import { experiences, type Experience } from "@/data/experience";

function shortHash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(16).padStart(7, "0").slice(0, 7);
}

function ExperienceEntry({ entry, index, total }: { entry: Experience; index: number; total: number }) {
  const head = index === 0;
  return (
    <article className="space-y-1 text-[13px] leading-[1.6]">
      <p>
        <span className="opacity-60">commit </span>
        <span>{shortHash(entry.title + entry.company)}</span>
        {head ? <span className="ml-2 opacity-60">(HEAD -&gt; current)</span> : null}
        {!head && index === total - 1 ? <span className="ml-2 opacity-60">(initial)</span> : null}
      </p>
      <p>
        <span className="opacity-60">Author: </span>
        {entry.companyUrl ? (
          <a href={entry.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
            {entry.company}
          </a>
        ) : (
          entry.company
        )}
      </p>
      <p>
        <span className="opacity-60">Date:   </span>
        {entry.period}
      </p>
      <p className="pt-2 pl-4 font-semibold">{entry.title}</p>
      <p className="pl-4 opacity-80">{entry.description}</p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="pl-4 list-none space-y-0.5">
          {entry.highlights.map((h, i) => (
            <li key={i}>
              <span className="opacity-60">- </span>
              {h}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function ExperienceLog() {
  return (
    <div className="space-y-6">
      <p className="opacity-60 text-[12px]">$ git log --oneline-ish ~/career</p>
      {experiences.map((entry, i) => (
        <ExperienceEntry key={i} entry={entry} index={i} total={experiences.length} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/experience-log.tsx
git commit -m "feat(sections): add ExperienceLog"
```

### Task 6.2: `<EducationBlock>`

**Files:**
- Create: `src/components/sections/education-block.tsx`

- [ ] **Step 1: Create**

```tsx
import { education } from "@/data/education";

export function EducationBlock() {
  return (
    <div className="space-y-4 text-[13px] leading-[1.6]">
      <p className="opacity-60 text-[12px]">$ cat ~/education.txt</p>
      <ul className="space-y-3">
        {education.map((edu, i) => (
          <li key={i}>
            <p className="font-semibold">{edu.degree}</p>
            <p className="opacity-80">{edu.school}</p>
            <p className="opacity-60 text-[12px]">{edu.period}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/education-block.tsx
git commit -m "feat(sections): add EducationBlock"
```

### Task 6.3: `<CertificationsList>`

**Files:**
- Create: `src/components/sections/certifications-list.tsx`

- [ ] **Step 1: Create**

```tsx
"use client";

import { certifications, type Certification } from "@/data/education";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import { ExternalLink } from "lucide-react";

function slug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".pdf";
}

function Row({ cert }: { cert: Certification }) {
  return (
    <Modal>
      <ModalTrigger className="grid w-full grid-cols-[max-content_1fr_max-content] gap-4 text-left text-[13px] py-1 hover:bg-[color:var(--ink)]/5 transition-colors">
        <span className="opacity-60">-rw-r--r--</span>
        <span className="truncate">{slug(cert.title)}</span>
        <span className="opacity-60">{cert.year}</span>
      </ModalTrigger>
      <ModalContent className="max-w-2xl">
        <div className="flex items-center gap-3 pr-8">
          {cert.icon ? <span className="text-2xl">{cert.icon}</span> : null}
          <div>
            <ModalTitle>{cert.title}</ModalTitle>
            <ModalDescription>{cert.issuer} · {cert.year}</ModalDescription>
          </div>
        </div>
        {cert.pdfUrl ? (
          <div className="mt-4">
            <iframe src={cert.pdfUrl} className="w-full h-[60vh] border border-[color:var(--ink)]" title={cert.title} />
            <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 hover:underline underline-offset-4 text-[13px]">
              <ExternalLink className="h-3.5 w-3.5" />
              Open PDF in New Tab
            </a>
          </div>
        ) : (
          <p className="mt-4 text-[13px] opacity-70">Certificate document not available for preview.</p>
        )}
      </ModalContent>
    </Modal>
  );
}

export function CertificationsList() {
  return (
    <div className="space-y-2">
      <p className="opacity-60 text-[12px]">$ ls cert/</p>
      <div className="divide-y divide-[color:var(--ink)]/15">
        {certifications.map((c) => (
          <Row key={c.title} cert={c} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/certifications-list.tsx
git commit -m "feat(sections): add CertificationsList"
```

---

## Phase 7 — Selected work & contact

### Task 7.1: `<ProjectsLog>`

**Files:**
- Create: `src/components/sections/projects-log.tsx`

- [ ] **Step 1: Confirm Project type**

```bash
grep -n "export" src/data/projects.ts | head -20
```

Used fields: `title`, `description`, `tags: string[]`, `image?: string`, `icon?: string`, `githubUrl?: string`, `liveUrl?: string`. Don't add new required fields.

- [ ] **Step 2: Create**

```tsx
"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import { GithubIcon } from "@/components/shared/icons";
import { TerminalButton } from "@/components/terminal/terminal-button";
import { KeyValue, KeyValueList } from "@/components/terminal/key-value";
import { AsciiDivider } from "@/components/terminal/ascii-divider";
import type { Project } from "@/data/projects";

interface Props {
  projects: Project[];
}

export function ProjectsLog({ projects }: Props) {
  if (projects.length === 0) return null;
  return (
    <div className="space-y-10">
      {projects.map((p, i) => {
        const idx = String(i + 1).padStart(2, "0");
        return (
          <article key={p.title} className="space-y-3">
            <AsciiDivider label={`project_${idx} — ${p.title.toLowerCase().replace(/\s+/g, "_")}`} />
            <KeyValueList>
              <KeyValue k="name">{p.title}</KeyValue>
              <KeyValue k="stack">{p.tags.join(" · ")}</KeyValue>
              <KeyValue k="desc">{p.description}</KeyValue>
              <KeyValue k="links">
                <span className="inline-flex flex-wrap gap-3">
                  {p.githubUrl && (
                    <TerminalButton href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                      <GithubIcon className="h-3.5 w-3.5" /> github
                    </TerminalButton>
                  )}
                  {p.liveUrl && (
                    <TerminalButton href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" /> demo
                    </TerminalButton>
                  )}
                </span>
              </KeyValue>
            </KeyValueList>
            <Modal>
              <ModalTrigger className="block w-full max-w-xl border border-[color:var(--ink)] cursor-pointer hover:bg-[color:var(--ink)]/5 transition-colors">
                {p.image ? (
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={p.image}
                      alt={`${p.title} preview`}
                      fill
                      sizes="(min-width: 1024px) 540px, 100vw"
                      className="object-cover"
                      style={{ filter: "grayscale(1) contrast(1.05)" }}
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] flex items-center justify-center text-3xl">{p.icon ?? "·"}</div>
                )}
              </ModalTrigger>
              <ModalContent>
                <ModalTitle>{p.title}</ModalTitle>
                <ModalDescription className="sr-only">Details about {p.title}</ModalDescription>
                <div className="mt-4 space-y-4 text-[14px]">
                  <p className="opacity-80">{p.description}</p>
                  <p className="opacity-60 text-[12px]">stack: {p.tags.join(" · ")}</p>
                </div>
              </ModalContent>
            </Modal>
          </article>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/projects-log.tsx
git commit -m "feat(sections): add ProjectsLog (replaces ProjectList/ProjectCard)"
```

### Task 7.2: `<ContactTerminal>` form

**Files:**
- Create: `src/components/sections/contact-terminal.tsx`

- [ ] **Step 1: Create**

```tsx
"use client";

import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { TerminalInput, TerminalTextarea, TerminalLabel } from "@/components/terminal/terminal-input";
import { TerminalButton } from "@/components/terminal/terminal-button";

const LIMITS = { name: 80, email: 120, message: 500 };
const MIN_MESSAGE = 10;

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ContactTerminal() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  function handleChange(field: keyof typeof formData, value: string) {
    if (value.length > LIMITS[field]) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleBlur(field: keyof typeof formData) {
    const errs: FieldErrors = {};
    if (field === "name" && !formData.name.trim()) errs.name = "Name is required";
    if (field === "email") {
      if (!formData.email.trim()) errs.email = "Email is required";
      else if (!validateEmail(formData.email)) errs.email = "Email looks invalid";
    }
    if (field === "message") {
      if (!formData.message.trim()) errs.message = "Message is required";
      else if (formData.message.trim().length < MIN_MESSAGE) errs.message = `At least ${MIN_MESSAGE} characters`;
    }
    setFieldErrors((prev) => ({ ...prev, ...errs }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs: FieldErrors = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!validateEmail(formData.email)) errs.email = "Email looks invalid";
    if (!formData.message.trim()) errs.message = "Message is required";
    else if (formData.message.trim().length < MIN_MESSAGE) errs.message = `At least ${MIN_MESSAGE} characters`;
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(data?.error ?? "Something went wrong");
        setStatus("error");
        return;
      }
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      const rect = submitBtnRef.current?.getBoundingClientRect();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: rect
          ? { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight }
          : undefined,
        colors: ["#1a1a1a", "#c0392b", "#f4f2ed"],
      });
    } catch {
      setServerError("Network error");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl text-[14px]">
      <p className="opacity-60 text-[12px]">$ contact --send</p>

      <div>
        <TerminalLabel>from / name</TerminalLabel>
        <TerminalInput
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          placeholder="your name"
        />
        {fieldErrors.name && <p className="text-[12px] mt-1 text-[color:var(--alarm)]">{fieldErrors.name}</p>}
      </div>

      <div>
        <TerminalLabel>email</TerminalLabel>
        <TerminalInput
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          placeholder="you@domain.com"
        />
        {fieldErrors.email && <p className="text-[12px] mt-1 text-[color:var(--alarm)]">{fieldErrors.email}</p>}
      </div>

      <div>
        <TerminalLabel>message</TerminalLabel>
        <TerminalTextarea
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          placeholder="say something nice"
        />
        {fieldErrors.message && <p className="text-[12px] mt-1 text-[color:var(--alarm)]">{fieldErrors.message}</p>}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button ref={submitBtnRef} type="submit" disabled={status === "loading"} className="contents">
          <TerminalButton>{status === "loading" ? "submitting…" : "submit"}</TerminalButton>
        </button>
        {status === "success" && (
          <span className="inline-flex items-center gap-1 text-[12px]"><CheckCircle className="h-3.5 w-3.5" /> sent</span>
        )}
        {status === "error" && (
          <span className="inline-flex items-center gap-1 text-[12px] text-[color:var(--alarm)]">
            <AlertCircle className="h-3.5 w-3.5" /> {serverError || "failed"}
          </span>
        )}
        {status === "loading" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/contact-terminal.tsx
git commit -m "feat(sections): add ContactTerminal preserving submit logic"
```

---

## Phase 8 — Wire homepage

### Task 8.1: Rewrite `src/app/page.tsx` and adjust `src/app/layout.tsx`

**Files:**
- Modify: `src/app/page.tsx` (full rewrite)
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Rewrite `src/app/page.tsx`**

```tsx
import { TerminalFrame } from "@/components/terminal/terminal-frame";
import { AsciiDivider } from "@/components/terminal/ascii-divider";
import { HeroTerminal } from "@/components/sections/hero-terminal";
import { UptimeLine } from "@/components/sections/uptime-line";
import { AboutTerminal } from "@/components/sections/about-terminal";
import { StackTree } from "@/components/sections/stack-tree";
import { ExperienceLog } from "@/components/sections/experience-log";
import { EducationBlock } from "@/components/sections/education-block";
import { CertificationsList } from "@/components/sections/certifications-list";
import { ProjectsLog } from "@/components/sections/projects-log";
import { ContactTerminal } from "@/components/sections/contact-terminal";
import { projects } from "@/data/projects";

export default function Home() {
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <TerminalFrame prompt="cat index.md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-16">
        <AsciiDivider number="01" label="introduction" />
        <HeroTerminal />

        <UptimeLine />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <AboutTerminal />
          <section aria-labelledby="stack-heading" className="space-y-4">
            <AsciiDivider label="stack" />
            <StackTree />
          </section>
        </div>

        <section aria-labelledby="career-heading" className="space-y-4">
          <AsciiDivider number="03" label="career" />
          <ExperienceLog />
        </section>

        <section aria-labelledby="education-heading" className="space-y-4">
          <AsciiDivider label="education" />
          <EducationBlock />
        </section>

        <section aria-labelledby="certifications-heading" className="space-y-4">
          <AsciiDivider label="certifications" />
          <CertificationsList />
        </section>

        <section id="projects" aria-labelledby="projects-heading" className="space-y-6">
          <AsciiDivider number="04" label="selected_work" />
          <ProjectsLog projects={featuredProjects} />
        </section>

        <section id="contact" aria-labelledby="contact-heading" className="space-y-4">
          <AsciiDivider number="05" label="contact" />
          <ContactTerminal />
        </section>
      </div>
    </TerminalFrame>
  );
}
```

- [ ] **Step 2: Edit `src/app/layout.tsx`**

In `<body>`, change `className` to:

```tsx
<body className="min-h-full flex flex-col font-sans antialiased terminal-route">
```

Remove these classes if present: `bg-noise`, `bg-page-gradient`, `overflow-x-hidden`. Delete the entire `<div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">…blob atmosphere…</div>` block.

If `<PortfolioChrome>` wraps `{children}`, replace with `{children}` directly:

```tsx
<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
  <main className="flex-1">{children}</main>
  <Analytics />
</ThemeProvider>
```

- [ ] **Step 3: Type-check and run**

Run:
```bash
pnpm tsc --noEmit
pnpm dev
```

Open `http://localhost:3000`. Verify all sections render, About reveal works, theme toggle in chrome works, footer cursor blinks.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/app/layout.tsx
git commit -m "feat(home): wire homepage with TerminalFrame and terminal sections"
```

---

## Phase 9 — Resume page

### Task 9.1: Rewrite `src/app/resume/page.tsx` + add print button

**Files:**
- Modify: `src/app/resume/page.tsx`
- Create: `src/components/terminal/print-button.tsx`

- [ ] **Step 1: Create the client print button**

`src/components/terminal/print-button.tsx`:

```tsx
"use client";

import { TerminalButton } from "./terminal-button";

export function PrintButton() {
  return <TerminalButton onClick={() => window.print()}>print</TerminalButton>;
}
```

- [ ] **Step 2: Rewrite the resume page**

`src/app/resume/page.tsx`:

```tsx
import type { Metadata } from "next";
import { personalInfo } from "@/data/personal";
import { TerminalFrame } from "@/components/terminal/terminal-frame";
import { AsciiDivider } from "@/components/terminal/ascii-divider";
import { KeyValue, KeyValueList } from "@/components/terminal/key-value";
import { TerminalButton } from "@/components/terminal/terminal-button";
import { PrintButton } from "@/components/terminal/print-button";
import { ExperienceLog } from "@/components/sections/experience-log";
import { EducationBlock } from "@/components/sections/education-block";
import { CertificationsList } from "@/components/sections/certifications-list";
import { StackTree } from "@/components/sections/stack-tree";
import { HighlightReveal } from "@/components/shared/highlight-reveal";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${personalInfo.name} — ${personalInfo.headline}`,
};

export default function ResumePage() {
  return (
    <TerminalFrame prompt="less resume.txt">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 print:py-0 print:px-0 space-y-12">
        <header className="space-y-2">
          <h1 className="font-bold text-[clamp(2rem,1.4rem+2vw,3rem)] leading-[1.05] tracking-[-0.02em]">
            {personalInfo.name}
          </h1>
          <p className="opacity-70 text-[14px]">{personalInfo.headline}</p>
          <KeyValueList>
            <KeyValue k="email">
              <a href={`mailto:${personalInfo.email}`} className="hover:underline underline-offset-4">{personalInfo.email}</a>
            </KeyValue>
            <KeyValue k="location">{personalInfo.location}</KeyValue>
            {personalInfo.socialLinks.github && (
              <KeyValue k="github">
                <a href={personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
                  {personalInfo.socialLinks.github}
                </a>
              </KeyValue>
            )}
            {personalInfo.socialLinks.linkedin && (
              <KeyValue k="linkedin">
                <a href={personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
                  {personalInfo.socialLinks.linkedin}
                </a>
              </KeyValue>
            )}
          </KeyValueList>
          <div className="flex gap-3 pt-2 print:hidden">
            <TerminalButton href="/">back</TerminalButton>
            <PrintButton />
          </div>
        </header>

        <section>
          <AsciiDivider label="profile" />
          <div className="mt-4 space-y-3">
            {personalInfo.bio.map((paragraph, i) => (
              <HighlightReveal key={i} paragraph={paragraph} />
            ))}
          </div>
        </section>

        <section>
          <AsciiDivider label="experience" />
          <div className="mt-4">
            <ExperienceLog />
          </div>
        </section>

        <section>
          <AsciiDivider label="education" />
          <div className="mt-4">
            <EducationBlock />
          </div>
        </section>

        <section>
          <AsciiDivider label="skills" />
          <div className="mt-4">
            <StackTree />
          </div>
        </section>

        <section>
          <AsciiDivider label="certifications" />
          <div className="mt-4">
            <CertificationsList />
          </div>
        </section>
      </article>
    </TerminalFrame>
  );
}
```

- [ ] **Step 3: Add print stylesheet rules**

Append to `src/app/globals.css`:

```css
@media print {
  body.terminal-route {
    background: #fff;
    color: #000;
  }
  header, nav, footer { display: none !important; }
  .print\:hidden { display: none !important; }
  @page { margin: 0.6in; }
}
```

- [ ] **Step 4: Verify**

Run: `pnpm dev` → visit `/resume` → click `[ print ]` → verify print preview shows full bio (secrets visible because of the Phase 1 print rule).

- [ ] **Step 5: Commit**

```bash
git add src/app/resume/page.tsx src/components/terminal/print-button.tsx src/app/globals.css
git commit -m "feat(resume): wire resume page with TerminalFrame and print rules"
```

---

## Phase 10 — Cleanup

### Task 10.1: Audit removed-component importers

**Files:**
- Read-only

Candidate paths (deletion targets):

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
src/components/shared/contact-form.tsx
src/components/layout/portfolio-chrome.tsx
```

- [ ] **Step 1: Grep gate**

```bash
for f in bento-card animated-border magnetic-button magnetic-cta magnetic-photo spotlight cursor-follower grain-overlay animated-name stats-ribbon sticky-eyebrow eyebrow-label scroll-progress lenis-provider section-heading tech-ticker experience-timeline project-list project-card redacted-text contact-form portfolio-chrome; do
  echo "== $f =="
  grep -rn "$f" src --include="*.tsx" --include="*.ts" | grep -v "^src/components" || true
done
```

Expected: only `src/app/page.tsx` / `src/app/layout.tsx` / `src/app/resume/page.tsx` should appear, and they should NOT reference any of these names anymore. Anything found inside `src/app/adventure/**` means **stop**: keep that file, remove only the other importers.

### Task 10.2: Delete dead components

**Files:**
- Delete: each candidate file with no remaining importer

- [ ] **Step 1: Delete in one commit**

```bash
git rm \
  src/components/shared/bento-card.tsx \
  src/components/ui/animated-border.tsx \
  src/components/ui/magnetic-button.tsx \
  src/components/shared/magnetic-cta.tsx \
  src/components/shared/magnetic-photo.tsx \
  src/components/ui/spotlight.tsx \
  src/components/ui/cursor-follower.tsx \
  src/components/ui/grain-overlay.tsx \
  src/components/shared/animated-name.tsx \
  src/components/shared/stats-ribbon.tsx \
  src/components/shared/sticky-eyebrow.tsx \
  src/components/shared/eyebrow-label.tsx \
  src/components/layout/scroll-progress.tsx \
  src/components/layout/lenis-provider.tsx \
  src/components/shared/section-heading.tsx \
  src/components/shared/tech-ticker.tsx \
  src/components/shared/experience-timeline.tsx \
  src/components/shared/project-list.tsx \
  src/components/shared/project-card.tsx \
  src/components/shared/redacted-text.tsx \
  src/components/shared/contact-form.tsx \
  src/components/layout/portfolio-chrome.tsx
```

- [ ] **Step 2: Type-check and build**

```bash
pnpm tsc --noEmit
pnpm build
```

Expected: green build.

- [ ] **Step 3: Click through every route**

Run: `pnpm dev` → visit `/`, `/resume`, `/adventure`. Confirm:
  - `/` and `/resume` use the new aesthetic.
  - `/adventure` is unchanged from main.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: delete components superseded by terminal redesign"
```

### Task 10.3: Remove the sandbox page

**Files:**
- Delete: `src/app/sandbox/`

- [ ] **Step 1: Delete and commit**

```bash
git rm -r src/app/sandbox
git commit -m "chore: drop highlight-reveal sandbox"
```

### Task 10.4: Drop orphaned dependencies

**Files:**
- Modify: `package.json` (only if grep below shows zero matches)

- [ ] **Step 1: Audit**

```bash
grep -rn "lenis\|gsap" src --include="*.tsx" --include="*.ts"
```

- [ ] **Step 2: For each name with zero matches, remove from `dependencies` in `package.json`**

Then:

```bash
pnpm install
pnpm build
```

Expected: green.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: drop dependencies orphaned by terminal redesign"
```

### Task 10.5: Final verification + PR

- [ ] **Step 1: Click-through**

Run: `pnpm dev`, verify `/`, `/resume` (including print preview), `/adventure` (untouched), theme toggle, About reveal in both modes.

- [ ] **Step 2: Lighthouse spot-check**

DevTools Lighthouse on `/`. Note LCP/CLS/INP. Targets: LCP < 2.5s, CLS < 0.1. Don't block on regressions; document in PR.

- [ ] **Step 3: Open PR**

```bash
gh pr create --title "Terminal/dev redesign of homepage and resume" --body "$(cat <<'EOF'
## Summary
- Replaces bento card system with a terminal-window aesthetic (paper/ink/alarm tokens, mono-only, ASCII dividers, key:value blocks, ls/git-log treatments).
- Adds highlight-to-reveal mechanic in the About paragraph (red keywords + invisible secret spans, revealed by native text selection).
- Migrates bio from string[] to BioSegment[][].
- Rewires /resume with a print-friendly stylesheet.
- /adventure untouched.

## Test plan
- [ ] Homepage renders all sections; selection reveals secrets; dark mode inverts cleanly.
- [ ] /resume prints without chrome; secrets visible in print.
- [ ] /adventure flows behave exactly as on main.
- [ ] pnpm build green.
- [ ] No console.log; no TS errors.
EOF
)"
```

---

## Self-review checklist

| Spec section | Implemented in |
| --- | --- |
| Tokens (`--paper`, `--ink`, `--muted-fg`, `--alarm`) | Task 1.1 |
| Body class for terminal aesthetic | Task 1.2, applied Task 8.1 |
| Hard borders / no radii / no blur | enforced inline per-component |
| Page chrome (top prompt, bottom blink) | Task 3.1, used in 8.1 / 9.1 |
| ASCII divider | Task 3.2, used in 8.1 / 9.1 / 7.1 |
| Selection rule + reveal classes | Task 1.1, consumed Task 4.1 |
| Motion budget (typing + blink only) | Tasks 5.1 + 3.1 |
| 01 Hero | Task 5.1 |
| Stats line | Task 5.2 |
| 02 About | Tasks 4.1, 4.2 |
| Stack tree | Task 5.3 |
| 03 Experience | Task 6.1 |
| 03 Education | Task 6.2 |
| 03 Certifications | Task 6.3 |
| 04 Selected work | Task 7.1 |
| 05 Contact | Task 7.2 |
| Resume page + print | Task 9.1 |
| BioSegment migration | Task 2.1 |
| `bioAsPlainText` helper | Task 2.2 |
| Optional `version?` on TechItem | Task 2.3 |
| Adventure-untouched gate | Tasks 0.1, 10.1 |
| Deletions | Task 10.2 |

No placeholders; every code block is paste-ready.

---

## Risks not eliminated by the plan

- The user must author the final keyword/secret content in `personalInfo.bio` after launch. Task 2.1 ships a baseline so the build is green; tone tuning is editorial.
- Lighthouse / CWV numbers are checked but not gated. Follow-up PR if a regression appears.
- `/api/contact` endpoint is preserved verbatim (Task 7.2 reuses existing logic) but not retested.
