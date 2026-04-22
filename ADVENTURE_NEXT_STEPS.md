# Adventure Game — Phase 8 Plan

## What's being asked

1. The day maps feel **empty** — big blank green regions.
2. **Hero** and **Pokéball** on the overworld look small.
3. Landmark / terrain artwork should come from **open-source APIs** (like how we already pull creature sprites from PokéAPI), not hardcoded SVGs.
4. **Movement feels laggy** on the overworld.

Goal: fill each day's map with dense, themed decoration pulled from public sources where possible, scale up hero + pokéball so they read clearly, and smooth movement.

---

## Problem 1 — Movement lag (quick fix)

### Root cause
The overworld hero is driven by two things fighting each other:

1. `setInterval(tick, 1000/60)` writes a new `pos` state every ~16ms.
2. Framer Motion's `<motion.g animate={{ x, y }} transition={{ duration: 0.05 }}>` **tweens** between those values over 50ms.

So every 16ms a new target arrives while Framer is still mid-interpolating the previous one. Overlapping tweens + React re-renders on every state change = visible jitter/lag.

Also, the map is **heavily animated**: ferris wheel (rotating 8 gondolas + spokes), 2 steaming volcanoes, 30+ falling snowflakes, confetti, butterflies, clouds, seagulls, leaves, stars — all running SVG `<animate>` or Framer Motion concurrently. On a modest laptop the browser's SVG compositor gets taxed.

### Fix plan
- **Drop the Framer tween on the hero**: set `transition={{ duration: 0 }}` or use `style={{ transform: ... }}` directly so position changes are instantaneous. The 60Hz tick is smooth enough on its own.
- **Throttle ambient animations** when the tab isn't focused (`document.hidden`) — pause.
- **Move keys → position** logic entirely into a `useRef` and only commit to `useState` for render. Avoids a React re-render every single tick.

**Estimated: 15 min.**

---

## Problem 2 — Hero + Pokéball too small

### Current sizes
- Hero: `renderSprite(56, { animated: true })` → 56px × 56px
- Wild Pokémon on map: 64px × 64px
- Pokéball pin: 64px tall (approx, from the SVG) + 34px tall name sign

### Target sizes
- Hero: **96px × 96px** (scale up about 1.7×)
- Wild Pokémon: **96px × 96px**
- Pokéball pin: **72px × 72px** (from PokéAPI items repo — see below)

### Fix plan
- Change `renderSprite(56, { animated: true })` → `renderSprite(96, { animated: true })` for hero.
- Change wild rendering `renderSprite(64, { animated: true })` → `renderSprite(96, { animated: true })` and resize the `foreignObject` + positioning accordingly.
- Replace the custom Pokéball SVG pin at each photo location with the **real Pokéball sprite** from PokéAPI (see Problem 4 below).

**Estimated: 20 min.**

---

## Problem 3 — Empty space per day (density)

### The complaint
Looking at Day 5 (Summit) in particular — a huge zone with just a ferris wheel, gazebo, 3 pine trees, and a distant volcano. The rest is flat green.

### Fix plan
Triple the decor count per zone. Each day should have roughly 20–30 landmarks scattered across the map. Add:

| Day | New items |
|---|---|
| 1 — Arrival | more palm trees, ship silhouette on water, seagulls, lifeguard tower, starfish |
| 2 — Urban | traffic lights, bus stops, store front signage, bike racks, park bench |
| 3 — Nightfall | more streetlamps, billboards, parked cars, fire hydrant, fountain, moon reflection |
| 4 — Nature | more trees/flowers, berry bushes, camping tent, picnic table, stream |
| 5 — Summit | more pines, cable car, viewing telescope, rock formations, waterfall |
| 6 — Highland | more pagodas, lanterns, wooden bridge, stone steps, snowman |

Procedurally scatter the existing decor types + add 2–3 new landmark components per day.

**Estimated: 1.5h.**

---

## Problem 4 — Can we fetch aesthetics from APIs / GitHub?

### Honest answer: **partially**

There is **no single API** for "Pokémon-style terrain / trees / buildings" the way PokéAPI exists for creatures. But we have good free sources:

### (A) PokéAPI items repo — **fully API-accessible** ✅
The same GitHub repo (`PokeAPI/sprites`) has an `items/` folder with every Pokémon item sprite as PNG:
- `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png`
- `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png`
- `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png`
- Berries, potions, evolution stones, etc.

Item names come from the PokéAPI REST endpoint `/api/v2/item?limit=2000`.

**Use for:** Pokéball pins on photo frames, berry bushes on Day 4, evolution stones on Day 6 shrine, items scattered on paths.

### (B) PokéAPI sprites/misc — **partial** ⚠
Same repo has `misc/` with badges, dungeon-map tiles, and ribbons. Limited, but free.

