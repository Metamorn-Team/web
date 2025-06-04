import { Socket } from "socket.io-client";
import { Pawn } from "@/game/entities/players/pawn";
import { Phaser } from "@/game/phaser";
import { UserInfo } from "@/types/socket-io/response";
import { PawnColor, pawnColors } from "@/constants/game/entities";
import { RemotePlayerFSM } from "@/game/fsm/machine/player/remote-player-fsm";
import { PlayerFSM } from "@/game/fsm/machine/player/player-fsm";
import { InputManager } from "@/game/managers/input/input-manager";
import { Position } from "@/types/game/game";
import { EquipmentState } from "@/game/components/equipment-state";

class SpawnManager {
  spawnPlayer(
    scene: Phaser.Scene,
    userInfo: UserInfo,
    position: Position,
    equipmentState = new EquipmentState(null),
    isControllable = false,
    inputManager?: InputManager,
    io?: Socket
  ) {
    const { avatarKey } = userInfo;
    const avatarInfo = avatarKey.split("_");
    const color = avatarInfo[0] as PawnColor;
    const hasColor = pawnColors.includes(color);

    const player = new Pawn(
      scene,
      position.x,
      position.y,
      hasColor ? color : "blue",
      userInfo,
      equipmentState,
      isControllable,
      inputManager,
      io
    );

    const fsm = isControllable
      ? new PlayerFSM(player)
      : new RemotePlayerFSM(player);
    player.setFsm(fsm);

    return player;
  }
}

export const spawnManager = new SpawnManager();
