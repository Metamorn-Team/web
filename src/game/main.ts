import { Phaser } from "@/game/phaser";
import { BootScene } from "@/game/scenes/boot-scene";
import { LobyScene } from "@/game/scenes/loby-scene";
import { ZoneScene } from "@/game/scenes/portal-scene";

export class GameSingleton {
  private static instance: Phaser.Game | null = null;

  private constructor() {}

  static getInstance(width: number, height: number, config?: object) {
    this.destroy();
    this.instance = new Phaser.Game({
      type: Phaser.AUTO,
      width,
      height,
      canvasStyle: "display: none",
      parent: "game-containter",
      scene: [BootScene, LobyScene, ZoneScene],
      physics: {
        default: "matter",
        matter: {
          gravity: { x: 0, y: 0 },
          debug: true,
        },
      },
      ...config,
    });

    return this.instance;
  }

  static destroy() {
    if (this.instance) {
      this.instance.destroy(true);
    }
  }
}
