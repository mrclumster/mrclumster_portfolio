# Design Spec: Nested Certifications

Organize certifications into logical groups (Professional Certificates/Learning Paths) to keep the portfolio clean while still providing detail on individual courses.

## Goals
- Group related certifications (e.g., Google IT Support, Google Cloud, AI Infrastructure).
- Use a "Nested Modal" approach where clicking a parent certificate reveals its constituent courses.
- Maintain existing PDF preview functionality for individual certificates.
- Support external links for certificates without PDFs (like Google Skills profile links).

## Data Model Changes (`src/data/education.ts`)
Update the `Certification` type to support recursion or a flat list of sub-items.

```typescript
export type Certification = {
  title: string;
  issuer: string;
  year: string;
  icon?: string;
  pdfUrl?: string;
  credentialUrl?: string; // New: link to public profile/badge
  subCertificates?: Certification[]; // New: constituent courses
};
```

## UI Changes (`src/components/sections/certifications-list.tsx`)
- Modify the `Row` component to detect `subCertificates`.
- If `subCertificates` exist, the Modal Content will display:
    - **Sidebar/List**: A scrollable list of the constituent courses on the left (or top on mobile).
    - **Preview Area**: An iframe or detail view on the right (or bottom) that updates when a course is selected.
    - **Primary Action**: A button to open the main "Professional Certificate" PDF/Link.
- This avoids "Modal inside a Modal" which is poor UX.

## Grouping Plan

### 1. Google IT Support Professional Certificate
- **Issuer:** Google (via Coursera)
- **Year:** 2026 (assumed)
- **Sub-certificates:**
    - Technical Support Fundamentals
    - The Bits and Bytes of Computer Networking
    - Operating Systems and You: Becoming a Power User
    - System Administration and IT Infrastructure Services
    - IT Security: Defense against the digital dark arts
    - (Wait, Coursera IT Support is usually 5 courses, user mentioned 6 - I will verify or allow for 6)

### 2. Google Cloud Learning Path
- **Issuer:** Google Cloud
- **Year:** 2026
- **Sub-certificates:**
    - Digital Transformation with Google Cloud
    - Exploring Data Transformation with Google Cloud
    - Innovating with Google Cloud Artificial Intelligence
    - Modernize Infrastructure and Applications with Google Cloud
    - Trust and Security with Google Cloud
    - Scaling with Google Cloud Operations
    - Preparing for Your Associate Cloud Engineer Journey

### 3. AI Infrastructure Series
- **Issuer:** Google Cloud
- **Year:** 2026
- **Sub-certificates:**
    - AI Infrastructure: Introduction to AI Hypercomputer
    - AI Infrastructure: Cloud GPUs
    - AI Infrastructure: Cloud TPUs
    - AI Infrastructure: Deployment Types
    - AI Infrastructure: Storage Options
    - AI Infrastructure: Networking Techniques

## Implementation Steps
1. Update `src/data/education.ts` types and export the new grouped data.
2. Refactor `src/components/sections/certifications-list.tsx` to handle nested certificates.
3. Ensure the Modal remains responsive and accessible.
