# Day 1 Revamp + Cross-Cutting Polish — Plan

## What you're asking for

1. **Day 1 landmarks should match the three real pins**: Airport, Intramuros, Mall of Asia — each location needs its own recognisable landmark instead of generic palm trees.
2. **Fill the whole screen** — no empty green gaps anywhere.
3. **Pixel-art style** — the landmarks should look like "2D Pokémon digital art" (chunky hard-pixel squares), not smooth vector shapes.
4. **Pokéball** — bigger, and it should *pop* (glow, float, drop shadow) so it reads clearly as the interactable.
5. **Pikachu hero is cut off** at the top of its sprite box.
6. **Trees** — fetch from PokéAPI or another open-source repo instead of hardcoded SVG.

---

## Problem 5 — Hero sprite clipping

### Root cause
`<foreignObject x={-48} y={-56} width="96" height="104">` bounds the hero div. PokéAPI sprites are 96×96 and centred in their frame, which means the top ~8px (ears) often spill into the top padding. When the hero is near the top of the SVG viewBox, that padding is clipped by the viewBox edge, cutting the ears off.

Also when the ✓ "defeated" badge or the "!" prompt sits near the hero, our hero's foreignObject may render *under* it awkwardly.

### Fix
Enlarge the foreignObject to 120×120 and re-centre it (`x=-60 y=-70`). Add extra padding so the 96px sprite sits fully inside with room above/below. Clip-safe.

---

## Problem 4 — Pokéball should "pop"

### Current
48–60px PokéAPI items PNG inside a `<foreignObject>`. No animation.

### Fix
- Scale up to **72–90px**.
- Wrap in a `<motion.g>` that **idles with a 3px bob** + scale pulse 1.0 ↔ 1.06.
- Add an outer **pulsing golden glow ring** (radial gradient, 0 → 1 opacity loop, 1.5s).
- Drop shadow: soft `filter: drop-shadow(0 4px 4px rgba(0,0,0,0.5))`.
- When the hero is nearby, ring goes brighter + faster.

---

## Problem 6 — Trees from open source

### Honest status of APIs
- **PokéAPI** has no generic tree sprite. It has Pokémon that *look like* trees: Sudowoodo (dex 185), Trevenant (dex 708), Exeggutor (dex 103), Phantump (dex 708). Using these works but they're recognisably Pokémon, not ambient trees.
- **PokéAPI items** has mushrooms, berries, stones — no trees.
- **Kenney Tiny Town / Nature packs** are CC0 and mirrored on GitHub. We can wire `raw.githubusercontent.com/kenney-assets/…` URLs directly into our existing `PokemonSprite` URL-fallback chain.
- **OpenGameArt** — no stable URL scheme; each asset has an individual download page. Not API-able.

### Recommendation
Two-layer approach:

1. **Primary trees**: draw new **pixel-art SVG trees** using hard 4px-grid rectangles (true "Pokémon map tile" aesthetic — chunky, 3-color shading, sharp edges). No dependency, infinite sharp scale. 3 variants: oak, pine, palm.
2. **Accent "Pokémon-trees"**: at 2–3 spots per map, use the PokéAPI sprite of a tree-like Pokémon (Sudowoodo or Exeggutor) as a fun easter-egg decoration. Uses the same URL chain we already have.

This gets you "Pokémon game vibe" without requiring a third-party tileset download.

---

## Problem 1 — Day 1 landmark revamp

Replace the current Day 1 scatter with landmarks that match each of the three pins. **Pixel-art style** for all.

### Landmark components to build (pixel-art SVG)

All new components in `scene-sprites.tsx` drawn on a **4px grid** with hard colors + 2px black outlines. No smooth curves. They'll look like map tiles from a handheld Pokémon game.

#### 1. `AirportTerminal` — sits behind the Airport pin
- Wide white rectangular terminal building with blue glass strip windows
- Rooftop "NAIA" sign
- Parallel runway lines extending to the right (sandy taupe)
- A parked airplane on a stand (reuse the existing `Plane` but repositioned)

#### 2. `ControlTower` — next to AirportTerminal
- Tall cylindrical grey tower
- Glass control room at the top (blue tinted)
- Red aviation light that blinks

#### 3. `IntramurosGate` — behind the Intramuros pin
- Stone archway (grey blocks, hard-edged pixel style)
- Spanish-style wooden double doors
- Flag on the battlements
- Stone wall extending left and right

#### 4. `StoneWallSegment` — extends from the gate to fill the zone
- Repeatable wall section (grey stone blocks, crenellations on top)
- Can tile multiple to form a long wall across the middle of the zone

#### 5. `MOAShoppingMall` — behind the Mall of Asia pin
- Large flat mall building (beige + blue glass facade)
- "MALL OF ASIA" sign on the roof
- Keep the existing `MOAGlobe` in front of it

