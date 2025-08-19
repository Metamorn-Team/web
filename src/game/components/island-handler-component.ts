import { NatureObjectSpawner } from "@/game/managers/nature-object-spawner";
import { natureObjectStore } from "@/game/managers/nature-object-store";
import { playerStore } from "@/game/managers/player-store";
import { playerSpawner } from "@/game/managers/spawners/player-spawner";
import { IslandScene } from "@/game/scenes/island-scene";
import { ActivePlayer, AttackedObject, IslandActiveObject } from "mmorntype";

export class IslandHandlerComponent {
  private scene: IslandScene;

  constructor(scene: IslandScene) {
    this.scene = scene;
  }

  handleHeartbeat(playerId: string, newLastActivity: number) {
    const player =
      this.scene.player.getPlayerInfo().id === playerId
        ? this.scene.player
        : playerStore.getPlayer(playerId);

    if (!player) return;

    player.setLastActivity(newLastActivity);

    const { lastActivity } = player.getPlayerInfo();
    const now = Date.now();

    const INACTIVITY_THRESHOLD = 1000 * 60 * 5;
    if (now - (lastActivity || now) > INACTIVITY_THRESHOLD) {
      player.sleep();
    }
  }

  handleAttacked(attackerId: string, attackedPlayerIds: string[]) {
    const player = playerStore.getPlayer(attackerId);
    if (!player && attackerId !== this.scene.player.getPlayerInfo().id) return;

    player?.onAttack();

    this.scene.time.delayedCall(200, () => {
      if (attackedPlayerIds.includes(this.scene.player.getPlayerInfo().id)) {
        // EventWrapper.emitToUi("attacked");
        this.scene.player.hit();
      }

      attackedPlayerIds
        .map((id) => playerStore.getPlayer(id))
        .forEach((player) => player?.hit());
    });
  }

  handleStrongAttacked(attackerId: string, attackedObjects: AttackedObject[]) {
    const player = playerStore.getPlayer(attackerId);
    if (!player && attackerId !== this.scene.player.getPlayerInfo().id) return;

    player?.onStrongAttack();

    this.scene.time.delayedCall(200, () => {
      attackedObjects.forEach((object) => {
        const natureObject = natureObjectStore.getNatureObject(object.id);
        if (natureObject) {
          if (object.status === "ALIVE") {
            natureObject.onHit();
          } else {
            natureObject.onDead();
          }
        }
      });
    });
  }

  handleJump(userId: string) {
    const player = playerStore.getPlayer(userId);
    if (!player) return;

    player.onJump();
  }

  handleSetTargetPosition(playerId: string, x: number, y: number) {
    const player = playerStore.getPlayer(playerId);
    const isBeingBorn = player?.getIsBeingBorn();

    if (player && !isBeingBorn) {
      player.onWalk(x, y);
    }
  }

  handleRespawnObjects(objects: IslandActiveObject[]) {
    objects.forEach((object) => {
      const existingObject = natureObjectStore.getNatureObject(object.id);
      if (existingObject) {
        existingObject.destroy(true);
      }

      const natureObject = NatureObjectSpawner.spawnNatureObject(
        this.scene,
        object
      );
      if (natureObject) {
        natureObjectStore.addNatureObject(natureObject);
      }
    });
  }

  handleClearAllPlayer() {
    playerStore
      .getAllPlayers()
      .values()
      .forEach((player) => {
        player.destroy();
      });
    playerStore.clear();
  }

  handleDestroyPlayer(playerId: string) {
    const player = playerStore.getPlayer(playerId);
    player?.destroyWithAnimation(true);
    playerStore.deletePlayer(playerId);
  }

  handleAddPlayer(data: ActivePlayer) {
    const { x, y, ...playerInfo } = data;
    if (playerStore.has(playerInfo.id)) return;

    const player = playerSpawner.spawnPlayer({
      scene: this.scene,
      equipment: data.equipmentState,
      playerInfo: playerInfo,
      position: { x, y },
      texture: playerInfo.avatarKey,
    });
    playerStore.addPlayer(playerInfo.id, player);
  }
}
