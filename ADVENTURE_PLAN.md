# Plan: Alter Ego — Interactive Adventure Mode

## Context

The previous creative features (console easter egg, fish rain, face-detection brackets, confetti, GitHub heatmap, vCard QR) are all complete. This plan covers the alter ego mode: a secret trigger that shatters the bento grid like a puzzle, then drops the user into a Pokemon-style interactive RPG world showcasing Aziz's 8-day Manila educational tour.

**Why this matters:** Shows off deep frontend skill (animation, game dev, canvas) in a way no recruiter will forget. Uniquely tied to identity — Filipino student, Manila trip, creative dev.

---

## Engine Decision: Phaser.js v3

**Chosen: `phaser@3`** (~1.2MB, loaded only on `/adventure` route — zero impact on portfolio page)

- Phaser has a built-in tilemap loader (reads Tiled JSON directly), sprite animation, arcade physics, and camera follow — everything needed for Pokemon-style movement
- React Three Fiber is wrong aesthetic (3D ≠ Pokemon top-down)
- Custom canvas would take 2-3 weeks to rebuild what Phaser gives for free
- Kaboom.js has uncertain maintenance, weaker tilemap tooling

Install: `npm install phaser@3`  
No `@types` needed — Phaser 3.60+ ships its own TypeScript declarations.

---

## File Tree (all new files)

```
src/
  app/
    adventure/
      page.tsx                            ← Shell; imports AdventureShell dynamically
      layout.tsx                          ← metadata only, renders {children}
  components/
    layout/
      portfolio-chrome.tsx                ← NEW: wraps Header/Footer/etc, hides on /adventure
    adventure/
      adventure-shell.tsx                 ← "use client"; mounts game or mobile fallback
      phaser-game.tsx                     ← dynamically imported; creates Phaser.Game
      game-loader-screen.tsx              ← Pixel loading bar (shown during asset load)
      adventure-overlay.tsx               ← Fixed "← Portfolio" button + location label
      mobile-fallback.tsx                 ← Static photo gallery for touch devices
    shared/
      puzzle-break-overlay.tsx            ← Card clone + fly-out animation layer
  hooks/
    use-adventure-trigger.ts              ← State machine: idle→triggered→animating→navigating
  game/
    index.ts                              ← createGame() factory
    config.ts                             ← Phaser GameConfig (320×240 @ 3x zoom)
    scenes/
      PreloadScene.ts                     ← load tileset, sprites, audio
      WorldScene.ts                       ← tilemap, player movement, photo frame zones
      UIScene.ts                          ← HUD (location name, interaction prompt)
      PhotoViewerScene.ts                 ← Pokemon dialog box + photo cycler
    entities/
      Player.ts                           ← Phaser.Physics.Arcade.Sprite, 4-dir walk
      PhotoFrame.ts                       ← Interactable zone, emits 'open-photo-viewer'
    data/
      trip-locations.ts                   ← TripLocation[] with photos[], name, mapTile coords
public/
  game/
    tilesets/lpc-base.png + lpc-base.json ← LPC Base Tiles (CC-BY-SA, 16×16px)
    sprites/player.png                    ← 48×64 sheet, 3 frames × 4 directions
    sprites/photo-frame.png               ← 16×16 wooden frame sprite
    audio/bgm-adventure.mp3               ← Optional chiptune loop (OpenGameArt)
  images/trip/
    placeholder.jpg                       ← Grey 600×400 placeholder
    day-1/ day-2/ ... day-8/              ← User adds real trip photos here
  fonts/press-start-2p.woff2             ← Pixel font (Google Fonts license)
```

---

## Edits to Existing Files

| File | Change |
|---|---|
| [src/app/layout.tsx](src/app/layout.tsx) | Replace inline Header/Footer/etc with `<PortfolioChrome />` |
| [src/components/shared/bento-card.tsx](src/components/shared/bento-card.tsx) | Add `data-bento-card=""` to inner card div (needed for DOM snapshot) |
| [src/components/layout/header.tsx](src/components/layout/header.tsx) | Add `🎮` trigger button (far left of nav, `title="???"`) |
| [src/app/globals.css](src/app/globals.css) | Add `card-fly-out` + `flash-white` keyframes |

