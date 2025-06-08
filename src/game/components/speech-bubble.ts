import { Component } from "@/game/components/interface/component";
import { BaseEntity } from "@/game/entities/common/base-entity";

interface SpeechBubbleOptions {
  gap: number;
  fontSize?: number;
}

export class SpeechBubble implements Component {
  private host: BaseEntity;
  private container: Phaser.GameObjects.Container;
  private bubbleGraphic: Phaser.GameObjects.Graphics;
  private textObject: Phaser.GameObjects.Text;
  private textStyle: Phaser.Types.GameObjects.Text.TextStyle;
  private gap: number;
  private destroyTimer?: Phaser.Time.TimerEvent;

  constructor(host: BaseEntity, options: SpeechBubbleOptions) {
    this.host = host;
    this.gap = options.gap;
    this.textStyle = {
      fontFamily: "MapleStory",
      fontSize: `${options.fontSize || 14}px`,
      color: "#000000",
      wordWrap: { width: 200, useAdvancedWrap: true },
      align: "center",
      resolution: host.scene.cameras.main.zoom,
    };
  }

  update(): void {
    if (this.container) {
      this.container.setPosition(this.host.x, this.host.y - this.gap);
    }
  }

  setText(message: string): void {
    this.textObject.setText(message);
  }

  setVisible(visible: boolean): void {
    this.container.setVisible(visible);
  }

  getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  show(text: string, delay = 5000) {
    if (this.container) {
      this.container.destroy(true);
    }
    if (this.destroyTimer) {
      this.destroyTimer.remove();
    }

    this.render(text);

    this.destroyTimer = this.host.scene.time.delayedCall(delay, () => {
      this.container?.destroy();
      this.destroyTimer = undefined;
    });
  }

  render(text: string) {
    const scene = this.host.scene;

    // 텍스트 객체 생성
    this.textObject = scene.add.text(0, 0, text, this.textStyle).setOrigin(0.5);

    // 말풍선 박스 그리기
    const paddingX = 22;
    const paddingY = 10;
    const tailHeight = 7;
    const bubbleWidth = this.textObject.width + paddingX * 2;
    const bubbleHeight = this.textObject.height + paddingY * 2;

    this.bubbleGraphic = scene.add.graphics();
    this.bubbleGraphic.fillStyle(0xffffff, 1);
    this.bubbleGraphic.fillRoundedRect(
      -bubbleWidth / 2,
      -bubbleHeight - tailHeight,
      bubbleWidth,
      bubbleHeight,
      8
    );
    this.bubbleGraphic.fillTriangle(-10, -tailHeight, 10, -tailHeight, 0, 0);

    // 텍스트 위치 조정
    this.textObject.y = -bubbleHeight / 2 - tailHeight;

    // 컨테이너 생성 및 추가
    this.container = scene.add.container(
      this.host.x,
      this.host.y - this.host.height / 2,
      [this.bubbleGraphic, this.textObject]
    );
    this.container.setDepth(9999);
  }

  destroy(fromScene = true): void {
    this.container?.destroy(fromScene);
  }
}
