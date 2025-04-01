import { Phaser } from "@/game/phaser";
import { PlazaScene } from "@/game/scenes/plaza-scene";
import { ZoneScene } from "@/game/scenes/portal-scene";

export function initializeGame(width: number, height: number, parent?: string) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width,
    height,
    canvasStyle: "display: none",
    parent: parent || "game-containter",
    scene: [PlazaScene, ZoneScene],
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
    if (this.instance) {
      this.instance.canvas.width = width;
      this.instance.canvas.height = height;
    } else {
      this.instance = initializeGame(width, height);
    }
    return this.instance;
  }
}
