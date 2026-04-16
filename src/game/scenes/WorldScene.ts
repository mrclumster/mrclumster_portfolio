import Phaser from "phaser";
import { Player } from "../entities/Player";
import { PhotoFrame } from "../entities/PhotoFrame";
import { tripLocations } from "../data/trip-locations";
import { CANVAS_W, CANVAS_H, TILE_SIZE } from "../config";

export class WorldScene extends Phaser.Scene {
  private player!: Player;
  private photoFrames: PhotoFrame[] = [];
  private interactKey!: Phaser.Input.Keyboard.Key;
  private currentZone?: string;
  private viewerOpen = false;

  constructor() {
    super({ key: "WorldScene" });
  }

  create() {
    // ── Tilemap ──────────────────────────────────────────────────────────
    // Try to load the Tiled map; fall back to a simple colored background
    let worldW = CANVAS_W * 5;
    let worldH = CANVAS_H * 5;

    try {
      const map = this.make.tilemap({ key: "world-map" });
      const tileset = map.addTilesetImage("lpc-base", "tiles");
      if (tileset) {
        map.createLayer("Ground", tileset, 0, 0);
        const collisionLayer = map.createLayer("Collision", tileset, 0, 0);
        collisionLayer?.setCollisionByProperty({ collides: true });
        if (collisionLayer) {
          this.physics.add.collider(this.player, collisionLayer);
        }
        worldW = map.widthInPixels;
        worldH = map.heightInPixels;
      }
    } catch {
      // No tilemap yet — render a plain green background
      this.add.rectangle(0, 0, worldW, worldH, 0x1a472a).setOrigin(0);

      // Grid lines for visual reference during dev
      const graphics = this.add.graphics();
      graphics.lineStyle(1, 0x2d6a4f, 0.3);
      for (let x = 0; x < worldW; x += TILE_SIZE) {
        graphics.moveTo(x, 0).lineTo(x, worldH);
      }
      for (let y = 0; y < worldH; y += TILE_SIZE) {
        graphics.moveTo(0, y).lineTo(worldW, y);
      }
      graphics.strokePath();
    }

    // ── Player ───────────────────────────────────────────────────────────
    // Spawn at DJM Dormitory tile coords (30, 40 = QC home base)
    const spawnX = 30 * TILE_SIZE + 8;
    const spawnY = 40 * TILE_SIZE + 8;
    this.player = new Player(this, spawnX, spawnY);

    // ── Camera ───────────────────────────────────────────────────────────
    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.physics.world.setBounds(0, 0, worldW, worldH);

    // Arrival flash + shake if coming from portfolio
    const fromPortfolio = sessionStorage.getItem("adventure-origin") === "portfolio";
    if (fromPortfolio) {
      sessionStorage.removeItem("adventure-origin");
      this.cameras.main.flash(600, 255, 255, 255);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduceMotion) {
        this.cameras.main.shake(300, 0.008);
      }
    }

    // ── Photo Frames ─────────────────────────────────────────────────────
    for (const loc of tripLocations) {
      const frame = new PhotoFrame(this, loc);
      this.photoFrames.push(frame);
    }

    // ── Interact key ─────────────────────────────────────────────────────
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on("down", () => this.tryInteract());
    this.interactKey.on("down", () => this.tryInteract());

    // ── Launch UI scene in parallel ───────────────────────────────────────
    this.scene.launch("UIScene", { worldScene: this });

    // ── Zone detection ───────────────────────────────────────────────────
    // Map photo frame proximity to zone entry
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: this.checkZoneEntry,
      callbackScope: this,
    });
  }

  private checkZoneEntry() {
    const PROXIMITY = TILE_SIZE * 5;
    let nearest: { dist: number; name: string } | null = null;

    for (const frame of this.photoFrames) {
      const loc = frame.getLocation();
      const fx = loc.mapTileX * TILE_SIZE;
      const fy = loc.mapTileY * TILE_SIZE;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, fx, fy);

      frame.showPrompt(dist < TILE_SIZE * 2);

      if (dist < PROXIMITY && (!nearest || dist < nearest.dist)) {
        nearest = { dist, name: loc.name };
      }
    }

    const newZone = nearest?.name;
    if (newZone !== this.currentZone) {
      this.currentZone = newZone;
      // Notify React overlay via custom DOM event
      window.dispatchEvent(
        new CustomEvent("adventure-zone-enter", {
          detail: { name: newZone ?? "" },
        })
      );
    }
  }

  private tryInteract() {
    if (this.viewerOpen) return;
    const REACH = TILE_SIZE * 2;

    for (const frame of this.photoFrames) {
      const loc = frame.getLocation();
      const fx = loc.mapTileX * TILE_SIZE;
      const fy = loc.mapTileY * TILE_SIZE;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, fx, fy);

      if (dist < REACH) {
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
    if (!this.viewerOpen) {
      this.player.update();
    }
  }
}
