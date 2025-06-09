import { speechBubble } from "@/constants/game/products/speech-bubble";
import { Component } from "@/game/components/interface/component";
import { BaseEntity } from "@/game/entities/common/base-entity";

interface SpeechBubbleOptions {
  gap: number;
  fontSize?: number;
  bubbleTexture?: string;
  bubbleFrame?: string;
}

export class SpeechBubble implements Component {
  private host: BaseEntity;
  private container: Phaser.GameObjects.Container;
  private bubbleTexture?: string;
  private bubble: Phaser.GameObjects.NineSlice;
  private textObject: Phaser.GameObjects.Text;
  private textStyle: Phaser.Types.GameObjects.Text.TextStyle;
  private gap: number;
  private destroyTimer?: Phaser.Time.TimerEvent;
  private bubbleHeight: number;
  private bubbleTailHeight: number;

  constructor(host: BaseEntity, options: SpeechBubbleOptions) {
    this.setTexture(options.bubbleTexture);
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
      this.container.setPosition(
        this.host.x,
        this.host.y - this.bubbleHeight / 2 - this.bubbleTailHeight - this.gap
      );
    }
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

    // 메시지 생성
    this.textObject = scene.add.text(0, 0, text, this.textStyle).setOrigin(0.5);

    // 말풍선 생성
    const paddingX = 25;
    const paddingY = 15;
    const bubbleWidth = this.textObject.width + paddingX * 2;
    const bubbleHeight = this.textObject.height + paddingY * 2;

    if (!this.bubbleTexture || !speechBubble[this.bubbleTexture]) {
      this.bubbleTexture = "white";
    }

    this.bubble = scene.add
      .nineslice(
        0,
        0,
        speechBubble[this.bubbleTexture].bubble,
        undefined,
        bubbleWidth,
        bubbleHeight,
        16,
        16,
        16,
        16
      )
      .setOrigin(0.5, 0.5);

    // 꼬리 생성
    const tail = scene.add
      .image(0, bubbleHeight / 2 - 4, speechBubble[this.bubbleTexture].tail)
      .setOrigin(0.5, 0);

    this.bubbleHeight = bubbleHeight;
    this.bubbleTailHeight = tail.height;

    this.container = scene.add.container(
      this.host.x,
      this.host.y - this.host.height / 2,
      [this.bubble, this.textObject, tail]
    );
    this.container.setDepth(9999);
  }

  setTexture(texture?: string) {
    if (!texture || !speechBubble[texture]) {
      this.bubbleTexture = "white";
      return;
    }
    this.bubbleTexture = texture;
  }

  destroy(fromScene = true): void {
    this.container?.destroy(fromScene);
  }
}