---

## Phase A — Puzzle Break Animation (~2.5 hrs)

### Trigger

A small `🎮` icon button at the far left of the header nav pill. No label, `title="???"`. Discoverable on hover. Clicking it fires `trigger()` from `use-adventure-trigger.ts`.

**Why not another keyboard sequence?** Konami code is already taken by fish rain. A visible button is better UX than memorizing a second sequence.

### State Machine (`src/hooks/use-adventure-trigger.ts`)

```
idle → triggered → animating → navigating
```

- `triggered`: snapshot all BentoCard rects, mount overlay
- `animating`: CSS keyframes running (cards flying, ~1.1s window)
- `navigating`: `router.push('/adventure')` fires at 1100ms

`prefers-reduced-motion` check: if set, skip to `navigating` immediately with a simple fade.

### Card Snapshot (`src/components/shared/puzzle-break-overlay.tsx`)

On mount, query `document.querySelectorAll('[data-bento-card]')`. For each element: call `getBoundingClientRect()`, clone its `innerHTML`, render a `position:fixed` div at the exact captured `{top, left, width, height}`. The original page stays untouched under the overlay.

### CSS Keyframe (`src/app/globals.css`)

```css
@keyframes card-fly-out {
  0%   { transform: translate(0,0) rotate(0deg) scale(1); opacity: 1; }
  30%  { opacity: 1; }
  100% { transform: translate(var(--fly-x), var(--fly-y)) rotate(var(--fly-rot)) scale(0.6); opacity: 0; }
}
@keyframes flash-white {
  0%   { opacity: 0; }
  20%  { opacity: 1; }
  100% { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  @keyframes card-fly-out { 0% { opacity: 1; } 100% { opacity: 0; } }
}
```

Each card clone gets inline CSS vars `--fly-x`, `--fly-y`, `--fly-rot` assigned to scatter them in different directions (hero → top-left, stats → bottom, projects → right, etc.). Stagger: 60ms between each, 700ms per card animation. White flash overlay fires at 1000ms, `router.push('/adventure')` at 1100ms.

---

## Phase B — Route and Layout (~1 hr)

### Hide Header/Footer on `/adventure`

**`src/components/layout/portfolio-chrome.tsx`** — `"use client"`, reads `usePathname()`. If pathname starts with `/adventure`, returns `null`. Otherwise renders `<ConsoleGreeting /><FishRain /><ScrollProgress /><Header /><Footer />`.

Replace the inline components in `src/app/layout.tsx` with `<PortfolioChrome />`.

### Adventure Route

**`src/app/adventure/layout.tsx`** — exports only metadata (`title: "Adventure Mode"`), renders `{children}` with no wrappers.

**`src/app/adventure/page.tsx`** — server component, renders `<AdventureShell />`.

**`src/components/adventure/adventure-shell.tsx`** — `"use client"`, detects mobile (`window.innerWidth < 768 || ontouchstart in window`). If mobile: renders `<MobileFallback />`. Otherwise: renders `<GameCanvas />` + `<AdventureOverlay />`.

### Data Handoff

Before `router.push('/adventure')`, write `sessionStorage.setItem('adventure-origin', 'portfolio')`. WorldScene reads this on create to play an arrival flash animation.

### "Return to Portfolio" Overlay (`src/components/adventure/adventure-overlay.tsx`)

Fixed `bottom-4 left-4 z-[9999]`. Pixel-font button `← Portfolio`. onClick: `router.push('/')`. Also shows location name as a small label top-left when player enters a new zone (emitted from WorldScene via a custom event bridge).

### Loading Screen (`src/components/adventure/game-loader-screen.tsx`)

