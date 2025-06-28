import { SkullSign } from "@/game/entities/nature/skull-sign";
import { getPositionCenterByCell } from "@/game/utils/calc-cell";
import { Phaser } from "@/game/phaser";

export class SkullSpawner {
  spawnSkullSign(scene: Phaser.Scene, cellX: number, cellY: number) {
    const { x, y } = getPositionCenterByCell({
      cellIndexX: cellX,
      cellIndexY: cellY,
    });
    return new SkullSign(scene, x, y);
  }
}

export const skullSpawner = new SkullSpawner();
