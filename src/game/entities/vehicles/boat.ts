import { COLLISION_CATEGORIES } from "@/constants/game/collision-categories";
import { COLLISION_LABEL } from "@/constants/game/collision-label";
import { SPRITE } from "@/constants/game/sprites/object";
import { BOAT_IDLE } from "@/game/animations/keys/objects/boat";
import { CollisionComponent } from "@/game/components/collision";
import { Component } from "@/game/components/interface/component";
import { Renderer } from "@/game/components/renderer";
import { BaseEntity } from "@/game/entities/common/base-entity";
import { Position } from "@/types/game/game";

interface BoatPrototype {
  readonly id: string;
  readonly position: Position;
  readonly sacle?: number;
  readonly collisionWidth?: number;
  readonly collisionHeight?: number;
}

export class Boat extends BaseEntity {
  constructor(scene: Phaser.Scene, prototype: BoatPrototype) {
    const { id, position } = prototype;

    super(scene, position.x, position.y);

    this.id = id;
    this.registerComponents(prototype);
    const renderer = this.getComponent(Renderer);
    renderer?.setScale(prototype.sacle ?? 0.5);
    renderer?.play(BOAT_IDLE);

    scene.add.existing(this);
  }

  registerComponents(prototype: BoatPrototype) {
    const components: Component[] = [
      new Renderer(this, SPRITE.BOAT),
      new CollisionComponent(this, {
        label: COLLISION_LABEL.PLAYER,
        shape: "rectangle",
        width: prototype.collisionWidth ?? 60,
        height: prototype.collisionHeight ?? 35,
        category: COLLISION_CATEGORIES.PLAYER,
        collidesGroup: -1,
      }),
    ];

    components.forEach((c) => this.addComponent(c));
  }
}
