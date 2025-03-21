import * as Phaser from "phaser";
import { io, Socket } from "socket.io-client";
import { WARRIOR } from "src/constants/entities";
import { defineAnimation } from "src/game/animations/define-animation";
import { Player } from "src/game/entities/players/player";
import { Warrior } from "src/game/entities/players/warrior";
import { Sheep } from "src/game/entities/sheep";
import { Mine } from "src/game/objects/mine";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "src/types/socket-io";

export class MainScene extends Phaser.Scene {
  private player: Player;
  private otherPlayers: { [playerId: string]: Player } = {};

  private mapWidth: number;
  private mapHeight: number;
  private centerOfMap: { x: number; y: number };

  private io: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.load.audio("town", "/game/sounds/town.mp3");
    this.load.audio("woodland-fantasy", "/game/sounds/woodland-fantasy.mp3");

    this.load.spritesheet("sheep", `/game/animal/sheep.png`, {
      frameWidth: 128,
      frameHeight: 128,
    });

    this.load.spritesheet(
      WARRIOR("blue"),
      `/game/player/${WARRIOR("blue")}.png`,
      {
        frameWidth: 192,
        frameHeight: 192,
      }
    );
    this.load.spritesheet(
      WARRIOR("purple"),
      `/game/player/${WARRIOR("purple")}.png`,
      {
        frameWidth: 192,
        frameHeight: 192,
      }
    );

    this.load.spritesheet(
      WARRIOR("yellow"),
      `/game/player/${WARRIOR("yellow")}.png`,
      {
        frameWidth: 192,
        frameHeight: 192,
      }
    );

    this.load.spritesheet(
      WARRIOR("red"),
      `/game/player/${WARRIOR("red")}.png`,
      {
        frameWidth: 192,
        frameHeight: 192,
      }
    );

    this.load.image("mine", "/game/object/mine.png");

    this.load.image("water", "/game/tiles/tiny-sward/water.png");
    this.load.image("elevation", "/game/tiles/tiny-sward/elevation.png");

    this.load.image("mushroom-l", "/game/tiles/tiny-sward/mushroom-l.png");
    this.load.image("mushroom-m", "/game/tiles/tiny-sward/mushroom-m.png");
    this.load.image("mushroom-s", "/game/tiles/tiny-sward/mushroom-s.png");

    this.load.image("bone1", "/game/tiles/tiny-sward/bone1.png");
    this.load.image("bone2", "/game/tiles/tiny-sward/bone2.png");

    this.load.image("bridge", "/game/tiles/tiny-sward/bridge.png");

    this.load.tilemapTiledJSON("home", "/game/maps/tiny_sward.json");

    this.load.image("portalButton", "/game/ui/button/red_button.png");
  }

  create() {
    this.initWorld();

    this.io = io("http://localhost:3000/game");
    this.spwanMyPlayer();

    this.io.emit("playerJoin", {
      x: this.centerOfMap.x,
      y: this.centerOfMap.y,
    });

    this.listenEvents();
  }

  update(): void {
    this.player.update();
    Object.values(this.otherPlayers).forEach((player) => {
      if (player.targetPosition) {
        if (
          Math.abs(player.x - player.targetPosition.x) < 1 &&
          Math.abs(player.y - player.targetPosition.y) < 1
        ) {
          player.idle();
        }
        player.x = Phaser.Math.Linear(player.x, player.targetPosition.x, 0.1);
        player.y = Phaser.Math.Linear(player.y, player.targetPosition.y, 0.1);
      }
    });
  }

  followPlayerCamera() {
    this.cameras.main = this.cameras.main;
    this.cameras.main.startFollow(this.player);
  }

  createTileMapLayers(map: Phaser.Tilemaps.Tilemap) {
    const waterTileset = map.addTilesetImage("water", "water");
    const stonTileset = map.addTilesetImage("elevation", "elevation");
    const bone1Tileset = map.addTilesetImage("bone1", "bone1");
    const bone2ileset = map.addTilesetImage("bone2", "bone2");
    const bridgeileset = map.addTilesetImage("bridge", "bridge");
    const mushroomLTileset = map.addTilesetImage("mushroom-l", "mushroom-l");
    const mushroomMTileset = map.addTilesetImage("mushroom-m", "mushroom-m");
    const mushroomSTileset = map.addTilesetImage("mushroom-s", "mushroom-s");

    map.createLayer("water", waterTileset!);
    map.createLayer("ston", stonTileset!);
    map.createLayer("bone", [bone1Tileset!, bone2ileset!]);
    map.createLayer("bridge", bridgeileset!);
    map.createLayer("mushroom", [
      mushroomLTileset!,
      mushroomMTileset!,
      mushroomSTileset!,
    ]);
  }

  setPortal() {
    this.matter.world.on("collisionstart", (_: any, bodyA: any, bodyB: any) => {
      if (
        bodyA.gameObject instanceof Player &&
        bodyB.gameObject instanceof Mine
      ) {
        this.sound.stopAll();
        this.scene.start("PortalScene");
      }

      if (
        bodyA.gameObject instanceof Sheep &&
        bodyB.gameObject instanceof Mine
      ) {
        bodyA.gameObject.destroy();
      }
    });
  }

  spawnPlayer(playerId: string, x?: number, y?: number) {
    if (this.otherPlayers.hasOwnProperty(playerId)) return;

    const player = new Warrior(
      this,
      x ?? this.mapWidth / 2,
      y ?? this.mapHeight / 2,
      "blue",
      playerId
    );
    this.otherPlayers[playerId] = player;
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

  spawnActiveUsers(activeUsers: {
    [playerId: string]: { x: number; y: number };
  }) {
    Object.keys(activeUsers).forEach((playerId) =>
      this.spawnPlayer(
        playerId,
        activeUsers[playerId].x,
        activeUsers[playerId].y
      )
    );
  }

  initWorld() {
    this.setPortal();
    defineAnimation(this);

    const map = this.make.tilemap({ key: "home" });
    this.createTileMapLayers(map);

    this.mapWidth = map.widthInPixels;
    this.mapHeight = map.heightInPixels;
    this.centerOfMap = {
      x: this.mapWidth / 2,
      y: this.mapHeight / 2,
    };

    this.matter.world.setBounds(0, 0, this.mapWidth, this.mapHeight);

    // this.sound.play("town", { volume: 0.05 });
    this.sound.play("woodland-fantasy", { volume: 0.1 });

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
      this.io
    );
    this.followPlayerCamera();
  }

  listenEvents() {
    this.io.on("activeUsers", (activeUsers) => {
      this.spawnActiveUsers(activeUsers);
    });

    this.io.on("playerJoin", (data) => {
      const playerId = data.playerId as string;
      this.spawnPlayer(playerId);
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
}
