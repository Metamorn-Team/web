import { getMyProfile } from "@/api/user";
import { Player } from "@/game/entities/players/player";
import { EventWrapper } from "@/game/event/EventBus";
import { InputManager } from "@/game/managers/input-manager";
import { Phaser } from "@/game/phaser";
import { getItem, persistItem } from "@/utils/persistence";

export class MetamornScene extends Phaser.Scene {
  protected player: Player;
  protected inputManager: InputManager;

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

  protected setEnabledMouseInput(enabled: boolean) {
    if (this.game.input.mouse) {
      this.game.input.mouse.enabled = enabled;
    }
  }

  protected getEnabledKeyboardInput() {
    return this.game.input.keyboard?.enabled || false;
  }

  protected onInitialEvent() {
    EventWrapper.onGameEvent("enableGameKeyboardInput", () => {
      this.setEnabledKeyboardInput(true);
      this.setEnabledMouseInput(true);
    });

    EventWrapper.onGameEvent("disableGameInput", () => {
      this.setEnabledKeyboardInput(false);
      this.setEnabledMouseInput(false);
      this.inputManager.resetKeyAll();
    });
  }

  protected async getPlayerInfo() {
    const storedProfile = getItem("profile");
    return storedProfile || this.fetchFreshPlayerInfo();
  }

  protected async fetchFreshPlayerInfo() {
    const user = await getMyProfile();
    persistItem("profile", user);

    return user;
  }

  protected ready(nsp: string) {
    EventWrapper.emitToUi("current-scene-ready", {
      scene: this,
      socketNsp: nsp,
    });
  }

  protected free() {
    EventWrapper.offGameEvent("enableGameKeyboardInput");
    EventWrapper.offGameEvent("disableGameInput");
  }
}
