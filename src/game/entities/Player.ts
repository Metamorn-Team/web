import * as Phaser from "phaser";

export class Player extends Phaser.Physics.Matter.Sprite {
  private speed = 6;
  private cursor?: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, "warrior");
    scene.add.existing(this);

    this.setRectangle(96, 96);
    this.setFixedRotation();

    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
      console.log(animation);
      if (animation.key === "warrior-attack") {
        this.play("warrior-idle");
      }
    });

    this.cursor = scene.input.keyboard?.createCursorKeys();

    this.play("warrior-idle");
  }

  update(): void {
    let velocityX = 0;
    let velocityY = 0;

    if (this.cursor?.left.isDown) {
      velocityX = -this.speed;
      this.play("warrior-walk", true);
      this.setFlipX(true);
    }
    if (this.cursor?.right.isDown) {
      velocityX = this.speed;
      this.play("warrior-walk", true);
      this.setFlipX(false);
    }
    if (this.cursor?.up.isDown) {
      this.play("warrior-walk", true);
      velocityY = -this.speed;
    }
    if (this.cursor?.down.isDown) {
      this.play("warrior-walk", true);
      velocityY = this.speed;
    }
    if (this.cursor?.space.isDown) {
      this.play("warrior-attack", true);
    }

    this.setVelocity(velocityX, velocityY);

    if (this.anims.currentAnim?.key === "warrior-attack") {
      return;
    }

    if (velocityX === 0 && velocityY === 0) {
      this.play("warrior-idle", true);
    }
  }
}
