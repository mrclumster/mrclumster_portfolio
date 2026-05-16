# Design Spec: Certifications UI Refinement

Improve the visual presentation of the certifications list by grouping event-based certificates, increasing readability, and removing technical file-extension suffixes.

## Goals
- Group Google developer event certificates (DevFest, I/O) into a single "Google Developer Events" entry.
- Enhance UI legibility by increasing font size and vertical spacing.
- Display natural titles (e.g., "AI Infrastructure Series") instead of file-slugs (e.g., "ai-infrastructure-series.pdf").
- Adhere to the "No Git" constraint for implementation.

## Data Changes (`src/data/education.ts`)
Consolidate individual event certificates into a nested structure.

### New Group: Google Developer Events
- **Title:** Google Developer Events
- **Issuer:** GDG Zamboanga
- **Year:** 2023 - 2025
- **Icon:** 🌟
- **Sub-certificates:**
    - Google DevFest Zamboanga Peninsula 2025 (pdf: `/cert-devfest-2025.pdf`)
    - Google I/O Extended 2024 (pdf: `/cert-google-io-2024.pdf`)
    - DevFest 2023 (pdf: `/cert-devfest-2023.pdf`)

## UI Changes (`src/components/sections/certifications-list.tsx`)

### Row Component Styling
- **Font Size:** Change `text-[13px]` to `text-[15px]`.
- **Vertical Spacing:** Change `py-1` to `py-3` on the `ModalTrigger`.
- **Title Logic:** Replace `{slug(cert.title)}` with `{cert.title}` in the `ModalTrigger`'s main span. This removes the `.pdf` extension from the list view.

### Group Display Logic
- Ensure the "Google Developer Events" group correctly triggers the nested modal view implemented in the previous phase.

## Implementation Steps
1. Modify `src/data/education.ts` to restructure the `certifications` array.
2. Modify `src/components/sections/certifications-list.tsx` to update styles and title logic.
3. Manually verify the layout in the browser.
