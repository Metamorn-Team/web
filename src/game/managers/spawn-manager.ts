import { Pawn } from "@/game/entities/players/pawn";
import { Player } from "@/game/entities/players/player";
import { Phaser } from "@/game/phaser";
import { UserInfo } from "@/types/socket-io/response";

class SpawnManager {
  spawnPlayer(
    store: Map<string, Player>,
    scene: Phaser.Scene,
    userInfo: UserInfo,
    x: number,
    y: number
  ) {
    console.log(userInfo.id);
    if (store.hasOwnProperty(userInfo.id)) return;

    const player = new Pawn(scene, x, y, "blue", userInfo);
    store.set(userInfo.id, player);
  }
}

export const spawnManager = new SpawnManager();
