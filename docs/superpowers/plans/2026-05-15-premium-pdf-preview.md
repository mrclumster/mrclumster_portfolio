# Premium 3D PDF Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. **STRICT CONSTRAINT: DO NOT USE GIT COMMANDS.**

**Goal:** Replace the iframe PDF viewer with a custom 3D tilted rendering using `react-pdf` and `framer-motion`.

**Architecture:** Integrate `react-pdf` Document and Page components into the `Row` component. Use `framer-motion` `useMotionValue` and `useTransform` to calculate 3D rotation based on mouse movement over the certificate.

**Tech Stack:** React, `react-pdf`, `framer-motion`.

---

### Task 1: Environment Setup

- [ ] **Step 1: Install `react-pdf`**
Run: `npm install react-pdf`

---

### Task 2: Implement 3D PDF Preview

**Files:**
- Modify: `src/components/sections/certifications-list.tsx`

- [ ] **Step 1: Update Imports**
Add `react-pdf` components and `motion` hooks.

```tsx
import { pdfjs, Document, Page } from 'react-pdf';
import { motion, useMotionValue, useTransform } from 'framer-motion';

// Setup worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
```

- [ ] **Step 2: Implement `CertificatePreview` component**
Create a new component within the file that handles the 3D tilt.

```tsx
function CertificatePreview({ file }: { file: string }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useTransform(y, [0, 1], [10, -10]);
  const rotateY = useTransform(x, [0, 1], [-10, 10]);

  function handleMouseMove(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  }

  return (
    <div 
      className="relative w-full aspect-[1.414/1] perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0.5); y.set(0.5); }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full h-full shadow-2xl rounded-sm overflow-hidden border border-[color:var(--ink)]/10"
      >
        <Document file={file} loading={<div className="w-full h-full bg-[color:var(--ink)]/5 animate-pulse" />}>
          <Page 
            pageNumber={1} 
            renderTextLayer={false} 
            renderAnnotationLayer={false}
            width={600} // Dynamic scaling handled by CSS
            className="max-w-full h-auto"
          />
        </Document>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 3: Replace `iframe` with `CertificatePreview`**
Update the preview area in the `Row` component to use the new component.

---

### Task 3: Final Verification

- [ ] **Step 1: Verify in Browser**
Run: `npm run dev`
Verify:
1. PDFs load without a black background.
2. The certificate tilts in 3D when hovered.
3. Aspect ratio is maintained and responsive.
