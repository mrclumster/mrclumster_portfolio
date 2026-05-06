# Portfolio Improvements Design Spec
**Date:** 2026-05-06  
**Status:** Approved — ready for implementation  
**Branch:** sub_branch

---

## Overview

A multi-part overhaul of the terminal-aesthetic portfolio covering font sizing, layout restructure, section redesigns, shell-prompt removal, and replacing all Canvas 2D "3D" effects with real Three.js interactive animations.

---

## Implementation Strategy: Option C — Sequential Phases

### Phase 1 — Layout & Content (no new dependencies)
### Phase 2 — Three.js Animations (new dependency: already installed)

---

## Phase 1: Layout & Content Changes

### 1.1 Font Sizes — Increase Globally

**File:** `src/app/globals.css`

Current values are still too small. Increase:
- `--text-body`: bump clamp minimum and maximum further up
- `body.terminal-route font-size`: bump both ends of the clamp
- Target: body text should feel comfortable at ~16–17px equivalent on desktop

### 1.2 Restore Profile Photo in Hero

**File:** `src/components/sections/hero-terminal.tsx`

The right column currently shows only `<IcosahedronCanvas />` inside a bordered div. The profile photo was removed when the icosahedron replaced it.

**Fix:** Restore the photo. In Phase 2, the photo becomes the texture source for the Shattered Glass Portrait effect (concept B). For Phase 1, just restore it as a static `<img>` or Next.js `<Image>` in the right column.

- Photo file: user must confirm path (likely `public/` folder — check `public/` for existing photo)
- Use `object-fit: cover`, full width/height of the right column container

### 1.3 Remove Shell Prompts — Replace with Code-Comment Labels

All fake CLI prompts (`$ whoami`, `$ cat ~/headline.txt`, `$ ls -la ~/stack`, `$ git log --oneline-ish`, `$ cat ~/education.txt`, `$ ls cert/`, `$ contact --send`) are removed.

**Replacement style:** code-comment section labels like:
```
// 03 career
// 04 selected_work
```

**Files to update:**
- `src/components/sections/stack-tree.tsx` — remove `$ ls -la ~/stack`
- `src/components/sections/experience-log.tsx` — remove `$ git log --oneline-ish ~/career`
- `src/components/sections/education-block.tsx` — remove `$ cat ~/education.txt`
- `src/components/sections/certifications-list.tsx` — remove `$ ls cert/`
- `src/components/sections/contact-terminal.tsx` — remove `$ contact --send`
- Hero typing headline — remove `> ` prefix if present

The `AsciiDivider` components in `page.tsx` already use `label="career"` etc. — keep those as-is. Only remove the per-section inline prompts inside each component.

### 1.4 Page Layout Restructure

**File:** `src/app/page.tsx`

**Current layout (relevant section):**
```
ExperienceLog       (full width)
EducationBlock      (full width)
CertificationsList  (full width)
```

**New layout:**
```
┌─────────────────────────┬──────────────────┐
│  ExperienceLog          │                  │
│  (stacked top-to-bottom)│  CertificationsList│
│  EducationBlock         │  (right column)  │
└─────────────────────────┴──────────────────┘
```

Implementation: wrap in a `grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8` div.
- Left column: `<ExperienceLog />` then `<EducationBlock />` stacked
- Right column: `<CertificationsList />`

Remove the individual `<section>` wrappers for education/certifications and nest them inside the new grid. Keep `AsciiDivider` labels for each.

### 1.5 Selected Work — Redesign Layout

**File:** `src/components/sections/projects-log.tsx`

**Current:** AsciiDivider per project + KeyValueList + grayscale image in Modal.

**New design:** Horizontal card layout — each project is a card with:
- Project number `[01]`, `[02]`, `[03]` in top-left corner (muted)
- Project name as large heading
- Tech stack tags in a row (pill style, using `--ink` border)
- Short description
- Two action links: `[view_demo]` and `[source_code]` styled as terminal buttons
- Thumbnail image — full-width at top of card, grayscale, hover reveals color
- Cards in a 1-col mobile / 2-col desktop grid
- No modal — links go directly to demo/source URLs

In Phase 2, cards get a 3D tilt effect (concept H).

### 1.6 Contact Section — Redesign

**File:** `src/components/sections/contact-terminal.tsx`

**Current:** Simple form (name/email/message) with confetti on success, `$ contact --send` prompt.

**New design:**
- Remove the `$ contact --send` prompt (already covered in 1.3)
- Two-column layout on desktop:
  - Left: contact info block — email (copyable), social links (GitHub, LinkedIn, Facebook, Instagram), a short "let's work together" line
  - Right: the form (name, email, message, send button)
