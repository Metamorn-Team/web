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

    this.load.image(
      "sunnysideworld_16px",
      "/game/tiles/sunnysideworld_16px.png"
    );
    this.load.tilemapTiledJSON("town", "/game/maps/town.json");
  }

  create() {
    defineAnimation(this);
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
    this.sound.play("town", { volume: 0.05 });

    this.player = new Warrior(this, mapWidth / 2, mapHeight / 2, "purple");

    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.setZoom(0.6);
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
