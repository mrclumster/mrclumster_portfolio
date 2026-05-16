# Nested Certifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Group related certifications (Google IT Support, Google Cloud, AI Infrastructure) into parent entries that expand into a detailed preview modal with a sidebar for sub-courses.

**Architecture:** Update `Certification` type to support recursive nesting. Refactor `CertificationsList` and its `Row` component to handle nested data and provide a side-by-side preview UI (Sidebar for selection, Main area for PDF/Link).

**Tech Stack:** React, Tailwind CSS, Lucide React (for icons), Framer Motion (already in project for modals).

---

### Task 1: Update Data Model

**Files:**
- Modify: `src/data/education.ts`

- [ ] **Step 1: Update `Certification` type**

```typescript
export type Certification = {
  title: string;
  issuer: string;
  year: string;
  icon?: string;
  pdfUrl?: string;
  credentialUrl?: string; // Link to badge/profile
  subCertificates?: Certification[]; // Nested courses
};
```

- [ ] **Step 2: Add Google IT Support Group**

```typescript
  {
    title: "Google IT Support Professional Certificate",
    issuer: "Google (via Coursera)",
    year: "2026",
    icon: "🛠️",
    credentialUrl: "https://www.coursera.org/professional-certificates/google-it-support",
    subCertificates: [
      {
        title: "Technical Support Fundamentals",
        issuer: "Google",
        year: "2026",
        pdfUrl: "/certs/it-support-1.pdf", // Placeholder paths
      },
      {
        title: "The Bits and Bytes of Computer Networking",
        issuer: "Google",
        year: "2026",
        pdfUrl: "/certs/it-support-2.pdf",
      },
      {
        title: "Operating Systems and You: Becoming a Power User",
        issuer: "Google",
        year: "2026",
        pdfUrl: "/certs/it-support-3.pdf",
      },
      {
        title: "System Administration and IT Infrastructure Services",
        issuer: "Google",
        year: "2026",
        pdfUrl: "/certs/it-support-4.pdf",
      },
      {
        title: "IT Security: Defense against the digital dark arts",
        issuer: "Google",
        year: "2026",
        pdfUrl: "/certs/it-support-5.pdf",
      }
    ],
  },
```

- [ ] **Step 3: Add Google Cloud Group**

```typescript
  {
    title: "Google Cloud Learning Path",
    issuer: "Google Cloud",
    year: "2026",
    icon: "☁️",
    credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5",
    subCertificates: [
      { title: "Digital Transformation with Google Cloud", issuer: "Google Cloud", year: "2026" },
      { title: "Exploring Data Transformation with Google Cloud", issuer: "Google Cloud", year: "2026" },
      { title: "Innovating with Google Cloud Artificial Intelligence", issuer: "Google Cloud", year: "2026" },
      { title: "Modernize Infrastructure and Applications with Google Cloud", issuer: "Google Cloud", year: "2026" },
      { title: "Trust and Security with Google Cloud", issuer: "Google Cloud", year: "2026" },
      { title: "Scaling with Google Cloud Operations", issuer: "Google Cloud", year: "2026" },
      { title: "Preparing for Your Associate Cloud Engineer Journey", issuer: "Google Cloud", year: "2026" },
    ],
  },
```

- [ ] **Step 4: Add AI Infrastructure Group**

```typescript
  {
    title: "AI Infrastructure Series",
    issuer: "Google Cloud",
    year: "2026",
    icon: "🤖",
    credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5",
    subCertificates: [
      { title: "AI Infrastructure: Introduction to AI Hypercomputer", issuer: "Google Cloud", year: "2026" },
      { title: "AI Infrastructure: Cloud GPUs", issuer: "Google Cloud", year: "2026" },
      { title: "AI Infrastructure: Cloud TPUs", issuer: "Google Cloud", year: "2026" },
      { title: "AI Infrastructure: Deployment Types", issuer: "Google Cloud", year: "2026" },
      { title: "AI Infrastructure: Storage Options", issuer: "Google Cloud", year: "2026" },
      { title: "AI Infrastructure: Networking Techniques", issuer: "Google Cloud", year: "2026" },
    ],
  },
```

- [ ] **Step 5: Commit**

```bash
git add src/data/education.ts
git commit -m "data: update certifications with nested groups"
```

---

### Task 2: Refactor UI Component

**Files:**
- Modify: `src/components/sections/certifications-list.tsx`

- [ ] **Step 1: Update `Row` component to handle state for sub-certificate selection**

```tsx
function Row({ cert }: { cert: Certification }) {
  const [selectedSub, setSelectedSub] = useState<Certification | null>(
    cert.subCertificates ? cert.subCertificates[0] : null
  );

  // ... modal logic
}
```

- [ ] **Step 2: Implement Sidebar for sub-certificates**

```tsx
{cert.subCertificates && (
  <div className="flex flex-col md:flex-row gap-6 mt-6 border-t pt-6 border-[color:var(--ink)]/10">
    <div className="w-full md:w-64 space-y-1 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
      <p className="text-[10px] uppercase tracking-wider opacity-50 mb-2 px-2">Courses</p>
      {cert.subCertificates.map((sub) => (
        <button
          key={sub.title}
          onClick={() => setSelectedSub(sub)}
          className={cn(
            "w-full text-left px-2 py-1.5 text-[12px] transition-colors rounded",
            selectedSub?.title === sub.title 
              ? "bg-[color:var(--ink)] text-[color:var(--paper)]" 
              : "hover:bg-[color:var(--ink)]/5"
          )}
        >
          {sub.title}
        </button>
      ))}
    </div>
    <div className="flex-1">
      {/* Preview area for selectedSub */}
    </div>
  </div>
)}
```

- [ ] **Step 3: Update Preview Area to show PDF or Credential Link**

```tsx
const displayCert = selectedSub || cert;

return (
  // ...
  <div className="mt-4">
    {displayCert.pdfUrl ? (
      <iframe src={displayCert.pdfUrl} className="w-full h-[50vh] border" />
    ) : displayCert.credentialUrl ? (
      <div className="h-[50vh] flex flex-col items-center justify-center border border-dashed opacity-60 text-center p-8">
        <ExternalLink className="mb-4 h-8 w-8" />
        <p>This certificate is verified online.</p>
        <a href={displayCert.credentialUrl} target="_blank" className="underline mt-2">View Credential</a>
      </div>
    ) : (
      <p>Details not available.</p>
    )}
  </div>
)
```

- [ ] **Step 4: Verify Layout and Responsiveness**
Run: `npm run dev` and check the modal on different screen sizes.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/certifications-list.tsx
git commit -m "feat: implement nested certifications with sidebar preview"
```
