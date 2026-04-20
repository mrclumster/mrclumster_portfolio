import Phaser from "phaser";
import { Player } from "../entities/Player";
import { PhotoFrame } from "../entities/PhotoFrame";
import { tripLocations } from "../data/trip-locations";
import { CANVAS_W, CANVAS_H, TILE_SIZE } from "../config";

void CANVAS_W; void CANVAS_H; // imported for type consistency

// ─── World dimensions ─────────────────────────────────────────────────────────
// 800×800 world (50×50 tiles). Camera viewport = 320×240 — scrolls freely.
const WORLD_W = 3840;
const WORLD_H = 2160;

// ─── Abu Dhabi Yas Marina Circuit ─────────────────────────────────────────────
// CatmullRom spline waypoints [x0,y0, x1,y1, …].
// Progression: Day 1 starts at the left end of the start/finish straight (top)
// and winds clockwise through the circuit toward Day 6 in the upper-right corner.
//
//  Day 1 ─── S/F straight (top, L→R) ─────────────── T1 right hairpin
//  Day 2 ─── S-curves descending right side ─────────────────────────
//  Day 3 ─── marina sweep, BGC night (left side) ────────────────────
//  Day 4 ─── back straight (south edge, L→R) ────────────────────────
//  Day 5 ─── chicane ascending right side ───────────────────────────
//  Day 6 ─── final sweepers, upper-right corner ─────────────────────
const CIRCUIT: number[] = [
  // ── Day 1: Start/Finish straight (left → right, y≈145) ────────────────
   80, 150,
  230, 140,
  400, 136,
  560, 142,
  // ── Turn 1: right hairpin (Yas-style hotel corner) ────────────────────
  662, 160,
  722, 208,
  712, 282,
  // ── Day 2: Technical S-section (sweeping down on right side) ──────────
  642, 332,
  532, 352,
  442, 346,
  402, 396,
  382, 462,
  322, 492,
  // ── Day 3: Marina sector + BGC night (left side, going south) ─────────
  238, 522,
  168, 572,
  150, 642,
  198, 702,
  342, 726,
  // ── Day 4: Back straight (south edge, left → right) ───────────────────
  478, 726,
  612, 704,
  688, 660,
  726, 600,
  742, 528,
  720, 460,
  // ── Day 5: Chicane + fast corner (ascending on right) ─────────────────
  658, 402,
  598, 362,
  558, 308,
  // ── Day 6: Final sweepers through upper-right (Baguio) ────────────────
  542, 250,
  566, 194,
  632, 174,
  702, 178,
  756, 212,
  758, 268,
  718, 294,
];

// ─── Day-divider sign positions ───────────────────────────────────────────────
const DAY_MARKERS: Array<{ label: string; x: number; y: number }> = [
  { label: "── DAY 2 ──", x: 732, y: 244 },
  { label: "── DAY 3 ──", x: 210, y: 504 },
  { label: "── DAY 4 ──", x: 346, y: 714 },
  { label: "── DAY 5 ──", x: 734, y: 484 },
  { label: "── DAY 6 ──", x: 546, y: 272 },
];

export class WorldScene extends Phaser.Scene {
  private player!: Player;
  private photoFrames: PhotoFrame[] = [];
  private interactKey!: Phaser.Input.Keyboard.Key;
  private currentZone?: string;
  private viewerOpen = false;
  // postFX handles (null if Phaser build doesn't support it)
  private bloomFX: Phaser.FX.Bloom | null = null;
  private inBGCZone = false;

  constructor() {
    super({ key: "WorldScene" });
  }

  create() {
    const bg   = this.add.graphics().setDepth(0);
    const deco = this.add.graphics().setDepth(1);
    const roadG = this.add.graphics().setDepth(2);

    const circuit = new Phaser.Curves.Spline(CIRCUIT);

    this.drawBackground(bg);
    this.drawRoad(roadG, circuit);
    this.drawDecorations(deco);
    this.drawDayLabels();

    // ── Player ─────────────────────────────────────────────────────────────
    // Spawns at left end of the Day 1 start straight
    this.player = new Player(this, 80, 150);

    // ── Camera ─────────────────────────────────────────────────────────────
    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setZoom(2);
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);

