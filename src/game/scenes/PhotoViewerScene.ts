import Phaser from "phaser";
import type { TripLocation, TripPhoto } from "../data/trip-locations";
import { PLACEHOLDER_PHOTO, dayGalleries } from "../data/trip-locations";

interface PhotoViewerData {
  location: TripLocation;
  photos: TripPhoto[];
  onClose: () => void;
}

// Layout constants — stored as class fields so setDisplaySize can be re-applied after setTexture
const PHOTO_W = 232;
const PHOTO_H = 176;
const PHOTO_X = 204; // (640 - 232) / 2
const PHOTO_Y = 60;

export class PhotoViewerScene extends Phaser.Scene {
  private photoIndex = 0;
  private photos: TripPhoto[] = [];
  private allPhotos: TripPhoto[] = [];
  private location!: TripLocation;
  private onClose!: () => void;
  private mode: "highlights" | "all" = "highlights";

  private photoImage?: Phaser.GameObjects.Image;
  private captionText?: Phaser.GameObjects.Text;
  private modeLabel?: Phaser.GameObjects.Text;
  private counterText?: Phaser.GameObjects.Text;
  private videoPlaceholder?: Phaser.GameObjects.Container;

  constructor() {
    super({ key: "PhotoViewerScene" });
  }

  init(data: PhotoViewerData) {
    this.photos     = data.photos;
    this.location   = data.location;
    this.onClose    = data.onClose;
    this.photoIndex = 0;
    this.allPhotos  = dayGalleries[this.location.day] ?? [];
    this.mode       = this.photos.length === 0 ? "all" : "highlights";
  }

