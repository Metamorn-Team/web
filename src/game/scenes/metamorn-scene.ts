import { Player } from "@/game/entities/players/player";
import { EventWrapper } from "@/game/event/EventBus";
import { InputManager } from "@/game/managers/input-manager";
import { Phaser } from "@/game/phaser";

export class MetamornScene extends Phaser.Scene {
  protected player: Player;
  protected inputManager: InputManager;
  protected isInteracting = false;

  constructor(sceneKey: string) {
    super({ key: sceneKey });
  }

  create() {
    this.inputManager = new InputManager(this);
    this.onInitialEvent();
  }

  protected followPlayerCamera() {
    this.cameras.main = this.cameras.main;
    this.cameras.main.startFollow(this.player);
  }

  protected setZoom(weight: number) {
    this.cameras.main.setZoom(weight);
  }

  protected setEnabledKeyboardInput(enabled: boolean) {
    if (this.game.input.keyboard) {
      this.game.input.keyboard.enabled = enabled;
    }
  }

  protected getEnabledKeyboardInput() {
    return this.game.input.keyboard?.enabled || false;
  }

  protected disableKeyboardInput() {
    if (this.input.keyboard) {
      this.input.keyboard.enabled = false;
      this.isInteracting = true;
    }
  }
  protected enableKeyboardInput() {
    if (this.input.keyboard) {
      this.input.keyboard.enabled = true;
      this.isInteracting = false;
    }
  }

  protected onInitialEvent() {
    EventWrapper.offGameEvent("interactionComplete");
    EventWrapper.onGameEvent("interactionComplete", () => {
      this.enableKeyboardInput();
    });
  }
}