Shown while Phaser loads assets. Dark background, pixel-style loading bar CSS, Press Start 2P font. Receives `progress: 0–1` prop from PreloadScene callback.

### Mobile Fallback (`src/components/adventure/mobile-fallback.tsx`)

Static photo gallery with pixel-border styling. Shows trip location cards with placeholder images. Pixel font header: "ADVENTURE MODE — Desktop only for the full experience."

---

## Phase C — Phaser Setup (~3 hrs)

### Game Config (`src/game/config.ts`)

```typescript
TILE_SIZE = 16        // Standard Pokemon tile size
SCALE_FACTOR = 3      // 16px → 48px on screen
CANVAS_W = 320        // 20 tiles wide (GBA resolution)
CANVAS_H = 240        // 15 tiles tall

// Phaser config:
{ width: 320, height: 240, zoom: 3, pixelArt: true, physics: { default: 'arcade' } }
```

`pixelArt: true` disables antialiasing. `zoom: 3` makes the whole canvas render at 3× — authentic GBA Pokemon feel.

### Dynamic Import Pattern (`src/components/adventure/phaser-game.tsx`)

```typescript
// This file is dynamically imported with { ssr: false }
// useEffect: import('../../game/index').then(m => m.createGame(containerRef.current))
// Stores game instance in ref, destroys on unmount (cleanup)
// Bridges PreloadScene progress → game-loader-screen via React state
```

### Scenes

**PreloadScene.ts** — loads tileset PNG + JSON, player sprite sheet, photo frame sprite, bitmap font, optional audio. Calls `onProgress(value)` on `this.load.on('progress', ...)`. On complete: `this.scene.start('WorldScene')`.

**WorldScene.ts** — creates tilemap from Tiled JSON, creates Player, sets up overlap zones for PhotoFrame entities, configures camera follow (`this.cameras.main.startFollow(player, true)`), handles input (cursor keys + WASD). On zone overlap + Z key: launches PhotoViewerScene.

**UIScene.ts** — runs parallel to WorldScene (`this.scene.launch`). Renders interaction prompt using bitmap font. Listens for `'enter-zone'` events from WorldScene to update location label.

**PhotoViewerScene.ts** — overlay scene. Renders Pokemon-style dialog box (white bg, black border, bitmap font). Dynamic image loading: `this.load.image(id, src); this.load.start()` then `'filecomplete'` callback. Left/right arrows cycle photos. B/Esc closes and returns to WorldScene.

---

## Phase D — World Design (~4 hrs)

### Tileset

**LPC Base Tiles** (OpenGameArt, CC-BY-SA 3.0) — 16×16px tiles covering grass, stone, water, walls, floors, paths. Download: `lpc-base.png`. Use **Tiled Map Editor** (free) to design the map, export as JSON.

### Actual Trip Sequence (8 days)

| Day | Location | Area | Notes |
|-----|----------|------|-------|
| 1 | NAIA Terminal → Intramuros → Rizal Park | Manila | Arrived 8am, walled city + Rizal monument |
| 2 | Hytec Power Inc. → OpenText / RCBC Plaza | Caloocan → Makati | Tech company visits |
| 3 | MMDA HQ → Teleperformance BGC → BGC High Street (night) | Pasig → Taguig | Night photos at BGC |
| 4 | Top Peg Animation (drew a cat!) → Microsourcing Eastwood | Las Piñas → QC | Animation + BPO |
| 5 | People's Park in the Sky → Sky Ranch | Tagaytay | Leisure, volcano views |
| 6 | La Trinidad Strawberry Farm → Bell Church → PMA → Mansion House → Mines View Park | Baguio | 1am bus, 6hr trip north |
| 7 | Burnham Park / shopping → Bus back to QC (DJM Dorm) | Baguio → QC | Leisure, then travel home |
| 8 | DJM Dorm → NAIA → Zamboanga | QC | Departure |

### Geographically Accurate Map Layout (160×100 tiles = 2560×1600px logical)

