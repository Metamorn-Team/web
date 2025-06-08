import * as Phaser from "phaser";
import { BaseEntity } from "@/game/entities/common/base-entity";
import { Component } from "@/game/components/interface/component";

export class SleepParticle implements Component {
  private particle: Phaser.GameObjects.Sprite | null = null;
  private _host: BaseEntity;

  constructor(private host: BaseEntity) {
    this._host = host;
  }

  sleep() {
    if (this.particle) return;

    this.particle = this.host.scene.add.sprite(
      this.host.x,
      this.host.y,
      "sleep"
    );
    this.particle.play("sleep");
    this.host.scene.children.moveBelow(this.particle, this.host); // host보다 뒤로
  }

  awake() {
    this.particle?.destroy(true);
    this.particle = null;
  }

  update(): void {
    if (this.particle) {
      this.particle.setPosition(this.host.x, this.host.y);
    }
  }

  destroy(fromScene = true): void {
    this.particle?.destroy(fromScene);
    this.particle = null;
  }
}
