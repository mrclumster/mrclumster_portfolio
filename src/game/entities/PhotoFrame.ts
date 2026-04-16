import Phaser from "phaser";
import { TripLocation, PLACEHOLDER_PHOTO } from "../data/trip-locations";

export class PhotoFrame extends Phaser.Physics.Arcade.StaticGroup {
  private location: TripLocation;
  private bounceArrow?: Phaser.GameObjects.Text;
  private bounceTimer?: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, location: TripLocation) {
    super(scene.physics.world, scene);
    this.location = location;

    const x = location.mapTileX * 16 + 8;
    const y = location.mapTileY * 16 + 8;

    // Create frame sprite (falls back to a colored rect if sprite missing)
    const sprite = scene.physics.add.staticImage(x, y, "photo-frame");
    if (!sprite.texture.key || sprite.texture.key === "__MISSING") {
      // Fallback: colored rectangle
      const rect = scene.add.rectangle(x, y, 12, 16, 0xffd700);
      scene.physics.add.existing(rect, true);
    }

    this.add(sprite, true);

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
