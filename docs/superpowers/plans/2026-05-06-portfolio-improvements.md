# Portfolio Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the terminal portfolio with larger fonts, restored profile photo, removed shell prompts, restructured layout, redesigned projects/contact sections, and Three.js interactive 3D animations.

**Architecture:** Two sequential phases — Phase 1 is pure layout/content with no new dependencies; Phase 2 replaces Canvas 2D with Three.js (`@react-three/fiber` + `@react-three/drei`, already installed).

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, Three.js, @react-three/fiber, @react-three/drei

---

## PHASE 1 — Layout & Content

---

### Task 1: Increase Font Sizes Globally

**Files:**
- Modify: `src/app/globals.css` (lines ~27–29, ~body.terminal-route block)

- [ ] **Step 1: Find the terminal-route font-size rule**

Search for `terminal-route` in `src/app/globals.css` to find the current font-size clamp value.

Run: `grep -n "terminal-route" src/app/globals.css`

- [ ] **Step 2: Update `--text-body` token and `body.terminal-route` font-size**

In `src/app/globals.css`, change:
```css
/* BEFORE (around line 29): */
--text-body: clamp(1rem, 0.96rem + 0.2vw, 1.125rem);

/* AFTER: */
--text-body: clamp(1.0625rem, 1rem + 0.3vw, 1.25rem);
```

Also find and update `body.terminal-route` font-size. If it currently reads:
```css
body.terminal-route {
  font-size: clamp(0.9375rem, 0.9rem + 0.2vw, 1.0625rem);
```
Change it to:
```css
body.terminal-route {
  font-size: clamp(1rem, 0.96rem + 0.25vw, 1.125rem);
```

- [ ] **Step 3: Also bump the small inline `text-[13px]` and `text-[12px]` overrides**

These are scattered in section components. For now just update the global tokens — the component-level overrides will be addressed as each component is touched in later tasks.

- [ ] **Step 4: Start dev server and visually check**

Run: `npm run dev` (or `pnpm dev`)

Open `http://localhost:3000` — body text should feel noticeably larger. Verify no text overflows containers.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "style: increase global font sizes for readability"
```

---

### Task 2: Restore Profile Photo in Hero

**Files:**
- Modify: `src/components/sections/hero-terminal.tsx`

**Context:** The right column currently renders `<IcosahedronCanvas />` inside a bordered div (height 400). The profile photo is at `/images/profile.jpg` and referenced in `personalInfo.profileImage`. In Phase 2 this will become the texture for the Shattered Glass Portrait. For now restore it as a static image.

- [ ] **Step 1: Read the current hero-terminal.tsx right column**

The right column (around line 101–106) currently reads:
```tsx
{/* Right column — A: Icosahedron wireframe in place of photo */}
<div
  className="border border-[color:var(--ink)] overflow-hidden"
  style={{ height: 400 }}
>
  <IcosahedronCanvas />
</div>
```

- [ ] **Step 2: Replace IcosahedronCanvas with the profile photo**

Replace that block with:
```tsx
{/* Right column — profile photo (Phase 2: becomes ShatteredPortrait) */}
<div
  className="border border-[color:var(--ink)] overflow-hidden relative"
  style={{ height: 400 }}
>
  <Image
    src={personalInfo.profileImage}
    alt="Aziz Tebbeng"
    fill
    sizes="(min-width: 1024px) 400px, 100vw"
    className="object-cover object-top grayscale"
    priority
  />
</div>
```

- [ ] **Step 3: Add Image import at the top of the file**

The file already imports from `"next/image"` via `projects-log.tsx` — but `hero-terminal.tsx` may not. Add if missing:
```tsx
import Image from "next/image";
```

Also add `personalInfo` import if not already present (it is — line 4).

- [ ] **Step 4: Remove the IcosahedronCanvas import**

Find and delete the import line:
```tsx
import { IcosahedronCanvas } from "@/components/hero/icosahedron-canvas";
```

(Leave the file `icosahedron-canvas.tsx` in place — Phase 2 will replace it.)

- [ ] **Step 5: Verify in browser**

Photo should appear in the right column, grayscale, cropped to the top (face visible).

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/hero-terminal.tsx
git commit -m "feat: restore profile photo in hero right column"
```

---

### Task 3: Remove Shell Prompts from All Sections

**Files:**
- Modify: `src/components/sections/stack-tree.tsx`
- Modify: `src/components/sections/experience-log.tsx`
- Modify: `src/components/sections/education-block.tsx`
- Modify: `src/components/sections/certifications-list.tsx`

**Context:** Each section has a fake CLI prompt line like `<p className="opacity-60 text-[12px]">$ ls -la ~/stack</p>`. Remove them all. The `AsciiDivider` labels in `page.tsx` already provide section context — no replacement needed inside the components.

