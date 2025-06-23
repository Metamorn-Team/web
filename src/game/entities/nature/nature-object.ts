import { BaseEntity } from "@/game/entities/common/base-entity";
import { Position } from "@/types/game/game";

export interface NatureObjectPrototype {
  id: string;
  hp: number;
  position: Position;
}

export class NatureObject extends BaseEntity {
  public readonly id: string;
  public readonly hp: number;

  constructor(scene: Phaser.Scene, prototype: NatureObjectPrototype) {
    const { id, hp, position } = prototype;
    super(scene, position.x, position.y);

    this.id = id;
    this.hp = hp;

    scene.add.existing(this);
  }
}
