import { TREE } from "@/constants/game/sprites/nature";
import { TREE_IDLE } from "@/game/animations/keys/objects/tree";
import { Phaser } from "@/game/phaser";

export class Tree extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, TREE);

    scene.add.existing(this);
    this.setRectangle(30, 5);
    this.setStatic(true);
    this.setFixedRotation();
    this.setDepth(y + 70);
    this.displayOriginY += 75;

    this.play(TREE_IDLE);
  }
}
