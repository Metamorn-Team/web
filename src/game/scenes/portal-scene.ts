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
  ServerToClient,
} from "mmorn-type";

interface PlayerProfile {
  id: string;
  nickname: string;
  tag: string;
  avatarKey: string;
}

export class ZoneScene extends MetamornScene {
  protected override player: Player;
  private otherPlayers: Map<string, Player> = new Map();

  private mapWidth: number;
  private mapHeight: number;
  private centerOfMap: { x: number; y: number };

  private io: Socket<ServerToClient, ClientToServer>;
  private zoneType: "dev" | "design";
  private socketNsp = "zone";

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
    this.load.image("ground", "/game/tiles/tiny-sward/ground.png");

    this.load.tilemapTiledJSON("zone", "/game/maps/portal.json");
  }

  create() {
    this.initWorld();

    this.io = socketManager.connect(this.socketNsp)!;

    this.spawnMyPlayer();

    this.listenEvents();

    EventBus.emit("current-scene-ready", {
      scene: this,
      socketNsp: this.socketNsp,
    });
    // this.playBgm();
  }

  update(): void {
    if (this.player) {
      this.player.update();
    }

    this.otherPlayers.values().forEach((player) => {
      player.update();
    });
  }

  createTileMapLayers(map: Phaser.Tilemaps.Tilemap) {
    const groundTileset = map.addTilesetImage("ground", "ground");

    if (groundTileset) {
      map.createLayer("ground", groundTileset);
    }
  }

  initWorld() {
    const map = this.make.tilemap({ key: "zone" });
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

  async spawnMyPlayer() {
    try {
      const playerInfo = await this.getPlayerInfo();
      this.initializePlayer(playerInfo);
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

  private initializePlayer(profile: PlayerProfile) {
    this.player = spawnManager.spawnPlayer(
      this,
      profile,
      this.centerOfMap.x,
      this.centerOfMap.y,
      true,
      this.io
    );
  }

  spawnActiveUsers(activeUsers: ActivePlayerResponse) {
    activeUsers.forEach((activeUser) => {
      this.addPlayer(activeUser);
    });
  }

  listenEvents() {
    this.io.on("connect", () => {
      console.log("on connect");
      this.io.emit("playerJoin", {
        roomType: this.zoneType,
        x: this.centerOfMap.x,
        y: this.centerOfMap.y,
      });
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
    });

    this.io.on("playerLeft", (data) => {
      console.log(`on playerLeft: ${JSON.stringify(data, null, 2)}`);
      this.destroyPlayer(data.id);
    });

    this.io.on("playerMoved", (data) => {
      console.log(`on playerMoved: ${JSON.stringify(data, null, 2)}`);
      this.handlePlayerMove(data.id, data.x, data.y);
    });
  }

  handlePlayerMove(playerId: string, x: number, y: number) {
    const player = this.otherPlayers.get(playerId);
    if (player) {
      const dx = player.x - x;
      const dy = player.y - y;

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

      player.targetPosition.x = x;
      player.targetPosition.y = y;
    }
  }

  playBgm() {
    this.sound.play("town");
    this.sound.setVolume(0.15);
  }

  clearAllPlayer() {
    this.otherPlayers.values().forEach((player) => {
      player.destroy();
    });
    this.otherPlayers.clear();
  }

  destroyPlayer(playerId: string) {
    const player = this.otherPlayers.get(playerId);
    player?.destroyWithAnimation(true);
    this.otherPlayers.delete(playerId);
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
    if (this.otherPlayers.has(userInfo.id)) return;

    const player = spawnManager.spawnPlayer(this, userInfo, x, y);

    this.otherPlayers.set(userInfo.id, player);
  }
}
