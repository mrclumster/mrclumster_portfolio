import Phaser from "phaser";
import { TripLocation, PLACEHOLDER_PHOTO } from "../data/trip-locations";

export class PhotoFrame extends Phaser.Physics.Arcade.StaticGroup {
  private location: TripLocation;
  private bounceArrow?: Phaser.GameObjects.Text;
  private bounceTimer?: Phaser.Time.TimerEvent;
  private frameSprite?: Phaser.GameObjects.Image;
  private glowFX?: Phaser.FX.Glow;

  constructor(scene: Phaser.Scene, location: TripLocation) {
    super(scene.physics.world, scene);
    this.location = location;

    const x = location.mapTileX * 16 + 8;
    const y = location.mapTileY * 16 + 8;

    // Create frame sprite — always constrain to 12×16 game-world pixels
    const sprite = scene.physics.add.staticImage(x, y, "photo-frame");
    sprite.setDisplaySize(12, 16);
    sprite.refreshBody(); // sync physics body to new display size

    if (sprite.texture.key === "__MISSING") {
      // Fallback: golden rectangle when texture unavailable
      sprite.destroy();
      const rect = scene.add.rectangle(x, y, 12, 16, 0xffd700).setDepth(2);
      scene.physics.add.existing(rect, true);
      this.add(rect as unknown as Phaser.GameObjects.GameObject, true);
      return;
    }

    this.add(sprite, true);
    this.frameSprite = sprite;

    // Dormant glow — brightens when player is nearby (showPrompt)
    try {
      this.glowFX = sprite.postFX?.addGlow(0xffd700, 0, 0, false, 0.15, 12);
    } catch {
      // postFX unavailable in this Phaser build — graceful fallback
    }

    // Bouncing "!" arrow above
    this.bounceArrow = scene.add
      .text(x, y - 18, "!", {
        fontSize: "8px",
        color: "#ffff00",
        fontFamily: "'Press Start 2P', monospace",
      })
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(10);

    this.bounceTimer = scene.time.addEvent({
      delay: 400,
      loop: true,
      callback: () => {
        if (this.bounceArrow?.visible) {
          this.bounceArrow.y = (this.bounceArrow.y < y - 18) ? y - 14 : y - 18;
        }
      },
    });
  }

  showPrompt(show: boolean) {
    this.bounceArrow?.setVisible(show);
    // Glow: dim when far, bright when near
    if (this.glowFX) {
      this.glowFX.outerStrength = show ? 4 : 0;
    }
  }

  getLocation() {
    return this.location;
  }

  getPhotosWithFallback() {
    return this.location.photos.map((p) => ({
      ...p,
      src: p.src || PLACEHOLDER_PHOTO,
    }));
  }
}