    const fromPortfolio = sessionStorage.getItem("adventure-origin") === "portfolio";
    if (fromPortfolio) {
      sessionStorage.removeItem("adventure-origin");
      this.cameras.main.flash(600, 255, 255, 255);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        this.cameras.main.shake(300, 0.008);
      }
    }

    // ── Cinematic postFX ───────────────────────────────────────────────────
    // Vignette darkens screen edges for a polished feel (always-on)
    try {
      this.cameras.main.postFX.addVignette(0.5, 0.5, 0.85, 0.4);
    } catch { /* postFX unavailable — no-op */ }

    // BGC bloom starts dormant; activated in checkZoneEntry when player enters Day 3
    try {
      this.bloomFX = this.cameras.main.postFX.addBloom(0xffffff, 1, 1, 0.6, 1.5, 1);
      this.bloomFX.active = false;
    } catch { this.bloomFX = null; }

    // ── Photo Frames ───────────────────────────────────────────────────────
    for (const loc of tripLocations) {
      this.photoFrames.push(new PhotoFrame(this, loc));
    }

    // ── Interact keys ──────────────────────────────────────────────────────
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on("down", () => this.tryInteract());
    this.interactKey.on("down", () => this.tryInteract());

    // ── UI scene (HUD) ─────────────────────────────────────────────────────
    this.scene.launch("UIScene", { worldScene: this });

    // ── Zone detection poll ────────────────────────────────────────────────
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: this.checkZoneEntry,
      callbackScope: this,
    });
  }

  // ─── Background ─────────────────────────────────────────────────────────────
  private drawBackground(g: Phaser.GameObjects.Graphics) {
    // World base — dark earth
    g.fillStyle(0x2e4a1e);
    g.fillRect(0, 0, WORLD_W, WORLD_H);

    // ── Day 1: Manila sky + bay (top-left) ──────────────────────────────
    g.fillStyle(0x5b8dd9); // sky blue
    g.fillRect(0, 0, 460, 200);
    g.fillStyle(0xc8a06b); // Manila tan
    g.fillRect(0, 120, 460, 100);
    // Manila Bay
    g.fillStyle(0x1e5799);
    g.fillRect(0, 155, 220, 110);
    g.fillStyle(0x2469b0);
    g.fillRect(12, 172, 160, 22);
    g.fillRect(18, 206, 130, 18);

    // ── T1 corner: Yas Hotel zone (upper-right) ──────────────────────────
    g.fillStyle(0x3a3a4a);
    g.fillRect(610, 0, 190, 250);
    // Hotel façade
    g.fillStyle(0x2e2e3e);
    g.fillRect(625, 20, 140, 110);
    // Hotel windows (randomize is fine — drawn once at scene create)
    g.fillStyle(0xffe080);
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 6; col++) {
        if ((row * 6 + col) % 7 !== 0) { // skip ~14% for variety
          g.fillRect(629 + col * 22, 26 + row * 20, 14, 12);
        }
      }
    }

    // ── Day 2: QC urban olive (right side, y 240-460) ───────────────────
    g.fillStyle(0x5a6a4a);
    g.fillRect(440, 200, 350, 290);

    // ── Day 3: Marina / BGC night (left side, y 430-760) ────────────────
    g.fillStyle(0x222838);
    g.fillRect(0, 430, 370, 360);
    // Marina water
    g.fillStyle(0x163050);
    g.fillRect(0, 530, 195, 220);
    g.fillStyle(0x1a3d63);
    g.fillRect(12, 558, 148, 28);
    g.fillRect(18, 610, 136, 22);

    // ── Day 4: Natural green along south edge ────────────────────────────
    g.fillStyle(0x3a5a2a);
    g.fillRect(0, 680, WORLD_W, 120);
    g.fillStyle(0x4a6a3a);
    g.fillRect(210, 698, 220, 58);
    g.fillRect(520, 698, 180, 58);

    // ── Day 5: Tagaytay highlands (right, y 340-580) ─────────────────────
    g.fillStyle(0x2d6a3f);
    g.fillRect(565, 300, 235, 310);
    g.fillStyle(0x1f5c32);
    g.fillRect(590, 340, 160, 120);

    // ── Day 6: Baguio pine mountain (upper-right, y 100-340) ─────────────
    g.fillStyle(0x3d5233);
    g.fillRect(440, 90, 220, 290);
    g.fillStyle(0x2a3d22);
    g.fillRect(440, 110, 220, 200);
  }

  // ─── Road ─────────────────────────────────────────────────────────────────
  private drawRoad(g: Phaser.GameObjects.Graphics, circuit: Phaser.Curves.Spline) {
    // Outer kerb (wide grey)
    g.lineStyle(36, 0x888888, 1);
    circuit.draw(g, 400);

    // Road surface (sandy tarmac)
    g.lineStyle(26, 0xc8bea8, 1);
    circuit.draw(g, 400);

    // Inner white line
    g.lineStyle(2, 0xffffff, 0.25);
    circuit.draw(g, 400);

    // Dashed centre line
    const pts = circuit.getPoints(600);
    for (let i = 0; i < pts.length; i += 7) {
      const p = pts[i];
      if (p) {
        g.fillStyle(0xffffff, 0.45);
        g.fillRect(p.x - 1, p.y - 1, 2, 2);
      }
    }

    // Start / Finish chequered bar
    for (let i = 0; i < 5; i++) {
      g.fillStyle(i % 2 === 0 ? 0xffffff : 0x111111);
      g.fillRect(77 + i * 4, 136, 4, 28);
    }

    // Red/white kerb chicane markers at key corners (T1, T5, T9)
    const kerbCorners = [
      { x: 662, y: 160 }, { x: 720, y: 208 }, // T1
      { x: 382, y: 462 }, { x: 322, y: 492 }, // T5
      { x: 726, y: 600 }, { x: 742, y: 528 }, // T9
    ];
    kerbCorners.forEach((pt, i) => {
      g.fillStyle(i % 2 === 0 ? 0xff2222 : 0xffffff);
      g.fillRect(pt.x - 4, pt.y - 4, 8, 8);
    });
  }

  // ─── Decorations ─────────────────────────────────────────────────────────
  private drawDecorations(g: Phaser.GameObjects.Graphics) {
    // ── Day 1: Airport runway + Manila wall ─────────────────────────────
    g.fillStyle(0x444444);
    g.fillRect(18, 182, 70, 9); // runway
    g.fillStyle(0xffffff);
    for (let i = 0; i < 4; i++) g.fillRect(24 + i * 16, 184, 10, 5);
    // Airplane silhouette
    g.fillStyle(0xbbbbcc);
    g.fillRect(38, 196, 32, 5);
    g.fillTriangle(38, 198, 24, 192, 38, 200);
    g.fillTriangle(55, 194, 66, 190, 66, 198);
    // Intramuros wall detail
    g.fillStyle(0x8c7a5e);
    g.fillRect(285, 116, 68, 22);
    g.fillStyle(0x7a6a4e);
    for (let i = 0; i < 5; i++) g.fillRect(287 + i * 14, 110, 10, 8);

    // ── T1: Yas Hotel track lights ───────────────────────────────────────
    g.fillStyle(0xff3300); g.fillCircle(692, 76, 4);
    g.fillStyle(0x00bbff); g.fillCircle(714, 66, 3);

    // ── Day 2: Urban apartment blocks ───────────────────────────────────
    this.drawBuilding(g, 462, 218, 58, 72, 0x505a60);
    this.drawBuilding(g, 566, 220, 46, 68, 0x4a5460);
    this.drawBuilding(g, 695, 212, 52, 78, 0x55606a);
    this.drawBuilding(g, 762, 222, 38, 64, 0x4a5060);
    this.drawBuilding(g, 460, 318, 42, 56, 0x3e4850);
    this.drawBuilding(g, 740, 320, 44, 60, 0x3e4850);

    // ── Day 3: MMDA HQ building ──────────────────────────────────────────
    this.drawBuilding(g, 12, 496, 72, 62, 0x404a50);
    this.drawBuilding(g, 98, 484, 52, 74, 0x404a50);
    // MMDA broadcast tower
    g.lineStyle(1, 0xaaaaaa, 1);
    g.lineBetween(82, 484, 88, 450); g.lineBetween(88, 450, 94, 484);
    g.lineBetween(86, 468, 90, 468);

    // ── Day 3: BGC skyscrapers + neon ───────────────────────────────────
    this.drawSkyscraper(g, 12, 604, 40, 82);
    this.drawSkyscraper(g, 60, 620, 32, 66);
    this.drawSkyscraper(g, 104, 608, 38, 76);
    const neons = [0xff00ff, 0x00ffff, 0xffee00, 0xff4400];
    for (let i = 0; i < 20; i++) {
      g.fillStyle(neons[i % 4]);
      g.fillCircle(16 + (i % 10) * 14, 620 + Math.floor(i / 10) * 18, 2);
    }

    // ── Day 4: Trees along back straight ────────────────────────────────
    for (let i = 0; i < 9; i++) {
      this.drawTree(g, 200 + i * 56, 754);
      this.drawTree(g, 226 + i * 50, 672);
    }

    // ── Day 5: Tagaytay hills + Taal volcano + ferris wheel ─────────────
    g.fillStyle(0x1a4a28);
    g.fillTriangle(568, 494, 648, 388, 726, 494);
    g.fillTriangle(606, 494, 678, 406, 748, 494);
    g.fillStyle(0x2a5a35);
    g.fillTriangle(584, 608, 664, 436, 744, 608);
    g.fillStyle(0xdcdcc8); // volcanic plume
    g.fillCircle(664, 430, 12);
    g.fillCircle(656, 422, 8);
    // Ferris wheel (Sky Ranch)
    g.lineStyle(2, 0xdddddd, 0.85);
    g.strokeCircle(752, 518, 26);
    g.lineStyle(1, 0xcccccc, 0.55);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      g.lineBetween(752, 518, 752 + Math.cos(a) * 26, 518 + Math.sin(a) * 26);
    }
    g.fillStyle(0x999999); g.fillCircle(752, 518, 3);
    g.lineStyle(2, 0x888888, 1);
    g.lineBetween(740, 542, 740, 565); g.lineBetween(764, 542, 764, 565);

    // ── Day 6: Pine trees ────────────────────────────────────────────────
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        this.drawPineTree(g, 446 + col * 20, 96  + row * 34);
        this.drawPineTree(g, 642 + col * 18, 100 + row * 32);
      }
    }
    // Strawberry patch (La Trinidad)
    g.fillStyle(0x1e6020); g.fillRect(554, 222, 24, 16);
    g.fillStyle(0xff2222);
    for (let i = 0; i < 8; i++) {
      g.fillCircle(556 + (i % 4) * 6, 224 + Math.floor(i / 4) * 8, 3);
    }
    // Bell Church gate
    g.fillStyle(0xff4444);
    g.fillRect(614, 162, 3, 18); g.fillRect(640, 162, 3, 18);
    g.fillStyle(0xffaa00);
    g.fillRect(614, 158, 29, 7);
    g.fillStyle(0xffee00);
    g.fillRect(617, 154, 6, 6); g.fillRect(632, 154, 6, 6);
    // PMA flagpole
    g.lineStyle(2, 0xcccccc, 1);
    g.lineBetween(690, 160, 690, 200);
    g.fillStyle(0x0033cc); g.fillRect(690, 160, 14, 10);
    g.fillStyle(0xff0000); g.fillRect(690, 160, 14, 5);
    // PMA guard post
    g.fillStyle(0x888888);
    g.fillRect(676, 188, 10, 14); g.fillRect(702, 188, 10, 14);

    // ── Grandstand (near S/F line) ───────────────────────────────────────
    g.fillStyle(0x888888);
    g.fillRect(62, 122, 36, 22);
    g.fillStyle(0xcccccc);
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        g.fillRect(64 + col * 7, 124 + row * 6, 5, 4);
      }
    }
  }

  // ─── Day divider labels ───────────────────────────────────────────────────
  private drawDayLabels() {
    for (const m of DAY_MARKERS) {
      this.add.text(m.x, m.y, m.label, {
        fontSize: "10px",
        color: "#ffffff",
        fontFamily: "'Press Start 2P', monospace",
        backgroundColor: "#00000099",
        padding: { x: 4, y: 2 },
      }).setOrigin(0.5).setDepth(4);

      const g2 = this.add.graphics().setDepth(3);
      g2.lineStyle(1, 0xffffff, 0.3);
      g2.lineBetween(m.x - 24, m.y, m.x + 24, m.y);
    }
  }

  // ─── Drawing helpers ──────────────────────────────────────────────────────
  private drawBuilding(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, color: number) {
    g.fillStyle(color);
    g.fillRect(x, y, w, h);
    g.fillStyle(0xffe080);
    const cols = Math.max(1, Math.floor(w / 12));
    const rows = Math.max(1, Math.floor(h / 14));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if ((r * cols + c) % 5 !== 0) {
          g.fillRect(x + 3 + c * 12, y + 4 + r * 14, 7, 7);
        }
      }
    }
  }

  private drawSkyscraper(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number) {
    g.fillStyle(0x1a1a2e);
    g.fillRect(x, y, w, h);
    g.fillStyle(0x4488ff);
    const cols = Math.max(1, Math.floor(w / 8));
    const rows = Math.max(1, Math.floor(h / 10));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if ((r * cols + c) % 3 !== 0) {
          g.fillRect(x + 2 + c * 8, y + 3 + r * 10, 5, 5);
        }
      }
    }
  }

  private drawTree(g: Phaser.GameObjects.Graphics, x: number, y: number) {
    g.fillStyle(0x7a5a30); g.fillRect(x + 3, y + 6, 4, 9);
    g.fillStyle(0x4a5a2a); g.fillCircle(x + 5, y, 8);
    g.fillStyle(0x5a6a3a); g.fillCircle(x + 3, y - 2, 5);
  }

  private drawPineTree(g: Phaser.GameObjects.Graphics, x: number, y: number) {
    g.fillStyle(0x4a3020); g.fillRect(x + 4, y + 2, 4, 7);
    g.fillStyle(0x2a3d1a); g.fillTriangle(x + 6, y - 15, x, y + 2, x + 12, y + 2);
    g.fillStyle(0x3a5028); g.fillTriangle(x + 6, y - 10, x + 1, y + 1, x + 11, y + 1);
  }

  // ─── Zone detection ───────────────────────────────────────────────────────
  private checkZoneEntry() {
    const PROXIMITY = TILE_SIZE * 5;
    let nearest: { dist: number; name: string } | null = null;

    for (const frame of this.photoFrames) {
      const loc = frame.getLocation();
      const fx = loc.mapTileX * TILE_SIZE;
      const fy = loc.mapTileY * TILE_SIZE;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, fx, fy);

      frame.showPrompt(dist < TILE_SIZE * 3);

      if (dist < PROXIMITY && (!nearest || dist < nearest.dist)) {
        nearest = { dist, name: loc.name };
      }
    }

    const newZone = nearest?.name;
    if (newZone !== this.currentZone) {
      this.currentZone = newZone;

      // Zone transition: brief white flash
      if (newZone) {
        this.cameras.main.flash(180, 255, 255, 255, true);
      }

      // BGC bloom: on while inside BGC stop, off elsewhere
      const enteringBGC = newZone === "BGC";
      if (enteringBGC !== this.inBGCZone) {
        this.inBGCZone = enteringBGC;
        if (this.bloomFX) {
          this.bloomFX.active = enteringBGC;
        }
      }

      // Include dayLabel + day so React banners can react to day transitions
      const matchedLoc = tripLocations.find((l) => l.name === newZone);
      window.dispatchEvent(new CustomEvent("adventure-zone-enter", {
        detail: {
          name:     newZone ?? "",
          dayLabel: matchedLoc?.dayLabel ?? "",
          day:      matchedLoc?.day ?? 0,
        },
      }));
    }
  }

  // ─── Interaction ──────────────────────────────────────────────────────────
  private tryInteract() {
    if (this.viewerOpen) return;
    const REACH = TILE_SIZE * 2;

    for (const frame of this.photoFrames) {
      const loc = frame.getLocation();
      const fx = loc.mapTileX * TILE_SIZE;
      const fy = loc.mapTileY * TILE_SIZE;
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, fx, fy) < REACH) {
        this.viewerOpen = true;
        this.scene.launch("PhotoViewerScene", {
          location: loc,
          photos: frame.getPhotosWithFallback(),
          onClose: () => {
            this.viewerOpen = false;
            this.scene.stop("PhotoViewerScene");
          },
        });
        return;
      }
    }
  }

  update() {
    if (!this.viewerOpen) this.player.update();
  }
}
