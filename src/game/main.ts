import { MainScene } from "src/game/scenes/main-scene";
import * as Phaser from "phaser";

export default function initializeGame(width: number, height: number) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width,
    height,
    scene: MainScene,
    physics: {
      default: "matter",
      matter: {
        gravity: { x: 0, y: 0 },
        // debug: true,
      },
    },
  });
}
