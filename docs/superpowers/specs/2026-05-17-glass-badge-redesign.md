# Design Spec: Glass Badge (Hybrid UI/UX Redesign)

## Objective
Elevate the certifications modal experience by blending immersive interactive elements (Option B) with professional, minimalist structure (Option C). The goal is to make earned credentials feel like high-value, collectible achievements.

## Visual Design

### 1. The "Glass" Modal
- **Background:** `backdrop-filter: blur(12px)` with a semi-transparent white/ink background (depending on theme).
- **Border:** Thin, subtle border (`1px solid rgba(var(--ink), 0.1)`) to define edges without adding weight.
- **Shadow:** Deep, multi-layered shadow to create high elevation.

### 2. Immersive Badge Container
- **Interactive Holograph:** Badges will feature a dynamic shimmer/sheen effect that moves as the 3D tilt interaction occurs.
- **Entrance Animation:** Shared element-style transition where the badge scales up and fades in from the point of origin.

### 3. Professional Sidebar & Progress
- **Layout:** A fixed-width sidebar (visible on desktop) containing the course navigation.
- **Progress Tracker:**
    - **Logic:** `(selectedCount / totalCount) * 100`.
    - **Visual:** A sleek, thin progress bar with numeric indicator (e.g., "4/6 completed").
    - **Completion State:** If 100%, the bar turns a "success" color (e.g., Google blue or green).

## Component Architecture

### `CertificationModal` (Refactored `Row`)
- **State Management:** Track `selectedSubIndex` to calculate progress and handle transitions.
- **Layout Split:**
    - **Sidebar Component:** Handles module listing and progress rendering.
    - **Preview Component:** Handles the 3D tilt, holographic image, and verification links.

## Technical Implementation
- **Motion:** Use `framer-motion` for the holographic shimmer (animating a linear gradient overlay).
- **Styles:** Use Tailwind's `backdrop-blur` and `bg-opacity` utilities.
- **Responsive:** Sidebar collapses to a top-scrollable module list on mobile devices to preserve screen real estate.

## Success Criteria
- Opening a collection (e.g., "Google Cloud AI Infrastructure") feels fluid and responsive.
- The user can clearly see their progress through a certification series.
- The badges feel tactile and "physical" due to the 3D tilt + holographic shimmer combo.