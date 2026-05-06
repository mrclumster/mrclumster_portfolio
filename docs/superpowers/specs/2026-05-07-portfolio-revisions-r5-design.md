# Portfolio Revisions Round 5 Design Spec

**Date:** 2026-05-07
**Status:** Approved — ready for implementation
**Branch:** feat/terminal-redesign

---

## Overview

Replace the photo configurator with a Josh Comeau-style cursor-tracking row of ASCII eye-pairs sitting above a full-color photo.

---

## Hero Photo + Tracking Eyes

### Replaces
- `src/components/hero/photo-configurator.tsx` (delete)
- The right-column wrapper in `src/components/sections/hero-terminal.tsx`

### Visual layout
```
[ o o ]  [ o o ]  [ o o ]  [ o o ]  [ o o ]
┌─────────────────────────────────────────┐
│                                         │
│              [photo]                    │   ← full color
│                                         │
└─────────────────────────────────────────┘
```

Five small bracketed eye-pairs sit in a horizontal row ABOVE the photo. Each eye-pair has two pupils. As the mouse moves anywhere on the page, each pupil shifts position toward the cursor — like five tiny faces all looking at the visitor.

### Behavior
- Each eye is a fixed-size circle (e.g., 14×14px) with a small pupil (4×4px) inside it.
- The pupil position is computed from the angle between the eye's center (in viewport coordinates) and the mouse position.
- The pupil moves on a small radius inside the eye (e.g., 3px max offset from center).
- When the cursor is far away, all 10 pupils still point toward it. Same direction for all eyes? No — each eye computes its OWN angle since each is at a different position. That's the magic — closer eyes look more "extreme," far eyes look more centered.
- Smooth: bind `pointermove` once at window level, write `--mx`/`--my` CSS variables to the row container, OR use React state with `requestAnimationFrame` throttle. Either approach works.

### Sub-elements per eye-pair
Each eye-pair component:
- Outer bracket characters `[` and `]` rendered as monospace text
- Two `<div>` eyes between them (round white-ish dots with a darker pupil dot inside)
- Eyes are aligned with the bracket character heights

Visual:
```
 [    ●  ●    ]
   ↑       ↑
  eye 1   eye 2 (each tracks independently)
```

Brackets are pure text (`[` and `]`), eyes are positioned absolutely inside the bracket span.

### Component structure

`src/components/hero/cursor-eyes.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";

const EYE_COUNT = 5;
const PUPIL_MAX_OFFSET = 3; // px
const EYE_SIZE = 14; // px

export function CursorEyes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const eyeRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      eyeRefs.current.forEach((eye) => {
        if (!eye) return;
        const rect = eye.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const ratio = Math.min(1, dist / 200); // saturate after 200px
        const tx = (dx / (dist || 1)) * PUPIL_MAX_OFFSET * ratio;
        const ty = (dy / (dist || 1)) * PUPIL_MAX_OFFSET * ratio;
        const pupil = eye.querySelector(".pupil") as HTMLElement | null;
        if (pupil) {
          pupil.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
        }
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div ref={containerRef} className="flex justify-center gap-3 select-none" aria-hidden>
      {Array.from({ length: EYE_COUNT }).map((_, i) => (
        <div key={i} className="font-mono text-[14px] flex items-center gap-1.5" style={{ color: "var(--ink)" }}>
          <span>[</span>
          <span
            ref={(el) => { eyeRefs.current[i * 2] = el; }}
            className="relative inline-block"
            style={{
              width: EYE_SIZE,
              height: EYE_SIZE,
              border: "1px solid var(--ink)",
              borderRadius: "50%",
              background: "var(--paper)",
            }}
          >
            <span
              className="pupil absolute"
              style={{
                width: 4,
                height: 4,
                background: "var(--ink)",
                borderRadius: "50%",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </span>
          <span
            ref={(el) => { eyeRefs.current[i * 2 + 1] = el; }}
            className="relative inline-block"
            style={{
              width: EYE_SIZE,
              height: EYE_SIZE,
              border: "1px solid var(--ink)",
              borderRadius: "50%",
              background: "var(--paper)",
            }}
          >
            <span
              className="pupil absolute"
              style={{
                width: 4,
                height: 4,
                background: "var(--ink)",
                borderRadius: "50%",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </span>
          <span>]</span>
        </div>
      ))}
    </div>
  );
}
```

### Photo component

`src/components/hero/photo-frame.tsx` (new, replaces PhotoConfigurator):

```tsx
"use client";

import Image from "next/image";

interface Props {
  imageSrc: string;
}

export function PhotoFrame({ imageSrc }: Props) {
  return (
    <div className="photo-anim relative w-full h-full overflow-hidden border border-[color:var(--ink)]">
      <Image
        src={imageSrc}
        alt="Aziz Tebbeng"
        fill
        sizes="(min-width: 1024px) 400px, 100vw"
        className="object-cover object-top"
        priority
      />
    </div>
  );
}
```

Note: Photo is full color now. The `grayscale` class is removed. Border is back on the photo div directly (since the configurator-era box-shadow border is no longer the source of truth — the `photo-anim` keyframe still animates `box-shadow` for the breathing effect, which sits on top of the static border for a layered look).

### Hero file change

`src/components/sections/hero-terminal.tsx` right column:

```tsx
{/* Right column — cursor-tracking eyes + colored photo */}
<div className="flex flex-col gap-3" style={{ height: 400 }}>
  <CursorEyes />
  <div className="relative flex-1">
    <PhotoFrame imageSrc={personalInfo.profileImage} />
  </div>
</div>
```

Imports:
- Remove: `import { PhotoConfigurator } from "@/components/hero/photo-configurator";`
- Add: `import { CursorEyes } from "@/components/hero/cursor-eyes";`
- Add: `import { PhotoFrame } from "@/components/hero/photo-frame";`

### File deletions
- `src/components/hero/photo-configurator.tsx`

### File additions
- `src/components/hero/cursor-eyes.tsx`
- `src/components/hero/photo-frame.tsx`

---

## Files Summary

### Create
| File | Purpose |
|------|---------|
| `src/components/hero/cursor-eyes.tsx` | Row of 5 ASCII eye-pairs tracking cursor |
| `src/components/hero/photo-frame.tsx` | Full-color photo with float + breathe animations |

### Modify
| File | Change |
|------|--------|
| `src/components/sections/hero-terminal.tsx` | Use CursorEyes + PhotoFrame instead of PhotoConfigurator |

### Delete
| File | Reason |
|------|--------|
| `src/components/hero/photo-configurator.tsx` | Replaced by CursorEyes + PhotoFrame |

---

## Open Questions
None.
