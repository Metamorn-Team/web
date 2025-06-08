import { Component } from "@/game/components/interface/component";
import { BaseEntity } from "@/game/entities/common/base-entity";
import { Phaser } from "@/game/phaser";

interface CollisionOptions {
  shape: "circle" | "rectangle";
  label: string;
  category: number;
  collidesGroup?: number;
  collidesWith?: number[];
  width?: number;
  height?: number;
  radius?: number;
}

/**
 * @category default: -1, 다른 카테고리끼리만 충돌
 */
export class CollisionComponent implements Component {
  private scene: Phaser.Scene;
  private host: BaseEntity;
  private body: MatterJS.BodyType;

  constructor(host: BaseEntity, options: CollisionOptions) {
    this.init(host, options);
  }

  init(host: BaseEntity, options: CollisionOptions): void {
    this.host = host;
    this.scene = host.scene;

    this.scene.matter.add.gameObject(host, {
      shape: {
        type: options.shape,
        width: options.width,
        height: options.height,
        radius: options.radius,
      },
    });

    const body = host.body as MatterJS.BodyType;
    body.label = options.label;

    this.body = body;
    this.body.collisionFilter.category = options.category;
    // (detault) 다른 카테고리끼리만 충돌
    this.body.collisionFilter.group = options.collidesGroup ?? -1;
  }

  update(): void {
    this.body.position.x = this.host.x;
    this.body.position.y = this.host.y;
  }

  get name() {
    return CollisionComponent.name;
  }

  destroy(): void {
    if (this.body) {
      this.scene.matter.world.remove(this.body);
    }
  }
}
