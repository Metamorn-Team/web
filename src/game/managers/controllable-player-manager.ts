import { EquipmentState } from "@/game/components/equipment-state";
import { InputManager } from "@/game/managers/input/input-manager";
import { spawnManager } from "@/game/managers/spawn-manager";
import { Phaser } from "@/game/phaser";
import { Position } from "@/types/game/game";
import { UserInfo } from "@/types/socket-io/response";
import { Socket } from "socket.io-client";

class ControllablePlayerManager {
  async spawnControllablePlayer(
    scene: Phaser.Scene,
    userInfo: UserInfo,
    position: Position,
    inputManager: InputManager,
    equipmentState = new EquipmentState(null),
    socket?: Socket
  ) {
    const player = spawnManager.spawnPlayer(
      scene,
      userInfo,
      position,
      equipmentState,
      true,
      inputManager,
      socket
    );
    scene.cameras.main.startFollow(player);

    return player;
  }
}

export const controllablePlayerManager = new ControllablePlayerManager();
