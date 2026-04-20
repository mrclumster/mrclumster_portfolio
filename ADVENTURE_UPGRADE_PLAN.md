# Adventure Mode — Upgrade Plan

Last updated: 2026-04-17

---

## Status: What's Already Done ✅

| Feature | Status |
|---|---|
| Abu Dhabi Yas Marina circuit layout (800×800 world) | ✅ Done |
| CatmullRom spline road with kerb + dashes | ✅ Done |
| Per-day visual zones (Manila, QC, BGC night, Tagaytay, Baguio) | ✅ Done |
| 16 photo frame stops along the circuit | ✅ Done |
| Correct subfolder image paths (`day-X/folder/file`) | ✅ Done |
| Photo viewer (highlights + TAB all) | ✅ Done |
| Player sprite (LPC format, walk/idle anims) | ✅ Done |
| Sound toggle, loading bar, mobile fallback | ✅ Done |

---

## Phase 1 — Zero-Install Polish (Phaser built-in FX) 🔜

These use Phaser 3.60's built-in `postFX` pipeline. No `npm install` needed.

### 1a. Photo frame glow
Add a yellow pulsing glow when the player is near a frame.

**File:** `src/game/entities/PhotoFrame.ts`
- Call `sprite.postFX.addGlow(0xffd700, 4, 0, false, 0.1, 16)` on the sprite
- Toggle glow intensity in `showPrompt()` — stronger when visible

### 1b. Camera vignette (always-on)
Darkens the screen edges for a cinematic feel.

**File:** `src/game/scenes/WorldScene.ts`
- `this.cameras.main.postFX.addVignette(0.5, 0.5, 0.85)`

### 1c. BGC night bloom
The Day 3 night area should feel like neon city glow.

**File:** `src/game/scenes/WorldScene.ts`
- When the player enters the BGC zone (tile Y 33–40), apply:
  `this.cameras.main.postFX.addBloom(0.6, 0.6, 0.6, 1.5, 1)`
- Remove bloom when leaving BGC

### 1d. Zone transition flash
Brief camera flash when crossing a day boundary.

**File:** `src/game/scenes/WorldScene.ts`
- Already have `checkZoneEntry()` — extend it to call
  `this.cameras.main.flash(200, 255, 255, 255, true)` on zone change

### 1e. Start/Finish arrival shake
Player arrives with a camera shake (already half-done for portfolio origin).
Extend to always shake on first spawn.

---

## Phase 2 — React UI Polish (Framer Motion) 🔜

**Install:** `npm install framer-motion`

### 2a. Zone name banner
Animated slide-in from top when entering a new zone.

**File:** `src/components/adventure/ZoneBanner.tsx` *(new)*
```tsx
<AnimatePresence>
  {zoneName && (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {zoneName}
    </motion.div>
  )}
</AnimatePresence>
```

### 2b. Photo viewer enter/exit
Scale + fade in/out instead of instant appear.

**File:** wherever PhotoViewerScene is mounted in React
```tsx
<motion.div
  initial={{ scale: 0.92, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.92, opacity: 0 }}
  transition={{ duration: 0.25 }}
/>
```

### 2c. Day label tooltip
When entering a new day zone, show a full-width day banner
(e.g. "DAY 3 — BGC NIGHT") that fades out after 2 seconds.

---

## Phase 3 — Audio (Howler.js zone BGM) 🔜

**Install:** `npm install howler @types/howler`

### 3a. Zone-based crossfade BGM
Different lo-fi/chiptune track per day zone. Crossfade on zone entry.

| Zone | Suggested vibe |
|---|---|
| Day 1 Manila | Tropical lo-fi, upbeat |
| Day 2 QC | Urban chill, mid-tempo |
| Day 3 BGC night | Synthwave, neon |
| Day 4 Back straight | Relaxed road trip |
| Day 5 Tagaytay | Acoustic, breezy |
| Day 6 Baguio | Mountain ambience, slower |

Free sources (CC0): OpenGameArt.org, incompetech.com, freemusicarchive.org

