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

  private isIntentionalDisconnect = false;
  private islandType: "NORMAL" | "DESERTED";

  constructor() {
    super(ISLAND_SCENE);
  }

  init(data: { islandId?: string; type: "NORMAL" | "DESERTED" }) {
    this.islandType = data.type;

    if (data.type === "NORMAL") {
      if (data.islandId) {
        setItem("current_island_id", data.islandId);
        this.currentIslandId = data.islandId;
        return;
      }

      const islandId = getItem("current_island_id");
      if (!islandId) {
        this.joinFailed();
      }
    }
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
    if (!this.player) return;

    this.player.update();

    if (
      this.getEnabledKeyboardInput() &&
      this.inputManager.isKeyJustDown(Keys.ENTER)
    ) {
      EventWrapper.emitToUi("activeChatInput");
      this.setEnabledKeyboardInput(false);
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
    this.cameras.main.setZoom(1.1);
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
      removeItem("current_island_id");
      this.changeToLoby();
    });

    EventWrapper.offGameEvent("enableGameKeyboardInput");

    EventWrapper.onGameEvent("enableGameKeyboardInput", () => {
      this.time.delayedCall(100, () => {
        this.setEnabledKeyboardInput(true);
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
      this.io.emit("islandHearbeat");
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
        this.handlePlayerSleep(player.id, player.lastActivity)
      );
      EventWrapper.emitToUi("updateOnlineStatus", data);
    });
  }

  listenSocketErrorEvent() {
    this.io.on("wsError", ({ name, message }: WsErrorBody) => {
      switch (name) {
        case "ISLAND_FULL":
          Alert.error(message);
          this.changeToLoby();
          return;
        case "ISLAND_NOT_FOUND":
          Alert.error(message);
          this.changeToLoby();
          return;
        default:
          return;
      }
    });
  }

  handlePlayerSleep(playerId: string, lastActivity: number) {
    if (lastActivity > Date.now() - 1000 * 60 * 5) return;

    const player = playerStore.getPlayer(playerId);
    if (player) {
      player.sleep();
      return;
    }

    const myPlayer = this.player.getPlayerInfo();
    if (myPlayer.id === playerId) {
      this.player.sleep();
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
      if (currBubble) {
        currBubble.destroy();
      }
      player.setSpeechBubble(null);
    }

    const container = this.add.container(
      player.x,
      player.y - player.displayHeight / 2 - 10
    );
    container.setDepth(99999);

    const text = this.add.text(0, 0, message, {
      fontFamily: "CookieRun",
      fontSize: "14px",
      color: "#000000",
      wordWrap: { width: 150, useAdvancedWrap: true },
      align: "center",
      resolution: 10,
    });
    text.setOrigin(0.5, 0.5);

    const bubble = this.add.graphics();
    const paddingX = 20;
    const paddingY = 10;
    const cornerRadius = 15;
    const tailHeight = 10;

    // 말풍선 크기 계산
    const bubbleWidth = text.width + paddingX * 2;
    const bubbleHeight = text.height + paddingY * 2;

    text.y = -bubbleHeight / 2 - tailHeight;

    bubble.fillStyle(0xffffff, 1);
    // bubble.lineStyle(2, 0x000000, 1);

    bubble.fillRoundedRect(
      -bubbleWidth / 2,
      -bubbleHeight - tailHeight,
      bubbleWidth,
      bubbleHeight,
      cornerRadius
    );
    bubble.strokeRoundedRect(
      -bubbleWidth / 2,
      -bubbleHeight - tailHeight,
      bubbleWidth,
      bubbleHeight,
      cornerRadius
    );

    bubble.fillTriangle(-10, -tailHeight, 10, -tailHeight, 0, 0);
    // bubble.strokeTriangle(-10, -tailHeight, 10, -tailHeight, 0, 0);

    // 컨테이너에 요소 추가
    container.add(bubble);
    container.add(text);

    player.setSpeechBubble(container);

    this.time.delayedCall(5000, () => {
      if (container && container.active) {
        container.destroy();
        player.setSpeechBubble(null);
      }
    });
  }

  private changeToLoby() {
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
