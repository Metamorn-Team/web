export class Mine extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, "mine");
    scene.add.existing(this);
    this.setRectangle(25, 25);
    this.setStatic(true);
  }
}
