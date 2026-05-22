# Projects Section Implementation Plan (v2 - Professional Icons)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the projects section to use professional Lucide icons instead of emojis, and ensure all 8 projects are correctly populated with their respective icons.

**Architecture:** Update `projects.ts` to use Lucide icon names. Update `ProjectsLog.tsx` to dynamically render Lucide components based on these names.

**Tech Stack:** Next.js, React, Tailwind CSS 4, Framer Motion, Lucide React.

---

### Task 1: Update Projects Data with Icon Names

**Files:**
- Modify: `src/data/projects.ts`

- [ ] **Step 1: Replace emojis with Lucide icon names**
Update the `icon` field for each project.

```typescript
export const projects: Project[] = [
  {
    title: "FishFresh",
    description: "A mobile computer vision system for real-time fish freshness assessment. Built to address uncertain post-harvest quality checks using machine learning.",
    icon: "ScanEye",
    tags: ["Python", "Computer Vision", "Machine Learning", "React Native"],
    githubUrl: "https://github.com/mrclumster/2025-CP_Fishfresh",
    featured: true,
    gradientColor: "#3b82f6",
  },
  {
    title: "Portfolio Website",
    description: "Personal developer portfolio featuring a built-in interactive text adventure game, dark mode, and SEO optimization.",
    icon: "LayoutTemplate",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/mrclumster/mrclumster_portfolio",
    liveUrl: "https://aziztebbeng.vercel.app/adventure",
    featured: true,
    gradientColor: "#8b5cf6",
  },
  {
    title: "Calarian Connect",
    description: "The official digital system of Barangay Calarian. Features a resident mobile app, staff web panel, and face-recognition kiosk to automate paperwork and reduce queue times.",
    icon: "Building2",
    tags: ["Next.js", "React Native", "TypeScript", "Supabase", "Face Recognition"],
    liveUrl: "https://mrclumster.github.io/CalarianConnectWeb/",
    featured: true,
    gradientColor: "#10b981",
  },
  {
    title: "Secure Login (WebGoat)",
    description: "A Flask web app demonstrating secure authentication alongside interactive, built-in security lessons covering SQLi, XSS, and Broken Access Control.",
    icon: "ShieldCheck",
    tags: ["Python", "Flask", "SQLite", "Security"],
    liveUrl: "https://secure-login-webgoat.onrender.com",
    featured: false,
  },
  {
    title: "Global Energy Tycoon",
    description: "A suite of immersive oil industry and corporate management simulations built in Python, featuring AI rivals, dynamic markets, and multiple visual themes.",
    icon: "Zap",
    tags: ["Python", "customtkinter", "tkinter", "SQLite"],
    githubUrl: "https://github.com/mrclumster/save_the_world_python",
    featured: false,
  },
  {
    title: "Tycoon Monopoly",
    description: "A feature-rich, visually polished Monopoly game implementation in Python featuring custom property names, AI opponents, and full game logic.",
    icon: "Gamepad2",
    tags: ["Python", "tkinter"],
    featured: false,
  },
  {
    title: "Blue Thunder POS",
    description: "A specialized Point of Sale (POS) system built specifically for Blue Thunder Agrivet to manage inventory and sales.",
    icon: "Receipt",
    tags: ["POS", "Inventory Management"],
    githubUrl: "https://github.com/rxykio/Blue-Thunder-SE",
    featured: false,
  },
  {
    title: "Active Directory Lab",
    description: "An Enterprise Active Directory infrastructure lab built in an isolated virtualized sandbox to demonstrate centralized identity management and GPO security hardening.",
    icon: "Server",
    tags: ["Windows Server", "Active Directory", "Hyper-V", "Networking"],
    githubUrl: "https://github.com/mrclumster/Active-Directory-Enterprise-Lab",
    featured: false,
  }
];
```

---

### Task 2: Dynamic Icon Rendering in ProjectsLog

**Files:**
- Modify: `src/components/sections/projects-log.tsx`

- [ ] **Step 1: Implement Dynamic Icon Component**
Update the component to import icons from `lucide-react` and render them dynamically.

```tsx
import * as LucideIcons from "lucide-react";

// Helper component to render icons by name
const ProjectIcon = ({ name }: { name?: string }) => {
  if (!name) return <LucideIcons.Folder className="w-6 h-6 opacity-60" />;
  
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <LucideIcons.Folder className="w-6 h-6 opacity-60" />;
  
  return <IconComponent className="w-6 h-6 opacity-80" />;
};
```

- [ ] **Step 2: Update ProjectCard to use ProjectIcon**
Replace the emoji rendering with `<ProjectIcon name={project.icon} />`.

---

### Task 3: Final Verification

- [ ] **Step 1: Run Lint**
Run: `npx eslint src/data/projects.ts src/components/sections/projects-log.tsx`

---
