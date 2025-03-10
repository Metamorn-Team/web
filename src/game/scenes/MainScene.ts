import { Player } from "@/game/entities/Player";
import * as Phaser from "phaser";

export class MainScene extends Phaser.Scene {
  private player: Player;

  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.load.audio("town", "/sounds/town.mp3");
    this.load.image("background", "/images/background.png");
    this.load.spritesheet("human-base-idle", "/game/human/idle/base_idle.png", {
      frameWidth: 96,
      frameHeight: 64,
    });
    this.load.image(
      "sunnysideworld_16px",
      "/game/tiles/sunnysideworld_16px.png"
    );
    this.load.tilemapTiledJSON("town", "/game/maps/town.json");
  }

  create() {
    const map = this.make.tilemap({ key: "town" });
    const tileset = map.addTilesetImage(
      "sunnysideworld_16px",
      "sunnysideworld_16px"
    );
    const groundLayer = map.createLayer("ground", tileset!);
    groundLayer?.setAlpha(1);

    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    this.matter.world.setBounds(0, 0, mapWidth, mapHeight);
    this.sound.play("town", { volume: 0.3 });

    this.player = new Player(this, mapWidth / 2, mapHeight / 2);

    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.setZoom(2.2);
    this.followPlayerCamera();
    this.defineAnimation();
  }

  update(): void {
    this.player.update();
  }

  followPlayerCamera() {
    this.cameras.main = this.cameras.main;
    this.cameras.main.startFollow(this.player);
  }

  defineAnimation() {
    this.anims.create({
      key: "human-idle",
      frames: this.anims.generateFrameNumbers("human-base-idle", {
        start: 0,
        end: 8,
      }),
      frameRate: 15,
      repeat: -1,
    });
  }
}
