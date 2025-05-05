import { SkullSign } from "@/game/entities/nature/skull-sign";
import { Phaser } from "@/game/phaser";
import { getPositionCenterByCell } from "@/game/utils/calc-cell";

export class SkullSpawner {
  spawnSkullSign(scene: Phaser.Scene, cellX: number, cellY: number) {
    const { x, y } = getPositionCenterByCell(cellX, cellY);
    return new SkullSign(scene, x, y);
  }
}

export const skullSpawner = new SkullSpawner();
