import * as Phaser from "phaser";
import { WARRIOR } from "constants/entities";
import { defineAnimation } from "game/animations/define-animation";
import { Player } from "game/entities/players/player";
import { Warrior } from "game/entities/players/warrior";

export class MainScene extends Phaser.Scene {
  private player: Player;

  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.load.audio("town", "/game/sounds/town.mp3");
    this.load.audio("woodland-fantasy", "/game/sounds/woodland-fantasy.mp3");

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

    this.load.image("water", "/game/tiles/tiny-sward/water.png");
    this.load.image("elevation", "/game/tiles/tiny-sward/elevation.png");
    this.load.image(
      "tiny_sward_ground",
      "/game/tiles/tiny-sward/tiny_sward_ground.png"
    );
    this.load.image("mushroom-l", "/game/tiles/tiny-sward/mushroom-l.png");
    this.load.image("bone1", "/game/tiles/tiny-sward/bone1.png");
    this.load.image("bone2", "/game/tiles/tiny-sward/bone2.png");
    this.load.image("bridge", "/game/tiles/tiny-sward/bridge.png");
    this.load.tilemapTiledJSON("home", "/game/maps/tiny_sward.json");
  }

  create() {
    defineAnimation(this);
    const map = this.make.tilemap({ key: "home" });
    const waterTileset = map.addTilesetImage("water", "water");
    const stonTileset = map.addTilesetImage("elevation", "elevation");
    const bone1Tileset = map.addTilesetImage("bone1", "bone1");
    const bone2ileset = map.addTilesetImage("bone2", "bone2");
    const bridgeileset = map.addTilesetImage("bridge", "bridge");

    const waterLayer = map.createLayer("water", waterTileset!);
    const stonLayer = map.createLayer("ston", stonTileset!);
    const boneLayer = map.createLayer("bone", [bone1Tileset!, bone2ileset!]);
    const bridgeLayer = map.createLayer("bridge", bridgeileset!);

    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;

    this.matter.world.setBounds(0, 0, mapWidth, mapHeight);

    // this.sound.play("town", { volume: 0.05 });
    this.sound.play("woodland-fantasy", { volume: 0.05 });

    this.player = new Warrior(this, mapWidth / 2, mapHeight / 2, "purple");

    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.setZoom(1.2);
    this.followPlayerCamera();
  }

  update(): void {
    this.player.update();
  }

  followPlayerCamera() {
    this.cameras.main = this.cameras.main;
    this.cameras.main.startFollow(this.player);
  }
}
