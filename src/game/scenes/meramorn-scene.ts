import { Player } from "@/game/entities/players/player";
import { Phaser } from "@/game/phaser";

export class MetamornScene extends Phaser.Scene {
  protected player: Player;

  constructor(sceneKey: string) {
    super({ key: sceneKey });
  }

  followPlayerCamera() {
    this.cameras.main = this.cameras.main;
    this.cameras.main.startFollow(this.player);
  }
}
