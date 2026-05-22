# Design Spec: Projects Section - Spotlight Effect

**Date:** 2026-05-23  
**Status:** Approved  
**Topic:** Adding a premium "Spotlight Grid" mouse-following effect to the Projects section.

## 1. Overview
This design adds a high-end, interactive "Spotlight" effect to the Projects directory. As the user moves their mouse over the project grid, a subtle radial gradient follows the cursor, illuminating the borders and backgrounds of the project cards. This is a common industry standard on premium engineering sites like Vercel and Linear.

## 2. Visual Interaction
- **Spotlight:** A radial gradient (~450px radius) that follows the mouse cursor.
- **Border Illumination:** The 1px borders of the project cards will transition from low opacity to high opacity when "hit" by the spotlight.
- **Background Glow:** A very subtle inner glow will appear within the cards, creating depth.
- **Responsiveness:** The effect will only be active on devices with a mouse (pointer: fine).

## 3. Technical Implementation

### 3.1. Tracking Logic
- We will use a `useMouseMove` hook at the container level (`ProjectsLog`) to track `mouseX` and `mouseY` relative to the grid.
- Coordinates will be passed to a CSS variable or a motion value to avoid unnecessary React re-renders of all cards.

### 3.2. Styling
- **Container:** `group/grid` class to coordinate state between cards.
- **Masking:** Use `mask-image` or a layered `before/after` pseudo-element with a radial gradient to create the "light" effect.
- **CSS:** Use Tailwind 4's utility classes for smooth transitions and opacity control.

### 3.3. Performance
- Use `framer-motion`'s `useMotionValue` and `useSpring` for smooth, lag-free cursor tracking.
- Ensure the effect is disabled on mobile/touch devices to save battery and processing power.

## 4. Success Criteria
- [ ] A subtle light follows the mouse cursor over the project grid.
- [ ] Card borders "light up" as the mouse passes near them.
- [ ] Performance remains smooth (60fps).
- [ ] No git commands are used during implementation.
