# Certification Icons Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. **STRICT CONSTRAINT: DO NOT USE GIT COMMANDS.**

**Goal:** Replace all emojis in the certifications section with professional, monochrome Lucide icons.

**Architecture:** Pass icon names (strings) from `src/data/education.ts` and use a lookup component in `src/components/sections/certifications-list.tsx` to render the corresponding Lucide React components.

**Tech Stack:** React, Lucide React, Tailwind CSS.

---

### Task 1: Update Data Mapping

**Files:**
- Modify: `src/data/education.ts`

- [ ] **Step 1: Replace Emojis with Icon Names**

Update the `icon` field for each certification entry.

```typescript
// Example mapping changes:
"🏛️" -> "Landmark"
"🌟" -> "Sparkles"
"🛠️" -> "Wrench"
"☁️" -> "Cloud"
"🤖" -> "Cpu"
```

---

### Task 2: Implement Icon Rendering

**Files:**
- Modify: `src/components/sections/certifications-list.tsx`

- [ ] **Step 1: Import Lucide Icons**

```tsx
import { 
  Landmark, 
  Sparkles, 
  Wrench, 
  Cloud, 
  Cpu, 
  Terminal,
  ExternalLink 
} from "lucide-react";
```

- [ ] **Step 2: Create Icon Mapper Component**

Add a helper component to render the icon based on the string name.

```tsx
const IconMap = {
  Landmark,
  Sparkles,
  Wrench,
  Cloud,
  Cpu,
  Terminal,
};

function CertIcon({ name, className }: { name?: string; className?: string }) {
  if (!name || !(name in IconMap)) return null;
  const Icon = IconMap[name as keyof typeof IconMap];
  return <Icon className={className} />;
}
```

- [ ] **Step 3: Update Modal UI to render icons**

Update the header section in the modal to use the new `CertIcon` component with the specified styling.

```tsx
// Replace emoji span with:
<div className="p-2 bg-[color:var(--ink)]/5 border border-[color:var(--ink)]/10 rounded-md">
  <CertIcon name={cert.icon} className="h-5 w-5 opacity-80" />
</div>
```

---

### Task 4: Final Verification

- [ ] **Step 1: Check in Browser**
Run: `npm run dev`
Verify:
1. All emojis are gone.
2. High-quality monochrome icons appear in the modal headers.
3. Icons are correctly sized and aligned.
