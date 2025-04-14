import { Socket } from "socket.io-client";
import {
  ActivePlayerResponse,
  ClientToServer,
  MessageSent,
  ReceiveMessage,
  ServerToClient,
} from "mmorntype";
import { EventWrapper } from "@/game/event/EventBus";
import { MetamornScene } from "@/game/scenes/metamorn-scene";
import { spawnManager } from "@/game/managers/spawn-manager";
import { Player } from "@/game/entities/players/player";
import { socketManager } from "@/game/managers/socket-manager";
import {
  getItem as getSessionItem,
  removeItem as removeSessionItem,
  setItem as setSessionItem,
} from "@/utils/session-storage";
import { playerStore } from "@/game/managers/player-store";
import { Pawn } from "@/game/entities/players/pawn";
import { AttackType } from "@/types/game/enum/state";
import { tileMapManager } from "@/game/managers/tile-map-manager";
import { controllablePlayerManager } from "@/game/managers/controllable-player-manager";
import { getItem, persistItem } from "@/utils/persistence";
import { getMyProfile } from "@/api/user";
import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";

export class IslandScene extends MetamornScene {
  protected override player: Player;

  private map: Phaser.Tilemaps.Tilemap;
  private mapWidth: number;
  private mapHeight: number;
  private centerOfMap: { x: number; y: number };

  private io: Socket<ServerToClient, ClientToServer>;
  private zoneType: "dev" | "design";
  private socketNsp = SOCKET_NAMESPACES.ISLAND;

  constructor() {
    super("IslandScene");
  }

  init(data?: { type: "dev" | "design" }) {
    if (data?.type) {
      this.zoneType = data.type;
      setSessionItem("zone_type", data.type);
    } else {
      this.zoneType = getSessionItem("zone_type") || "design";
    }
  }

  preload() {
    this.load.tilemapTiledJSON("zone", "/game/maps/portal.json");
    this.load.tilemapTiledJSON("island", "/game/maps/island.json");
  }

  create() {
    super.create();
    this.initWorld();

    this.io = socketManager.connect(this.socketNsp)!;

    this.listenLocalEvents();
    this.listenSocketEvents();

    EventWrapper.emitToUi("current-scene-ready", {
      scene: this,
      socketNsp: this.socketNsp,
    });
    // this.playBgm();
  }

  update(time: number, delta: number): void {
    if (this.player) {
      this.player.update(delta);
    }

    playerStore
      .getAllPlayers()
      .values()
      .forEach((player) => {
        player.update(delta);
      });
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
      this.changeToLoby();
    });
  }

  listenSocketEvents() {
    const playerJoinParam = {
      roomType: this.zoneType,
      x: this.centerOfMap.x,
      y: this.centerOfMap.y,
    };

    if (this.io.connected) {
      this.io.emit("playerJoin", playerJoinParam);
    }

    this.io.on("connect", () => {
      console.log("on connect");
      this.io.emit("playerJoin", playerJoinParam);
    });

    this.io.on("disconnect", () => {
      console.log("on disconnect");
      this.clearAllPlayer();
    });

    this.io.on("activePlayers", (activeUsers) => {
      console.log(`online users: ${JSON.stringify(activeUsers, null, 2)}`);
      this.spawnActiveUsers(activeUsers);
    });

    this.io.on("playerJoin", (data) => {
      console.log(`on playerJoin: ${JSON.stringify(data, null, 2)}`);
      this.addPlayer(data);
      EventWrapper.emitToUi("newPlayer", data);
    });

    this.io.on("playerJoinSuccess", async (data: { x: number; y: number }) => {
      console.log("참여 성공");
      try {
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
    });

    this.io.on("playerMoved", (data) => {
      console.log(`on playerMoved: ${JSON.stringify(data, null, 2)}`);
      this.handleSetTargetPosition(data.id, data.x, data.y);
    });

    this.io.on("attacked", (data) => {
      console.log(`on attacked: ${JSON.stringify(data, null, 2)}`);
      this.handleAttacked(data.attackerId, data.attackedPlayerIds);
    });
  }

  async getPlayerInfo() {
    const storedProfile = getItem("profile");
    return storedProfile || this.fetchFreshPlayerInfo();
  }

  private async fetchFreshPlayerInfo() {
    const user = await getMyProfile();
    persistItem("profile", user);

    return user;
  }

  handleAttacked(attackerId: string, attackedPlayerIds: string[]) {
    const player = playerStore.getPlayer(attackerId);
    if (!player && attackerId !== this.player.getPlayerInfo().id) return;

    if (player instanceof Pawn) {
      player.attack(AttackType.VISUAL);
    }

    this.time.delayedCall(200, () => {
      if (attackedPlayerIds.includes(this.player.getPlayerInfo().id)) {
        this.player.hit();
      }

      attackedPlayerIds
        .map((id) => playerStore.getPlayer(id))
        .forEach((player) => player?.hit());
    });
  }

  handleSetTargetPosition(playerId: string, x: number, y: number) {
    const player = playerStore.getPlayer(playerId);
    const isBeingBorn = player?.getIsBeingBorn();

    if (player && !isBeingBorn) {
      player.targetPosition.x = x;
      player.targetPosition.y = y;
    }
  }

  playBgm() {
    this.sound.play("town");
    this.sound.setVolume(0.15);
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
    const padding = 10;
    const cornerRadius = 15;
    const tailHeight = 10;

    // 말풍선 크기 계산
    const bubbleWidth = text.width + padding * 2;
    const bubbleHeight = text.height + padding * 2;

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
    this.cameras.main.fadeOut(500, 0, 0, 0);

    this.time.delayedCall(500, () => {
      EventWrapper.emitToUi("start-change-scene");

      this.cleanupBeforeLeft();

      this.scene.start("LobyScene");
      removeSessionItem("zone_type");
      console.log("딜레이콜 완료");
    });
  }

  private cleanupBeforeLeft(): void {
    // 1. 소켓 정리
    socketManager.disconnect(this.socketNsp);

    // 2. 플레이어 정리
    // this.player?.destroy();
    playerStore.clear();

    // 3. 맵 및 물리엔진 정리
    this.map?.destroy();
    this.matter.world.setBounds(0, 0, 0, 0);

    // 4. 사운드/이펙트 정리
    this.sound.stopAll();
    this.tweens.killAll();

    // 5. 이벤트 리스너 정리
    EventWrapper.offGameEvent("mySpeechBubble");
    EventWrapper.offGameEvent("otherSpeechBubble");
    EventWrapper.offGameEvent("left-island");

    // 6. 모든 게임 객체 제거 - 이건 더 알아봐야할듯
    this.children.each((child) => child.destroy());
  }
}
