import { Socket } from "socket.io-client";
import {
  ActivePlayerResponse,
  ClientToServer,
  MessageSent,
  ReceiveMessage,
  ServerToClient,
  WsErrorBody,
} from "mmorntype";
import { EventWrapper } from "@/game/event/EventBus";
import { MetamornScene } from "@/game/scenes/metamorn-scene";
import { spawnManager } from "@/game/managers/spawn-manager";
import { Player } from "@/game/entities/players/player";
import { socketManager } from "@/game/managers/socket-manager";
import {
  getItem,
  removeItem,
  removeItem as removeSessionItem,
  setItem,
} from "@/utils/session-storage";
import { playerStore } from "@/game/managers/player-store";
import { tileMapManager } from "@/game/managers/tile-map-manager";
import { controllablePlayerManager } from "@/game/managers/controllable-player-manager";
import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import Alert from "@/utils/alert";
import { Keys } from "@/types/game/enum/key";
import { SoundManager } from "@/game/managers/sound-manager";
import { POSITION_CHANGE_THRESHOLD } from "@/constants/game/threshold";
import { ISLAND_SCENE, LOBY_SCENE } from "@/constants/game/islands/island";
import {
  CONFLIC_MESSAGE,
  ISLAND_FULL_MESSAGE,
  ISLANF_NOT_FOUND_MESSAGE,
  UNKNOWN_MESSAGE,
} from "@/error/exceptions/message";
import { SpeechBubbleRenderer } from "@/game/managers/speech-bubble-renderer";

export class IslandScene extends MetamornScene {
  protected override player: Player;

  private bgmKey = "town";
  private map: Phaser.Tilemaps.Tilemap;
  private mapWidth: number;
  private mapHeight: number;
  private centerOfMap: { x: number; y: number };

  private io: Socket<ServerToClient, ClientToServer>;
  private socketNsp = SOCKET_NAMESPACES.ISLAND;
  private currentIslandId?: string;

  private isActiveChat = false;
  private isIntentionalDisconnect = false;
  private islandType: "NORMAL" | "DESERTED";
  private isChangingScene = false;

  constructor() {
    super(ISLAND_SCENE);
  }

  init(data?: { islandId?: string; type: "NORMAL" | "DESERTED" }) {
    this.isChangingScene = false;

    if (data && "islandId" in data && "type" in data) {
      if (data.type === "NORMAL" && data.islandId) {
        setItem("current_island_id", data.islandId);
        setItem("current_island_type", data.type);
        this.currentIslandId = data.islandId;
        this.islandType = data.type;
        return;
      }

      return this.joinFailed();
    }
    const islandId = getItem("current_island_id");
    const type = getItem("current_island_type");

    this.currentIslandId = islandId;
    this.islandType = type;
  }

  create() {
    super.create();
    this.initWorld();

    this.listenLocalEvents();

    this.initConnection();
    this.listenSocketEvents();
    this.listenSocketErrorEvent();

    this.registerHearbeatCheck();
    this.isIntentionalDisconnect = false;

    SoundManager.init(this);
    SoundManager.getInstance().playBgm(this.bgmKey);

    this.ready(this.socketNsp);
  }

  private hasPositionChangedSignificantly(): boolean {
    const dx = Math.abs(this.player.x - this.player.lastSentPosition.x);
    const dy = Math.abs(this.player.y - this.player.lastSentPosition.y);
    return dx >= POSITION_CHANGE_THRESHOLD || dy >= POSITION_CHANGE_THRESHOLD;
  }

  update(): void {
    if (!this.player?.body) return;

    this.player.update();

    if (
      this.isActiveChat === false &&
      this.inputManager.isKeyJustDown(Keys.ENTER)
    ) {
      EventWrapper.emitToUi("activeChatInput");
      this.isActiveChat = true;
    }

    if (this.io && this.hasPositionChangedSignificantly()) {
      const x = Math.round(this.player.x * 100) / 100;
      const y = Math.round(this.player.y * 100) / 100;

      this.io.emit("playerMoved", { x, y });

      this.player.lastSentPosition.x = x;
      this.player.lastSentPosition.y = y;
    }

    for (const player of playerStore.getAllPlayers().values()) {
      player.update();
    }
  }