- Keep the confetti on success (it's a nice touch)
- Form fields styled as terminal inputs: monospace font, `--ink` border bottom only (no box), label above each field
- Send button: full-width, solid `--ink` background, `--paper` text, `[send_message]` label

In Phase 2, floating origami birds (concept G) appear around this section.

---

## Phase 2: Three.js Animations

**Prerequisite:** `@react-three/fiber`, `@react-three/drei`, `three` already installed (confirmed — used in `/adventure`).

### 2.1 Replace FloatingName — remove entirely

`src/components/hero/floating-name.tsx` — delete the component and remove from `hero-terminal.tsx`. The name "AZIZ" is already shown as the `<h1>` heading. The canvas version is redundant once the photo is back.

### 2.2 Replace ParticleConstellation (Hero background)

**File:** `src/components/hero/particle-constellation.tsx` → replace with Three.js version

Keep the same behavior: particles floating, connecting with lines when close, repelling from mouse. But render in Three.js (`@react-three/fiber` Canvas) instead of Canvas 2D.

- Use `<Points>` or individual `<mesh>` spheres for particles
- Lines via `<Line>` from drei or custom `BufferGeometry`
- Mouse repulsion via `useFrame` + raycaster or pointer events
- Same COUNT=65, CONNECT_DIST, REPEL_DIST constants
- Respect `--ink` color variable (read from CSS or pass as prop)

### 2.3 Replace IcosahedronCanvas → Shattered Glass Portrait (concept B)

**File:** `src/components/hero/icosahedron-canvas.tsx` → replace with `ShatteredPortrait.tsx`

**Behavior:**
- Load user's profile photo as a Three.js texture
- Fragment it into ~60–80 triangular glass shards using Delaunay triangulation or a pre-computed mesh
- Shards float slightly apart (small random offsets on Z axis)
- On mouse hover/move: shards scatter further, rotate slightly — "shattering" effect
- On mouse leave: shards reassemble back to the portrait
- Subtle rim lighting / specular highlight on shard edges to sell the glass look
- Photo path: confirm with user (likely `public/photo.jpg` or similar)

**Libraries:** `three`, `@react-three/fiber`, `@react-three/drei` — no extra packages needed

### 2.4 Skills/Stack — Neural Network (concept E)

**Current:** `src/components/sections/stack-tree.tsx` — directory-listing style

**New:** Replace (or sit alongside) the text list with a Three.js neural network visualization

- Nodes = skills/technologies from `stackData`
- Edges = connections between related skills (define adjacency in data or auto-connect by category)
- Nodes glow on hover, show skill name in a label
- Animated pulse traveling along edges
- Floating slowly in 3D space, rotates gently
- Click a node: highlight all its connections
- Keep the text list accessible (visually hidden or shown on mobile where 3D is disabled)

**File:** new `src/components/hero/neural-network.tsx` (or `src/components/sections/neural-network.tsx`)

### 2.5 Selected Work — 3D Card Tilt (concept H)

**File:** `src/components/sections/projects-log.tsx` (built in Phase 1)

Add tilt effect to each project card:
- On mouse enter: card tilts toward cursor (CSS 3D transform + perspective, OR Three.js plane)
- Subtle specular highlight that moves with cursor
- On mouse leave: spring back to flat
- Implement with CSS `transform: perspective() rotateX() rotateY()` driven by mouse position — **no Three.js needed for this one** (pure CSS/JS is simpler and more performant for cards)

### 2.6 Contact — Floating Origami Birds (concept G)

**File:** `src/components/sections/contact-terminal.tsx`

Add a Three.js scene as the section background:
- 5–8 paper crane / origami bird meshes floating around the contact form
- Birds made from flat-shaded low-poly geometry (origami aesthetic fits the paper/terminal theme)
- Gentle flapping animation via morph targets or simple rotation
- Birds avoid the form area (stay to the edges/background)
- Pointer-events: none so form interaction is unaffected
- Reduce motion: skip animation if `prefers-reduced-motion`

---

## Files Summary

### Phase 1 files to edit
| File | Change |
|------|--------|
| `src/app/globals.css` | Increase font sizes |
| `src/app/page.tsx` | Layout restructure (career+edu+certs grid) |
| `src/components/sections/hero-terminal.tsx` | Restore photo in right column |
| `src/components/sections/stack-tree.tsx` | Remove shell prompt |
| `src/components/sections/experience-log.tsx` | Remove shell prompt |
| `src/components/sections/education-block.tsx` | Remove shell prompt |
| `src/components/sections/certifications-list.tsx` | Remove shell prompt |
| `src/components/sections/contact-terminal.tsx` | Remove prompt + full redesign |
| `src/components/sections/projects-log.tsx` | Full redesign |

### Phase 2 files to create/replace
| File | Change |
|------|--------|
| `src/components/hero/floating-name.tsx` | Delete |
| `src/components/hero/particle-constellation.tsx` | Replace with Three.js |
| `src/components/hero/icosahedron-canvas.tsx` | Replace with ShatteredPortrait |
| `src/components/hero/shattered-portrait.tsx` | New — Three.js glass shards |
| `src/components/sections/neural-network.tsx` | New — Three.js skill nodes |
| Contact section | Add Three.js origami birds background |

---

## Open Questions (resolve before Phase 2)

1. **Profile photo path** — What is the filename/path of your profile photo in `public/`? (needed for Phase 1.2 and Phase 2.3)
2. **Neural network data** — Should skill nodes auto-connect within the same category, or do you want to define connections manually in `src/data/`?

---

## How to Continue on Your Laptop

1. Pull the branch: `git pull origin sub_branch`
2. Open this spec: `docs/superpowers/specs/2026-05-06-portfolio-improvements-design.md`
3. Tell Claude: *"Continue from the portfolio improvements spec, start Phase 1"*
4. Claude will invoke the `writing-plans` skill to create a task list, then execute Phase 1

