import { SKULL_SIGN } from "@/constants/game/sprites/nature";
import { Phaser } from "@/game/phaser";

export class SkullSign extends Phaser.Physics.Matter.Image {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, SKULL_SIGN);

    scene.add.existing(this);
    this.setRectangle(20, 5);
    this.setStatic(true);
    this.setFixedRotation();
    this.setDepth(y + 70);
    this.displayOriginY += 35;
  }
}
