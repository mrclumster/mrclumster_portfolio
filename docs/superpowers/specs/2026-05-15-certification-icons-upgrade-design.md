# Design Spec: Certification Icons Upgrade (Monochrome Minimalist)

Replace existing emojis in the certifications section with a professional, monochrome icon system using Lucide React to match the terminal/developer aesthetic.

## Goals
- Replace all emojis with high-quality SVG icons from the `lucide-react` library.
- Implement a consistent "Monochrome Minimalist" style (Option A).
- Update the data structure to store icon names instead of emoji strings.
- Strictly adhere to the "No Git" constraint.

## Icon Mapping
Each certification category will be mapped to a specific Lucide icon:

| Category / Keyword | Lucide Icon | Rationale |
|--------------------|-------------|-----------|
| Google IT Support | `Wrench` | Represents technical support/tools |
| Google Cloud | `Cloud` | Standard cloud representation |
| AI Infrastructure | `Cpu` | Represents compute/AI hardware |
| Google DevEvents | `Sparkles` | Represents events/inspiration |
| Civil Service | `Landmark` | Represents government/official status |
| Google I/O | `Terminal` | Represents developer-focused event |

## Data Changes (`src/data/education.ts`)
Update the `icon` field in the `certifications` array (and sub-certificates) from emoji strings to icon identifiers or components.

## UI Changes (`src/components/sections/certifications-list.tsx`)
- Import the required icons from `lucide-react`.
- Create an `IconComponent` mapper or pass icons directly.
- Wrap the icon in a subtle container:
  - Padding: `p-2`
  - Background: `bg-[color:var(--ink)]/5`
  - Border: `border border-[color:var(--ink)]/10`
  - Border Radius: `rounded-md`

## Implementation Steps
1. Update `src/data/education.ts` with the new icon mappings.
2. Update `src/components/sections/certifications-list.tsx` to import and render `lucide-react` icons.
3. Clean up the `icon` display logic to handle the new components/strings.
4. Verify the visual alignment and sizing.
