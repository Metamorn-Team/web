import { TorchGoblin } from "@/game/entities/npc/torch-goblin";
import { Pawn } from "@/game/entities/players/pawn";
import { Player } from "@/game/entities/players/player";
import { EventBus } from "@/game/event/EventBus";
import { socketManager } from "@/game/managers/socket-manager";
import { spawnManager } from "@/game/managers/spawn-manager";
import { Mine } from "@/game/objects/mine";
import { Phaser } from "@/game/phaser";
import { MetamornScene } from "@/game/scenes/meramorn-scene";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket-io";
import { setItem } from "@/utils/session-storage";
import { Socket } from "socket.io-client";

export class LobyScene extends MetamornScene {
  private otherPlayers: { [playerId: string]: Player } = {};
  private npcGoblin: TorchGoblin;
  private mine: Mine;

  private isMute = false;

  private mapWidth: number;
  private mapHeight: number;
  private centerOfMap: { x: number; y: number };

  private isEnterPortal: boolean = false;

  public updateLoadingState: (state: boolean) => void;

  private io: Socket<ServerToClientEvents, ClientToServerEvents>;
  private socketNsp = "loby";

  constructor() {
    super("LobyScene");
  }

  preload() {}

  create() {
    this.initWorld();

    this.io = socketManager.connect(this.socketNsp)!;
    this.spwanMyPlayer();

    this.io.emit("playerJoin", {
      x: this.centerOfMap.x,
      y: this.centerOfMap.y,
    });

    this.npcGoblin = new TorchGoblin(
      this,
      this.centerOfMap.x - 200,
      this.centerOfMap.y,
      "red"
    );
    this.mine = new Mine(this, this.centerOfMap.x, this.centerOfMap.y - 200);

    this.listenEvents();
  }

  update(): void {
    this.player.update();
    Object.values(this.otherPlayers).forEach((player) => {
      player.update();
    });

    const distance = Phaser.Math.Distance.Between(
      this.mine.x,
      this.mine.y + 40,
      this.player.x,
      this.player.y
    );
    if (distance < 30 && !this.isEnterPortal) {
      EventBus.emit("in-portal", { category: "개발" });
      this.isEnterPortal = true;
    }
    if (distance > 29 && this.isEnterPortal) {
      EventBus.emit("out-portal");
      this.isEnterPortal = false;
    }
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // this.matter.world.on("collisionstart", (_: any, bodyA: any, bodyB: any) => {
    //   console.log(_);
    //   if (
    //     bodyA.gameObject instanceof Player &&
    //     bodyB.gameObject instanceof Mine
    //   ) {
    //     EventBus.emit("portal", { category: "개발" });
    //   }
    //   if (
    //     bodyA.gameObject instanceof Sheep &&
    //     bodyB.gameObject instanceof Mine
    //   ) {
    //     bodyA.gameObject.destroy();
    //   }
    // });
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
      spawnManager.spawnPlayer(
        this.otherPlayers,
        this,
        playerId,
        activeUsers[playerId].x,
        activeUsers[playerId].y
      )
    );
  }

  initWorld() {
    this.setPortal();

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
    // this.sound.play("woodland-fantasy");
    this.sound.setVolume(0.15);

    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.setZoom(1.1);

    EventBus.emit("current-scene-ready", {
      scene: this,
      socketNsp: this.socketNsp,
    });
  }

  spwanMyPlayer() {
    this.player = new Pawn(
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

  listenEvents() {
    this.io.on("activeUsers", (activeUsers) => {
      console.log(activeUsers);
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

    EventBus.on("move-to-zone", () => {
      this.cameras.main.fadeOut(500);
      socketManager.disconnect(this.socketNsp);

      this.time.delayedCall(500, () => {
        this.sound.stopAll();
        EventBus.emit("start-change-scene");
        const type = "dev";
        this.scene.start("ZoneScene", { type });
        setItem("zone_type", type);
      });
    });
  }

  setBgmPlay(state: boolean) {
    this.sound.setVolume(state ? 0.15 : 0);
    this.isMute = state;
  }
}
