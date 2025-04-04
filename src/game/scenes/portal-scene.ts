import { Socket } from "socket.io-client";
import { EventBus } from "@/game/event/EventBus";
import { MetamornScene } from "@/game/scenes/meramorn-scene";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket-io";
import { spawnManager } from "@/game/managers/spawn-manager";
import { Player } from "@/game/entities/players/player";
import { socketManager } from "@/game/managers/socket-manager";
import { getItem, setItem } from "@/utils/session-storage";
import { UserInfo } from "@/types/socket-io/response";
import { Pawn } from "@/game/entities/players/pawn";

export class ZoneScene extends MetamornScene {
  protected override player: Player;
  private otherPlayers: Map<string, Player> = new Map();
  // { [playerId: string]: Player } = {};

  private mapWidth: number;
  private mapHeight: number;
  private centerOfMap: { x: number; y: number };

  private io: Socket<ServerToClientEvents, ClientToServerEvents>;
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

    this.spwanMyPlayer({
      id: "my",
      nickname: "ME",
      x: this.centerOfMap.x,
      y: this.centerOfMap.y,
    });

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

  spwanMyPlayer(data: UserInfo & { x: number; y: number }) {
    const { x, y, ...userInfo } = data;
    this.player = new Pawn(this, x, y, "red", userInfo, true, this.io);
    this.followPlayerCamera();
  }

  spawnActiveUsers(activeUsers: (UserInfo & { x: number; y: number })[]) {
    activeUsers.forEach((activeUser) =>
      spawnManager.spawnPlayer(
        this.otherPlayers,
        this,
        { id: activeUser.id, nickname: activeUser.nickname },
        activeUser.x,
        activeUser.y
      )
    );
  }

  listenEvents() {
    this.io.on("connect", () => {
      console.log("on connect");
      this.io.emit("playerJoin", {
        type: this.zoneType,
        x: this.centerOfMap.x,
        y: this.centerOfMap.y,
      });
    });

    this.io.on("disconnect", () => {
      console.log("on disconnect");
      this.clearAllPlayer();
    });

    this.io.on(
      "activeUsers",
      (activeUsers: (UserInfo & { x: number; y: number })[]) => {
        console.log(`online users: ${JSON.stringify(activeUsers, null, 2)}`);
        this.spawnActiveUsers(activeUsers);
      }
    );

    this.io.on("playerJoin", (data) => {
      console.log(`on playerJoin: ${JSON.stringify(data, null, 2)}`);
      const { x, y, ...userInfo } = data;
      spawnManager.spawnPlayer(this.otherPlayers, this, userInfo, x, y);
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
    player?.destroy();
    this.otherPlayers.delete(playerId);
  }
}