- [ ] **Step 1: Remove prompt from stack-tree.tsx**

In `src/components/sections/stack-tree.tsx`, delete line 10:
```tsx
<p className="opacity-60 mb-2">$ ls -la ~/stack</p>
```

- [ ] **Step 2: Remove prompt from experience-log.tsx**

In `src/components/sections/experience-log.tsx`, delete line 54:
```tsx
<p className="opacity-60 text-[12px]">$ git log --oneline-ish ~/career</p>
```

- [ ] **Step 3: Remove prompt from education-block.tsx**

In `src/components/sections/education-block.tsx`, delete line 6:
```tsx
<p className="opacity-60 text-[12px]">$ cat ~/education.txt</p>
```

- [ ] **Step 4: Remove prompt from certifications-list.tsx**

In `src/components/sections/certifications-list.tsx`, delete line 52:
```tsx
<p className="opacity-60 text-[12px]">$ ls cert/</p>
```

- [ ] **Step 5: Verify in browser — no prompts visible in any section**

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/stack-tree.tsx src/components/sections/experience-log.tsx src/components/sections/education-block.tsx src/components/sections/certifications-list.tsx
git commit -m "style: remove shell prompt labels from all sections"
```

---

### Task 4: Restructure Page Layout — Career + Education + Certifications Grid

**Files:**
- Modify: `src/app/page.tsx`

**Context:** Currently ExperienceLog, EducationBlock, and CertificationsList are three full-width stacked sections. New layout: left column has ExperienceLog + EducationBlock stacked, right column has CertificationsList.

- [ ] **Step 1: Read the current page.tsx layout section (lines 33–46)**

Current structure:
```tsx
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
```

- [ ] **Step 2: Replace those three sections with the new grid structure**

```tsx
<div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12">
  {/* Left column: career then education stacked */}
  <div className="space-y-10">
    <section aria-labelledby="career-heading" className="space-y-4">
      <AsciiDivider number="03" label="career" />
      <ExperienceLog />
    </section>
    <section aria-labelledby="education-heading" className="space-y-4">
      <AsciiDivider label="education" />
      <EducationBlock />
    </section>
  </div>

  {/* Right column: certifications */}
  <section aria-labelledby="certifications-heading" className="space-y-4">
    <AsciiDivider label="certifications" />
    <CertificationsList />
  </section>
</div>
```

- [ ] **Step 3: Verify in browser at both mobile and desktop widths**

At `lg` (1024px+): two columns. Below: single column, career/education then certifications.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: restructure career/education/certifications into two-column grid"
```

---

### Task 5: Redesign Selected Work (ProjectsLog)

**Files:**
- Modify: `src/components/sections/projects-log.tsx`

**Context:** Replace the current AsciiDivider-per-project + KeyValueList + Modal pattern with card-based layout. Each card: project number, title, tech tags, description, action links, thumbnail image (grayscale → color on hover). No modal. 2-col grid on desktop.

- [ ] **Step 1: Remove unused imports**

The new design doesn't use `Modal`, `ModalTrigger`, `ModalContent`, `ModalTitle`, `ModalDescription`, `KeyValue`, `KeyValueList`, or `AsciiDivider`. Remove those imports. Keep `Image`, `ExternalLink`, `GithubIcon`, `TerminalButton`, and `Project`.

- [ ] **Step 2: Write the new ProjectsLog component**

Replace the entire component with:

```tsx
"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";
import { TerminalButton } from "@/components/terminal/terminal-button";
import type { Project } from "@/data/projects";

interface Props {
  projects: Project[];
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <article className="border border-[color:var(--ink)] flex flex-col group">
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[color:var(--ink)]/5">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            sizes="(min-width: 1024px) 480px, 100vw"
            className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">
            {project.icon ?? "·"}
          </div>
        )}
        <span className="absolute top-2 left-2 font-mono text-[11px] opacity-50 bg-[color:var(--paper)] px-1">
          [{num}]
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-bold text-[1rem] leading-tight">{project.title}</h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] border border-[color:var(--ink)]/40 px-1.5 py-0.5 opacity-70"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-[0.875rem] opacity-75 leading-relaxed flex-1">{project.description}</p>

        {/* Links */}
        <div className="flex flex-wrap gap-2 pt-1">
          {project.githubUrl && (
            <TerminalButton href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <GithubIcon className="h-3.5 w-3.5" /> source_code
            </TerminalButton>
          )}
          {project.liveUrl && (
            <TerminalButton href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" /> view_demo
            </TerminalButton>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProjectsLog({ projects }: Props) {
  if (projects.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((p, i) => (
        <ProjectCard key={p.title} project={p} index={i} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Verify in browser**

Cards should show at 1-col mobile, 2-col desktop. Thumbnail grayscale, color on hover. Tags as pills. Action buttons at the bottom.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/projects-log.tsx
git commit -m "feat: redesign selected work as card grid with hover color reveal"
```

