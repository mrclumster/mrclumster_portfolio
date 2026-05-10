# Spec: Sentient Constellation Eye Cloud

**Date:** 2026-05-10
**Topic:** Redesign of the `CursorEyes` component into an organic, diverse "Rainbow Cloud" of 16+ tracking eye species.

---

## 1. Overview
The current `CursorEyes` component is a static linear row of 5 eye pairs. This redesign replaces it with a dynamic, organic "cloud" of eyes arranged in a parabolic arc above the profile photo. Every eye is unique, belonging to one of 16 "species," and features reactive idle states.

## 2. Visual Design
### The Arc (Rainbow Cloud)
- **Geometry:** Eyes are positioned along a parabola $y = ax^2$ centered above the `PhotoFrame`.
- **Organic Dithering:** Each eye has a random positional offset (+/- 20px) to prevent a "perfect" line.
- **Population:** 16–22 individual eyes (not necessarily pairs).

### The Species (Diversity)
1.  **Classic:** Standard circular eye.
2.  **Observer:** XL eye, thick border, heavy pupil.
3.  **Glitch:** Square brackets `[ . ]`, fast pupil.
4.  **Lash:** `// . \\` with CSS lashes.
5.  **Cyber:** `< . >` or `{ . }` code-styled.
6.  **Feline:** Vertical slit pupil.
7.  **Hollow:** Borderless, floating pupil.
8.  **Binary:** Two pupils in one socket.
9.  **Recursive:** Eye-inside-an-eye.
10. **Clockwork:** Rotating socket.
11. **ASCII:** `(o_O)` character-swapping text eye.
12. **Pulse:** Throbbing/scaling socket.
13. **Orbit:** Central pupil with satellite pupils.
14. **Cross-Hair:** Target reticle `(+)`.
15. **Static:** Noise/starfield background in the "white" of the eye.
16. **Shadow:** Inverted colors (black socket, white pupil).

## 3. Interaction Logic
### Modes
- **Idle Mode (Mouse outside Hero):**
    - **Floating:** Staggered sine-wave vertical movement.
    - **Scanning:** Random pupil movement every 3-5 seconds.
    - **Blinking:** Individual random blink intervals.
- **Tracking Mode (Mouse inside Hero):**
    - **The Snap:** Eyes orient toward the cursor.
    - **Weighted Movement:** Large eyes have high inertia (slow); tiny eyes are jittery (high frequency).

## 4. Technical Architecture
### Components
- `CursorEyeCloud.tsx`: Container component. Calculates arc layout, manages global/hero-local mouse tracking.
- `EyeSpecies.tsx`: A registry of render functions for each eye type.
- `IndividualEye.tsx`: Manages its own internal animation states (float, blink, tracking interpolation).

### Performance
- Use `requestAnimationFrame` or `framer-motion` for smooth movement.
- Throttled mouse tracking.
- CSS-only animations for idle "floating" to reduce JS main-thread load.

## 5. Success Criteria
- [ ] Eyes follow a curved "rainbow" path above the photo.
- [ ] At least 16 different species are represented.
- [ ] Eyes "breathe" while the mouse is idle.
- [ ] No layout shift on page load.
- [ ] Smooth transition between Idle and Tracking modes.
