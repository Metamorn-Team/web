import { NATURE_SPRITE } from "@/constants/game/sprites/nature";
import { TREE_IDLE } from "@/game/animations/keys/objects/tree";
import { CollisionRangeSensorComponent } from "@/game/components/collision-range-sensor";
import { Component } from "@/game/components/interface/component";
import { Renderer } from "@/game/components/renderer";
import { NatureObject } from "@/game/entities/nature/nature-object";
import { Position } from "@/types/game/game";

interface TreePrototype {
  id: string;
  hp: number;
  position: Position;
}

export class Tree extends NatureObject {
  private isShaking = false;

  constructor(scene: Phaser.Scene, prototype: TreePrototype) {
    super(scene, {
      ...prototype,
      texture: NATURE_SPRITE.TREE,
      width: 30,
      height: 5,
      displayOriginY: 100,
    });

    this.init();
    const renderer = this.getComponent(Renderer);
    renderer?.play(TREE_IDLE);
    this.startFadeInAnimation(renderer);
  }

  init() {
    const isDebug = !!this.scene.game.config.physics.matter?.debug;

    const components: Component[] = [
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

    const originalX = this.x;
    const shakeIntensity = 3;
    const shakeDuration = 150;
    const shakeCount = 3;

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
          duration: 10,
          ease: "Power2",
          onComplete: () => {
            this.isShaking = false;
            this.renderer?.play(TREE_IDLE);
          },
        });
      },
    });
  }

  onDead(): void {
    const originalRotation = this.rotation;
    const renderer = this.getComponent(Renderer);

    // 오른쪽으로 넘어지면서 서서히 연해지는 애니메이션
    this.scene.tweens.add({
      targets: renderer?.sprite,
      alpha: 0,
      rotation: originalRotation + Math.PI / 2,
      duration: 800,
      ease: "Back.easeIn",
      onComplete: () => {
        this.destroy(true);
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
