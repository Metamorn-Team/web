export class Sheep extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, "sheep");
    scene.add.existing(this);
    this.setRectangle(40, 30);
    this.setFixedRotation();

    this.play("sheep-jump");
  }
}
