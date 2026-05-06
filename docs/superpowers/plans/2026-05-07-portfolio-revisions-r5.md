# Portfolio Revisions Round 5 Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`).

**Goal:** Replace photo configurator with cursor-tracking ASCII eye-pairs + full-color photo.

**Tech Stack:** Next.js 15, React 19, TypeScript.

---

## Task 1: Cursor Eyes + Photo Frame

**Files:**
- Create: `src/components/hero/cursor-eyes.tsx`
- Create: `src/components/hero/photo-frame.tsx`
- Modify: `src/components/sections/hero-terminal.tsx`
- Delete: `src/components/hero/photo-configurator.tsx`

- [ ] **Step 1: Create `src/components/hero/cursor-eyes.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";

const EYE_COUNT = 5;
const PUPIL_MAX_OFFSET = 3;
const EYE_SIZE = 14;

export function CursorEyes() {
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
        const ratio = Math.min(1, dist / 200);
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

  const eyeStyle = {
    width: EYE_SIZE,
    height: EYE_SIZE,
    border: "1px solid var(--ink)",
    borderRadius: "50%",
    background: "var(--paper)",
  } as const;

  const pupilStyle = {
    width: 4,
    height: 4,
    background: "var(--ink)",
    borderRadius: "50%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  } as const;

  return (
    <div className="flex justify-center gap-3 select-none" aria-hidden>
      {Array.from({ length: EYE_COUNT }).map((_, i) => (
        <div key={i} className="font-mono text-[14px] flex items-center gap-1.5" style={{ color: "var(--ink)" }}>
          <span>[</span>
          <span
            ref={(el) => { eyeRefs.current[i * 2] = el; }}
            className="relative inline-block"
            style={eyeStyle}
          >
            <span className="pupil absolute" style={pupilStyle} />
          </span>
          <span
            ref={(el) => { eyeRefs.current[i * 2 + 1] = el; }}
            className="relative inline-block"
            style={eyeStyle}
          >
            <span className="pupil absolute" style={pupilStyle} />
          </span>
          <span>]</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/hero/photo-frame.tsx`**

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

- [ ] **Step 3: Update `src/components/sections/hero-terminal.tsx`**

Read the file. Find:
- Import: `import { PhotoConfigurator } from "@/components/hero/photo-configurator";`
- Right-column wrapper containing `<PhotoConfigurator imageSrc={personalInfo.profileImage} />`

Make these changes:

1. Replace the import line with:
```tsx
import { CursorEyes } from "@/components/hero/cursor-eyes";
import { PhotoFrame } from "@/components/hero/photo-frame";
```

2. Replace the entire right-column wrapper with:
```tsx
{/* Right column — cursor-tracking eyes + colored photo */}
<div className="flex flex-col gap-3" style={{ height: 400 }}>
  <CursorEyes />
  <div className="relative flex-1">
    <PhotoFrame imageSrc={personalInfo.profileImage} />
  </div>
</div>
```

The previous wrapper was `<div className="relative" style={{ height: 360 }}><PhotoConfigurator ... /></div>`. We swap the height back to 400 since there's no chip overflow concern, and we use a flex column to stack the eyes row above the photo.

- [ ] **Step 4: Delete `src/components/hero/photo-configurator.tsx`**

```
git rm src/components/hero/photo-configurator.tsx
```

- [ ] **Step 5: Type-check + commit**

```
npx tsc --noEmit
git add src/components/hero/cursor-eyes.tsx src/components/hero/photo-frame.tsx src/components/sections/hero-terminal.tsx
git commit -m "feat: replace photo configurator with cursor-tracking ASCII eyes + colored photo"
```

Ignore pre-existing pokeball/postprocessing TS errors.

---

## Verification

- [ ] Hero right column shows 5 eye-pairs above the colored photo
- [ ] Moving mouse anywhere on the page moves all 10 pupils to track the cursor
- [ ] Photo is full color (no grayscale)
- [ ] Photo retains float + breathe animations
- [ ] No TypeScript errors
