import { COLLISION_CATEGORIES } from "@/constants/game/collision-categories";
import { TREE } from "@/constants/game/sprites/nature";
import { TREE_IDLE } from "@/game/animations/keys/objects/tree";
import { CollisionComponent } from "@/game/components/collision";
import { CollisionRangeSensorComponent } from "@/game/components/collision-range-sensor";
import { Component } from "@/game/components/interface/component";
import { Renderer } from "@/game/components/renderer";
import {
  NatureObject,
  NatureObjectPrototype,
} from "@/game/entities/nature/nature-object";

export class Tree extends NatureObject {
  private isShaking = false;

  constructor(scene: Phaser.Scene, prototype: NatureObjectPrototype) {
    super(scene, prototype);
    this.registerComponents();

    this.renderer = this.getComponent(Renderer);
    this.renderer?.play(TREE_IDLE);
  }

  registerComponents() {
    const isDebug = !!this.scene.game.config.physics.matter?.debug;

    const components: Component[] = [
      new Renderer(this, TREE).setScale(0.9).setDisplayOriginY(100),
      new CollisionComponent(this, {
        label: "TREE",
        shape: "rectangle",
        width: 30,
        height: 5,
        category: COLLISION_CATEGORIES.NATURE_OBJECT,
      }).fixed(true),
      new CollisionRangeSensorComponent(this, {
        shape: "rectangle",
        width: 30,
        height: 20,
        alpha: 0.4,
        enabled: isDebug,
      }),
    ];

    components.forEach((c) => this.addComponent(c));
  }

  onHit(): void {
    if (this.isShaking) return; // 이미 진동 중이면 무시

    this.isShaking = true;

    // 진동 애니메이션 시작
    const originalX = this.x;
    const shakeIntensity = 3;
    const shakeDuration = 150; // 0.15초로 단축
    const shakeCount = 3; // 진동 횟수 줄임

    // 진동 효과
    this.scene.tweens.add({
      targets: this,
      x: originalX + shakeIntensity,
      duration: shakeDuration / shakeCount,
      yoyo: true,
      repeat: shakeCount - 1,
      ease: "Sine.easeInOut",
      onComplete: () => {
        // 진동 완료 후 원래 위치로 복원
        this.scene.tweens.add({
          targets: this,
          x: originalX,
          duration: 10, // 복원 시간도 더 짧게
          ease: "Power2",
          onComplete: () => {
            this.isShaking = false;
            // TREE_IDLE 애니메이션으로 복원
            this.renderer?.play(TREE_IDLE);
          },
        });
      },
    });
  }

  update(delta: number): void {
    super.update(delta);
  }

  destroy(fromScene = true): void {
    super.destroy(fromScene);
  }
}
