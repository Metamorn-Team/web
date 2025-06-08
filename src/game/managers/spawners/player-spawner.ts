import { Pawn } from "@/game/entities/players/pawn";
import { pawnColors } from "@/constants/game/entities";
import { RemotePlayerFSM } from "@/game/fsm/machine/player/remote-player-fsm";
import { PlayerFSM } from "@/game/fsm/machine/player/player-fsm";
import { PlayerOptions } from "@/game/entities/players/player";

class PlayerSpawner {
  spawnPlayer(options: PlayerOptions) {
    const { avatarKey } = options.playerInfo;
    const color =
      pawnColors.find((c) => avatarKey.startsWith(c + "_")) ?? "blue";

    const player = new Pawn({ ...options, radius: 15, color });

    const fsm = options.inputManager
      ? new PlayerFSM(player)
      : new RemotePlayerFSM(player);
    player.setFsm(fsm);

    return player;
  }
}

export const playerSpawner = new PlayerSpawner();