---

### Task 6: Redesign Contact Section

**Files:**
- Modify: `src/components/sections/contact-terminal.tsx`

**Context:** Current: single-column form with `$ contact --send` prompt. New: two-column layout (info left, form right). Remove prompt. Keep confetti. Terminal-style inputs (border-bottom only). Send button full-width solid ink.

- [ ] **Step 1: Read personalInfo imports needed**

The component needs `personalInfo` for email and social links. Import it:
```tsx
import { personalInfo } from "@/data/personal";
import { GithubIcon, LinkedinIcon, FacebookIcon, InstagramIcon } from "@/components/shared/icons";
```

- [ ] **Step 2: Rewrite ContactTerminal**

Replace the return JSX (keep all the state, handlers, and validation logic — only change the markup):

```tsx
return (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
    {/* Left: contact info */}
    <div className="space-y-6 text-[0.9rem]">
      <p className="opacity-70 leading-relaxed">
        Have a project in mind or just want to say hi?<br />
        Let&apos;s build something together.
      </p>

      <div className="space-y-2">
        <p className="font-mono text-[11px] opacity-50 uppercase tracking-widest">email</p>
        <a
          href={`mailto:${personalInfo.email}`}
          className="font-mono hover:underline underline-offset-4 break-all"
        >
          {personalInfo.email}
        </a>
      </div>

      <div className="space-y-3">
        <p className="font-mono text-[11px] opacity-50 uppercase tracking-widest">links</p>
        <div className="flex flex-wrap gap-2">
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
          {personalInfo.socialLinks.facebook && (
            <TerminalButton href={personalInfo.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
              <FacebookIcon className="h-3.5 w-3.5" /> facebook
            </TerminalButton>
          )}
          {personalInfo.socialLinks.instagram && (
            <TerminalButton href={personalInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
              <InstagramIcon className="h-3.5 w-3.5" /> instagram
            </TerminalButton>
          )}
        </div>
      </div>
    </div>

    {/* Right: form */}
    <form onSubmit={handleSubmit} className="space-y-4 text-[0.9rem]">
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

      <div className="space-y-2 pt-2">
        <button
          ref={submitBtnRef}
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-[color:var(--ink)] text-[color:var(--paper)] font-mono py-2.5 text-[0.875rem] hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === "loading" ? "submitting…" : "[send_message]"}
        </button>
        {status === "success" && (
          <span className="inline-flex items-center gap-1 text-[12px]"><CheckCircle className="h-3.5 w-3.5" /> message sent</span>
        )}
        {status === "error" && (
          <span className="inline-flex items-center gap-1 text-[12px] text-[color:var(--alarm)]">
            <AlertCircle className="h-3.5 w-3.5" /> {serverError || "failed"}
          </span>
        )}
      </div>
    </form>
  </div>
);
```

- [ ] **Step 3: Remove the Loader2 import if no longer used**

The new design removes the spinning loader inline. Remove `Loader2` from the lucide import if unused.

- [ ] **Step 4: Verify in browser — two columns on desktop, stacked on mobile. Confetti still fires on success.**

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/contact-terminal.tsx
git commit -m "feat: redesign contact section with two-column layout"
```

---

## PHASE 2 — Three.js Animations

> Before starting Phase 2, confirm: profile photo visible in hero from Phase 1? If not, fix Task 2 first.

---

### Task 7: Remove FloatingName Component

**Files:**
- Modify: `src/components/sections/hero-terminal.tsx`
- (Leave `src/components/hero/floating-name.tsx` in place for now — delete after confirming nothing else imports it)

**Context:** The FloatingName canvas drew "AZIZ" in 3D extruded text at height 130 in the left column. Now that the name appears in the `<h1>`, this is redundant.

- [ ] **Step 1: Remove FloatingName from hero-terminal.tsx**

In `src/components/sections/hero-terminal.tsx`, find and delete:
```tsx
{/* D — Floating AZIZ name: above the text identity */}
<div className="w-full" style={{ height: 130 }}>
  <FloatingName />
