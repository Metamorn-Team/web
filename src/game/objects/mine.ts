export class Mine extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, "mine");
    scene.add.existing(this);
    this.setRectangle(150, 100);
    this.setStatic(true);
  }
}