The map is oriented north-up, mirroring real Metro Manila geography. Baguio is far north, Tagaytay far south, BGC/Makati in the south-center, QC in the north-center, Manila City (Intramuros/Rizal Park) on the west coast.

```
NORTH
  ┌────────────────────────────────────────────────┐
  │  ░░░░ BAGUIO REGION ░░░░░░░░░░░░░░░░░░░░░░░   │  ← Day 6 & 7
  │  [Strawberry Farm]  [Bell Church]              │
  │  [PMA Grounds]  [Mansion House] [Mines View]   │
  │  [Burnham Park] ← mountain tiles, pine trees  │
  ├────────────────────────────────────────────────┤
  │  ░░░ QUEZON CITY / CALOOCAN ░░░░░░░░░░░░░░░░  │  ← Days 1 (start), 2, 4
  │  ★ DJM DORMITORY ← player spawn here          │
  │  [Hytec Power Inc.] ← industrial tiles        │
  │  [Eastwood City / Microsourcing] ← modern     │
  ├──────────────────┬─────────────────────────────┤
  │  ░ MANILA CITY ░ │  ░░░ PASIG / ORTIGAS ░░░░  │  ← Days 1, 3
  │  [Intramuros]    │  [MMDA HQ]                  │
  │  [Rizal Park]    │                             │
  │  (cobblestone +  │  ← office building tiles   │
  │   sea wall)      │                             │
  ├──────────────────┼─────────────────────────────┤
  │                  │  ░░ MAKATI / BGC ░░░░░░░░░  │  ← Days 2, 3
  │                  │  [RCBC Plaza / OpenText]    │
  │  Manila Bay      │  [Teleperformance]          │
  │  (water tiles)   │  [BGC High Street] ← night │
  │                  │   glow tiles                │
  ├──────────────────┴─────────────────────────────┤
  │  ░░░░░░ LAS PIÑAS ░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← Day 4
  │  [Top Peg Animation] ← creative studio tiles  │
  ├────────────────────────────────────────────────┤
  │  ░░░░░░░░░░░ TAGAYTAY ░░░░░░░░░░░░░░░░░░░░░░  │  ← Day 5
  │  [People's Park in the Sky] ← volcano/cliff   │
  │  [Sky Ranch] ← ferris wheel tile              │
  └────────────────────────────────────────────────┘
SOUTH
```

Player spawns at DJM Dormitory (QC) since that was the home base. NAIA airport is at the Manila City zone edge — walking to it ends a short "fly home" cutscene.

### Zone Tile Aesthetics

| Zone | Floor tiles | Wall/boundary | Special |
|------|-------------|---------------|---------|
| QC / Dorm | Concrete + grass | Apartment walls | Normal city |
| Intramuros | Cobblestone | Stone fortress walls | Cannon props |
| Rizal Park | Grass + fountain | Trees | Obelisk prop |
| Caloocan / Hytec | Industrial floor | Warehouse walls | Machinery props |
| Makati / RCBC | Marble floor | Glass tower walls | Elevator prop |
| Pasig / MMDA | Office carpet | Modern office | Traffic light |
| BGC | Modern tile | Glass building | Night: neon glow |
| Las Piñas / Top Peg | Studio floor | Colorful walls | Cat drawing on wall |
| Tagaytay | Green hill tiles | Cliff edge | Volcano silhouette |
| Baguio zones | Mountain path | Pine trees | Snow/fog overlay |
| Strawberry Farm | Farm soil | Wooden fence | Strawberry props |
| Burnham Park | Grass + lake | Tree line | Rowboat prop |

### Trip Location Data (`src/game/data/trip-locations.ts`)