</div>
```

Also remove the import:
```tsx
import { FloatingName } from "@/components/hero/floating-name";
```

- [ ] **Step 2: Verify in browser — left column content shifts up, no gap where the canvas was.**

- [ ] **Step 3: Check nothing else imports FloatingName**

Run: `grep -r "FloatingName" src/`

If nothing else imports it, delete the file:
```bash
# PowerShell:
Remove-Item src/components/hero/floating-name.tsx
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/hero-terminal.tsx
git commit -m "feat: remove floating name canvas — name shown in h1"
```

---

### Task 8: Replace ParticleConstellation with Three.js

**Files:**
- Modify: `src/components/hero/particle-constellation.tsx` (full rewrite)

**Context:** Current implementation uses Canvas 2D with 65 particles, mouse repulsion (REPEL_DIST=90, REPEL_FORCE=0.18), and line connections within CONNECT_DIST=100. Rewrite to use `@react-three/fiber`. The canvas is `absolute inset-0 pointer-events-auto` inside the hero section.

- [ ] **Step 1: Read the existing constants**

From the current file:
- COUNT = 65
- CONNECT_DIST = 100
- REPEL_DIST = 90  
- REPEL_FORCE = 0.18

- [ ] **Step 2: Rewrite particle-constellation.tsx**

```tsx
"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 65;
const CONNECT_DIST = 2.0;
const REPEL_DIST = 1.5;
const REPEL_FORCE = 0.003;

function getInkColor() {
  return document.documentElement.classList.contains("dark")
    ? new THREE.Color(0xe8e4dc)
    : new THREE.Color(0x1a1a1a);
}

type ParticleData = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
};

function Particles() {
  const { size } = useThree();
  const mouseRef = useRef(new THREE.Vector2(-999, -999));
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const colorRef = useRef(getInkColor());

  const particles = useMemo<ParticleData[]>(() =>
    Array.from({ length: COUNT }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        0
      ),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.008,
        0
      ),
    })), []);

  const posArray = useMemo(() => new Float32Array(COUNT * 3), []);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      mouseRef.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    }
    function onMouseLeave() {
      mouseRef.current.set(-999, -999);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  useFrame(() => {
    const aspect = size.width / size.height;
    const mx = mouseRef.current.x * 10 * aspect;
    const my = mouseRef.current.y * 5;
    const ink = getInkColor();
    colorRef.current = ink;

    particles.forEach((p, i) => {
      const dx = p.pos.x - mx;
      const dy = p.pos.y - my;
      const dist = Math.hypot(dx, dy);
      if (dist < REPEL_DIST && dist > 0) {
        p.vel.x += (dx / dist) * REPEL_FORCE;
        p.vel.y += (dy / dist) * REPEL_FORCE;
      }
      p.vel.multiplyScalar(0.98);
      p.pos.add(p.vel);
      const hw = 10 * aspect;
      const hh = 5;
      if (p.pos.x < -hw) p.pos.x = hw;
      if (p.pos.x > hw) p.pos.x = -hw;
      if (p.pos.y < -hh) p.pos.y = hh;
      if (p.pos.y > hh) p.pos.y = -hh;
      posArray[i * 3] = p.pos.x;
      posArray[i * 3 + 1] = p.pos.y;
      posArray[i * 3 + 2] = 0;
    });

    if (pointsRef.current) {
      (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute).set(posArray);
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      (pointsRef.current.material as THREE.PointsMaterial).color = ink;
    }

    // Build line segments
    const linePositions: number[] = [];
    const lineColors: number[] = [];
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const d = particles[i].pos.distanceTo(particles[j].pos);
        if (d < CONNECT_DIST) {
          const alpha = (1 - d / CONNECT_DIST) * 0.22;
          linePositions.push(particles[i].pos.x, particles[i].pos.y, 0);
          linePositions.push(particles[j].pos.x, particles[j].pos.y, 0);
          lineColors.push(ink.r, ink.g, ink.b, alpha, ink.r, ink.g, ink.b, alpha);
        }
      }
    }

    if (linesRef.current) {
      const geo = linesRef.current.geometry;
      geo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
      geo.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 4));
      geo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={posArray} itemSize={3} count={COUNT} />
        </bufferGeometry>
        <pointsMaterial size={0.06} vertexColors={false} color={colorRef.current} transparent opacity={0.65} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial vertexColors transparent />
      </lineSegments>
    </>
  );
}

