import Phaser from "phaser";

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "UIScene" });
  }

  create() {
    // Day counter — top-center (placeholder until we wire day tracking)
    this.add
      .text(320, 12, "AZIZ'S MANILA TOUR", {
        fontSize: "12px",
        color: "#ffffff",
        fontFamily: "'Press Start 2P', monospace",
      })
      .setAlpha(0.5)
      .setScrollFactor(0)
      .setOrigin(0.5, 0)
      .setDepth(100);
  }
}
