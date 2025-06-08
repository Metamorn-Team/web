import { INITIAL_PROFILE } from "@/constants/game/initial-profile";
import { STORE } from "@/constants/game/sounds/bgm/bgms";
import { defineAnimation } from "@/game/animations/define-animation";
import { TilemapComponent } from "@/game/components/tile-map.component";
import { EventWrapper } from "@/game/event/EventBus";
import { assetManager } from "@/game/managers/asset-manager";
import { SoundManager } from "@/game/managers/sound-manager";
import { playerSpawner } from "@/game/managers/spawners/player-spawner";
import { MetamornScene } from "@/game/scenes/metamorn-scene";
import { GetMyResponse } from "mmorntype";

export class StoreScene extends MetamornScene {
  private bgmKey = STORE;

  private mapComponent: TilemapComponent;
  private zoomWeight = 1.3;

  constructor() {
    super("StoreScene");
  }

  preload() {
    assetManager.preloadCommonAsset(this);
  }

  create() {
    super.create();

    defineAnimation(this);

    this.mapComponent = new TilemapComponent(this, "store");
    this.cameras.main.setZoom(this.zoomWeight);

    this.spawnPlayer().then(() => {
      this.player.setSpeed(this.player.getSpeed() * 0.5);
    });

    this.listenEvent();

    SoundManager.init(this).playBgm(this.bgmKey, 0.1);

    EventWrapper.emitToUi("current-scene-ready", {
      scene: this,
    });
  }

  update(_: number, delta: number) {
    if (this.player) {
      this.player.update(delta);
    }
  }

  async spawnPlayer() {
    let userInfo: GetMyResponse;

    try {
      userInfo = await this.getPlayerInfo();
    } catch (e: unknown) {
      console.log(e);
      userInfo = INITIAL_PROFILE;
    }

    const { equipmentState: equipment, ...playerInfo } = userInfo;
    this.player = playerSpawner.spawnPlayer({
      equipment,
      playerInfo,
      position: { x: 160, y: 160 },
      scene: this,
      texture: playerInfo.avatarKey,
      inputManager: this.inputManager,
    });
    this.followPlayerCamera();
  }

  listenEvent() {
    EventWrapper.onGameEvent("tryOnProduct", (type, key) => {
      console.log(key);
      console.log(type);
      if (type === "AURA") {
        this.player.setAura(key);
      }
    });
  }
}
