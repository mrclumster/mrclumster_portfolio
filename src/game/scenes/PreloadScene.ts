import Phaser from "phaser";

type ProgressCallback = (value: number) => void;
type ReadyCallback = () => void;

// Attached to the game registry so PhaserGame.tsx can wire up React state
declare module "phaser" {
  interface Game {
    _onProgress?: ProgressCallback;
    _onReady?: ReadyCallback;
  }
}

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    this.load.on("progress", (value: number) => {
      this.game._onProgress?.(value);
    });

    // Tileset + tilemap
    this.load.image("tiles", "/game/tilesets/lpc-base.png");
    this.load.tilemapTiledJSON("world-map", "/game/tilesets/world-map.json");

    // Player spritesheet: 48px wide × 64px tall sheet, 16×16 frames
    this.load.spritesheet("player", "/game/sprites/player.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    // Photo frame prop
    this.load.image("photo-frame", "/game/sprites/photo-frame.png");

    // Optional BGM (graceful fallback if missing)
    this.load.audio("bgm", "/game/audio/bgm-adventure.mp3");

    // Fallback: if any file 404s, just skip it
    this.load.on("loaderror", () => {});
  }

  create() {
    this.game._onReady?.();
    this.scene.start("WorldScene");
  }
}