export function ParticleConstellation() {
  return (
    <Canvas
      className="absolute inset-0 w-full h-full pointer-events-auto"
      aria-hidden
      camera={{ position: [0, 0, 8], fov: 60 }}
      gl={{ alpha: true, antialias: false }}
      style={{ background: "transparent" }}
    >
      <Particles />
    </Canvas>
  );
}
```

- [ ] **Step 3: Verify in browser — particles float, connect with lines, scatter from cursor.**

- [ ] **Step 4: Check for performance — particles should run at 60fps on desktop.**

- [ ] **Step 5: Commit**

```bash
git add src/components/hero/particle-constellation.tsx
git commit -m "feat: replace Canvas 2D particle constellation with Three.js"
```

---

### Task 9: Replace IcosahedronCanvas with Shattered Glass Portrait

**Files:**
- Create: `src/components/hero/shattered-portrait.tsx`
- Modify: `src/components/sections/hero-terminal.tsx`

**Context:** The right column now shows the static profile photo (from Task 2). Replace it with an interactive Three.js scene where the photo is fragmented into triangular glass shards. On hover: shards scatter. On mouse leave: reassemble.

- [ ] **Step 1: Create the shattered-portrait.tsx component**

```tsx
"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SHARD_ROWS = 8;
const SHARD_COLS = 6;

type Shard = {
  mesh: THREE.Mesh;
  originPos: THREE.Vector3;
  originRot: THREE.Euler;
  scatterPos: THREE.Vector3;
  scatterRot: THREE.Euler;
  t: number;
};

interface PortraitProps {
  imageSrc: string;
}

function ShardField({ imageSrc }: PortraitProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const shardsRef = useRef<Shard[]>([]);
  const scatteredRef = useRef(false);
  const progressRef = useRef(0);

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(imageSrc);
  }, [imageSrc]);

  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.clear();
    shardsRef.current = [];

    const w = 3.2;
    const h = 4.0;
    const sw = w / SHARD_COLS;
    const sh = h / SHARD_ROWS;

    for (let r = 0; r < SHARD_ROWS; r++) {
      for (let c = 0; c < SHARD_COLS; c++) {
        const u0 = c / SHARD_COLS;
        const u1 = (c + 1) / SHARD_COLS;
        const v0 = 1 - (r + 1) / SHARD_ROWS;
        const v1 = 1 - r / SHARD_ROWS;

        const cx = -w / 2 + sw * c + sw / 2;
        const cy = h / 2 - sh * r - sh / 2;

        // Two triangles per cell
        [[0, 0], [1, 0], [0, 1], [1, 0], [1, 1], [0, 1]].forEach((_, triIdx) => {
          if (triIdx % 3 !== 0) return; // only create once per triangle pair
        });

        // Triangle A (lower-left)
        const geoA = new THREE.BufferGeometry();
        const posA = new Float32Array([
          -sw / 2, -sh / 2, 0,
          sw / 2, -sh / 2, 0,
          -sw / 2, sh / 2, 0,
        ]);
        const uvA = new Float32Array([u0, v0, u1, v0, u0, v1]);
        geoA.setAttribute("position", new THREE.BufferAttribute(posA, 3));
        geoA.setAttribute("uv", new THREE.BufferAttribute(uvA, 2));
        geoA.computeVertexNormals();

        // Triangle B (upper-right)
        const geoB = new THREE.BufferGeometry();
        const posB = new Float32Array([
          sw / 2, -sh / 2, 0,
          sw / 2, sh / 2, 0,
          -sw / 2, sh / 2, 0,
        ]);
        const uvB = new Float32Array([u1, v0, u1, v1, u0, v1]);
        geoB.setAttribute("position", new THREE.BufferAttribute(posB, 3));
        geoB.setAttribute("uv", new THREE.BufferAttribute(uvB, 2));
        geoB.computeVertexNormals();

        const mat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

        [geoA, geoB].forEach((geo) => {
          const mesh = new THREE.Mesh(geo, mat);
          const jitter = (Math.random() - 0.5) * 0.02;
          mesh.position.set(cx + jitter, cy + jitter, (Math.random() - 0.5) * 0.05);
          const originPos = mesh.position.clone();
          const originRot = mesh.rotation.clone();
          const scatterPos = new THREE.Vector3(
            cx + (Math.random() - 0.5) * 3,
            cy + (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 2
          );
          const scatterRot = new THREE.Euler(
            (Math.random() - 0.5) * 1.2,
            (Math.random() - 0.5) * 1.2,
            (Math.random() - 0.5) * 0.8
          );
          groupRef.current.add(mesh);
          shardsRef.current.push({ mesh, originPos, originRot, scatterPos, scatterRot, t: Math.random() });
        });
      }
    }
  }, [texture]);

  useFrame((_, delta) => {
    const target = scatteredRef.current ? 1 : 0;
    progressRef.current += (target - progressRef.current) * Math.min(delta * 3, 1);
    const p = progressRef.current;

    shardsRef.current.forEach((s) => {
      s.mesh.position.lerpVectors(s.originPos, s.scatterPos, p);
      s.mesh.rotation.x = THREE.MathUtils.lerp(s.originRot.x, s.scatterRot.x, p);
      s.mesh.rotation.y = THREE.MathUtils.lerp(s.originRot.y, s.scatterRot.y, p);
      s.mesh.rotation.z = THREE.MathUtils.lerp(s.originRot.z, s.scatterRot.z, p);
    });
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={() => { scatteredRef.current = true; }}
      onPointerLeave={() => { scatteredRef.current = false; }}
    />
  );
}

