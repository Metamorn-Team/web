import { Tree } from "@/game/entities/nature/tree";
import { Phaser } from "@/game/phaser";
import { getPositionCenterByCell } from "@/game/utils/calc-cell";

export class TreeSpawner {
  spawnTree(scene: Phaser.Scene, cellX: number, cellY: number) {
    const { x, y } = getPositionCenterByCell(cellX, cellY);
    return new Tree(scene, x, y);
  }
}

export const treeSpawner = new TreeSpawner();
