# Day 3 Revamp — Choose Your Vibe

## Context

Day 3 pins: **MMDA** (Metro Manila Development Authority, Pasig) + **BGC** (Bonifacio Global City). Day theme is already "**NIGHTFALL**" in the menu. Previous night-out-in-BGC energy.

Same pixel-art language as Day 1 and Day 2:
- Pixel-tile background bands (inline SVG)
- Hand-tuned landmark row, no overlaps
- 3 horizontal decor rows in the foreground
- Original SVG components, no external images

Pick ONE of the four vibes below. All four are compatible with the existing engine; only differ in palette, landmarks, and ambient overlay.

---

## Option A — Neon Cyberpunk (recommended for "BGC night out")

Think Blade Runner meets BGC High Street: deep navy + magenta sky, neon signs glowing, slick wet pavement reflecting lights.

**Palette**
- Sky: `#0e0e2e` top → `#2a1040` bottom
- Neon accents: `#ff2ec8` magenta, `#00e0ff` cyan, `#ffe066` amber
- Pavement: `#1a1a24` with cyan/magenta reflection streaks

**Background bands**
- `NeonSkyBand` — deep navy base, scattered tiny stars + magenta city glow at horizon
- `NeonCityBand` — taller skyline silhouette than Day 2 with 3× more lit windows (yellow/cyan/magenta)
- `NeonStreetBand` — dark pavement with neon reflection streaks (pink/cyan)

**Landmarks**
- `MMDAHq` — gov't building with blue LED signage "MMDA"
- `BGCTowerA` — tall office tower, animated billboard on side
- `BGCTowerB` — second tower, different height
- `NeonSign` (multiple) — "KTV", "OPEN 24HR", "SUSHI" on random shopfronts
- `BillboardTV` — animated GIF-style billboard cycling 3 colored frames

**Ambient**
- `NeonGlow` — subtle screen-wide magenta/cyan pulse at 4-sec interval
- `Sparkle` — occasional cyan twinkle on wet street

**Effort**: ~1.5h

---

## Option B — Rainy Cyberpunk Night

Option A + heavy rain + thicker puddles + lightning flash every 20s. Moodier.

**Additions on top of A**
- `RainOverlay` (already built from Day 2) at density=120
- `LightningFlash` — brief white screen flash at random intervals (every 15-25s)
- `DeepPuddle` — larger puddles that reflect neon colors

**Effort**: +20 min on top of A (~1.75h total)

---

## Option C — Festival / Night Market

Warmer, friendlier feel. String lights overhead, food stalls, colorful tents, paper lanterns.

**Palette**
- Sky: deep violet `#1a1040`
- Warm accents: `#ffcc30` amber, `#e05030` orange-red, `#60e0a0` green
- Pavement: cobblestone grey

**Background**
- `TwilightSkyBand` (violet with stars)
- `StringLightsBand` — diagonal strings of tiny amber bulbs across the upper area, each with a bobbing motion
- `CobblestoneBand` — grey-block pavement

**Landmarks**
- `FoodStall` — striped canopy with menu board (skewers, ice cream)
- `LanternPost` — classical-style wooden post holding 2–3 paper lanterns
- `FestivalBanner` — triangular flags strung between posts
- `MMDAHq` — keep the gov't building but with warm lit windows
- `BGCPavilion` — open-air tented pavilion with musicians (silhouette)

**Ambient**
- Floating sparks from grill stalls (yellow pixel particles rising)
- Occasional `ConfettiRain` (existing)

**Effort**: ~1.5h

---

## Option D — Clear Quiet Night

Calm, contemplative. Like BGC after the party. Navy starry sky, one bright moon, subdued streetlamps, a couple late taxis driving by.

**Palette**
- Sky: `#0a0a2a` with bright stars + large moon
- Pavement: `#3a3a48`
- Accents: warm `#ffcc80` only in streetlamp glow

**Background**
- `DeepNightSkyBand` — lots of stars, 1 moon with craters, 2 slow-drifting clouds
- `SkylineSilhouetteBand` — subtler than Option A, fewer lit windows
- `PavementBand` — dark grey

**Landmarks**
- `MMDAHq`
- `BGCTower` (1 tower, less flashy)
- `MoonReflection` puddle variant
- `Taxi` — animated driving across
- `LampPost` (existing) in heavier cluster

**Effort**: ~1h

---

## My recommendation

**Option A (Neon Cyberpunk)** — it's the strongest visual jump from Days 1 and 2, perfectly matches the existing "NIGHTFALL" label in the menu, and BGC High Street genuinely does look like that at night. Makes the Day 3 stop memorable.

If you want rain mood, go **Option B** (+20 min).

If you want a warmer / more "Filipino night market" feel, go **Option C**.

If you want understated, **Option D**.

---

## Files to change (all 4 options share the same targets)

| File | Change |
|---|---|
| `src/components/adventure/scene-sprites.tsx` | Add the chosen option's tile-band components and landmark sprites |
| `src/components/adventure/adventure-screens.tsx` | Add `day === 3` branch to `isTiledBg`, wire new background bands, rewrite `DayLandmarks case 3` in clean row layout, add any ambient overlay (rain / flash / sparks) |

---

## Execution plan once you pick

**Part A** — build the tile bands (chosen palette)
**Part B** — build 4-6 new landmark components matching MMDA + BGC
**Part C** — add ambient overlay (neon pulse / rain / string lights / fireworks)
**Part D** — rewrite `DayLandmarks case 3` using the same clean-row convention as Day 1/2

Final verification:
- Day 3 loads at `/adventure` with the chosen atmosphere
- MMDA pin and BGC pin each have a distinct landmark behind them
- No prop overlaps in the foreground
- Pixel-art language consistent with Days 1 and 2

---

**Reply with "A", "B", "C", or "D" and I'll execute that option.**
