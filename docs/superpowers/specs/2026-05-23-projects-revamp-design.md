# Design Spec: Projects Section Revamp (v2 - Professional Icons)

**Date:** 2026-05-23  
**Status:** Approved  
**Topic:** Transitioning "Selected Works" to a comprehensive "Projects" directory with professional Lucide icons.

## 1. Overview
The goal is to move away from a visual-heavy "Selected Works" section with 3 projects to a professional, clean "Projects" directory featuring 8 projects. This version replaces emojis with professional, consistent stroke icons from the `lucide-react` library.

## 2. Target Audience
Non-technical stakeholders, recruiters, and technical peers. The design is clean, organized, and "professional" (Option B: The Dev Directory).

## 3. Visual Design (The "Dev Directory")

### 3.1. Layout
- **Grid:** A 2-column grid on desktop, 1-column on mobile.
- **Card Style:** Minimalist tiles with a subtle border (`var(--ink)` at low opacity).
- **Background:** Solid paper background (`var(--paper)`).
- **No Images:** Images are removed entirely.

### 3.2. Professional Icons (Lucide)
Emojis are replaced with the following Lucide icons:
- **FishFresh:** `ScanEye`
- **Portfolio Website:** `LayoutTemplate`
- **Calarian Connect:** `Building2`
- **Secure Login:** `ShieldCheck`
- **Global Energy Tycoon:** `Zap`
- **Tycoon Monopoly:** `Gamepad2`
- **Blue Thunder POS:** `Receipt`
- **Active Directory Lab:** `Server`

### 3.3. Highlighting (Major Projects)
Two projects (**FishFresh** and **Barangay Connect**) will be highlighted as "Major Projects":
- **Badge:** A small, elegant pill badge (e.g., "Major Project") in the top-right corner.
- **Vertical Accent:** A 3px vertical line on the left edge of the card using the project's `gradientColor`.

## 4. Technical Implementation

### 4.1. Libraries
- **Tailwind CSS 4:** For modern grid layout and utility styling.
- **Framer Motion:** Staggered entry animations and subtle hover "lift".
- **Lucide React:** For professional UI icons.

### 4.2. Icon Rendering
The `projects.ts` data will store icon names as strings. The `ProjectsLog` component will dynamically import or map these strings to Lucide components for rendering.

## 5. Success Criteria
- [x] 8 projects are displayed in a uniform grid.
- [x] No images are used in the project cards.
- [x] Emojis are replaced by professional Lucide icons.
- [x] FishFresh and Barangay Connect are visually distinct but fit the uniform grid.
- [x] The section is renamed from "Selected Works" to "04 / Projects".