interface ShatteredPortraitProps {
  imageSrc: string;
}

export function ShatteredPortrait({ imageSrc }: ShatteredPortraitProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <ambientLight intensity={1.2} />
      <ShardField imageSrc={imageSrc} />
    </Canvas>
  );
}
```

- [ ] **Step 2: Update hero-terminal.tsx to use ShatteredPortrait**

Replace the right column (now showing the static `<Image>`):
```tsx
{/* Right column — ShatteredPortrait: photo fragments on hover */}
<div
  className="border border-[color:var(--ink)] overflow-hidden relative"
  style={{ height: 400 }}
>
  <ShatteredPortrait imageSrc={personalInfo.profileImage} />
</div>
```

Add the import:
```tsx
import { ShatteredPortrait } from "@/components/hero/shattered-portrait";
```

Remove the `Image` import if no longer used elsewhere in the file.

- [ ] **Step 3: Verify in browser — photo displays as assembled portrait. Hover → shards scatter. Move away → reassemble.**

- [ ] **Step 4: Commit**

```bash
git add src/components/hero/shattered-portrait.tsx src/components/sections/hero-terminal.tsx
git commit -m "feat: replace icosahedron with Three.js shattered glass portrait"
```

---

### Task 10: Neural Network for Skills/Stack

**Files:**
- Create: `src/components/sections/neural-network.tsx`
- Modify: `src/components/sections/stack-tree.tsx`

**Context:** Add a Three.js neural network visualization above or replacing the directory-listing stack tree. Nodes = tech skills, edges = intra-category connections. Nodes glow on hover, show name label. Auto-connect nodes within the same category.

- [ ] **Step 1: Read the tech-stack data structure**

Run: `cat src/data/tech-stack.ts`

Note the shape — likely `{ category: string; items: { name: string; version?: string }[] }[]`.

- [ ] **Step 2: Create neural-network.tsx**

```tsx
"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { techStack } from "@/data/tech-stack";

type NodeData = {
  id: string;
  label: string;
  category: string;
  pos: THREE.Vector3;
};

type EdgeData = {
  a: number;
  b: number;
};

function buildGraph(): { nodes: NodeData[]; edges: EdgeData[] } {
  const nodes: NodeData[] = [];
  const edges: EdgeData[] = [];
  const catRadius = 3.5;
  const itemRadius = 1.2;
  const catCount = techStack.length;

  techStack.forEach((cat, ci) => {
    const catAngle = (ci / catCount) * Math.PI * 2;
    const catX = Math.cos(catAngle) * catRadius;
    const catY = Math.sin(catAngle) * catRadius;
    const catIdx = nodes.length;
    nodes.push({ id: `cat-${ci}`, label: cat.category, category: cat.category, pos: new THREE.Vector3(catX, catY, 0) });

    cat.items.forEach((item, ii) => {
      const itemAngle = catAngle + ((ii - cat.items.length / 2) / cat.items.length) * 1.2;
      const itemX = catX + Math.cos(itemAngle) * itemRadius;
      const itemY = catY + Math.sin(itemAngle) * itemRadius;
      const itemIdx = nodes.length;
      nodes.push({ id: `item-${ci}-${ii}`, label: item.name, category: cat.category, pos: new THREE.Vector3(itemX, itemY, (Math.random() - 0.5) * 0.5) });
      edges.push({ a: catIdx, b: itemIdx });
    });
  });

  return { nodes, edges };
}

function getInkHex() {
  return document.documentElement.classList.contains("dark") ? "#e8e4dc" : "#1a1a1a";
}

