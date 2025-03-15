import * as Phaser from "phaser";

export abstract class Player extends Phaser.Physics.Matter.Sprite {
  private cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
  protected speed = 6;
  protected isAttack: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene.matter.world, x, y, texture);
    scene.add.existing(this);

    this.setFixedRotation();

    this.cursor = scene.input.keyboard?.createCursorKeys();
  }

  update(): void {
    let velocityX = 0;
    let velocityY = 0;

    if (this.cursor?.space.isDown) {
      this.attack();
    }

    if (this.isAttack) {
      this.setVelocity(0, 0);
      return;
    }

    if (this.cursor?.left.isDown) {
      velocityX = this.walk("left");
    }
    if (this.cursor?.right.isDown) {
      velocityX = this.walk("right");
    }
    if (this.cursor?.up.isDown) {
      velocityY = this.walk("up");
    }
    if (this.cursor?.down.isDown) {
      velocityY = this.walk("down");
    }

    this.setVelocity(velocityX, velocityY);

    if (velocityX === 0 && velocityY === 0) {
      this.idle();
    }
  }

  abstract walk(side: "right" | "left" | "up" | "down"): number;
  abstract idle(): void;
  abstract attack(): void;
}
