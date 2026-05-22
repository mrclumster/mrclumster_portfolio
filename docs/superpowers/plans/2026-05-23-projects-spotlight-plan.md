# Projects Spotlight Effect Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a mouse-following spotlight effect on the Projects grid to enhance interactivity and provide a premium "senior engineer" feel.

**Architecture:** We will implement a mouse tracker in the `ProjectsLog` component that updates CSS variables (`--mouse-x`, `--mouse-y`) on the grid container. Each `ProjectCard` will then use these variables to render a radial gradient spotlight in its background and border layers.

**Tech Stack:** React, Framer Motion, Tailwind CSS 4.

**STRICT RULE:** NO GIT COMMANDS.

---

### Task 1: Implement Mouse Tracking in ProjectsLog

**Files:**
- Modify: `src/components/sections/projects-log.tsx`

- [ ] **Step 1: Add mouse tracking logic to ProjectsLog**
Update `ProjectsLog` to use `useMotionValue` and `useSpring` for coordinates, and apply them to the container via a ref.

```tsx
"use client";

import { useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";
// ... existing imports

export function ProjectsLog({ projects }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse movement
  const springX = useSpring(mouseX, { stiffness: 500, damping: 50 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 50 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  if (projects.length === 0) return null;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="group/grid grid-cols-1 md:grid-cols-2 gap-4 relative"
    >
      {projects.map((p, i) => (
        <ProjectCard key={p.title} project={p} index={i} springX={springX} springY={springY} />
      ))}
    </div>
  );
}
```

---

### Task 2: Implement Spotlight Effect in ProjectCard

**Files:**
- Modify: `src/components/sections/projects-log.tsx`

- [ ] **Step 1: Update ProjectCard to render the spotlight**
Use the passed `springX` and `springY` motion values to drive a radial gradient background and border.

```tsx
import { motion, useMotionTemplate, type MotionValue } from "framer-motion";

// ... inside ProjectCard component
function ProjectCard({ project, index, springX, springY }: { 
  project: Project; 
  index: number;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}) {
  const background = useMotionTemplate`radial-gradient(450px circle at ${springX}px ${springY}px, rgba(var(--ink-rgb), 0.06), transparent 80%)`;
  const border = useMotionTemplate`radial-gradient(300px circle at ${springX}px ${springY}px, rgba(var(--ink-rgb), 0.3), transparent 80%)`;

  return (
    <motion.article
      // ... existing props
      className="group relative flex flex-col h-full bg-[var(--paper)] transition-all duration-300 overflow-hidden"
    >
      {/* The Spotlight Background Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover/grid:opacity-100"
        style={{ background }}
      />
      
      {/* The Spotlight Border Light */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover/grid:opacity-100 z-30"
        style={{ 
          border: '1px solid transparent',
          backgroundImage: border,
          backgroundOrigin: 'border-box',
          backgroundClip: 'border-box',
          maskImage: 'linear-gradient(black, black), linear-gradient(black, black)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
        }}
      />

      {/* Outer border (static) */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        aria-hidden
        style={{
          boxShadow: "inset 0 0 0 1px var(--ink)",
          opacity: 0.1,
        }}
      />
      
      {/* ... Rest of the card content (ensure it has relative z-index if needed) */}
      <div className="relative z-20 flex flex-col h-full">
         {/* existing header and body content */}
      </div>
    </motion.article>
  );
}
```

---

### Task 3: Final Verification

- [ ] **Step 1: Check Linting**
Run: `npx eslint src/components/sections/projects-log.tsx`
Expected: No errors.

- [ ] **Step 2: Manual Check (mental)**
Verify that the `mask-image` and `mask-composite` trick for the border light is correctly implemented for cross-browser support (Webkit prefixes).
