import * as Phaser from "phaser";

export class Player extends Phaser.Physics.Matter.Sprite {
  private speed = 2;
  private cursor?: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, 'human-base-idle');
    scene.add.existing(this);

    this.setRectangle(12, 17);
    this.setFixedRotation();

    this.cursor = scene.input.keyboard?.createCursorKeys();
    
    this.play('human-idle');
  }

  update(): void {
    let velocityX = 0;
    let velocityY = 0;

    if (this.cursor?.left.isDown) {
      velocityX = -this.speed;
      this.setFlipX(true);
    }
    if (this.cursor?.right.isDown) {
      velocityX = this.speed;
      this.setFlipX(false);
    }
    if (this.cursor?.up.isDown) {
      velocityY = -this.speed;
    }
    if (this.cursor?.down.isDown) {
      velocityY = this.speed;
    }

    this.setVelocity(velocityX, velocityY);

    if (velocityX === 0 && velocityY === 0) {
      this.play("human-idle", true);
    }
  }
}