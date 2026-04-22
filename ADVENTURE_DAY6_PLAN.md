# Day 6 — Baguio Highland Plan

## Context

Day 6 is the final day — **"HIGHLAND"** theme (Baguio, La Trinidad, Bell Church, PMA). It's the pin-heaviest day in the whole game: **5 pins** vs 1-3 for every other day.

| Pin | Real place |
|---|---|
| `baguio` (370, 160) | Baguio bus arrival / city centre |
| `strawberry-farm` (560, 270) | La Trinidad strawberry fields |
| `bell-church` (720, 380) | Chinese-Filipino temple |
| `pma` (860, 140) | Philippine Military Academy |
| `day6-dump` (680, 460) | Burnham Park / end of trip |

These 5 pins span very different vibes (bus-terminal, farm, temple, military, park). This is the most interesting day to design because the options are wide open.

## Four directions — pick one

### Option A — Misty Pine Morning *(unified, moody)*

Classic cool-mountain Baguio. One atmosphere across the whole map.

- **Palette:** cool blue-green sky, fog grey, pine dark green, warm cabin brown accents
- **Background:** `DawnMistSky` (pastel sky + tiny sun), `PineRidgeBand` (3 layers of pine silhouettes), `ForestFloorBand` (grass + pine needles + mossy rock pixels)
- **Landmarks:** Baguio bus terminal, strawberry patches, Chinese temple pagoda, military parade ground, Burnham lake + paddle boats
- **Ambient:** `FogBand` rolling in layers, `DriftingLeaves`, 2 swallows circling
- **Mood:** crisp, cool, contemplative. End-of-trip reflection.
- **Effort:** ~2h

### Option B — Five-zone Highland Tour *(most ambitious — recommended)*

Like Day 5's split, but **five** distinct zones across one map, each behind its pin. Small gate/signpost dividers between. Most creative, biggest visual payoff.

```
[BUS TERMINAL]  [STRAWBERRY FIELDS]  [BELL TEMPLE]  [PMA PARADE]  [BURNHAM PARK]
    x=0-240          x=240-460         x=460-640      x=640-820     x=820-900
```

Each zone has its own 2-3 landmarks and mini-terrain:
- **Bus Terminal** — station roof, waiting bench, bus sign, schedule board
- **Strawberry Field** — red-berry rows (3-4 patches), farmer, basket, scale, stall
- **Bell Temple** — red-gold pagoda, stone lions, incense brazier, bell
- **PMA Parade** — flag pole, parade ground lines, cannon, guard post
- **Burnham Park** — oval lake, paddle swan boats, pine row, ice-cream cart

- **Effort:** ~2.5h

### Option C — Strawberry Festival *(bright, celebratory)*

Lean into the strawberry-farm angle across the whole day. Red + green palette, giant strawberry statues, fruit-picking carts, jam stalls, wooden baskets, farmers waving.

- **Palette:** strawberry red + leaf green + cream
- **Landmarks:** giant strawberry statue centrepiece, berry rows, jam shop, harvest cart, scarecrow farmer
- **Ambient:** butterflies, cheerful breeze particles
- **Effort:** ~1.5h

### Option D — Sunset End of Trip *(warm, emotional)*

Final-day feeling. Warm orange-pink sunset over pines, market lights starting up, people heading home carrying souvenir bags. Last-moment vibe.

- **Palette:** orange-pink-violet sunset, warm amber lamp glow
- **Landmarks:** market stalls closing, tourists with shopping bags, bus pulling up, pine silhouettes, lamp posts
- **Ambient:** rising lantern particles, warm glow pulse
- **Effort:** ~1.5h

---

## My recommendation: **B — Five-zone Highland Tour**

Day 6 is the end of the journey with the most pins — this is the ambitious finale the portfolio deserves. Splitting into five mini-zones gives each real place its own moment on screen and parallels Day 5's split (but scaled up 2.5×). Each zone gets 2-3 unique landmarks, so the player sees 5 distinct micro-scenes as they walk from left to right: **bus → farm → temple → PMA → lake**.

If you want cohesion instead of diversity, go **A**. If you want bright celebratory, go **C**. If you want emotional closing note, go **D**.

---

## Option B implementation breakdown (if picked)

### New components needed in `scene-sprites.tsx`

**Zone 1 (Bus Terminal):**
- `BusStation` — roofed open-air terminal with schedule board
- `ParkedBus` — static pixel bus in a bay
- `TravelerCrowd` — waiting passengers with luggage

**Zone 2 (Strawberry Field):**
- `StrawberryField` — 3-row berry patch with trellis
- `HarvestCart` — wooden wheelbarrow with berries
- `JamStall` — small roadside jam shop
- `FarmerPixel` — farmer with hat and basket

**Zone 3 (Bell Temple):**
- `BellPagoda` — 3-tier red+gold pagoda
- `StoneLion` × 2 — entry guardian statues
- `IncenseBrazier` — brass pot with animated smoke
- `TempleBell` — hanging bell

**Zone 4 (PMA Parade):**
- `ParadeGround` — painted concrete with white lines
- `FlagPoleFlag` — PH flag waving animated
- `Cannon` — decorative period cannon
- `GuardPost` — small sentry box

**Zone 5 (Burnham Park):**
- `OvalLake` — pixel lake with ripples
- `SwanBoat` × 2 — paddle boats shaped like swans
- `IceCreamCart` — colorful wheeled cart
- `ParkBench` (reuse existing)

### Tile bands

- `DawnMistSkyBand` — pastel pink-blue gradient sky with small sun + drifting clouds
- `PineRidgeBand` — 3 layers of pine silhouettes forming horizon (distant, mid, near)
- `ForestFloorBand` — cool grass tiles with pine-needle + mossy-rock pixels

### Dividers

Small pixel signposts between each zone pointing to the next: "FARM →", "TEMPLE →", "PMA →", "BURNHAM →". Cheap, readable, no big arches needed.

### Files to modify

| File | Change |
|---|---|
| `src/components/adventure/scene-sprites.tsx` | Add ~18 new pixel-art components + 3 tile bands |
| `src/components/adventure/adventure-screens.tsx` | Add `day === 6` to `isTiledBg` list, add background composition for day 6, rewrite `DayLandmarks case 6` with the five-zone layout |

### Verification

- Day 6 opens with a cohesive cool highland palette
- Walking left-to-right: you encounter **bus terminal → strawberry field → bell temple → PMA parade → Burnham Park** in that order
- Each zone has 2-3 distinct landmarks behind its pin, with a small signpost divider between zones
- All 5 pins are clearly associated with their landmark behind them
- Pixel-art language consistent with Days 1-5

---

## Reply

Say **A**, **B**, **C**, or **D** and I'll execute. Mix instructions welcome (e.g. "B but with the sunset palette from D").
