import { Component } from "@/game/components/interface/component";
import { BaseEntity } from "@/game/entities/common/base-entity";

export class PointerInteractionComponent implements Component {
  private host: BaseEntity;

  constructor(host: BaseEntity) {
    this.host = host;
  }

  update(): void {}

  registerPointerover(handler: (...args: unknown[]) => void) {
    this.host.on("pointerover", handler);
  }

  registerPointerout(handler: (...args: unknown[]) => void) {
    this.host.on("pointerout", handler);
  }

  registerPointerdown(handler: (...args: unknown[]) => void) {
    this.host.on("pointerdown", handler);
  }

  destroy(): void {
    this.host.off("pointerover");
    this.host.off("pointerout");
    this.host.off("pointerdown");
  }
}
