import { io, Socket } from "socket.io-client";
import { Warrior } from "@/game/entities/players/warrior";
import { EventBus } from "@/game/event/EventBus";
import { MetamornScene } from "@/game/scenes/meramorn-scene";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket-io";
import { spawnManager } from "@/game/managers/spawn-manager";
import { Player } from "@/game/entities/players/player";
import { assetManager } from "@/game/managers/asset-manager";

export class ZoneScene extends MetamornScene {
  protected override player: Warrior;
  private otherPlayers: { [playerId: string]: Player } = {};

  private mapWidth: number;
  private mapHeight: number;
  private centerOfMap: { x: number; y: number };

  private io: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor() {
    super("ZoneScene");
  }

  preload() {
    assetManager.preloadCommonAsset(this);
    this.load.image("ground", "/game/tiles/tiny-sward/ground.png");

    this.load.tilemapTiledJSON("zone", "/game/maps/portal.json");
  }

  create() {
    console.log(this.game);
    this.initWorld();

    this.io = io("http://localhost:4000/game");
    this.spwanMyPlayer();

    this.io.emit("playerJoin", {
      x: this.centerOfMap.x,
      y: this.centerOfMap.y,
    });

    this.listenEvents();

    setTimeout(() => {
      EventBus.emit("current-scene-ready", this);
      this.playBgm();
    }, 4000);
  }

  update(): void {
    this.player.update();
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

  spwanMyPlayer() {
    this.player = new Warrior(
      this,
      this.centerOfMap.x,
      this.centerOfMap.y,
      "red",
      "Snail",
      true,
      this.io
    );
    this.followPlayerCamera();
  }

  spawnActiveUsers(activeUsers: {
    [playerId: string]: { x: number; y: number };
  }) {
    Object.keys(activeUsers).forEach((playerId) =>
      spawnManager.spawnPlayer(
        this.otherPlayers,
        this,
        playerId,
        activeUsers[playerId].x,
        activeUsers[playerId].y
      )
    );
  }

  listenEvents() {
    this.io.on("activeUsers", (activeUsers) => {
      this.spawnActiveUsers(activeUsers);
    });

    this.io.on("playerJoin", (data) => {
      const playerId = data.playerId as string;
      spawnManager.spawnPlayer(
        this.otherPlayers,
        this,
        playerId,
        this.centerOfMap.x,
        this.centerOfMap.y
      );
    });

    this.io.on("playerLeft", (data) => {
      const playerId = data.playerId as string;
      this.otherPlayers[playerId].destroy();
      delete this.otherPlayers[playerId];
    });

    this.io.on("playerMoved", (data) => {
      this.handlePlayerMove(data.playerId, data.x, data.y);
    });
  }

  handlePlayerMove(playerId: string, x: number, y: number) {
    const player = this.otherPlayers[playerId];
    if (player) {
      const dx = this.otherPlayers[playerId].x - x;
      const dy = this.otherPlayers[playerId].y - y;

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
}