```typescript
export const tripLocations: TripLocation[] = [
  // DAY 1
  { id: 'naia',         name: 'NAIA Terminal',            day: 1, mapTileX: 28, mapTileY: 62,
    description: 'Arrived from Zamboanga at 8am. The adventure begins.',
    photos: [{ src: '/images/trip/day-1/naia.jpg', caption: 'Landing in Manila' }] },
  { id: 'intramuros',   name: 'Intramuros',               day: 1, mapTileX: 22, mapTileY: 58,
    description: 'The Walled City. 500-year-old Spanish colonial streets.',
    photos: [{ src: '/images/trip/day-1/intramuros-01.jpg', caption: 'Fort Santiago' }] },
  { id: 'rizal-park',   name: 'Rizal Park',               day: 1, mapTileX: 25, mapTileY: 55,
    description: 'Luneta Park. Learned about Dr. Jose Rizal and Philippine history.',
    photos: [{ src: '/images/trip/day-1/rizal-park.jpg', caption: 'Rizal Monument' }] },

  // DAY 2
  { id: 'hytec',        name: 'Hytec Power Inc.',         day: 2, mapTileX: 30, mapTileY: 35,
    description: 'Industrial tech company in Caloocan. Saw real engineering systems.',
    photos: [{ src: '/images/trip/day-2/hytec.jpg', caption: 'Hytec facility' }] },
  { id: 'opentext',     name: 'OpenText / RCBC Plaza',    day: 2, mapTileX: 55, mapTileY: 62,
    description: 'OpenText office in Makati. RCBC Plaza is one of the tallest buildings here.',
    photos: [{ src: '/images/trip/day-2/rcbc.jpg', caption: 'RCBC Plaza' }] },

  // DAY 3
  { id: 'mmda',         name: 'MMDA Headquarters',        day: 3, mapTileX: 68, mapTileY: 50,
    description: 'Metro Manila Development Authority in Pasig. Saw how Metro traffic is managed.',
    photos: [{ src: '/images/trip/day-3/mmda.jpg', caption: 'MMDA control center' }] },
  { id: 'teleperformance', name: 'Teleperformance BGC',   day: 3, mapTileX: 62, mapTileY: 68,
    description: 'Global BPO company at BGC Taguig. Huge office with amazing views.',
    photos: [{ src: '/images/trip/day-3/teleperformance.jpg', caption: 'BGC skyline' }] },
  { id: 'bgc-highstreet',  name: 'BGC High Street',       day: 3, mapTileX: 60, mapTileY: 70,
    description: 'Night out at BGC High Street. Neon lights, street art, and good vibes.',
    photos: [{ src: '/images/trip/day-3/bgc-night.jpg', caption: 'BGC at night' }] },

  // DAY 4
  { id: 'top-peg',      name: 'Top Peg Animation',        day: 4, mapTileX: 35, mapTileY: 78,
    description: 'Animation company in Las Piñas. I drew a cute cat here! 🐱',
    photos: [
      { src: '/images/trip/day-4/toppeg.jpg',     caption: 'Top Peg studio' },
      { src: '/images/trip/day-4/my-cat-art.jpg', caption: 'My cat drawing!' },
    ] },
  { id: 'microsourcing', name: 'Microsourcing Eastwood',  day: 4, mapTileX: 72, mapTileY: 42,
    description: 'BPO company at Eastwood City, QC. Sleek offices, great company culture.',
    photos: [{ src: '/images/trip/day-4/microsourcing.jpg', caption: 'Eastwood City' }] },

  // DAY 5
  { id: 'peoples-park', name: "People's Park in the Sky", day: 5, mapTileX: 42, mapTileY: 92,
    description: 'Tagaytay. Stood on a cliff with views of Taal Volcano. Breathtaking.',
    photos: [
      { src: '/images/trip/day-5/peoples-park.jpg',  caption: 'View from the top' },
      { src: '/images/trip/day-5/taal-volcano.jpg',  caption: 'Taal Volcano' },
    ] },
  { id: 'sky-ranch',    name: 'Sky Ranch Tagaytay',        day: 5, mapTileX: 45, mapTileY: 94,
    description: 'Rides and fun with the group at Sky Ranch. The ferris wheel view was unreal.',
    photos: [{ src: '/images/trip/day-5/sky-ranch.jpg', caption: 'Sky Ranch ferris wheel' }] },

  // DAY 6
  { id: 'strawberry-farm', name: 'La Trinidad Strawberry Farm', day: 6, mapTileX: 48, mapTileY: 8,
    description: 'First stop in Baguio after a 6-hour overnight bus. Picked strawberries, bought pasalubong.',
    photos: [{ src: '/images/trip/day-6/strawberry-farm.jpg', caption: 'Strawberry fields' }] },
  { id: 'bell-church',  name: 'Bell Church',               day: 6, mapTileX: 52, mapTileY: 10,
    description: 'Chinese-Filipino temple in Baguio. Beautiful architecture and peaceful vibes.',
    photos: [{ src: '/images/trip/day-6/bell-church.jpg', caption: 'Bell Church entrance' }] },
  { id: 'pma',          name: 'PMA Baguio',                day: 6, mapTileX: 50, mapTileY: 14,
    description: 'Philippine Military Academy. Marching grounds, historic buildings.',
    photos: [{ src: '/images/trip/day-6/pma.jpg', caption: 'PMA parade grounds' }] },
  { id: 'mansion-house', name: 'Mansion House',            day: 6, mapTileX: 55, mapTileY: 12,
    description: "The President's Baguio residence. Iconic white gate photo stop.",
    photos: [{ src: '/images/trip/day-6/mansion-house.jpg', caption: 'Mansion House gate' }] },
  { id: 'mines-view',   name: 'Mines View Park',           day: 6, mapTileX: 57, mapTileY: 9,
    description: 'Overlooking the Cordillera mountains. Last pasalubong stop in Baguio.',
    photos: [{ src: '/images/trip/day-6/mines-view.jpg', caption: 'Mountain view' }] },

  // DAY 7
  { id: 'burnham-park', name: 'Burnham Park',              day: 7, mapTileX: 50, mapTileY: 16,
    description: 'Last morning in Baguio. Rowboats on the lake, shopping along Session Road.',
    photos: [{ src: '/images/trip/day-7/burnham-park.jpg', caption: 'Burnham Lake' }] },
];
```

