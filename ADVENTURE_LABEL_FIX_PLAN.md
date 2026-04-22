# Pin Label Redesign Plan

## Problem

Every photo pin has a **name sign rendered directly below the Pokéball** via `pin.y + 28` offset. Because Pokéballs are now 72-88 px tall and sit *above* their landmarks, the labels overlap the landmarks they were meant to annotate:

- "LA TRINIDAD STRAWBERRY FARM" crosses the strawberry trellis + harvest cart
- "BELL CHURCH" splits the pagoda in half
- "BAGUIO ARRIVAL" covers the bus station door
- "DAY 6 PHOTO DUMP" floats across the Burnham lake

It's noisy, chops up the pixel art, and fights for attention with the pins themselves.

Relevant file: [src/components/adventure/adventure-screens.tsx](src/components/adventure/adventure-screens.tsx) — search for the `{/* Name sign */}` block inside the pins render loop. Long names get sliced with `.slice(0, 14)` which truncates but still renders a 120-px-wide rectangle.

---

## Four options

### Option A — **Hover-reveal floating tag** *(recommended)*

Remove the always-on label entirely. When the player walks near a pin, a small pixel-pill tag smoothly fades in **above** the pokeball (not below) showing the full name. Fades out when the player walks away. Like Zelda's waypoint tooltips.

- **Default state:** just the glowing Pokéball. Scene breathes, landmarks are visible.
- **Near state:** the existing `nearestId` proximity check (same radius that lights up the pin) shows the name tag above it.
- **Benefit:** zero screen clutter most of the time. You see the label exactly when you need it — the moment you approach.

### Option B — **Compact tag above pin, always visible**

Keep labels always on, but make them smaller and move them **above** the pokeball (not below). Use a tighter pixel-pill with smaller font. Landmarks stay clean because all labels sit in the sky band above the pins.

- **Pro:** familiar, always-readable.
- **Con:** you still have 5 small floating labels in the scene at all times.

### Option C — **Numbered pin + side legend**

Replace big text with just the day number already on the pokeball + a corner "legend" panel (top-right or bottom-right) showing `1 — BAGUIO ARRIVAL / 2 — LA TRINIDAD / 3 — BELL CHURCH / 4 — PMA / 5 — BURNHAM PARK`. Clean scene, clean index.

- **Pro:** minimalist, references older RPG map screens.
- **Con:** loses the direct link between label and landmark; player has to scan legend.

### Option D — **Bottom HUD card when near**

Same as Option A, but the label appears in a fixed card at the **bottom of the screen** (like a status line) rather than floating above the pin. More modern-MMO style.

- **Pro:** label always in the same screen position; easier to read.
- **Con:** breaks the pixel-art scene language since it's a HUD element, not part of the world.

---

## My recommendation

**Option A — hover-reveal floating tag.** It fixes the clutter completely (default state is clean) and keeps the label tied to the landmark it describes. The proximity system and `nearestId` state already exist, so it's cheap to wire.

Fallback: if you want labels always visible, go with **Option B**.

---

## Option A implementation sketch

### Change the pin render block

Currently (in `case 5`/`case 6` pin loop):

```tsx
<g key={pin.id}>
  <circle .../> {/* glow */}
  <PokeBall .../>
  <g transform={`translate(${pin.x}, ${pin.y + 28})`}>
    <rect x={-60} y={0} width="120" height="22" ... />
    <text .../> {/* always on, below pin */}
  </g>
</g>
```

Becomes:

```tsx
<g key={pin.id}>
  <circle .../> {/* glow */}
  <PokeBall .../>
  {nearestId === pin.id && (
    <motion.g
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transform={`translate(${pin.x}, ${pin.y - 56})`}
    >
      <rect x={-70} y={-10} width="140" height="20" rx="3"
            fill={POKE.dialogBg} stroke="#1a1a2a" strokeWidth="2" />
      <rect x={-66} y={-6} width="132" height="2"
            fill={POKE.dialogBorderInner} />
      <text x={0} y={4} textAnchor="middle" fontSize="8"
            fill={POKE.text} fontFamily="'Press Start 2P', monospace">
        {loc?.name.toUpperCase()}
      </text>
      {/* small ▼ tail pointing down at the pin */}
      <path d="M -4 10 L 4 10 L 0 14 Z" fill={POKE.dialogBg} stroke="#1a1a2a" strokeWidth="1" />
    </motion.g>
  )}
</g>
```

### Details

- **Position:** `pin.y - 56` — above the pokeball's glow ring
- **Trigger:** only render when `nearestId === pin.id` (already tracked)
- **Fade:** Framer Motion with 150 ms opacity + slight y slide
- **Visual:** same white Pokémon-dialog style as existing prompts, with a small ▼ tail pointing to the pin below
- **Full name:** no more `.slice(0, 14)` truncation — since only one is visible at a time, we can show the full name
- **Font size:** 8 px (same as before), width auto-grows via explicit rect sized to text length OR a fixed 140 px that handles most names

### Keep "PRESS A" prompt logic separate

The "PRESS A" prompt (which only shows when **very** close + not yet interacted) is already wired. We keep it below the pin for interaction clarity. The new name tag sits **above** the pin. Both can be visible simultaneously:

```
      [LA TRINIDAD STRAWBERRY FARM]
                  ▼
              (pokeball)
                  ▲
            [PRESS A]
```

Clear visual hierarchy.

---

## Files to modify

Only [src/components/adventure/adventure-screens.tsx](src/components/adventure/adventure-screens.tsx) — just the pin render block inside `DayOverworld`. Remove the always-on sign, add the proximity-conditional motion.g above.

## Verification

1. Open any day at `/adventure`.
2. Default state — landmarks fully visible, only glowing pokeballs + a "1", "2" etc. number inside each.
3. Walk near a pin — a clean pixel dialog tag fades in **above** the pokeball showing the full location name with a small ▼ pointer.
4. Walk away — tag fades out.
5. Multiple pins never show labels at the same time (only the nearest one).
6. "PRESS A" prompt still appears below the pin for interaction — no conflict.

## Estimated effort

~15 minutes. Single file, single render block.