function NetworkScene() {
  const { nodes, edges } = useMemo(buildGraph, []);
  const hoveredRef = useRef<number | null>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const { camera } = useThree();

  useFrame(() => {
    // Gentle overall rotation
    camera.position.x = Math.sin(Date.now() * 0.0002) * 0.3;
    camera.lookAt(0, 0, 0);
  });

  const ink = getInkHex();

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />

      {/* Edges */}
      {edges.map((e, i) => {
        const a = nodes[e.a].pos;
        const b = nodes[e.b].pos;
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const dir = b.clone().sub(a);
        const len = dir.length();
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.normalize()
        );
        return (
          <mesh key={i} position={mid} quaternion={quat}>
            <cylinderGeometry args={[0.008, 0.008, len, 4]} />
            <meshBasicMaterial color={ink} transparent opacity={0.2} />
          </mesh>
        );
      })}

      {/* Nodes */}
      {nodes.map((n, i) => {
        const isCat = n.id.startsWith("cat-");
        const size = isCat ? 0.18 : 0.1;
        return (
          <group key={n.id} position={n.pos}>
            <mesh
              ref={(el) => { meshRefs.current[i] = el; }}
              onPointerEnter={() => { hoveredRef.current = i; }}
              onPointerLeave={() => { hoveredRef.current = null; }}
            >
              <sphereGeometry args={[size, 12, 12]} />
              <meshStandardMaterial
                color={ink}
                emissive={ink}
                emissiveIntensity={hoveredRef.current === i ? 0.8 : 0.1}
              />
            </mesh>
            <Text
              position={[0, size + 0.12, 0]}
              fontSize={isCat ? 0.14 : 0.1}
              color={ink}
              anchorX="center"
              anchorY="bottom"
              font="/fonts/CourierPrime-Regular.ttf"
            >
              {n.label}
            </Text>
          </group>
        );
      })}
    </>
  );
}

export function NeuralNetwork() {
  return (
    <div style={{ height: 400 }} className="w-full">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 55 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <NetworkScene />
      </Canvas>
    </div>
  );
}
```

**Note on font:** The `Text` component from drei needs a font file. Either:
- Use the default (no `font` prop) which uses `@react-three/drei`'s built-in font, OR
- Remove the `font` prop entirely (simplest — drei has a default)

Remove the `font` prop from `Text` components to use drei's default font.

- [ ] **Step 3: Update stack-tree.tsx to show the neural network above the tree**

In `src/components/sections/stack-tree.tsx`, add at the top of the returned JSX:
```tsx
import { NeuralNetwork } from "./neural-network";

// Inside the return div, before the directory listing:
<NeuralNetwork />
```

Full updated return:
```tsx
return (
  <div className="font-mono text-[13px] leading-[1.6] space-y-4">
    <NeuralNetwork />
    <div className="space-y-3">
      {techStack.map((cat) => (
        // ... existing category rendering unchanged
      ))}
    </div>
  </div>
);
```

- [ ] **Step 4: Verify in browser — 3D node graph renders above the text list. Nodes are interactive on hover.**

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/neural-network.tsx src/components/sections/stack-tree.tsx
git commit -m "feat: add Three.js neural network visualization to skills section"
```

---

### Task 11: 3D Card Tilt for Selected Work

**Files:**
- Modify: `src/components/sections/projects-log.tsx`

**Context:** Add CSS 3D tilt effect to project cards on mouse move. No Three.js needed — pure CSS `transform: perspective() rotateX() rotateY()` driven by mouse position relative to card. Spring back on mouse leave.

- [ ] **Step 1: Add a useTilt hook inline in projects-log.tsx**

Add this hook before the `ProjectCard` component:

