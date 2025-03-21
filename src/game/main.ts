import * as Phaser from "phaser";
import { PlazaScene } from "@/game/scenes/plaza-scene";

export function initializeGame(width: number, height: number) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width,
    height,
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
