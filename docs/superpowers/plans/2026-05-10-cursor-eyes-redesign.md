# Sentient Constellation Eye Cloud Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static CursorEyes row with an organic, diverse "Rainbow Cloud" of 16+ tracking eye species arranged in an arc.

**Architecture:** A container component (`CursorEyeCloud`) calculates arc positions and manages mouse state. It renders 16-22 `IndividualEye` components, which use a registry (`EyeSpecies`) to render unique visual styles and handle their own idle/tracking animations.

**Tech Stack:** Next.js (React), Framer Motion (for smooth transitions and animations), Tailwind CSS.

---

### Task 1: Define Eye Species Registry

**Files:**
- Create: `src/components/hero/eye-species.tsx`

- [ ] **Step 1: Create the EyeSpecies registry.**
Define types and a map of render functions for all 16 species.

```tsx
import React from "react";

export type EyeSpeciesType =
  | "classic" | "observer" | "glitch" | "lash" | "cyber" | "feline" 
  | "hollow" | "binary" | "recursive" | "clockwork" | "ascii" | "pulse" 
  | "orbit" | "crosshair" | "static" | "shadow";

export interface EyeProps {
  pupilX: number;
  pupilY: number;
  isBlinking: boolean;
  idleOffset: number;
  isTracking: boolean;
}

export const EYE_SPECIES: Record<EyeSpeciesType, (props: EyeProps) => React.ReactNode> = {
  classic: ({ pupilX, pupilY, isBlinking }) => (
    <div className="w-4 h-4 border border-[color:var(--ink)] rounded-full bg-[color:var(--paper)] relative overflow-hidden">
      {!isBlinking && (
        <div 
          className="w-1.5 h-1.5 bg-[color:var(--ink)] rounded-full absolute top-1/2 left-1/2"
          style={{ transform: `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))` }}
        />
      )}
    </div>
  ),
  observer: ({ pupilX, pupilY, isBlinking }) => (
    <div className="w-6 h-6 border-2 border-[color:var(--ink)] rounded-full bg-[color:var(--paper)] relative overflow-hidden">
      {!isBlinking && (
        <div 
          className="w-2.5 h-2.5 bg-[color:var(--ink)] rounded-full absolute top-1/2 left-1/2"
          style={{ transform: `translate(calc(-50% + ${pupilX * 0.7}px), calc(-50% + ${pupilY * 0.7}px))` }}
        />
      )}
    </div>
  ),
  glitch: ({ pupilX, pupilY, isBlinking }) => (
    <div className="font-mono text-[14px] flex items-center justify-center text-[color:var(--ink)] h-5 w-5">
      <span>[</span>
      <div className="w-2 h-2 bg-[color:var(--ink)] relative mx-0.5">
        {!isBlinking && (
          <div 
            className="w-1 h-1 bg-[color:var(--paper)] absolute top-1/2 left-1/2"
            style={{ transform: `translate(calc(-50% + ${pupilX * 1.5}px), calc(-50% + ${pupilY * 1.5}px))` }}
          />
        )}
      </div>
      <span>]</span>
    </div>
  ),
  lash: ({ pupilX, pupilY, isBlinking }) => (
    <div className="relative h-6 w-6 flex items-center justify-center">
      <div className="absolute -top-1 text-[10px] text-[color:var(--ink)] opacity-50 select-none">///</div>
      <div className="w-4 h-4 border border-[color:var(--ink)] rounded-full bg-[color:var(--paper)] relative overflow-hidden">
        {!isBlinking && (
          <div 
            className="w-1.5 h-1.5 bg-[color:var(--ink)] rounded-full absolute top-1/2 left-1/2"
            style={{ transform: `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))` }}
          />
        )}
      </div>
    </div>
  ),
  cyber: ({ pupilX, pupilY, isBlinking }) => (
    <div className="font-mono text-[12px] flex items-center justify-center text-[color:var(--ink)] h-5 w-5">
      <span>{"<"}</span>
      <div className="w-2 h-2 rounded-sm border border-[color:var(--ink)] relative mx-0.5">
        {!isBlinking && (
          <div 
            className="w-1 h-1 bg-[color:var(--ink)] absolute top-1/2 left-1/2"
            style={{ transform: `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))` }}
          />
        )}
      </div>
      <span>{">"}</span>
    </div>
  ),
  feline: ({ pupilX, pupilY, isBlinking }) => (
    <div className="w-4 h-4 border border-[color:var(--ink)] rounded-full bg-[color:var(--paper)] relative overflow-hidden">
      {!isBlinking && (
        <div 
          className="w-1 h-3 bg-[color:var(--ink)] rounded-full absolute top-1/2 left-1/2"
          style={{ transform: `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))` }}
        />
      )}
    </div>
  ),
  hollow: ({ pupilX, pupilY, isBlinking }) => (
    <div className="w-5 h-5 relative flex items-center justify-center">
      {!isBlinking && (
        <div 
          className="w-2 h-2 bg-[color:var(--ink)] rounded-full"
          style={{ transform: `translate(${pupilX}px, ${pupilY}px)` }}
        />
      )}
    </div>
  ),
  binary: ({ pupilX, pupilY, isBlinking }) => (
    <div className="w-6 h-4 border border-[color:var(--ink)] rounded-full bg-[color:var(--paper)] relative overflow-hidden flex items-center justify-center gap-0.5">
      {!isBlinking && (
        <>
          <div 
            className="w-1.5 h-1.5 bg-[color:var(--ink)] rounded-full"
            style={{ transform: `translate(${pupilX * 0.5}px, ${pupilY * 0.5}px)` }}
          />
          <div 
            className="w-1.5 h-1.5 bg-[color:var(--ink)] rounded-full"
            style={{ transform: `translate(${pupilX * 0.5}px, ${pupilY * 0.5}px)` }}
          />
        </>
      )}
    </div>
  ),
  recursive: ({ pupilX, pupilY, isBlinking }) => (
    <div className="w-5 h-5 border border-[color:var(--ink)] rounded-full bg-[color:var(--paper)] relative overflow-hidden flex items-center justify-center">
       <div 
          className="w-2 h-2 border border-[color:var(--ink)] rounded-full relative overflow-hidden"
          style={{ transform: `translate(${pupilX}px, ${pupilY}px)` }}
        >
           {!isBlinking && <div className="w-0.5 h-0.5 bg-[color:var(--ink)] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
        </div>
    </div>
  ),
  clockwork: ({ pupilX, pupilY, isBlinking, idleOffset }) => (
    <div 
      className="w-5 h-5 border border-[color:var(--ink)] border-dashed rounded-full bg-[color:var(--paper)] relative overflow-hidden"
      style={{ transform: `rotate(${idleOffset * 10}deg)` }}
    >
      {!isBlinking && (
        <div 
          className="w-1.5 h-1.5 bg-[color:var(--ink)] rounded-full absolute top-1/2 left-1/2"
          style={{ transform: `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))` }}
        />
      )}
    </div>
  ),
  ascii: ({ isBlinking }) => (
    <div className="font-mono text-[12px] text-[color:var(--ink)] select-none">
      {isBlinking ? "( -_- )" : "( o_O )"}
    </div>
  ),
  pulse: ({ pupilX, pupilY, isBlinking, idleOffset }) => (
    <div 
      className="w-4 h-4 border border-[color:var(--ink)] rounded-full bg-[color:var(--paper)] relative overflow-hidden"
      style={{ transform: `scale(${1 + Math.sin(idleOffset * 2) * 0.1})` }}
    >
      {!isBlinking && (
        <div 
          className="w-1.5 h-1.5 bg-[color:var(--ink)] rounded-full absolute top-1/2 left-1/2"
          style={{ transform: `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))` }}
        />
      )}
    </div>
  ),
  orbit: ({ pupilX, pupilY, isBlinking, idleOffset }) => (
    <div className="w-6 h-6 border border-[color:var(--ink)] rounded-full bg-[color:var(--paper)] relative overflow-hidden flex items-center justify-center">
      {!isBlinking && (
        <>
          <div 
            className="w-2 h-2 bg-[color:var(--ink)] rounded-full"
            style={{ transform: `translate(${pupilX}px, ${pupilY}px)` }}
          />
          <div 
            className="w-0.5 h-0.5 bg-[color:var(--ink)] rounded-full absolute"
            style={{ 
              transform: `rotate(${idleOffset * 20}deg) translate(8px) rotate(-${idleOffset * 20}deg)` 
            }}
          />
        </>
      )}
    </div>
  ),
  crosshair: ({ pupilX, pupilY, isBlinking }) => (
    <div className="w-5 h-5 border border-[color:var(--ink)] rounded-full bg-[color:var(--paper)] relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 border-t border-[color:var(--ink)] top-1/2 -translate-y-1/2 opacity-30" />
      <div className="absolute inset-0 border-l border-[color:var(--ink)] left-1/2 -translate-x-1/2 opacity-30" />
      {!isBlinking && (
        <div 
          className="w-1.5 h-1.5 bg-[color:var(--ink)] absolute top-1/2 left-1/2"
          style={{ transform: `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))` }}
        />
      )}
    </div>
  ),
  static: ({ pupilX, pupilY, isBlinking }) => (
    <div className="w-5 h-5 border border-[color:var(--ink)] rounded-full relative overflow-hidden bg-black">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }} />
      {!isBlinking && (
        <div 
          className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2"
          style={{ transform: `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))` }}
        />
      )}
    </div>
  ),
  shadow: ({ pupilX, pupilY, isBlinking }) => (
    <div className="w-4 h-4 border border-white/20 rounded-full bg-black relative overflow-hidden">
      {!isBlinking && (
        <div 
          className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2"
          style={{ transform: `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))` }}
        />
      )}
    </div>
  ),
};
```