  create() {
    const W = 640;
    const H = 640;

    // ── Full-canvas dark overlay ───────────────────────────────────────────
    this.add.rectangle(0, 0, W, H, 0x000000, 0.82)
      .setOrigin(0).setScrollFactor(0).setDepth(200);

    // ── Photo frame ────────────────────────────────────────────────────────
    // White border
    this.add.rectangle(PHOTO_X - 4, PHOTO_Y - 4, PHOTO_W + 8, PHOTO_H + 8, 0xffffff)
      .setOrigin(0).setScrollFactor(0).setDepth(201);

    // Black inner background (shown while photo loads)
    this.add.rectangle(PHOTO_X, PHOTO_Y, PHOTO_W, PHOTO_H, 0x111122)
      .setOrigin(0).setScrollFactor(0).setDepth(201);

    // Photo image — ALWAYS setDisplaySize after setTexture to avoid natural-size blowup
    this.photoImage = this.add
      .image(PHOTO_X + PHOTO_W / 2, PHOTO_Y + PHOTO_H / 2, "__MISSING")
      .setDisplaySize(PHOTO_W, PHOTO_H)
      .setScrollFactor(0)
      .setDepth(202);

    // ▶ VIDEO placeholder
    const vpBg    = this.add.rectangle(0, 0, PHOTO_W, PHOTO_H, 0x111122).setOrigin(0.5);
    const vpIcon  = this.add.text(0, -16, "\u25b6", {
      fontSize: "36px", color: "#6366f1",
      fontFamily: "'Press Start 2P', monospace",
    }).setOrigin(0.5);
    const vpLabel = this.add.text(0, 32, "PRESS Z TO PLAY", {
      fontSize: "8px", color: "#aaaaaa",
      fontFamily: "'Press Start 2P', monospace",
    }).setOrigin(0.5);
    this.videoPlaceholder = this.add
      .container(PHOTO_X + PHOTO_W / 2, PHOTO_Y + PHOTO_H / 2, [vpBg, vpIcon, vpLabel])
      .setScrollFactor(0).setDepth(202).setVisible(false);

    // ── Dialog box ─────────────────────────────────────────────────────────
    const BOX_X = 12;
    const BOX_Y = PHOTO_Y + PHOTO_H + 28;
    const BOX_W = W - BOX_X * 2;
    const BOX_H = H - BOX_Y - 12;

    // White border
    this.add.rectangle(BOX_X, BOX_Y, BOX_W, BOX_H, 0xffffff)
      .setOrigin(0).setScrollFactor(0).setDepth(201);
    // Dark fill
    this.add.rectangle(BOX_X + 4, BOX_Y + 4, BOX_W - 8, BOX_H - 8, 0x0d0d1a)
      .setOrigin(0).setScrollFactor(0).setDepth(202);

    // Day + location name
    this.add.text(BOX_X + 16, BOX_Y + 14,
      `${this.location.dayLabel} \u2014 ${this.location.name.toUpperCase()}`, {
        fontSize: "10px",
        color: "#818cf8",
        fontFamily: "'Press Start 2P', monospace",
        wordWrap: { width: BOX_W - 32 },
      }).setScrollFactor(0).setDepth(203);

    // Description
    this.add.text(BOX_X + 16, BOX_Y + 38, this.location.description, {
      fontSize: "10px",
      color: "#b0b0c8",
      fontFamily: "'Press Start 2P', monospace",
      wordWrap: { width: BOX_W - 32 },
      lineSpacing: 4,
    }).setScrollFactor(0).setDepth(203);

    // Nav hint strip at bottom of dialog
    this.add.text(BOX_X + 16, BOX_Y + BOX_H - 24,
      "\u25c4 \u25ba PHOTOS   TAB MODE   B CLOSE", {
        fontSize: "10px",
        color: "#44445a",
        fontFamily: "'Press Start 2P', monospace",
      }).setScrollFactor(0).setDepth(203);

    // ── Caption (between photo and dialog) ────────────────────────────────
    this.captionText = this.add
      .text(W / 2, PHOTO_Y + PHOTO_H + 8, "", {
        fontSize: "10px", color: "#e2e8f0",
        fontFamily: "'Press Start 2P', monospace",
      })
      .setOrigin(0.5, 0).setScrollFactor(0).setDepth(203);

    // ── Mode label (top-left) ─────────────────────────────────────────────
    this.modeLabel = this.add.text(12, 12,
      this.mode === "highlights" ? "\u2605 HIGHLIGHTS" : "ALL PHOTOS", {
        fontSize: "10px",
        color: this.mode === "highlights" ? "#fbbf24" : "#64748b",
        fontFamily: "'Press Start 2P', monospace",
        backgroundColor: "#00000099",
        padding: { x: 6, y: 4 },
      }).setScrollFactor(0).setDepth(203);

    // ── Counter (top-right) ───────────────────────────────────────────────
    this.counterText = this.add.text(W - 12, 12, "", {
      fontSize: "10px", color: "#ffffff66",
      fontFamily: "'Press Start 2P', monospace",
      backgroundColor: "#00000099",
      padding: { x: 6, y: 4 },
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(203);

    // Show first photo
    this.showPhoto(0);

    // ── Input ─────────────────────────────────────────────────────────────
    const kb = this.input.keyboard!;
    const left  = kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    const right = kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    const bKey  = kb.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    const esc   = kb.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    const tab   = kb.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
    const zKey  = kb.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    left.on("down",  () => this.navPhoto(-1));
    right.on("down", () => this.navPhoto(1));
    bKey.on("down",  () => this.close());
    esc.on("down",   () => this.close());
    tab.on("down",   () => this.toggleMode());
    zKey.on("down",  () => this.tryPlayVideo());

    window.addEventListener("adventure-video-close", this.onVideoClose);
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  private get activePhotos(): TripPhoto[] {
    return this.mode === "highlights" ? this.photos : this.allPhotos;
  }

  private showPhoto(index: number) {
    const photos = this.activePhotos;
    if (photos.length === 0) {
      this.captionText?.setText("NO PHOTOS YET");
      this.counterText?.setText("0/0");
      this.photoImage?.setVisible(false);
      this.videoPlaceholder?.setVisible(false);
      return;
    }

    this.photoIndex = ((index % photos.length) + photos.length) % photos.length;
    const photo = photos[this.photoIndex];

    this.counterText?.setText(`${this.photoIndex + 1}/${photos.length}`);

    if (photo.type === "video") {
      this.photoImage?.setVisible(false);
      this.videoPlaceholder?.setVisible(true);
      this.captionText?.setText(photo.caption || "VIDEO");
    } else {
      this.videoPlaceholder?.setVisible(false);
      this.photoImage?.setVisible(true);
      this.captionText?.setText(photo.caption);
      this.loadPhotoImage(photo, this.photoIndex);
    }
  }

  private loadPhotoImage(photo: TripPhoto, index: number) {
    const key = `trip-${this.location.id}-${this.mode}-${index}`;

    const applyTexture = (texKey: string) => {
      if (!this.photoImage) return;
      this.photoImage.setTexture(texKey);
      // CRITICAL: re-apply display size after every setTexture call —
      // Phaser resets to the texture's natural dimensions otherwise
      this.photoImage.setDisplaySize(PHOTO_W, PHOTO_H);
    };

    if (this.textures.exists(key)) {
      applyTexture(key);
      return;
    }

    this.load.image(key, photo.src);
    this.load.once("complete", () => applyTexture(key));
    this.load.once("loaderror", () => {
      const fbKey = `${key}-fb`;
      if (this.textures.exists(fbKey)) {
        applyTexture(fbKey);
        return;
      }
      this.load.image(fbKey, PLACEHOLDER_PHOTO);
      this.load.once("complete", () => applyTexture(fbKey));
      this.load.start();
    });
    this.load.start();
  }

  private navPhoto(dir: -1 | 1) {
    if (this.activePhotos.length === 0) return;
    this.showPhoto(this.photoIndex + dir);
  }

  private tryPlayVideo() {
    const photo = this.activePhotos[this.photoIndex];
    if (photo?.type === "video") {
      window.dispatchEvent(
        new CustomEvent("adventure-video-play", { detail: { src: photo.src } })
      );
    }
  }

  private toggleMode() {
    const next: "highlights" | "all" = this.mode === "highlights" ? "all" : "highlights";
    if (next === "highlights" && this.photos.length === 0) return;
    if (next === "all" && this.allPhotos.length === 0) return;

    this.mode = next;
    this.photoIndex = 0;

    this.modeLabel?.setText(this.mode === "highlights" ? "\u2605 HIGHLIGHTS" : "ALL PHOTOS");
    this.modeLabel?.setColor(this.mode === "highlights" ? "#fbbf24" : "#64748b");

    this.tweens.add({ targets: this.modeLabel, alpha: { from: 0.2, to: 1 }, duration: 220 });
    this.showPhoto(0);
  }

  private onVideoClose = () => {
    this.input.keyboard?.enableGlobalCapture();
  };

  private close() {
    window.removeEventListener("adventure-video-close", this.onVideoClose);
    this.onClose();
  }
}
