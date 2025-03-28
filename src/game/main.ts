import { Phaser } from "@/game/phaser";
import { PlazaScene } from "@/game/scenes/plaza-scene";

export function initializeGame(width: number, height: number, parent?: string) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width,
    height,
    parent: parent || "game-containter",
    scene: PlazaScene,
    physics: {
      default: "matter",
      matter: {
        gravity: { x: 0, y: 0 },
        // debug: true,
      },
    },
  });
}
