import { Player } from "@/game/entities/players/player";
import { InputManager } from "@/game/managers/input-manager";
import { Phaser } from "@/game/phaser";

export class MetamornScene extends Phaser.Scene {
  protected player: Player;
  protected inputManager: InputManager;

  constructor(sceneKey: string) {
    super({ key: sceneKey });
  }

  create() {
    this.inputManager = new InputManager(this);
  }

  followPlayerCamera() {
    this.cameras.main = this.cameras.main;
    this.cameras.main.startFollow(this.player);
  }

  setZoom(weight: number) {
    this.cameras.main.setZoom(weight);
  }
}
