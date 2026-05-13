# About Section Redesign with Cloud the Cat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the "About" section to be more professional and interactive, featuring a new bio, categorized tech stack, and "Cloud" the Side Pet. **Note: Do not commit changes; the user will handle commits personally.**

**Architecture:**
- Update `src/data/personal.ts` with the new professional bio.
- Refactor `src/components/sections/stack-table.tsx` into a categorized grid.
- Create `src/components/shared/side-pet.tsx` for the walking cat interaction.
- Integrate all into `src/components/sections/about-terminal.tsx`.

**Tech Stack:**
- React (Next.js)
- Tailwind CSS
- Framer Motion

---

### Task 1: Update Bio Content

**Files:**
- Modify: `src/data/personal.ts`

- [ ] **Step 1: Replace bio text with professional and catchy narrative**

```typescript
// Inside src/data/personal.ts

export const personalInfo = {
  // ...
  bio: [
    [
      { type: "text", value: "I am a " },
      { type: "keyword", value: "Fullstack Developer" },
      { type: "text", value: " dedicated to building software that solves real-world problems. From architecting " },
      { type: "keyword", value: "FishFresh" },
      { type: "text", value: " (AI-driven food safety) to scaling " },
      { type: "keyword", value: "Barangay Connect" },
      { type: "text", value: ", I thrive on turning complex logic into seamless experiences." },
      { type: "secret", value: " (Translation: I turn caffeine into working features and bugs into lessons.)" },
    ],
    [
      { type: "text", value: "I specialize in crafting robust, scalable architectures with a focus on impact and user-centric design. I believe technology should deliver meaningful value to communities." },
      { type: "secret", value: " (I also have a strangely deep relationship with console.log.)" },
    ],
    [
      { type: "text", value: "I build for impact. " },
      { type: "keyword", value: "Scroll down" },
      { type: "text", value: " to see these projects in action." },
    ]
  ] satisfies Bio,
  // ...
} as const;
```

---

### Task 2: Categorize Tech Stack

**Files:**
- Modify: `src/components/sections/stack-table.tsx`

- [ ] **Step 1: Refactor StackTable to use a categorized grid layout**

```tsx
// Inside src/components/sections/stack-table.tsx

export function StackTable() {
  const categories = [
    { title: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
    { title: "Backend", items: ["Node.js", "Python (FastAPI)", "PostgreSQL", "SQL"] },
    { title: "Specialized", items: ["PyTorch (ML)", "OpenCV (CV)", "Docker", "Git"] },
    { title: "Tools", items: ["Vercel", "Linux", "Framer Motion", "Three.js"] },
  ];

  return (
    <div className="font-mono text-[13px] leading-relaxed">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div key={cat.title} className="border border-[color:var(--ink)] p-4 relative group hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] transition-colors duration-200">
            <span className="absolute -top-2.5 left-2 bg-[color:var(--paper)] px-1.5 text-[10px] font-bold uppercase tracking-widest border border-[color:var(--ink)] group-hover:bg-[color:var(--ink)]">
              {cat.title}
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {cat.items.map((item) => (
                <span key={item} className="opacity-80 after:content-['/'] after:ml-2 after:opacity-30 last:after:content-['']">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### Task 3: Implement Cloud the Side Pet

**Files:**
- Create: `src/components/shared/side-pet.tsx`
- Modify: `src/components/sections/about-terminal.tsx`

- [ ] **Step 1: Create SidePet component with walking and click logic**

Use a transparent pixel art cat GIF for "Cloud".

```tsx
// Create src/components/shared/side-pet.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPEECH_BUBBLES = [
  "Meow!",
  "Cloud is watching the code!",
  "Ready for adventure!",
  "I hope you're having a great day!",
  "Is that a bug I see?",
];

export function SidePet() {
  const [x, setX] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const [isJumping, setIsJumping] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isJumping) {
        setX((prev) => {
          const next = prev + direction * 2;
          if (next > 100 || next < -100) {
            setDirection((d) => -d);
            return prev;
          }
          return next;
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, [direction, isJumping]);

  const handleClick = () => {
    setIsJumping(true);
    setBubble(SPEECH_BUBBLES[Math.floor(Math.random() * SPEECH_BUBBLES.length)]);
    setTimeout(() => {
      setIsJumping(false);
      setBubble(null);
    }, 2000);
  };

  return (
    <div className="relative h-12 mt-8 border-b border-[color:var(--ink)] border-dashed overflow-visible">
      <motion.div
        className="absolute bottom-0 cursor-pointer"
        animate={{ x: `${x}%`, scaleX: direction }}
        style={{ left: "50%" }}
        onClick={handleClick}
      >
        <AnimatePresence>
          {bubble && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -40 }}
              exit={{ opacity: 0 }}
              className="absolute left-1/2 -translate-x-1/2 bg-[color:var(--ink)] text-[color:var(--paper)] text-[10px] px-2 py-1 whitespace-nowrap font-mono"
            >
              {bubble}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[color:var(--ink)] rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.img
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3N6M2Z6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/vootsak/tuxedo-cat-walking-transparent/giphy.gif"
          alt="Cloud the Cat"
          className="w-10 h-10 pixelated"
          animate={isJumping ? { y: [0, -20, 0], rotate: [0, 360] } : {}}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Integrate SidePet into AboutTerminal and remove GitHub Calendar**

```tsx
// Inside src/components/sections/about-terminal.tsx

import { personalInfo } from "@/data/personal";
import { AsciiDivider } from "@/components/terminal/ascii-divider";
import { HighlightReveal } from "@/components/shared/highlight-reveal";
import { SidePet } from "@/components/shared/side-pet"; // Import SidePet

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
      {/* Replaced GitHub Calendar with SidePet */}
      <SidePet />
    </section>
  );
}
```

---

### Task 4: Final Verification

- [ ] **Step 1: Verify responsiveness**
- Ensure the categorized stack grid stacks correctly on mobile.
- Ensure Cloud the Cat stays within the horizontal boundaries of the About section.
- Test "Select to Reveal" on the new bio text.
- Confirm click interactions and speech bubbles for Cloud.
