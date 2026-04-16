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

    // Shrink physics body for tighter collision
    this.body!.setSize(10, 8);
    this.body!.setOffset(3, 8);

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

    // Walk-down: frames 0–2
    anims.create({ key: "walk-down",  frames: anims.generateFrameNumbers("player", { start: 0,  end: 2  }), frameRate: 8, repeat: -1 });
    // Walk-left: frames 3–5
    anims.create({ key: "walk-left",  frames: anims.generateFrameNumbers("player", { start: 3,  end: 5  }), frameRate: 8, repeat: -1 });
    // Walk-right: frames 6–8
    anims.create({ key: "walk-right", frames: anims.generateFrameNumbers("player", { start: 6,  end: 8  }), frameRate: 8, repeat: -1 });
    // Walk-up: frames 9–11
    anims.create({ key: "walk-up",    frames: anims.generateFrameNumbers("player", { start: 9,  end: 11 }), frameRate: 8, repeat: -1 });

    // Idle frames (single, no loop)
    anims.create({ key: "idle-down",  frames: [{ key: "player", frame: 1  }], frameRate: 1 });
    anims.create({ key: "idle-left",  frames: [{ key: "player", frame: 4  }], frameRate: 1 });
    anims.create({ key: "idle-right", frames: [{ key: "player", frame: 7  }], frameRate: 1 });
    anims.create({ key: "idle-up",    frames: [{ key: "player", frame: 10 }], frameRate: 1 });
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
