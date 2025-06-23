import { COLLISION_CATEGORIES } from "@/constants/game/collision-categories";
import { MUSHROOM_L } from "@/constants/game/sprites/nature";
import { CollisionComponent } from "@/game/components/collision";
import { Component } from "@/game/components/interface/component";
import { Renderer } from "@/game/components/renderer";
import {
  NatureObject,
  NatureObjectPrototype,
} from "@/game/entities/nature/nature-object";

export class Mushroom extends NatureObject {
  constructor(scene: Phaser.Scene, prototype: NatureObjectPrototype) {
    super(scene, prototype);
    this.registerComponents();
  }

  registerComponents() {
    const components: Component[] = [
      new Renderer(this, MUSHROOM_L).setDisplayOriginY(12),
      new CollisionComponent(this, {
        label: "MUSHROOM",
        shape: "rectangle",
        width: 30,
        height: 5,
        category: COLLISION_CATEGORIES.NATURE_OBJECT,
      }).fixed(true),
    ];

    components.forEach((c) => this.addComponent(c));

    // 베이스 클래스의 충돌 센서 추가 기능 사용
    this.addCollisionSensor({
      color: 0xff8800, // 주황색
      alpha: 0.4,
      showText: true,
      showCollisionInfo: true,
    });
  }

  update(delta: number): void {
    super.update(delta);
  }

  destroy(fromScene = true): void {
    super.destroy(fromScene);
  }
}
