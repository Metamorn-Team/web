import { Warrior } from "@/game/entities/players/warrior";
import { Phaser } from "@/game/phaser";

class SpawnManager {
  spawnPlayer(
    store: Record<string, object>,
    scene: Phaser.Scene,
    playerId: string,
    x: number,
    y: number
  ) {
    if (store.hasOwnProperty(playerId)) return;

    const player = new Warrior(scene, x, y, "blue", playerId);
    store[playerId] = player;
  }
}

export const spawnManager = new SpawnManager();
