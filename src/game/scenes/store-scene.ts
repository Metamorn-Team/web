import { ProductType } from "@/api/product";
import { INITIAL_PROFILE } from "@/constants/game/initial-profile";
import { defineAnimation } from "@/game/animations/define-animation";
import { EventWrapper } from "@/game/event/EventBus";
import { assetManager } from "@/game/managers/asset-manager";
import { controllablePlayerManager } from "@/game/managers/controllable-player-manager";
import { preFxManager } from "@/game/managers/preFxManger";
import { SoundManager } from "@/game/managers/sound-manager";
import { tileMapManager } from "@/game/managers/tile-map-manager";
import { MetamornScene } from "@/game/scenes/metamorn-scene";
import { UserInfo } from "@/types/socket-io/response";

export class StoreScene extends MetamornScene {
  private bgmKey = "store";

  private map: Phaser.Tilemaps.Tilemap;
  private mapWidth: number;
  private mapHeight: number;
  private centerOfMap: { x: number; y: number };

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

    this.initWorld();
    this.spawnPlayer().then(() => {
      this.player.setVisibleNickname(false);
      this.player.setSpeed(this.player.getSpeed() * 0.5);
    });

    this.listenEvent();

    SoundManager.init(this);
    SoundManager.getInstance().playBgm(this.bgmKey);

    EventWrapper.emitToUi("current-scene-ready", {
      scene: this,
    });
  }

  update(time: number, delta: number) {
    if (this.player) {
      this.player.update(delta);
    }
  }

  async spawnPlayer() {
    let userInfo: UserInfo;

    try {
      userInfo = await this.getPlayerInfo();
    } catch (e: unknown) {
      console.log(e);
      userInfo = INITIAL_PROFILE;
    }

    this.player = await controllablePlayerManager.spawnControllablePlayer(
      this,
      userInfo,
      160,
      160,
      this.inputManager
    );
  }

  initWorld() {
    this.map = tileMapManager.registerTileMap(this, "store");

    this.mapWidth = this.map.widthInPixels;
    this.mapHeight = this.map.heightInPixels;
    this.centerOfMap = {
      x: this.mapWidth / 2,
      y: this.mapHeight / 2,
    };

    this.matter.world.setBounds(
      0,
      0,
      this.mapWidth / this.zoomWeight,
      this.mapHeight / this.zoomWeight
    );
    this.cameras.main.setBounds(
      0,
      0,
      this.mapWidth / this.zoomWeight,
      this.mapHeight / this.zoomWeight
    );
    this.cameras.main.setZoom(1.3);
  }

  listenEvent() {
    EventWrapper.onGameEvent("tryOnProduct", (type, key) => {
      if (type === ProductType.AURA) {
        preFxManager.applyEffect(this.player, type, key);
      }
    });
  }
}
