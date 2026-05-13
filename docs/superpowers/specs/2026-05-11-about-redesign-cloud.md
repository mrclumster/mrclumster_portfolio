# Design: About Section Redesign with Cloud the Cat

## Goal
Redesign the "About" section to be more professional, catchy, and interactive. This includes updating the bio text, categorizing the tech stack cleanly, and introducing an interactive "Side Pet" named **Cloud** (a black and white tuxedo cat).

## Proposed Changes

### 1. Bio Content Update (`src/data/personal.ts`)
- **Tone**: Professional, punchy, and impact-focused.
- **Narrative**:
    - Paragraph 1: Identity as a Fullstack Developer. Highlight **FishFresh** (AI-driven food safety) and **Barangay Connect** (digital governance).
    - Paragraph 2: Skills and passion for solving real-world problems.
    - Call to Action: "I build for impact. Scroll down to see these projects in action."
- **Hidden Notes**: Preserve the `secret` note type for "Easter eggs" revealed on selection.

### 2. Categorized Tech Stack (`src/components/sections/stack-table.tsx`)
- **Layout**: Replace the single list with a clean 2x2 or 2x3 grid.
- **Categories**:
    - **Frontend**: Next.js, React, TypeScript, Tailwind CSS.
    - **Backend**: Node.js, Python (FastAPI), PostgreSQL, SQL.
    - **Specialized**: PyTorch (ML), OpenCV (Computer Vision).
    - **Tools**: Docker, Git, Vercel, Linux.
- **Visuals**: Maintain the monospaced, minimal aesthetic with subtle category labels.

### 3. "Cloud" the Side Pet (`src/components/shared/side-pet.tsx`)
- **Character**: A pixel-art black and white tuxedo cat named Cloud.
- **Behavior**:
    - **Walking**: Walks horizontally along the bottom edge of the About section.
    - **Boundaries**: Reverses direction when hitting the container edges.
    - **Interactivity**: 
        - Clicking Cloud triggers a "jump" or "spin" animation.
        - Displays a random speech bubble (e.g., "Meow!", "Ready for adventure!", "Cloud is watching the code!").
- **Implementation**:
    - Use `framer-motion` for smooth movement and interaction animations.
    - Component will be placed at the bottom of the `AboutTerminal` section.

## Success Criteria
- Bio is under 30 seconds to read but covers all major professional points.
- Tech stack is scannable and organized by domain.
- Cloud the Cat is non-intrusive but adds a layer of "fun" and personality.
- Responsiveness: Cloud stays within the About section boundaries on all screen sizes.

## Testing Strategy
- Verify that "Cloud" does not overflow its container on mobile.
- Test "Select to Reveal" logic on the new bio text.
- Confirm click interactions and speech bubbles appear correctly.
