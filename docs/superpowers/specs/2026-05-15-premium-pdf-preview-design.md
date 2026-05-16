# Design Spec: Premium 3D PDF Preview

Replace the standard browser PDF viewer (iframe) with a custom, chrome-less rendering solution that features a 3D tilt effect on hover.

## Goals
- Remove the browser's default black background and UI around PDFs.
- Render PDF pages directly as high-quality canvases/images.
- Add an interactive 3D tilt effect using `framer-motion`.
- Ensure fast loading and clean fallback states.
- Adhere to the "No Git" constraint.

## Technology Stack
- **Library:** `react-pdf` (for rendering PDF to Canvas).
- **Animation:** `framer-motion` (for 3D transform and hover states).
- **Worker:** `pdfjs-dist` worker via CDN (to avoid large local bundles).

## UI Components

### `CertificatePreview` Component
A new internal component to handle the rendering and animation:
- **Perspective Container:** A wrapper with `perspective: 1000px`.
- **Motion Card:** A `motion.div` that handles `rotateX` and `rotateY` based on mouse position.
- **PDF Document:** Renders the first page of the provided `pdfUrl`.
- **Loading UI:** A themed skeleton loader that matches the terminal aesthetic.

## Changes to `src/components/sections/certifications-list.tsx`
- Replace the `<iframe>` tag with the new `CertificatePreview` component.
- Ensure the preview area container handles the aspect ratio of a standard certificate (usually US Letter or A4 landscape).

## Implementation Steps
1. Install dependencies: `npm install react-pdf`.
2. Update `src/components/sections/certifications-list.tsx` to include the `react-pdf` setup and the 3D motion logic.
3. Configure the PDF worker using the official CDN.
4. Manually verify the 3D interaction and visual quality.
