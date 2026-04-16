import Phaser from "phaser";
import type { TripLocation, TripPhoto } from "../data/trip-locations";
import { PLACEHOLDER_PHOTO } from "../data/trip-locations";

interface PhotoViewerData {
  location: TripLocation;
  photos: TripPhoto[];
  onClose: () => void;
}

export class PhotoViewerScene extends Phaser.Scene {
  private photoIndex = 0;
  private photos: TripPhoto[] = [];
  private location!: TripLocation;
  private onClose!: () => void;
  private photoImage?: Phaser.GameObjects.Image;
  private captionText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "PhotoViewerScene" });
  }

  init(data: PhotoViewerData) {
    this.photos = data.photos;
    this.location = data.location;
    this.onClose = data.onClose;
    this.photoIndex = 0;
  }

  create() {
    const W = 320;
    const H = 240;

    // Dark overlay
    this.add.rectangle(0, 0, W, H, 0x000000, 0.7).setOrigin(0).setScrollFactor(0).setDepth(200);

    // Dialog box — Pokemon style: white bg, black border
    const boxX = 8;
    const boxY = 140;
    const boxW = 304;
    const boxH = 92;

    this.add.rectangle(boxX, boxY, boxW, boxH, 0xffffff).setOrigin(0).setScrollFactor(0).setDepth(201);
    this.add.rectangle(boxX + 2, boxY + 2, boxW - 4, boxH - 4, 0x1a1a2e).setOrigin(0).setScrollFactor(0).setDepth(202);

    // Location name
    this.add
      .text(boxX + 8, boxY + 8, `DAY ${this.location.day} — ${this.location.name.toUpperCase()}`, {
        fontSize: "6px",
        color: "#6366f1",
        fontFamily: "'Press Start 2P', monospace",
        wordWrap: { width: boxW - 20 },
      })
      .setScrollFactor(0)
      .setDepth(203);

    // Description text
    this.add
      .text(boxX + 8, boxY + 22, this.location.description, {
        fontSize: "5px",
        color: "#cccccc",
        fontFamily: "'Press Start 2P', monospace",
        wordWrap: { width: boxW - 20 },
        lineSpacing: 3,
      })
      .setScrollFactor(0)
      .setDepth(203);

    // Photo area (above dialog box)
    const photoW = 120;
    const photoH = 90;
    const photoX = W / 2 - photoW / 2;
    const photoY = 40;

    this.add.rectangle(photoX - 2, photoY - 2, photoW + 4, photoH + 4, 0xffffff).setOrigin(0).setScrollFactor(0).setDepth(201);
    this.photoImage = this.add
      .image(photoX + photoW / 2, photoY + photoH / 2, "__MISSING")
      .setDisplaySize(photoW, photoH)
      .setScrollFactor(0)
      .setDepth(202);

    // Caption
    this.captionText = this.add
      .text(W / 2, photoY + photoH + 6, "", {
        fontSize: "5px",
        color: "#ffffff",
        fontFamily: "'Press Start 2P', monospace",
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(203);

    // Nav hints
    this.add
      .text(boxX + 8, boxY + boxH - 14, "◄ ►  PHOTOS     B/ESC  CLOSE", {
        fontSize: "5px",
        color: "#888888",
        fontFamily: "'Press Start 2P', monospace",
      })
      .setScrollFactor(0)
      .setDepth(203);

    // Load and show first photo
    this.loadPhoto(0);

    // Input
    const left  = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    const right = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    const bKey  = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    const esc   = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    left.on("down",  () => this.navPhoto(-1));
    right.on("down", () => this.navPhoto(1));
    bKey.on("down",  () => this.close());
    esc.on("down",   () => this.close());
  }

  private loadPhoto(index: number) {
    const photo = this.photos[index] ?? { src: PLACEHOLDER_PHOTO, caption: "" };
    const key = `trip-photo-${this.location.id}-${index}`;

    const setImage = () => {
      if (this.photoImage) {
        this.photoImage.setTexture(key);
      }
      if (this.captionText) {
        this.captionText.setText(photo.caption);
      }
    };

    if (this.textures.exists(key)) {
      setImage();
    } else {
      this.load.image(key, photo.src);
      this.load.once("complete", setImage);
      this.load.once("loaderror", () => {
        this.load.image(key, PLACEHOLDER_PHOTO);
        this.load.once("complete", setImage);
        this.load.start();
      });
      this.load.start();
    }
  }

  private navPhoto(dir: -1 | 1) {
    const len = this.photos.length;
    this.photoIndex = (this.photoIndex + dir + len) % len;
    this.loadPhoto(this.photoIndex);
  }

  private close() {
    this.onClose();
  }
}
