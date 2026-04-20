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
    type: Phaser.WEBGL, 
    width: CANVAS_W,
    height: CANVAS_H,
    zoom: SCALE_FACTOR,
    
    // --- AGGRESSIVE PIXEL ART SETTINGS ---
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    
    // --- LET PHASER HANDLE RESIZING (NOT CSS) ---
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    parent,
    backgroundColor: "#1a472a",
    physics: {
      default: "arcade",
      arcade: { gravity: { x: 0, y: 0 }, debug: false },
    },
    audio: { disableWebAudio: false, noAudio: muted },
    scene: [PreloadScene, WorldScene, UIScene, PhotoViewerScene],
    banner: false,
  });

  game._onProgress = onProgress;
  game._onReady = onReady;

  return game;
}