import { Component } from "@/game/components/interface/component";
import { BaseEntity } from "@/game/entities/common/base-entity";

interface NicknameLabelOptions {
  text: string;
  gap: number;
  isMine?: boolean;
  color?: string;
  offsetY?: number;
}

export class NameLabel implements Component {
  private host: BaseEntity;
  private textObject: Phaser.GameObjects.Text;
  private gap: number;

  constructor(host: BaseEntity, options: NicknameLabelOptions) {
    this.host = host;
    this.gap = options.gap;

    const cameraZoom = host.scene.cameras.main.zoom;

    this.textObject = host.scene.add
      .text(host.x, host.y, options.text, {
        fontFamily: "MapleStory",
        fontSize: "16px",
        fontStyle: "bold",
        stroke: "#000",
        strokeThickness: 3,
        color: options.color ?? "#FFFFFF",
        resolution: cameraZoom,
      })
      .setOrigin(0.5)
      .setDepth(options.isMine ? 1000 : 999);
  }

  update(): void {
    this.textObject.setPosition(this.host.x, this.host.y - this.gap);
  }

  setText(text: string) {
    this.textObject.setText(text);
  }

  setVisible(visible: boolean) {
    this.textObject.setVisible(visible);
  }

  destroy(fromScene = true): void {
    this.textObject.destroy(fromScene);
  }
}