#### 6. `ShoppingBag`, `FoodStall`, `TrolleyCart` — fillers around MOA

#### 7. `PixelPalm` — re-skin of `PalmTree` in pixel-art style
- Hard-edge trunk (brown rects, alternating shade)
- Green fronds as 4px-grid triangles (not smooth curves)

### Day 1 layout (fills the whole map)

```
          [SHIP]               [control tower]
     [cloud] [cloud]      [AIRPORT TERMINAL]
  [airport pin]  [INTRAMUROS GATE + wall wall]  [MALL BUILDING]
  [PALMS]         [stone wall] [stone wall]      [MOA GLOBE + BAGS]
  [lifeguard]  [fountain]    [INTRAMUROS pin]    [MOA pin]
  [umbrellas]                                    [palms]
```

Layers: horizon mountains (existing) → cityscape silhouette → per-landmark zone → pins + hero on top.

---

## Problem 2 — Fill the whole screen

The SVG viewBox is 900×700 but the playable band is ~y=200-650. Outside that range is sky + foreground, still visible. Need to populate those areas.

### Plan
- **Sky band (y=0–180):** clouds, seagulls, plane (existing) + 2 more distant planes + a hot air balloon
- **Mid band (y=180–260):** mountains, ship, faraway buildings (currently sparse)
- **Main zone (y=260–600):** the 3 landmark landmarks described above + wall + decorations
- **Foreground band (y=600–700):** palms, benches, flower clusters, stone wall extensions

---

## Problem 3 — Pixelated aesthetic

### What "pixel-art SVG" looks like
- All shapes are `<rect>` on integer coordinates
- Fill colors from a limited 3–4 shade palette per object (main + shadow + highlight)
- No bezier curves, no blur filters, no gradients (except tiny "sparkle" spots)
- 2px black outlines on silhouettes, drawn as separate rect layers

### Global fix
- Add `shape-rendering="crispEdges"` to the SVG root → browser never antialiases any shape
- Add `image-rendering: pixelated` to the top-level container
- New landmark components all follow the 4px-grid rule

The existing smooth-curve landmarks (Lighthouse, Volcano, etc.) will look slightly out of place, so we rebuild them in the same pixel style in a follow-up if you want — not this round.

---

## Proposed execution phases

### Phase 9A — Fix hero clipping + Pokéball pop (~30 min)
- Expand foreignObject to 120×120.
- Wrap PokeBall in a motion.g with idle bob + pulse + glow ring.
- Scale PokeBall default size 48 → 72 (near = 60 → 88).

### Phase 9B — Build the Day 1 landmark set (~1.5 h)
- Add 6 new pixel-art landmarks to `scene-sprites.tsx`:
  - `AirportTerminal`, `ControlTower`, `IntramurosGate`, `StoneWallSegment`, `MOAShoppingMall`, `PixelPalm`
- Add filler props: `ShoppingBag`, `HotAirBalloon`
- Rewrite `case 1` in `DayLandmarks` to use the new set + remove generic scatter
- Stretch landmarks across the full viewBox so no band is empty

### Phase 9C — PokéAPI tree accents (~20 min)
- Add an `AccentCreatureSprite` component that loads a PokéAPI Pokémon sprite by dex id (e.g. Sudowoodo=185) via the existing URL chain
- Scatter 2–3 per day as visual easter eggs
- On Day 1: maybe one Sudowoodo (tree-Pokémon) near Intramuros ruins

### Phase 9D — Pixelated rendering hints (~10 min)
- Add `shapeRendering="crispEdges"` to the overworld SVG element
- Ensure all new landmark components use integer coordinates only

### Optional Phase 9E — Apply same pixel-art treatment to Days 2–6
Same approach, but iterated per day. ~30 min per day.

---

## Critical files

```
src/components/adventure/scene-sprites.tsx         # new Day 1 landmarks + PixelPalm + fillers
src/components/adventure/adventure-screens.tsx     # updated Day 1 case, PokeBall wrap, hero foreignObject size
```

---

## Verification

1. Day 1 `/adventure` shows: airport terminal + control tower + parked plane behind Airport pin; stone gate + wall behind Intramuros pin; mall building + globe behind MOA pin. Every region of the viewBox has something to look at.
2. All Day 1 landmarks have the chunky pixel-art feel — zoom in, you see hard rectangular edges, no antialiasing.
3. Pokéballs visibly pulse + bob + have a gold glow around them. Can't miss them.
4. Hero sprite is never clipped regardless of position (ears always visible).
5. Walking remains smooth 60fps.

---

## Estimated effort

9A (~30 min) + 9B (~1.5 h) + 9C (~20 min) + 9D (~10 min) = **~2.5 hours** to ship the Day 1 revamp end-to-end.

Optional Days 2-6 iteration: ~30 min per day if you like the Day 1 result.
