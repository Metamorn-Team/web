import { COLLISION_CATEGORIES } from "@/constants/game/collision-categories";
import { CollisionComponent } from "@/game/components/collision";
import { Component } from "@/game/components/interface/component";
import { Renderer } from "@/game/components/renderer";
import { BaseEntity } from "@/game/entities/common/base-entity";
import { Position } from "@/types/game/game";

export interface NatureObjectPrototype {
  id: string;
  hp: number;
  position: Position;
  texture: string;
  width: number;
  height: number;
  displayOriginY?: number;
}

export class NatureObject extends BaseEntity {
  public readonly id: string;
  public readonly hp: number;

  constructor(scene: Phaser.Scene, prototype: NatureObjectPrototype) {
    const { id, hp, position } = prototype;
    super(scene, position.x, position.y);

    this.id = id;
    this.hp = hp;

    this.registerComponents(prototype);
    scene.add.existing(this);
  }

  protected registerComponents(prototype: NatureObjectPrototype) {
    const components: Component[] = [
      new Renderer(this, prototype.texture)
        .setScale(0.9)
        .setDisplayOriginY(prototype.displayOriginY ?? 0),
      new CollisionComponent(this, {
        label: prototype.texture,
        shape: "rectangle",
        width: prototype.width,
        height: prototype.height,
        category: COLLISION_CATEGORIES.NATURE_OBJECT,
      }).fixed(true),
    ];

    components.forEach((c) => this.addComponent(c));
  }
}
