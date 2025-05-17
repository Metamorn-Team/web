import { InputManager } from "@/game/managers/input/input-manager";
import { spawnManager } from "@/game/managers/spawn-manager";
import { Phaser } from "@/game/phaser";
import { UserInfo } from "@/types/socket-io/response";
import { Socket } from "socket.io-client";

class ControllablePlayerManager {
  async spawnControllablePlayer(
    scene: Phaser.Scene,
    userInfo: UserInfo,
    x: number,
    y: number,
    inputManager: InputManager,
    socket?: Socket
  ) {
    const player = this.initializePlayer(
      scene,
      userInfo,
      x,
      y,
      inputManager,
      socket
    );
    scene.cameras.main.startFollow(player);

    return player;
  }

  private initializePlayer(
    scene: Phaser.Scene,
    profile: UserInfo,
    x: number,
    y: number,
    inputManager: InputManager,
    socket?: Socket
  ) {
    return spawnManager.spawnPlayer(
      scene,
      profile,
      x,
      y,
      true,
      inputManager,
      socket
    );
  }
}

export const controllablePlayerManager = new ControllablePlayerManager();