- [ ] **Step 2: Commit.**

```bash
git add src/components/hero/eye-species.tsx
git commit -m "feat: define eye species registry for rainbow cloud"
```

---

### Task 2: Implement Individual Eye Component

**Files:**
- Create: `src/components/hero/individual-eye.tsx`

- [ ] **Step 1: Create the IndividualEye component.**
Handle idle animations (floating, random blinks, random scans) and cursor tracking interpolation.

```tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { EYE_SPECIES, EyeSpeciesType } from "./eye-species";

interface IndividualEyeProps {
  species: EyeSpeciesType;
  x: number;
  y: number;
  isTracking: boolean;
  mousePos: { x: number; y: number };
}

export function IndividualEye({ species, x, y, isTracking, mousePos }: IndividualEyeProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [idleOffset, setIdleOffset] = useState(0);
  const [randomScan, setRandomScan] = useState({ x: 0, y: 0 });
  const eyeRef = useRef<HTMLDivElement>(null);

  // Pupil movement springs for smooth tracking
  const springConfig = { damping: 20, stiffness: 150 };
  const pupilX = useSpring(0, springConfig);
  const pupilY = useSpring(0, springConfig);

  // Idle floating animation
  useEffect(() => {
    let startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setIdleOffset(elapsed);
      requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  // Random blinking and scanning
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3000);

    const scanInterval = setInterval(() => {
      if (!isTracking && Math.random() > 0.7) {
        setRandomScan({
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 6,
        });
      }
    }, 4000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(scanInterval);
    };
  }, [isTracking]);

  // Tracking logic
  useEffect(() => {
    if (isTracking && eyeRef.current) {
      const rect = eyeRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mousePos.x - cx;
      const dy = mousePos.y - cy;
      const dist = Math.hypot(dx, dy);
      const ratio = Math.min(1, dist / 300);
      const maxOffset = species === "observer" ? 4 : 5;
      
      pupilX.set((dx / (dist || 1)) * maxOffset * ratio);
      pupilY.set((dy / (dist || 1)) * maxOffset * ratio);
    } else {
      pupilX.set(randomScan.x);
      pupilY.set(randomScan.y);
    }
  }, [isTracking, mousePos, randomScan, species, pupilX, pupilY]);

  const RenderEye = EYE_SPECIES[species];

  return (
    <motion.div
      ref={eyeRef}
      className="absolute"
      style={{
        left: x,
        top: y,
        y: Math.sin(idleOffset * 2 + x * 0.05) * 3, // Float effect
      }}
    >
      <RenderEye 
        pupilX={pupilX.get()} 
        pupilY={pupilY.get()} 
        isBlinking={isBlinking} 
        idleOffset={idleOffset}
        isTracking={isTracking}
      />
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit.**

```bash
git add src/components/hero/individual-eye.tsx
git commit -m "feat: add IndividualEye component with tracking and idle logic"
```

---

### Task 3: Implement Cursor Eye Cloud Container

**Files:**
- Create: `src/components/hero/cursor-eye-cloud.tsx`

- [ ] **Step 1: Create the CursorEyeCloud component.**
Calculate arc positions, randomly assign species, and manage the `isTracking` state based on mouse distance from the container.

```tsx
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { IndividualEye } from "./individual-eye";
import { EyeSpeciesType } from "./eye-species";

