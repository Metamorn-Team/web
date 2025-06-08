import { ComponentHostMixin } from "@/game/entities/common/component-host-mixin";
import { Phaser } from "@/game/phaser";

export class BaseEntity extends ComponentHostMixin(
  Phaser.GameObjects.Container
) {
  scene: Phaser.Scene;

  update(delta: number): void {
    this.components.forEach((c) => c.update(delta));
  }

  destroy(fromScene = true): void {
    this.components.forEach((c) => c.destroy(fromScene));
  }
}
