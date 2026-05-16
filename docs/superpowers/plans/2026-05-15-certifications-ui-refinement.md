# Certifications UI Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. **STRICT CONSTRAINT: DO NOT USE GIT COMMANDS (ADD, COMMIT, PUSH).**

**Goal:** Clean up the certifications list by grouping events, increasing font/spacing, and removing the `.pdf` extension from the display.

**Architecture:** Restructure the `certifications` array in `src/data/education.ts` to include a new "Google Developer Events" group. Update the CSS classes in `src/components/sections/certifications-list.tsx` for better visual presence.

**Tech Stack:** React, Tailwind CSS.

---

### Task 1: Restructure Data

**Files:**
- Modify: `src/data/education.ts`

- [ ] **Step 1: Group DevFest and I/O Certificates**

Move the individual Google DevFest and Google I/O entries into a new nested group.

```typescript
// Replace the individual entries with this group:
  {
    title: "Google Developer Events",
    issuer: "GDG Zamboanga",
    year: "2023 - 2025",
    icon: "🌟",
    subCertificates: [
      {
        title: "Google DevFest Zamboanga Peninsula 2025",
        issuer: "GDG Zamboanga",
        year: "2025",
        icon: "🔥",
        pdfUrl: "/cert-devfest-2025.pdf",
      },
      {
        title: "Google I/O Extended 2024",
        issuer: "GDG Zamboanga",
        year: "2024",
        icon: "🚀",
        pdfUrl: "/cert-google-io-2024.pdf",
      },
      {
        title: "DevFest 2023",
        issuer: "GDG Zamboanga",
        year: "2023",
        icon: "💡",
        pdfUrl: "/cert-devfest-2023.pdf",
      },
    ],
  },
```

---

### Task 2: Refine UI Styling

**Files:**
- Modify: `src/components/sections/certifications-list.tsx`

- [ ] **Step 1: Update Font Size and Padding**

Change the `ModalTrigger` classes to increase readability.

```tsx
// Find this line:
<ModalTrigger className="grid w-full grid-cols-[1fr_max-content] gap-4 text-left text-[13px] py-1 hover:bg-[color:var(--ink)]/5 transition-colors">

// Replace with:
<ModalTrigger className="grid w-full grid-cols-[1fr_max-content] gap-4 text-left text-[15px] py-3 hover:bg-[color:var(--ink)]/5 transition-colors">
```

- [ ] **Step 2: Show Actual Titles (Remove .pdf)**

Change the main span to display the certificate title directly.

```tsx
// Find this line:
<span className="truncate">{slug(cert.title)}</span>

// Replace with:
<span className="truncate">{cert.title}</span>
```

---

### Task 3: Final Verification

- [ ] **Step 1: Check in Browser**
Run: `npm run dev`
Verify:
1. "Google Developer Events" appears in the list.
2. The list uses larger font and has more vertical space.
3. No `.pdf` extension is visible in the row titles.
4. Clicking "Google Developer Events" shows the 3 sub-certificates in the modal sidebar.
