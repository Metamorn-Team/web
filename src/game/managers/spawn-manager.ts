import { Socket } from "socket.io-client";
import { Pawn } from "@/game/entities/players/pawn";
import { Phaser } from "@/game/phaser";
import { UserInfo } from "@/types/socket-io/response";
import { PawnColor, pawnColors } from "@/constants/game/entities";
import { InputManager } from "@/game/managers/input-manager";
import { RemotePlayerFSM } from "@/game/fsm/machine/player/remote-player-fsm";
import { PlayerFSM } from "@/game/fsm/machine/player/player-fsm";

class SpawnManager {
  spawnPlayer(
    scene: Phaser.Scene,
    userInfo: UserInfo,
    x: number,
    y: number,
    isControllable = false,
    inputManager?: InputManager,
    io?: Socket
  ) {
    console.log(userInfo.id);
    const { avatarKey } = userInfo;
    const avatarInfo = avatarKey.split("_");
    const color = avatarInfo[0] as PawnColor;
    const hasColor = pawnColors.includes(color);

    const player = new Pawn(
      scene,
      x,
      y,
      hasColor ? color : "blue",
      userInfo,
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