**Photo folder structure:**
```
public/images/trip/
  placeholder.jpg
  day-1/  naia.jpg · intramuros-01.jpg · rizal-park.jpg
  day-2/  hytec.jpg · rcbc.jpg
  day-3/  mmda.jpg · teleperformance.jpg · bgc-night.jpg
  day-4/  toppeg.jpg · my-cat-art.jpg · microsourcing.jpg
  day-5/  peoples-park.jpg · taal-volcano.jpg · sky-ranch.jpg
  day-6/  strawberry-farm.jpg · bell-church.jpg · pma.jpg · mansion-house.jpg · mines-view.jpg
  day-7/  burnham-park.jpg
```

User adds real photos matching these filenames. Any missing file falls back to `placeholder.jpg` automatically (handled in PhotoFrame loading logic).

### Player (`src/game/entities/Player.ts`)

Extends `Phaser.Physics.Arcade.Sprite`. Walk animations: 3 frames × 4 directions at 8fps. Speed: 80px/s at logical resolution. Use LPC character generator (free, CC-BY-SA) to produce the sprite sheet.

### Photo Frames (`src/game/entities/PhotoFrame.ts`)

Static sprite at tile coords from `trip-locations.ts`. Bouncing arrow above when player is nearby. Overlap zone: press Z → emits event → PhotoViewerScene launches.

---

## Phase E — Polish (~2 hrs)

