import { TorchGoblin } from "@/game/entities/npc/torch-goblin";
import { Pawn } from "@/game/entities/players/pawn";
import { EventBus } from "@/game/event/EventBus";
import { socketManager } from "@/game/managers/socket-manager";
import { Mine } from "@/game/objects/mine";
import { Phaser } from "@/game/phaser";
import { MetamornScene } from "@/game/scenes/metamorn-scene";
import { getItem } from "@/utils/persistence";
import { setItem } from "@/utils/session-storage";

export class LobyScene extends MetamornScene {
  private npcGoblin: TorchGoblin;
  private mine: Mine;

  private isMute = false;

  private mapWidth: number;
  private mapHeight: number;
  private centerOfMap: { x: number; y: number };

  public updateLoadingState: (state: boolean) => void;

  private socketNsp = "loby";

  constructor() {
    super("LobyScene");
  }

  preload() {}

  create() {
    super.create();
    this.initWorld();

    this.spwanMyPlayer();

    this.npcGoblin = new TorchGoblin(
      this,
      this.centerOfMap.x - 200,
      this.centerOfMap.y,
      "red"
    );
    this.mine = new Mine(
      this,
      this.centerOfMap.x,
      this.centerOfMap.y - 200,
      "dev"
    );

    this.listenEvents();
  }

  update(time: number, delta: number): void {
    this.player.update(delta);
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

  initWorld() {
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
    const player = getItem("profile");

    this.player = new Pawn(
      this,
      this.centerOfMap.x,
      this.centerOfMap.y,
      "red",
      player
        ? player
        : { id: "", tag: "", nickname: "", avatarKey: "red_pawn" },
      true,
      this.inputManager
    );
    this.followPlayerCamera();
  }

  setBgmPlay(state: boolean) {
    this.sound.setVolume(state ? 0.15 : 0);
    this.isMute = state;
  }

  listenEvents() {
    EventBus.on("join-zone", (data: { type: "dev" | "design" }) => {
      this.cameras.main.fadeOut(500);
      socketManager.disconnect(this.socketNsp);

      this.time.delayedCall(500, () => {
        this.sound.stopAll();
        EventBus.emit("start-change-scene");
        this.scene.start("ZoneScene", data);
        setItem("zone_type", data.type);
      });
    });
  }
}
