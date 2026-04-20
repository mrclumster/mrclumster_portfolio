import Phaser from "phaser";
import { PreloadScene } from "./scenes/PreloadScene";
import { WorldScene } from "./scenes/WorldScene";
import { UIScene } from "./scenes/UIScene";
import { PhotoViewerScene } from "./scenes/PhotoViewerScene";
import { CANVAS_W, CANVAS_H } from "./config";

// index.ts
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
    
    // Put these at the root level (some Phaser versions prefer them here)
    pixelArt: true,
    roundPixels: true,
    
    parent,
    backgroundColor: "#1a472a",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: CANVAS_W,
      height: CANVAS_H,
      // Completely removed 'resolution' from here!
    },
    physics: {
      default: "arcade",
      arcade: { gravity: { x: 0, y: 0 }, debug: false },
    },
    audio: { disableWebAudio: false, noAudio: muted },
    scene: [PreloadScene, WorldScene, UIScene, PhotoViewerScene],
    banner: false,
  });

  // Wire up React callbacks via game inastance
  game._onProgress = onProgress;
  game._onReady = onReady;

  return game;
}