  initWorld() {
    this.map = tileMapManager.registerTileMap(this, "island");

    this.mapWidth = this.map.widthInPixels;
    this.mapHeight = this.map.heightInPixels;
    this.centerOfMap = {
      x: this.mapWidth / 2,
      y: this.mapHeight / 2,
    };

    this.matter.world.setBounds(0, 0, this.mapWidth, this.mapHeight);

    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.setZoom(this.isMobile() ? 0.9 : 1.1);
    this.cameras.main.setScroll(this.centerOfMap.x, this.centerOfMap.y);
  }

  spawnActiveUsers(activeUsers: ActivePlayerResponse) {
    activeUsers.forEach((activeUser) => {
      this.addPlayer(activeUser);
    });
  }

  listenLocalEvents() {
    this.input.on("pointerdown", () => {
      if (!this.getEnabledKeyboardInput()) {
        EventWrapper.emitToUi("blurChatInput");
        this.setEnabledKeyboardInput(true);
      }
    });

    EventWrapper.onGameEvent("mySpeechBubble", async (data: MessageSent) => {
      const me = await this.getPlayerInfo();
      this.showSpeechBubble(me.id, data.message, true);
    });

    EventWrapper.onGameEvent(
      "otherSpeechBubble",
      async (data: ReceiveMessage) => {
        this.showSpeechBubble(data.senderId, data.message);
      }
    );

    EventWrapper.onGameEvent("left-island", () => {
      this.io.emit("playerLeft");
    });

    EventWrapper.offGameEvent("enableGameKeyboardInput");

    EventWrapper.onGameEvent("enableGameKeyboardInput", () => {
      this.time.delayedCall(100, () => {
        this.setEnabledKeyboardInput(true);
        this.setEnabledMouseInput(true);
        this.isActiveChat = false;
      });
    });
  }

  listenSocketEvents() {
    const joinIsland = () => {
      const position = {
        x: this.centerOfMap.x,
        y: this.centerOfMap.y,
      };

      if (this.islandType === "NORMAL") {
        if (this.currentIslandId) {
          this.io.emit("joinNormalIsland", {
            ...position,
            islandId: this.currentIslandId,
          });
          return;
        }

        this.joinFailed();
      } else {
        this.io.emit("joinDesertedIsland", position);
      }
    };

    if (this.io.connected) {
      joinIsland();
    }

    this.io.on("connect", () => {
      joinIsland();
    });

    this.io.on("disconnect", () => {
      console.log("on disconnect");
      if (!this.isIntentionalDisconnect) {
        Alert.error("서버와의 연결이 끊어졌어요..");
        this.clearAllPlayer();
      }
    });

    this.io.on("activePlayers", (activeUsers) => {
      console.log(`online users: ${JSON.stringify(activeUsers, null, 2)}`);
      this.spawnActiveUsers(activeUsers);

      EventWrapper.emitToUi("updateParticipantsPanel");
    });

    this.io.on("playerJoin", (data) => {
      console.log(`on playerJoin: ${JSON.stringify(data, null, 2)}`);
      this.addPlayer(data);

      EventWrapper.emitToUi("newPlayer", data);
      EventWrapper.emitToUi("updateParticipantsPanel");
    });

    this.io.on("playerJoinSuccess", async (data: { x: number; y: number }) => {
      // this.io.emit("islandHearbeat");
      try {
        if (this.player) {
          this.player.destroy(true);
        }

        const userInfo = await this.getPlayerInfo();
        this.player = await controllablePlayerManager.spawnControllablePlayer(
          this,
          userInfo,
          data.x,
          data.y,
          this.inputManager,
          this.io
        );
      } catch (e: unknown) {
        // TODO 토큰 재발급 추가하면 401시 그쪽에서 처리
        console.log(e);

        removeSessionItem("current_scene");
        window.location.reload();
      }
    });

    this.io.on("playerLeftSuccess", () => {
      this.changeToLoby();
    });

    this.io.on("playerKicked", () => {
      console.log("on Kicked");
      alert("다른 곳에서 로그인 되었어요.. 😢");
      this.changeToLoby();
    });

    this.io.on("playerLeft", (data) => {
      console.log(`on playerLeft: ${JSON.stringify(data, null, 2)}`);
      EventWrapper.emitToUi("playerLeftChat", data);
      this.destroyPlayer(data.id);

      EventWrapper.emitToUi("updateParticipantsPanel");
    });

    this.io.on("playerMoved", (data) => {
      this.handleSetTargetPosition(data.id, data.x, data.y);
    });

    this.io.on("attacked", (data) => {
      this.handleAttacked(data.attackerId, data.attackedPlayerIds);
    });

    this.io.on("jump", (userId: string) => {
      this.handleJump(userId);
    });

    this.io.on("islandHearbeat", (data) => {
      data.forEach((player) =>
        this.handleHeartbeat(player.id, player.lastActivity)
      );
      EventWrapper.emitToUi("updateOnlineStatus", data);
    });
  }

