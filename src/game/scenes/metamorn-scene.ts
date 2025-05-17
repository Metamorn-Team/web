import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";
import { getMyProfile } from "@/api/user";
import { Player } from "@/game/entities/players/player";
import { EventWrapper } from "@/game/event/EventBus";
import { KeyboardInputManager } from "@/game/managers/input/keyboard-input-manager";
import { InputManager } from "@/game/managers/input/input-manager";
import { VirtualJoystickInputManager } from "@/game/managers/input/virtual-joystick-input-manager";
import { Phaser } from "@/game/phaser";
import { getItem, persistItem } from "@/utils/persistence";
import { Keys } from "@/types/game/enum/key";

export class MetamornScene extends Phaser.Scene {
  protected player: Player;
  protected inputManager: InputManager;

  constructor(sceneKey: string) {
    super({ key: sceneKey });
  }

  preload() {}

  create() {
    this.initInputManager();
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

  private initInputManager() {
    const isMobile =
      this.sys.game.device.os.android || this.sys.game.device.os.iOS;

    if (isMobile) {
      this.inputManager = this.initJoystickInputManager();
      this.initVirtualButtons();
    } else {
      this.inputManager = new KeyboardInputManager(this);
    }
  }

  private initJoystickInputManager(): InputManager {
    const base = this.add
      .circle(0, 0, 30, 0x888888)
      .setScrollFactor(0)
      .setDepth(1000)
      .setAlpha(1);
    const thumb = this.add
      .circle(0, 0, 15, 0xcccccc)
      .setScrollFactor(0)
      .setDepth(1000)
      .setAlpha(1);

    const joystick = new VirtualJoystick(this, {
      x: 85,
      y: this.scale.height - 180,
      radius: 30,
      base,
      thumb,
    });

    joystick.setScrollFactor(0);

    return new VirtualJoystickInputManager(joystick);
  }

  private initVirtualButtons() {
    const eBtn = this.add
      .text(this.scale.width - 175, this.scale.height - 180, "E", {
        fontFamily: "CookieRun",
        fontSize: "14px",
        backgroundColor: "#d6c6aa",
        padding: { x: 10, y: 6 },
        color: "#2a1f14",
        fontStyle: "bold",
        resolution: 10,
      })
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(1000);

    const zBtn = this.add
      .text(this.scale.width - 125, this.scale.height - 180, "공격", {
        fontFamily: "CookieRun",
        fontSize: "14px",
        backgroundColor: "#d6c6aa",
        padding: { x: 10, y: 6 },
        color: "#2a1f14",
        fontStyle: "bold",
        resolution: 10,
      })
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(1000);

    const spaceBtn = this.add
      .text(this.scale.width - 75, this.scale.height - 180, "점프", {
        fontFamily: "CookieRun",
        fontSize: "14px",
        backgroundColor: "#d6c6aa",
        padding: { x: 10, y: 6 },
        color: "#2a1f14",
        fontStyle: "bold",
        resolution: 10,
      })
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(1000);

    zBtn.on("pointerdown", () => {
      (this.inputManager as VirtualJoystickInputManager).pressVirtualKey(
        Keys.Z
      );
    });

    zBtn.on("pointerup", () => {
      (this.inputManager as VirtualJoystickInputManager).releaseVirtualKey(
        Keys.Z
      );
    });

    eBtn.on("pointerdown", () => {
      (this.inputManager as VirtualJoystickInputManager).pressVirtualKey(
        Keys.E
      );
    });
    eBtn.on("pointerup", () => {
      (this.inputManager as VirtualJoystickInputManager).releaseVirtualKey(
        Keys.E
      );
    });

    spaceBtn.on("pointerdown", () => {
      (this.inputManager as VirtualJoystickInputManager).pressVirtualKey(
        Keys.SPACE
      );
    });
    spaceBtn.on("pointerup", () => {
      (this.inputManager as VirtualJoystickInputManager).releaseVirtualKey(
        Keys.SPACE
      );
    });
  }
}
