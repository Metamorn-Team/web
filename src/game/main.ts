import { Phaser } from "@/game/phaser";
import { LobyScene } from "@/game/scenes/loby-scene";
import { ZoneScene } from "@/game/scenes/portal-scene";

export function initializeGame(width: number, height: number) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width,
    height,
    canvasStyle: "display: none",
    parent: "game-containter",
    scene: [LobyScene, ZoneScene],
    physics: {
      default: "matter",
      matter: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
  });
}

export class GameSingleton {
  private static instance: Phaser.Game | null = null;

  private constructor() {}

  static getInstance(width: number, height: number) {
    this.destroy();
    this.instance = initializeGame(width, height);

    return this.instance;
  }

  static destroy() {
    if (this.instance) {
      this.instance.destroy(true);
    }
  }
}
