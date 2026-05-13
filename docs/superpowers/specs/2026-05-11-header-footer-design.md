# Design: Friendly Modern-Vintage Header & Footer

## Goal
Redesign the global Header and Footer to be more inclusive and approachable for both technical and non-technical audiences. Move away from technical terminal jargon (branch names, system stats) toward a human-centric, "Friendly Modern-Vintage" aesthetic using the `@aziztebbeng` handle.

## Proposed Changes

### 1. Global Header (`src/components/terminal/terminal-frame.tsx`)
- **Branding**: Replace `aziz@portfolio :~ % cat index.md` with a clean `@aziztebbeng` handle.
- **Navigation**:
    - Keep the existing navigation links (`ABOUT`, `WORK`, `CONTACT`, `RESUME`).
    - Simplify the visual layout to a single horizontal line with a bottom border.
    - Keep the theme toggle `[light/dark]` as a subtle interactive element.
- **Aesthetics**:
    - Use a simple solid border instead of complex terminal headers.
    - Add a subtle ASCII "texture" line (e.g., `::::::::::::`) just below the header for visual interest.

### 2. Global Footer (`src/components/terminal/terminal-frame.tsx`)
- **Content**:
    - Replace the blinking terminal cursor and system prompt with human-readable notes.
    - Left side: "Hand-crafted with code. Based in Algeria."
    - Right side: Links to social platforms (GitHub, LinkedIn) and an "Available for new projects" status indicator.
- **Layout**:
    - Use a two-column grid layout for better information hierarchy.
    - Maintain the monospaced font to preserve the digital identity.

### 3. Visual Style
- **Typography**: Mono-font (Courier New or project default) for a consistent "digital" feel.
- **Approachability**: No jargon, clear labels, and a warm "sign-off" feel in the footer.

## Success Criteria
- The header and footer feel "designed" and intentional, not just like a raw terminal window.
- Navigation remains clear and prominent.
- The branding `@aziztebbeng` is consistently applied.
- The page feels approachable to a non-technical recruiter while remaining "cool" for a fellow developer.

## Testing Strategy
- Verify responsiveness across mobile, tablet, and desktop.
- Confirm dark/light theme compatibility for all new elements.
- Ensure all navigation links function correctly.
