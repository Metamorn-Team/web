import { Socket } from "socket.io-client";
import { EventBus } from "@/game/event/EventBus";
import { MetamornScene } from "@/game/scenes/meramorn-scene";
import { spawnManager } from "@/game/managers/spawn-manager";
import { Player } from "@/game/entities/players/player";
import { socketManager } from "@/game/managers/socket-manager";
import { getItem, removeItem, setItem } from "@/utils/session-storage";
import {
  getItem as getPersistenceItem,
  persistItem,
} from "@/utils/persistence";
import { getMyProfile } from "@/api/user";
import {
  ActivePlayerResponse,
  ClientToServer,
  MessageSent,
  ReceiveMessage,
  ServerToClient,
} from "mmorntype";
import { playerStore } from "@/game/managers/player-store";
import { Pawn } from "@/game/entities/players/pawn";
import { AttackType } from "@/types/game/enum/state";

interface PlayerProfile {
  id: string;
  nickname: string;
  tag: string;
  avatarKey: string;
}

export class ZoneScene extends MetamornScene {
  protected override player: Player;

  private mapWidth: number;
  private mapHeight: number;
  private centerOfMap: { x: number; y: number };

  private io: Socket<ServerToClient, ClientToServer>;
  private zoneType: "dev" | "design";
  private socketNsp = "zone";

  lastTime = Date.now();

  constructor() {
    super("ZoneScene");
  }

  init(data?: { type: "dev" | "design" }) {
    if (data?.type) {
      this.zoneType = data.type;
      setItem("zone_type", data.type);
    } else {
      this.zoneType = getItem("zone_type") || "design";
    }

    console.log("init");
    console.log(this.zoneType);
  }

  preload() {
    this.load.tilemapTiledJSON("zone", "/game/maps/portal.json");
    this.load.tilemapTiledJSON("island", "/game/maps/island.json");
  }

  create() {
    this.initWorld();

    this.io = socketManager.connect(this.socketNsp)!;

    this.listenLocalEvents();
    this.listenSocketEvents();

    EventBus.emit("current-scene-ready", {
      scene: this,
      socketNsp: this.socketNsp,
    });
    this.playBgm();
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

  createTileMapLayers(map: Phaser.Tilemaps.Tilemap) {
    const seaTileset = map.addTilesetImage("water", "water");
    const elevationTileset = map.addTilesetImage("elevation", "elevation");
    const groundTileset = map.addTilesetImage("ground", "ground");
    const shadowTileset = map.addTilesetImage("shadow", "shadow");
    const bridgeTileset = map.addTilesetImage("bridge", "bridge");
    const mushroomLTileset = map.addTilesetImage("mushroom-l", "mushroom-l");

    if (
      seaTileset &&
      elevationTileset &&
      groundTileset &&
      shadowTileset &&
      bridgeTileset &&
      mushroomLTileset
    ) {
      map.createLayer("sea", seaTileset);
      map.createLayer("shadow", shadowTileset);
      map.createLayer("sand", groundTileset);
      map.createLayer("elevation", elevationTileset);
      map.createLayer("sand-deco", groundTileset);
      map.createLayer("ground", groundTileset);
      map.createLayer("hill-shadow", shadowTileset);
      map.createLayer("hill", elevationTileset);
      map.createLayer("grass-deco", groundTileset);
      map.createLayer("hill-ground", groundTileset);
      map.createLayer("bridge", bridgeTileset);
      map.createLayer("deco", mushroomLTileset);

      const collisionLines = map.getObjectLayer("collision")?.objects;
      if (collisionLines && collisionLines?.length > 0) {
        collisionLines!.forEach((line) => {
          if (line.rectangle) {
            if (line.x && line.y && line.width && line.height) {
              this.matter.add.rectangle(
                line.x + line.width / 2,
                line.y + line.height / 2,
                line.width,
                line.height,
                {
                  isStatic: true,
                  collisionFilter: {
                    category: 0x0001,
                  },
                }
              );
            }
          }
        });
      }
    }
  }

  initWorld() {
    const map = this.make.tilemap({ key: "island" });
    this.createTileMapLayers(map);

    this.mapWidth = map.widthInPixels;
    this.mapHeight = map.heightInPixels;
    this.centerOfMap = {
      x: this.mapWidth / 2,
      y: this.mapHeight / 2,
    };

    this.matter.world.setBounds(0, 0, this.mapWidth, this.mapHeight);

    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.setZoom(1.1);
  }

  async spawnMyPlayer(x: number, y: number) {
    try {
      const playerInfo = await this.getPlayerInfo();
      this.initializePlayer(playerInfo, x, y);
      this.followPlayerCamera();
    } catch (e: unknown) {
      // TODO 토큰 재발급 추가하면 401시 그쪽에서 처리
      console.log(e);

      removeItem("current_scene");
      window.location.reload();
    }
  }

  private async getPlayerInfo() {
    const storedProfile = getPersistenceItem("profile");
    return storedProfile || this.fetchFreshPlayerInfo();
  }

  private async fetchFreshPlayerInfo() {
    const user = await getMyProfile();
    persistItem("profile", user);

    return user;
  }

  private initializePlayer(profile: PlayerProfile, x: number, y: number) {
    this.player = spawnManager.spawnPlayer(
      this,
      profile,
      x ?? this.centerOfMap.x,
      y ?? this.centerOfMap.y,
      true,
      this.io
    );
  }

  spawnActiveUsers(activeUsers: ActivePlayerResponse) {
    activeUsers.forEach((activeUser) => {
      this.addPlayer(activeUser);
    });
  }

  listenLocalEvents() {
    EventBus.on("mySpeechBubble", async (data: MessageSent) => {
      const me = await this.getPlayerInfo();
      this.showSpeechBubble(me.id, data.message, true);
    });

    EventBus.on("otherSpeechBubble", async (data: ReceiveMessage) => {
      this.showSpeechBubble(data.senderId, data.message);
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
      EventBus.emit("activePlayers", activeUsers);
    });

    this.io.on("playerJoin", (data) => {
      console.log(`on playerJoin: ${JSON.stringify(data, null, 2)}`);
      this.addPlayer(data);
      EventBus.emit("newPlayer", data);
    });

    this.io.on("playerJoinSuccess", (data: { x: number; y: number }) => {
      console.log("참여 성공");
      this.spawnMyPlayer(data.x, data.y);
    });

    this.io.on("playerLeft", (data) => {
      console.log(`on playerLeft: ${JSON.stringify(data, null, 2)}`);
      this.destroyPlayer(data.id);
      EventBus.emit("playerLeft", data);
    });

    this.io.on("playerMoved", (data) => {
      console.log(`on playerMoved: ${JSON.stringify(data, null, 2)}`);
      this.handlePlayerMove(data.id, data.x, data.y);
    });

    this.io.on("attacked", (data) => {
      console.log(`on attacked: ${JSON.stringify(data, null, 2)}`);
      this.handleAttacked(data.attackerId, data.attackedPlayerIds);
    });
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

  handlePlayerMove(playerId: string, x: number, y: number) {
    const player = playerStore.getPlayer(playerId);
    const isBeingBorn = player?.getIsBeingBorn();

    if (player && !isBeingBorn) {
      const dx = player.x - x;
      const dy = player.y - y;

      player.targetPosition.x = x;
      player.targetPosition.y = y;

      if (dx > 0) {
        player.walk("left");
      } else if (dx < 0) {
        player.walk("right");
      } else if (dy > 0) {
        player.walk("up");
      } else if (dy < 0) {
        player.walk("down");
      } else {
        player.idle();
      }
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
}
