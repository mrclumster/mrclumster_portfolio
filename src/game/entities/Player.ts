import Phaser from "phaser";
import { PLAYER_SPEED } from "../config";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
  private lastDir = "down";

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setDepth(5);

    // Scale 64px LPC frame to ~24px in the 320×240 game world (1.5 tiles tall)
    this.setScale(0.375);

    // Physics body in LOCAL (pre-scale) coords.
    // 28×20 local → ~10×8 world pixels at the character's feet.
    this.body!.setSize(28, 20);
    this.body!.setOffset(18, 36);

    // Capture keyboard globally so the user doesn't need to click the canvas first
    scene.input.keyboard!.enableGlobalCapture();

    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.wasd = {
      up:    scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down:  scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left:  scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    this.createAnimations(scene);
  }

  private createAnimations(scene: Phaser.Scene) {
    // Skip if sprite sheet not loaded yet (fallback mode — no real asset)
    if (!scene.textures.exists("player") || scene.textures.get("player").key === "__MISSING") return;

    const anims = scene.anims;

    // Standard LPC layout: 64×64 frames, 24 cols (1536 / 64 = 24)
    // Walk section at rows 8-11, direction order: up / left / down / right
    // Each walk row has 9 frames (indices 0-8 within the row)
    const COLS = 24;
    const walkUp    = 8  * COLS; // 192
    const walkLeft  = 9  * COLS; // 216
    const walkDown  = 10 * COLS; // 240
    const walkRight = 11 * COLS; // 264

    anims.create({ key: "walk-up",    frames: anims.generateFrameNumbers("player", { start: walkUp,    end: walkUp    + 8 }), frameRate: 8, repeat: -1 });
    anims.create({ key: "walk-left",  frames: anims.generateFrameNumbers("player", { start: walkLeft,  end: walkLeft  + 8 }), frameRate: 8, repeat: -1 });
    anims.create({ key: "walk-down",  frames: anims.generateFrameNumbers("player", { start: walkDown,  end: walkDown  + 8 }), frameRate: 8, repeat: -1 });
    anims.create({ key: "walk-right", frames: anims.generateFrameNumbers("player", { start: walkRight, end: walkRight + 8 }), frameRate: 8, repeat: -1 });

    // Idle: standing pose = frame 0 of each walk row
    anims.create({ key: "idle-up",    frames: [{ key: "player", frame: walkUp    }], frameRate: 1 });
    anims.create({ key: "idle-left",  frames: [{ key: "player", frame: walkLeft  }], frameRate: 1 });
    anims.create({ key: "idle-down",  frames: [{ key: "player", frame: walkDown  }], frameRate: 1 });
    anims.create({ key: "idle-right", frames: [{ key: "player", frame: walkRight }], frameRate: 1 });
  }

  update() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    const left  = this.cursors.left.isDown  || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const up    = this.cursors.up.isDown    || this.wasd.up.isDown;
    const down  = this.cursors.down.isDown  || this.wasd.down.isDown;

    const moving = left || right || up || down;

    if (left)       { body.setVelocityX(-PLAYER_SPEED); this.lastDir = "left"; }
    else if (right) { body.setVelocityX(PLAYER_SPEED);  this.lastDir = "right"; }
    if (up)         { body.setVelocityY(-PLAYER_SPEED); this.lastDir = "up"; }
    else if (down)  { body.setVelocityY(PLAYER_SPEED);  this.lastDir = "down"; }

    // Normalize diagonal speed
    if (left && (up || down)) body.setVelocityX(-PLAYER_SPEED * 0.707);
    if (right && (up || down)) body.setVelocityX(PLAYER_SPEED * 0.707);

    const animKey = moving ? `walk-${this.lastDir}` : `idle-${this.lastDir}`;
    if (this.scene.anims.exists(animKey)) {
      this.anims.play(animKey, true);
    }
  }

  get interactKey(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
           Phaser.Input.Keyboard.JustDown(this.scene.input.keyboard!.addKey("Z")) ||
           Phaser.Input.Keyboard.JustDown(this.cursors.down /* Enter-style */);
  }
}
