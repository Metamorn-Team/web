// SpeechBubbleRenderer.ts
import Phaser from "phaser";

export class SpeechBubbleRenderer {
  static render(
    scene: Phaser.Scene,
    x: number,
    y: number,
    message: string,
    fontSize = 14
  ): Phaser.GameObjects.Container {
    const container = scene.add.container(x, y);
    container.setDepth(99999);

    const cameraZoom = scene.cameras.main.zoom;

    const text = scene.add
      .text(0, 0, message, {
        fontFamily: "CookieRun",
        fontSize: `${fontSize}px`,
        color: "#000000",
        wordWrap: { width: 200, useAdvancedWrap: true },
        align: "center",
        resolution: cameraZoom,
      })
      .setOrigin(0.5);

    const paddingX = 20;
    const paddingY = 10;
    const tailHeight = 7;
    const bubbleWidth = text.width + paddingX * 2;
    const bubbleHeight = text.height + paddingY * 2;

    const bubble = scene.add.graphics();
    bubble.fillStyle(0xffffff, 1);
    bubble.fillRoundedRect(
      -bubbleWidth / 2,
      -bubbleHeight - tailHeight,
      bubbleWidth,
      bubbleHeight,
      15
    );
    bubble.fillTriangle(-10, -tailHeight, 10, -tailHeight, 0, 0);

    text.y = -bubbleHeight / 2 - tailHeight;

    container.add(bubble);
    container.add(text);

    scene.time.delayedCall(5000, () => {
      container.destroy();
    });

    return container;
  }
}