### (C) External tileset APIs — **no true API exists**
What exists:
- **Kenney.nl** tilesets (CC0) — must download a zip, not API-driven. But the packs are on GitHub mirrors like `github.com/Kenney-nl/*`, so you could raw-fetch individual PNGs at runtime.
- **OpenGameArt.org** — fan-submitted Pokémon tilesets. No stable API; each asset has its own page.
- **itch.io** — many free Pokémon-style packs; all downloads, no API.

### (D) tiles.openfreemap.org / openstreetmap — **works but not Pokémon aesthetic**
Real map tiles (we used this earlier in the Leaflet attempt). Accurate but doesn't match the cartoon Pokémon vibe.

### Recommendation
1. **Use PokéAPI items** for every Pokéball-style pin, berry, and consumable prop. Fully dynamic, API-driven. No local bundling.
2. **Keep custom SVG** for terrain / landmarks (trees, buildings, volcanoes). **Expand the library** — add 15–20 new SVG components — rather than bundling a tileset. This keeps the codebase dependency-free, every asset crisp at any zoom, and legally bulletproof.
3. **If you want a truly external pack:** pick Kenney's *"Tiny Town"* or *"RPG Urban Kit"*. Those are GitHub-mirror-ed as CC0; I can wire remote raw-fetching the same way PokéAPI sprites load (tried → local → SVG fallback).

**Default plan: (1) + (2). (3) is optional if you want raster artwork.**

---

## Proposed execution phases

### Phase 8A — Movement smoothness (~15 min)
- Drop Framer tween on hero `<motion.g>`.
- Move live position to `useRef` + a throttled state commit for rendering.
- Verify 60fps walking on a mid-range laptop.

### Phase 8B — Bigger hero + Pokéball items from PokéAPI (~45 min)
- Scale hero sprite 56 → 96.
- Scale wild sprite 64 → 96.
- Swap custom Pokéball SVG → **remote PNG from PokéAPI items** (`raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png`), loaded via the existing `PokemonSprite` URL-fallback chain (remote → local cache → inline SVG fallback).

### Phase 8C — Density + new landmarks (~2h)
Add new SVG components (in `scene-sprites.tsx`):

- `Ship` (Day 1 water silhouette)
- `Lifeguard` (Day 1 beach)
- `Bench` (Days 2, 3, 6)
- `Bike` (Day 2)
- `ParkedCar` (static, Day 3 vs the animated one)
- `Fountain` (Day 3)
- `Tent` (Day 4 camping)
- `PicnicTable` (Day 4)
- `Waterfall` (Day 5)
- `Telescope` (Day 5 viewpoint)
- `RockFormation` (Day 5)
- `Lantern` (Day 6)
- `Bridge` (Day 6 stone)
- `Snowman` (Day 6)

Wire 2–3 per day, plus scatter 4–6 more of the existing decorations (PineTree, PalmTree, Bush, etc.) to fill the empty zones. Procedural scatter using the existing `mulberry32` seed so it's stable.

### Phase 8D — Dynamic item scatter via PokéAPI (~45 min) — **optional polish**
- Fetch `/api/v2/item-category/picture-up-items` (or similar item list) from PokéAPI REST.
- Scatter 5–10 items per day map: berries, potions, stones, fossils, based on day theme.
- Each uses the existing `PokemonSprite` URL fallback for graceful offline behaviour.

---

## Critical files

```
src/components/adventure/adventure-screens.tsx    # hero size + movement tick fix + density scatter
src/components/adventure/scene-sprites.tsx         # +15 new SVG landmark components
src/components/adventure/creature-sprites.tsx      # extend PokemonSprite to accept raw URL for items
src/components/adventure/poke-api.ts               # optional: item list fetcher
```

---

## Verification

After each phase:

1. **Phase 8A:** walk around at 60fps. No stuttering. DevTools Performance tab shows <2ms React work per frame.
2. **Phase 8B:** hero + wilds render clearly at ~100px on screen. Pokéball pins load from GitHub raw URL (check Network tab) and match official Pokémon Red/Blue pokéball art.
3. **Phase 8C:** every day's overworld feels populated. No large blank green patches anywhere within the playable zone.
4. **Phase 8D:** scattered berries and potions on the ground, each with proper PokéAPI sprites.

---

## Estimated total effort

8A (~15 min) + 8B (~45 min) + 8C (~2h) + 8D optional (~45 min)
**≈ 3–3.5 hours.** Ship 8A + 8B first (immediate payoff), then iterate on 8C + 8D.

---

## Open questions before I code

- Do you want me to wire **Kenney tileset raster artwork** (option 4C above) as an additional visual layer, or stick with pure SVG? SVG is cleaner; rasters would be more "authentic GBA Pokémon" but add a bundling step.
- OK to keep the movement fix as a ref-based commit (slightly more code complexity) or just remove the Framer tween (simpler, might look marginally less smooth on the first tick)?

If you don't care, defaults: **SVG only** and **simple tween removal**.
