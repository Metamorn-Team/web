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

  protected isMobile(): boolean {
    return this.scale.width <= 640;
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
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off("resize");
    });
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
      .image(0, 0, "base")
      .setDisplaySize(100, 100)
      .setScrollFactor(0)
      .setDepth(1000);
    const thumb = this.add
      .image(0, 0, "thumb")
      .setDisplaySize(44, 44)
      .setScrollFactor(0)
      .setDepth(1000);

    const joystick = new VirtualJoystick(this, {
      x: 85,
      y: this.scale.height - 170,
      radius: 50,
      base,
      thumb,
    });

    joystick.setScrollFactor(0);

    return new VirtualJoystickInputManager(joystick);
  }

  private initVirtualButtons() {
    const createButton = (x: number, y: number, key: Keys, label: string) => {
      const thumbImage = this.add
        .image(x, y, "thumb")
        .setDisplaySize(50, 50)
        .setInteractive()
        .setScrollFactor(0)
        .setDepth(1000);

      this.add
        .text(x, y, label, {
          fontFamily: "CookieRun",
          fontSize: "16px",
          color: "#2a1f14",
          fontStyle: "bold",
          resolution: 0.85,
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(1001);

      // 이벤트 연결
      thumbImage.on("pointerdown", () => {
        (this.inputManager as VirtualJoystickInputManager).pressVirtualKey(key);
      });

      thumbImage.on("pointerup", () => {
        (this.inputManager as VirtualJoystickInputManager).releaseVirtualKey(
          key
        );
      });
    };

    const baseY = this.scale.height - 170;
    createButton(this.scale.width - 165, baseY, Keys.E, "E");
    createButton(this.scale.width - 110, baseY, Keys.Z, "공격");
    createButton(this.scale.width - 55, baseY, Keys.SPACE, "점프");
  }

  protected onMapResize(mapWith: number) {
    this.adjustZoomBasedOnWidth(mapWith);
    this.scale.on("resize", () => {
      this.adjustZoomBasedOnWidth(mapWith);

      const width = this.scale.width;
      const height = this.scale.height;
      this.cameras.main.setViewport(0, 0, width, height);
      this.game.renderer.resize(width, height);
    });
  }

  protected adjustZoomBasedOnWidth(mapWidth: number) {
    const width = this.scale.width;

    let zoom = 3;

    if (width <= 640) {
      zoom = 0.85;
    } else if (width <= 1680) {
      zoom = 1.1;
    } else if (width <= 1920) {
      zoom = 1.3;
    } else if (width <= 2560) {
      zoom = 1.7;
    } else if (width <= 3840) {
      zoom = 2.5;
    }

    const minZoomX = width / mapWidth;
    zoom = Math.max(zoom, minZoomX);

    this.setZoom(zoom);
  }
}
