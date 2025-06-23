import { Socket } from "socket.io-client";
import {
  ActivePlayerResponse,
  ClientToServer,
  ServerToClient,
  WsErrorBody,
} from "mmorntype";
import { EventWrapper } from "@/game/event/EventBus";
import { playerSpawner } from "@/game/managers/spawners/player-spawner";
import Alert from "@/utils/alert";
import Reload from "@/utils/reload";
import { HAS_NEW_VERSION } from "@/constants/message/info-message";
import {
  CONFLIC_MESSAGE,
  ISLAND_FULL_MESSAGE,
  ISLANF_NOT_FOUND_MESSAGE,
  UNKNOWN_MESSAGE,
} from "@/error/exceptions/message";
import { TilemapComponent } from "@/game/components/tile-map.component";
import { MapKeys } from "@/game/managers/tile-map-manager";
import { IslandScene } from "@/game/scenes/island-scene";
import { NatureObjectSpawner } from "@/game/managers/nature-object-spawner";
import { natureObjectStore } from "@/game/managers/nature-object-store";

export class IslandNetworkHandler {
  constructor(
    private scene: IslandScene,
    private io: Socket<ServerToClient, ClientToServer>
  ) {}

  listenSocketEvents() {
    const joinIsland = () => {
      if (this.scene.islandType === "NORMAL") {
        if (this.scene.currentIslandId) {
          this.io.emit("joinNormalIsland", {
            islandId: this.scene.currentIslandId,
          });
          return;
        }
        this.scene.joinFailed();
      } else {
        this.io.emit("joinDesertedIsland");
      }
    };

    if (this.io.connected) {
      joinIsland();
    }

    this.io.on("connect", joinIsland);

    this.io.on("disconnect", () => {
      if (!this.scene.isIntentionalDisconnect) {
        Alert.error("서버와의 연결이 끊어졌어요..");
        this.scene.clearAllPlayer();
      }
    });

    this.io.on("activePlayers", (activeUsers: ActivePlayerResponse) => {
      this.scene.spawnActiveUsers(activeUsers);
      EventWrapper.emitToUi("updateParticipantsPanel");
    });

    this.io.on("playerJoin", (data) => {
      this.scene.addPlayer(data);
      EventWrapper.emitToUi("newPlayer", data);
      EventWrapper.emitToUi("updateParticipantsPanel");
    });

    this.io.on("playerJoinSuccess", async (data) => {
      const { mapKey, activeObjects, ...position } = data;
      try {
        this.scene.mapComponent = new TilemapComponent(
          this.scene,
          mapKey as MapKeys
        );
        this.scene.onMapResize(
          this.scene.mapComponent.mapWidth,
          this.scene.mapComponent.mapHeight
        );

        if (this.scene.player) {
          this.scene.player.destroy(true);
        }

        const { equipmentState, ...playerInfo } =
          await this.scene.getPlayerInfo();
        this.scene.player = playerSpawner.spawnPlayer({
          scene: this.scene,
          equipment: equipmentState,
          playerInfo,
          position,
          texture: playerInfo.avatarKey,
          inputManager: this.scene.inputManager,
          io: this.io,
        });

        this.scene.followPlayerCamera();

        // 기존 자연 오브젝트 정리 후 새로 생성
        natureObjectStore.clearAllNatureObjects();
        const natureObjects = NatureObjectSpawner.spawnNatureObjects(
          this.scene,
          activeObjects
        );
        natureObjectStore.addNatureObjects(natureObjects);

        this.scene.ready(this.scene.socketNsp);
      } catch (e) {
        console.error(e);
        sessionStorage.removeItem("current_scene");
        window.location.reload();
      }
    });

    this.io.on("playerLeftSuccess", () => {
      this.scene.changeToLoby();
    });

    this.io.on("playerKicked", () => {
      alert("다른 곳에서 로그인 되었어요.. 😢");
      this.scene.changeToLoby();
    });

    this.io.on("playerLeft", (data) => {
      EventWrapper.emitToUi("playerLeftChat", data);
      this.scene.destroyPlayer(data.id);
      EventWrapper.emitToUi("updateParticipantsPanel");
    });

    this.io.on("playerMoved", (data) => {
      this.scene.handleSetTargetPosition(data.id, data.x, data.y);
    });

    this.io.on("attacked", (data) => {
      this.scene.handleAttacked(data.attackerId, data.attackedPlayerIds);
    });

    this.io.on("strongAttacked", (data) => {
      this.scene.handleStrongAttacked(data.attackerId, data.attackedPlayerIds);
    });

    this.io.on("jump", (userId: string) => {
      this.scene.handleJump(userId);
    });

    this.io.on("islandHearbeat", (data) => {
      data.forEach((player) =>
        this.scene.handleHeartbeat(player.id, player.lastActivity)
      );
      EventWrapper.emitToUi("updateOnlineStatus", data);
    });

    this.io.on("invalidVersion", () => {
      Reload.open(HAS_NEW_VERSION);
    });
  }

  listenSocketErrorEvents() {
    const alertAndChangeToLoby = (message: string) => {
      Alert.error(message);
      this.scene.changeToLoby();
    };

    this.io.on("wsError", ({ name }: WsErrorBody) => {
      switch (name) {
        case "ISLAND_FULL":
          alertAndChangeToLoby(ISLAND_FULL_MESSAGE);
          break;
        case "ISLAND_NOT_FOUND":
          alertAndChangeToLoby(ISLAND_FULL_MESSAGE);
          break;
        case "ISLAND_NOT_FOUND_IN_STORAGE":
          alertAndChangeToLoby(ISLANF_NOT_FOUND_MESSAGE);
          break;
        case "PLAYER_NOT_FOUND_IN_STORAGE":
          alertAndChangeToLoby(UNKNOWN_MESSAGE);
          break;
        case "LOCK_ACQUIRED_FAILED":
          alertAndChangeToLoby(CONFLIC_MESSAGE);
          break;
        case "TOO_MANY_PARTICIPANTS":
          Alert.error("참가 중인 인원이 더 많아요..");
          break;
        default:
          return;
      }
    });
  }

  cleanup() {
    this.io.removeAllListeners();
  }
}
