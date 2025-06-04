import { INITIAL_PROFILE } from "@/constants/game/initial-profile";
import { STORE } from "@/constants/game/sounds/bgm/bgms";
import { defineAnimation } from "@/game/animations/define-animation";
import { EquipmentState } from "@/game/components/equipment-state";
import { EventWrapper } from "@/game/event/EventBus";
import { assetManager } from "@/game/managers/asset-manager";
import { controllablePlayerManager } from "@/game/managers/controllable-player-manager";
import { SoundManager } from "@/game/managers/sound-manager";
import { tileMapManager } from "@/game/managers/tile-map-manager";
import { MetamornScene } from "@/game/scenes/metamorn-scene";
import { GetMyResponse } from "mmorntype";

export class StoreScene extends MetamornScene {
  private bgmKey = STORE;

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
    SoundManager.getInstance().playBgm(this.bgmKey, 0.1);

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
    let userInfo: GetMyResponse;

    try {
      userInfo = await this.getPlayerInfo();
    } catch (e: unknown) {
      console.log(e);
      userInfo = INITIAL_PROFILE;
    }

    const { equipmentState: equipmentStateProto, ...playerInfo } = userInfo;
    const equipmentState = new EquipmentState(equipmentStateProto.AURA);

    this.player = await controllablePlayerManager.spawnControllablePlayer(
      this,
      playerInfo,
      { x: 160, y: 160 },
      this.inputManager,
      equipmentState
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
      console.log(key);
      console.log(type);
      if (type === "AURA") {
        this.player.setAura(key);
      }
    });
  }
}