### 3b. SFX
- Footstep (grass / tarmac) — Kenney.nl Impact Sounds pack
- Photo frame open
- Zone transition chime

---

## Phase 4 — Visual Assets (Custom Sprites) 🔜

These replace the procedural Graphics draws with real pixel-art sprites.

### Priority order (most visible first):

| Asset | Replaces | Size |
|---|---|---|
| Photo frame sprite (gold/wood) | Current `.jpg` | 12×16px |
| Photo frame glow overlay | postFX glow | 24×32px |
| Yas Hotel building sheet | Procedural drawBuilding() | 80×100px |
| Grandstand sprite | Procedural fillRect | 40×24px |
| Pine tree sprite (3 variants) | Procedural drawPineTree() | 16×24px |
| Deciduous tree sprite | Procedural drawTree() | 16×20px |
| Taal Volcano silhouette | Procedural triangle | 80×60px |
| Ferris wheel sprite (animated) | Procedural circles | 52×56px |
| Kerb/road edge tile | Spline stroke | 16×16px |

### Character upgrades:
| Asset | Notes |
|---|---|
| Player walk (LPC) ✅ | Already in |
| NPC sprites | Optional — pit crew, travellers |

### UI upgrades:
| Asset | Notes |
|---|---|
| Dialogue box (9-slice PNG) | Replace plain background |
| Zone name banner sprite | Replace CSS div |
| Interaction prompt chip | "Z" or "Enter" bubble |
| Day sign (roadside) | Replace text label |

---

## Asset Sources

| Platform | Best for | License |
|---|---|---|
| [LPC Generator](https://lpc.opengameart.org) | Player character ✅ | CC0/CC-BY |
| [OpenGameArt.org](https://opengameart.org) | Tiles, BGM, SFX | CC0/CC-BY |
| [itch.io](https://itch.io/game-assets/tag-pixel-art) | Full packs, RPG style | Varies |
| [Kenney.nl](https://kenney.nl/assets) | Props, UI, SFX | CC0 |
| [craftpix.net](https://craftpix.net/freebies) | Environment packs | Free tier |
| [freesound.org](https://freesound.org) | SFX | CC0 |
| [incompetech.com](https://incompetech.com) | Chiptune BGM | CC-BY |

---

## Implementation Order (Recommended)

```
Phase 1 ✅ DONE
  ✅ 1a  Photo frame glow (postFX)
  ✅ 1b  Camera vignette
  ✅ 1c  BGC bloom on zone entry
  ✅ 1d  Zone transition flash

Phase 2 ✅ DONE
  ✅ npm install framer-motion
  ✅ 2a  ZoneBanner — slide-in location name (zone-banner.tsx)
  ✅ 2b  Video overlay fade + scale animation (adventure-shell.tsx)
  ✅ 2c  DayBanner — day arrival announcement (day-banner.tsx)
  ✅ 2d  AdventureOverlay buttons — staggered fade-up
  ✅ 2e  GameLoaderScreen — smooth fade-out exit animation
  ✅ 2f  WorldScene zone event — now dispatches dayLabel + day

Phase 3 (when BGM files are ready)
  [ ] npm install howler @types/howler
  [ ] 3a  Zone BGM crossfade
  [ ] 3b  SFX integration

Phase 4 (when custom sprites are ready)
  [ ] Drop photo-frame.png into public/game/sprites/
  [ ] Drop tree/building sprites
  [ ] Update PreloadScene.ts to load new assets
  [ ] Replace procedural draws with sprite renders
```

---

## Notes

- **Do NOT add PixiJS, Three.js, or Babylon.js** — Phaser already uses WebGL internally. Mixing them causes conflicts.
- **Phaser postFX requires Phaser ≥ 3.60** — verify with `import Phaser from 'phaser'; console.log(Phaser.VERSION)` if effects don't appear.
- **BGM file goes here:** `public/game/audio/bgm-adventure.mp3` (already wired, just missing the file)