  listenSocketErrorEvent() {
    const alertAndChangeToLoby = (message: string) => {
      Alert.error(message);
      this.changeToLoby();
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
        default:
          return;
      }
    });
  }

  handleHeartbeat(playerId: string, newLastActivity: number) {
    const player =
      this.player.getPlayerInfo().id === playerId
        ? this.player
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
    if (!player && attackerId !== this.player.getPlayerInfo().id) return;

    player?.onAttack();

    this.time.delayedCall(200, () => {
      if (attackedPlayerIds.includes(this.player.getPlayerInfo().id)) {
        // EventWrapper.emitToUi("attacked");
        this.player.hit();
      }

      attackedPlayerIds
        .map((id) => playerStore.getPlayer(id))
        .forEach((player) => player?.hit());
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

  clearAllPlayer() {
    playerStore
      .getAllPlayers()
      .values()
      .forEach((player) => {
        player.destroy();
      });
    playerStore.clear();
  }

  destroyPlayer(playerId: string) {
    const player = playerStore.getPlayer(playerId);
    player?.destroyWithAnimation(true);
    playerStore.deletePlayer(playerId);
  }

  addPlayer(data: {
    readonly id: string;
    readonly nickname: string;
    readonly tag: string;
    readonly avatarKey: string;
    readonly x: number;
    readonly y: number;
  }) {
    const { x, y, ...userInfo } = data;
    if (playerStore.has(userInfo.id)) return;

    const player = spawnManager.spawnPlayer(this, userInfo, x, y);

    playerStore.addPlayer(userInfo.id, player);
  }

  showSpeechBubble(playerId: string, message: string, isMe = false) {
    const player = isMe ? this.player : playerStore.getPlayer(playerId);
    if (!player) return;

    const currBubble = player.getSpeechBubble();
    if (currBubble) {
      currBubble.destroy();
      player.setSpeechBubble(null);
    }

    const bubble = SpeechBubbleRenderer.render(
      this,
      player.x,
      player.y - player.displayHeight / 2 - 10,
      message
    );

    player.setSpeechBubble(bubble);
  }

  private changeToLoby() {
    if (this.isChangingScene) return;
    this.isChangingScene = true;

    removeItem("current_island_id");
    removeItem("current_island_type");
    this.isIntentionalDisconnect = true;
    this.cameras.main.fadeOut(500, 0, 0, 0);

    this.time.delayedCall(500, () => {
      EventWrapper.emitToUi("start-change-scene");

      this.scene.stop(ISLAND_SCENE);
      this.cleanupBeforeLeft();
      this.scene.start(LOBY_SCENE);
    });
  }

  private cleanupBeforeLeft(): void {
    this.removeSocketEvents();
    this.removeLocalEvents();

    playerStore.clear();

    this.map?.destroy();
    this.matter.world.setBounds(0, 0, 0, 0);

    this.sound.stopAll();
    this.tweens.killAll();

    this.children.each((child) => child.destroy());
    this.free();
  }

  private removeSocketEvents() {
    if (!this.io) return;

    this.io.off("connect");
    this.io.off("disconnect");
    this.io.off("activePlayers");
    this.io.off("playerJoin");
    this.io.off("playerJoinSuccess");
    this.io.off("playerLeft");
    this.io.off("playerMoved");
    this.io.off("attacked");
    this.io.off("islandHearbeat");
    this.io.off("playerKicked");

    this.io.off("wsError");
  }

  private removeLocalEvents() {
    EventWrapper.offGameEvent("mySpeechBubble");
    EventWrapper.offGameEvent("otherSpeechBubble");
    EventWrapper.offGameEvent("left-island");
    EventWrapper.offGameEvent("enableGameKeyboardInput");
  }

  private registerHearbeatCheck() {
    this.time.addEvent({
      delay: 1000 * 30,
      loop: true,
      callback: () => {
        this.io.emit("islandHearbeat");
      },
    });
  }

  initConnection() {
    const socket = socketManager.connect(this.socketNsp);
    if (socket) {
      this.io = socket;
    }

    if (!this.io) {
      EventWrapper.emitToGame("left-island");
      Alert.error("섬에 도착하지 못 했어요..");
    }
  }

  joinFailed() {
    Alert.error("섬 참여 실패..");
    this.changeToLoby();
  }
}
