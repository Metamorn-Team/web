import { Player } from "@/game/entities/Player";
import * as Phaser from "phaser";

export class MainScene extends Phaser.Scene {
  private player: Player;

  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.load.audio('town', '/sounds/town.mp3');
    this.load.image('background', '/images/background.png');
    this.load.spritesheet(
      "human-base-idle",
      "/images/game/human/idle/base_idle.png",
      {
        frameWidth: 96,
        frameHeight: 64,
      }
    );
  }

  create() {
    const mapWidth = 2201;
    const mapHeight = 1300;
    this.matter.world.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.setZoom(3);
    this.sound.play('town');

    const centerX = this.cameras.main.width / 3;
    const centerY = this.cameras.main.height / 3;

    const background = this.add.image(0, 0, "background");
    background.setOrigin(0, 0);
    this.player = new Player(this, centerX, centerY);
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
