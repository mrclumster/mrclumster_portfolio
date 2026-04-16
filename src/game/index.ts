import Phaser from "phaser";
import { PreloadScene } from "./scenes/PreloadScene";
import { WorldScene } from "./scenes/WorldScene";
import { UIScene } from "./scenes/UIScene";
import { PhotoViewerScene } from "./scenes/PhotoViewerScene";
import { CANVAS_W, CANVAS_H, SCALE_FACTOR } from "./config";

export function createGame(
  parent: HTMLElement,
  onProgress: (v: number) => void,
  onReady: () => void,
  muted: boolean
): Phaser.Game {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: CANVAS_W,
    height: CANVAS_H,
    zoom: SCALE_FACTOR,
    pixelArt: true,
    parent,
    backgroundColor: "#1a472a",
    physics: {
      default: "arcade",
      arcade: { gravity: { x: 0, y: 0 }, debug: false },
    },
    audio: { disableWebAudio: false, noAudio: muted },
    scene: [PreloadScene, WorldScene, UIScene, PhotoViewerScene],
    // Disable default banner
    banner: false,
  });

  // Wire up React callbacks via game instance
  game._onProgress = onProgress;
  game._onReady = onReady;

  return game;
}