```tsx
function useTilt() {
  const ref = useRef<HTMLElement>(null!);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg) scale(1.02)`;
    }

    function onLeave() {
      el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return ref;
}
```

- [ ] **Step 2: Apply tilt to ProjectCard**

Update `ProjectCard` to use the tilt ref:

```tsx
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const tiltRef = useTilt();
  // ... existing code ...
  return (
    <article
      ref={tiltRef as React.RefObject<HTMLElement>}
      className="border border-[color:var(--ink)] flex flex-col group transition-transform duration-200 ease-out"
      // ... rest unchanged
    >
```

- [ ] **Step 3: Add `useEffect` and `useRef` imports if not already present**

```tsx
import { useEffect, useRef } from "react";
```

Add `"use client";` at the top of the file if not already there.

- [ ] **Step 4: Verify in browser — cards tilt toward cursor on hover, spring back on leave.**

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/projects-log.tsx
git commit -m "feat: add 3D tilt effect to project cards"
```

---

### Task 12: Floating Origami Birds in Contact Section

**Files:**
- Create: `src/components/sections/origami-birds.tsx`
- Modify: `src/components/sections/contact-terminal.tsx`

**Context:** Add a Three.js scene with 6 low-poly paper crane silhouettes floating around the contact section background. Pointer-events none so form interaction is unaffected.

- [ ] **Step 1: Create origami-birds.tsx**

```tsx
"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BIRD_COUNT = 6;

function makeCraneGeometry(): THREE.BufferGeometry {
  // Simplified low-poly origami crane silhouette — 8 triangles
  const geo = new THREE.BufferGeometry();
  const verts = new Float32Array([
    // Body
    0, 0, 0,   0.4, 0.2, 0,   0.2, -0.1, 0,
    0, 0, 0,  -0.4, 0.2, 0,  -0.2, -0.1, 0,
    // Wings
    0.4, 0.2, 0,   0.8, 0.5, 0,   0.5, 0, 0,
   -0.4, 0.2, 0,  -0.8, 0.5, 0,  -0.5, 0, 0,
    // Tail
    0.2, -0.1, 0,   0.3, -0.5, 0,   0, -0.2, 0,
   -0.2, -0.1, 0,  -0.3, -0.5, 0,   0, -0.2, 0,
    // Head
    0.4, 0.2, 0,   0.6, 0.4, 0,   0.5, 0.15, 0,
   -0.4, 0.2, 0,  -0.6, 0.4, 0,  -0.5, 0.15, 0,
  ]);
  geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
  geo.computeVertexNormals();
  return geo;
}

type BirdState = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rot: THREE.Euler;
  rotVel: THREE.Euler;
  wingPhase: number;
  wingSpeed: number;
  scale: number;
};

function Birds() {
  const groupRef = useRef<THREE.Group>(null!);
  const birds = useMemo<BirdState[]>(() =>
    Array.from({ length: BIRD_COUNT }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 2
      ),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.004,
        0
      ),
      rot: new THREE.Euler(0, Math.random() * Math.PI * 2, Math.random() * 0.3),
      rotVel: new THREE.Euler(0, (Math.random() - 0.5) * 0.003, 0),
      wingPhase: Math.random() * Math.PI * 2,
      wingSpeed: 0.8 + Math.random() * 0.6,
      scale: 0.5 + Math.random() * 0.5,
    })), []);

  const geo = useMemo(makeCraneGeometry, []);

  const ink = document.documentElement.classList.contains("dark") ? "#e8e4dc" : "#1a1a1a";

  useFrame((_, delta) => {
    groupRef.current.children.forEach((child, i) => {
      const b = birds[i];
      b.pos.add(b.vel);
      b.rot.x += b.rotVel.x;
      b.rot.y += b.rotVel.y;
      b.wingPhase += delta * b.wingSpeed;

      const wrapH = 8;
      const wrapV = 4;
      if (b.pos.x > wrapH) b.pos.x = -wrapH;
      if (b.pos.x < -wrapH) b.pos.x = wrapH;
      if (b.pos.y > wrapV) b.pos.y = -wrapV;
      if (b.pos.y < -wrapV) b.pos.y = wrapV;

      child.position.copy(b.pos);
      child.rotation.copy(b.rot);
      child.rotation.z += Math.sin(b.wingPhase) * 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {birds.map((b, i) => (
        <mesh key={i} geometry={geo} scale={b.scale}>
          <meshBasicMaterial color={ink} side={THREE.DoubleSide} transparent opacity={0.18} />
        </mesh>
      ))}
    </group>
  );
}

export function OrigamiBirds() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      gl={{ alpha: true, antialias: false }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        background: "transparent",
      }}
    >
      <Birds />
    </Canvas>
  );
}
```

- [ ] **Step 2: Update contact-terminal.tsx to add origami birds**

At the top of the returned JSX in `ContactTerminal`, wrap everything in a `relative` div and add the birds:

```tsx
return (
  <div className="relative">
    <OrigamiBirds />
    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
      {/* ... existing contact content ... */}
    </div>
  </div>
);
```

Add import at top:
```tsx
import { OrigamiBirds } from "./origami-birds";
```

- [ ] **Step 3: Add `prefers-reduced-motion` guard in OrigamiBirds**

In `origami-birds.tsx`, before the Canvas return:
```tsx
const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (prefersReduced) return null;
```

- [ ] **Step 4: Verify in browser — faint paper crane shapes drift in background. Form is fully interactive. Motion is subtle.**

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/origami-birds.tsx src/components/sections/contact-terminal.tsx
git commit -m "feat: add Three.js floating origami birds to contact section"
```

---

## Post-Implementation Checklist

- [ ] All shell prompts removed (`$ git log`, `$ cat`, `$ ls`, `$ contact`)
- [ ] Profile photo visible in hero (Phase 1) OR shattered portrait active (Phase 2)
- [ ] Font sizes feel comfortable on desktop (~16–17px body)
- [ ] Career + Education stacked left, Certifications on right
- [ ] Project cards: 2-col grid, hover color reveal, tilt effect
- [ ] Contact: 2-col, info left / form right, origami birds in background
- [ ] Three.js: particles, shattered portrait, neural network, origami birds
- [ ] No console errors in browser
- [ ] No TypeScript errors: `pnpm tsc --noEmit`
- [ ] Build passes: `pnpm build`
