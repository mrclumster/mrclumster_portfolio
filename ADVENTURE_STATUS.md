# Adventure Mode — Current Status

Last updated: 2026-04-17

---

## What's Working ✅

| Feature | Status |
|---|---|
| Colored zone map (Baguio, QC, Manila, Makati, Tagaytay) | ✅ Rendering |
| Region labels on map | ✅ Rendering |
| Roads (EDSA, C5, NLEX, etc.) | ✅ Rendering |
| Photo frame sprites (correctly sized 12×16px) | ✅ Rendering |
| Photo viewer (opens on Z key near a frame) | ✅ Working |
| TAB key — toggles Highlights ↔ All Photos | ✅ Working |
| Video playback overlay (MOV files) | ✅ Working |
| ← Portfolio button | ✅ Working |
| Sound toggle | ✅ Working |
| Mobile fallback | ✅ Working |
| Loading bar | ✅ Working |
| Puzzle break animation (bento cards fall apart) | ✅ Working |

---

## What's Broken / Incomplete ❌

### 1. Player Can't Move
**Likely cause A — browser keyboard focus (most common)**
Browsers require you to **click on the game canvas first** before keyboard input works.
> **Fix**: Click anywhere on the green map area, THEN press WASD/arrow keys.

**Likely cause B — wrong LPC sprite rows**
The code assumes the walk animation is at rows 8–11 of your sprite (standard LPC layout). If your generator used a different layout, the player shows empty/transparent frames and *might* still move but be invisible.

**How to test**: After clicking the canvas, hold the RIGHT arrow key for 3 seconds. If the photo frame moves off screen to the left (camera follows player), movement IS working but the sprite is invisible. If nothing moves, it's a different issue.

---

### 2. Player Sprite Shows as Grey Checkerboard
**Root cause**: The animation code assumes your LPC spritesheet uses the **Standard LPC row layout**:
```
Row 8  → Walk UP    (frame indices 224–232)
Row 9  → Walk LEFT  (frame indices 252–260)
Row 10 → Walk DOWN  (frame indices 280–288)
Row 11 → Walk RIGHT (frame indices 308–316)
```

Your sprite is 1792×2390px → 28 columns × 37 rows at 64×64px per frame.

**But**: Different generators use different row orders. If your generator outputs walk at rows 0–3 instead of rows 8–11, those rows would show **spellcast / thrust animations** instead of walking — and if those are empty in your sprite, the player looks like a grey square.

**What I need from you**: Open your `player.png` in any image editor (Preview, Paint, Photoshop, etc.) and count **which row (from the top, starting at 0) shows your character walking DOWN** toward the bottom of the screen. Each row is 64px tall.

Example answer: *"Walking down is at row 2"*

Once you tell me the row, I can fix the 4 animation rows in 2 minutes.

---

### 3. No Background Music
There is no audio file. The code looks for it but silently skips if missing.

**To add BGM**: Drop any `.mp3` chiptune file here:
```
public/game/audio/bgm-adventure.mp3
```
Free options (CC0 license):
- OpenGameArt.org → search "RPG town music" or "adventure chiptune"

---

## Assets Status

| Asset | Location | Status |
|---|---|---|
| player.png | `public/game/sprites/player.png` | ✅ Added (1792×2390, LPC format) |
| photo-frame.jpg | `public/game/sprites/photo-frame.jpg` | ✅ Added |
| Trip photos Day 1–6 | `public/images/trip/day-1/` … `day-6/` | ✅ Added |
| placeholder.svg | `public/images/trip/placeholder.svg` | ✅ Added |
| BGM audio | `public/game/audio/bgm-adventure.mp3` | ❌ Missing (optional) |
| Tileset PNG | `public/game/tilesets/lpc-base.png` | ❌ Not needed (procedural map) |
| Map JSON | `public/game/tilesets/world-map.json` | ❌ Not needed (procedural map) |

---

## The One Thing Needed to Fix the Player

Tell me which row your character's **walk-down animation** is on.

Open `public/game/sprites/player.png` → count rows from top (row 0 = first row).
Each row = 64px tall.

| If walk-down is at row... | I update the code with... |
|---|---|
| Row 0 | `walkDown = 0 * 28` |
| Row 2 | `walkDown = 2 * 28` |
| Row 10 | Already correct (current code) |

That's the only thing blocking a fully working game.

---

## Optional Future Improvements

- Add a real pixel-art tileset (I can provide exact download instructions)
- Day counter in top-left showing current zone's day number
- Collision walls so player can't walk through buildings
- Spawn animation (player "arrives" at DJM dorm on entry)