- **Entry flash**: `this.cameras.main.flash(500)` + `this.cameras.main.shake(300, 0.01)` in WorldScene.create()
- **Pixel font in React overlays**: `Press_Start_2P` loaded via `next/font/google` in `adventure/layout.tsx` only
- **Pixel font in Phaser**: bitmap font atlas (no WebFont timing issues)
- **Optional chiptune BGM**: OpenGameArt free Pokemon-style track, Web Audio via Phaser. Muted by default, user clicks a `♪` toggle in `adventure-overlay.tsx` to enable
- **Transition back**: clicking "← Portfolio" navigates to `/` — main page re-mounts cleanly (no reverse puzzle animation needed, keep it simple)

---

## Constraints

- **AGENTS.md**: Next.js 16 App Router only — no `getServerSideProps`, no pages directory
- Phaser only imported inside `{ ssr: false }` dynamic import — never evaluated server-side
- `prefers-reduced-motion`: puzzle break skips to instant fade; game camera shake skipped; no auto-playing audio
- Main portfolio performance untouched — Phaser (~1.2MB) only loads on `/adventure`
- Trip photos folder structure ready from day 1; real photos can be added anytime without code changes
- Audio muted by default — user opts in

---

## Verification

1. Click `🎮` in header → bento cards fly off screen in different directions → white flash → `/adventure` loads
2. On `/adventure`: loading bar appears while Phaser loads assets
3. Player spawns center of map with arrival flash
4. WASD/arrow keys move player in 4 directions with walk animation
5. Walk into a zone → location name label updates in overlay
6. Stand near photo frame → bouncing arrow appears → press Z → Pokemon-style dialog with photo
7. Left/right arrow cycles photos in dialog → B/Esc closes
8. `← Portfolio` button returns to main page with header/footer visible
9. On mobile: static fallback renders instead of game canvas
10. `prefers-reduced-motion`: puzzle break is instant fade, no camera shake in game

---

## Phasing Order

1. **Phase A** — Puzzle break (no deps, immediate wow factor, can commit standalone)
2. **Phase B** — Route setup (gives you a page to navigate to)
3. **Phase C** — Phaser setup + player movement (core game loop working)
4. **Phase D** — Map design + photo frames (trip content)
5. **Phase E** — Polish last

Each phase is independently committable. Stop after any phase and the portfolio still works perfectly.

---

## Photos / Assets Still Needed from User

Before implementing Phase D fully, collect these from Aziz:

| Day | Files needed | Notes |
|-----|-------------|-------|
| Day 1 | naia.jpg, intramuros-01.jpg, rizal-park.jpg | Airport arrival, walled city, Rizal monument |
| Day 2 | hytec.jpg, rcbc.jpg | Hytec facility, RCBC Plaza exterior |
| Day 3 | mmda.jpg, teleperformance.jpg, bgc-night.jpg | MMDA office, Teleperformance, BGC neon night |
| Day 4 | toppeg.jpg, **my-cat-art.jpg**, microsourcing.jpg | Cat drawing is a highlight — use the actual art |
| Day 5 | peoples-park.jpg, taal-volcano.jpg, sky-ranch.jpg | Tagaytay views + Sky Ranch |
| Day 6 | strawberry-farm.jpg, bell-church.jpg, pma.jpg, mansion-house.jpg, mines-view.jpg | Baguio full day |
| Day 7 | burnham-park.jpg | Last Baguio morning |

Put them in `public/images/trip/day-N/` matching exact filenames above. Any missing file uses `placeholder.jpg` automatically — no code change needed.

**Video from Day 5 (Tagaytay):** Consider extracting a still frame as the photo. The game does not play video — photos only in the viewer.

## Handoff Notes

- Map JSON designed in **Tiled Map Editor** (free desktop app), exported to `public/game/tilesets/lpc-base.json`
- Character sprite from LPC generator: https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/
- LPC Base Tiles download: https://opengameart.org/content/lpc-base-tiles
- Player spawn: DJM Dormitory (QC) — the home base for the whole trip
- Map orientation: north = Baguio, south = Tagaytay, west coast = Manila Bay / Intramuros, east = Pasig/BGC
- The `🎮` button in the header is the trigger — Konami code is already taken by fish rain