const SPECIES: EyeSpeciesType[] = [
  "classic", "observer", "glitch", "lash", "cyber", "feline", 
  "hollow", "binary", "recursive", "clockwork", "ascii", "pulse", 
  "orbit", "crosshair", "static", "shadow"
];

const EYE_COUNT = 18;
const CLOUD_WIDTH = 340;
const CLOUD_HEIGHT = 100;

export function CursorEyeCloud() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTracking, setIsTracking] = useState(false);

  // Generate stable random positions and species on first mount
  const eyes = useMemo(() => {
    return Array.from({ length: EYE_COUNT }).map((_, i) => {
      // Parabolic arc: y = a * x^2
      // Normalize x to -1 to 1 range
      const t = (i / (EYE_COUNT - 1)) * 2 - 1;
      const xBase = (t * CLOUD_WIDTH) / 2 + CLOUD_WIDTH / 2;
      const yBase = Math.pow(t, 2) * CLOUD_HEIGHT;
      
      return {
        id: i,
        species: SPECIES[Math.floor(Math.random() * SPECIES.length)],
        // Add organic jitter
        x: xBase + (Math.random() - 0.5) * 30,
        y: yBase + (Math.random() - 0.5) * 25,
      };
    });
  }, []);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Expand tracking zone beyond the element itself
        const trackingPad = 400;
        const inZone = 
          e.clientX >= rect.left - trackingPad &&
          e.clientX <= rect.right + trackingPad &&
          e.clientY >= rect.top - trackingPad &&
          e.clientY <= rect.bottom + trackingPad;
        
        setIsTracking(inZone);
      }
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative mx-auto select-none pointer-events-none"
      style={{ width: CLOUD_WIDTH, height: CLOUD_HEIGHT + 20 }}
      aria-hidden
    >
      {eyes.map((eye) => (
        <IndividualEye 
          key={eye.id}
          species={eye.species}
          x={eye.x}
          y={eye.y}
          isTracking={isTracking}
          mousePos={mousePos}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit.**

```bash
git add src/components/hero/cursor-eye-cloud.tsx
git commit -m "feat: add CursorEyeCloud container with parabolic arc layout"
```

---

### Task 4: Integrate into Hero Terminal

**Files:**
- Modify: `src/components/sections/hero-terminal.tsx`

- [ ] **Step 1: Replace CursorEyes with CursorEyeCloud.**

```tsx
// src/components/sections/hero-terminal.tsx

// ... other imports
import { CursorEyeCloud } from "@/components/hero/cursor-eye-cloud"; // Replace CursorEyes
// ...

// In the JSX (around line 100):
<div className="flex flex-col gap-3" style={{ height: 400 }}>
  <CursorEyeCloud /> {/* Use the new component */}
  <div className="relative flex-1">
    <PhotoFrame imageSrc={personalInfo.profileImage} />
  </div>
</div>
```

- [ ] **Step 2: Verify visually.**
Run `npm run dev` and check the hero section.

- [ ] **Step 3: Commit.**

```bash
git add src/components/sections/hero-terminal.tsx
git commit -m "feat: integrate CursorEyeCloud into HeroTerminal"
```

---

### Task 5: Cleanup

- [ ] **Step 1: Remove old CursorEyes component.**

Run: `rm src/components/hero/cursor-eyes.tsx`

- [ ] **Step 2: Commit.**

```bash
git add src/components/hero/cursor-eyes.tsx
git commit -m "chore: remove old CursorEyes component"
```
