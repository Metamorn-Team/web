import { InteractiveObject } from "@/game/entities/interactive-object";

export abstract class Npc extends InteractiveObject {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, "[E] 대화하기", 40);
    this.setStatic(true);
    this.setDepth(this.y);
    this.setBodyConfig();
  }

  protected abstract setBodyConfig(): void;
}
