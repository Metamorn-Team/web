import { LOBY_SCENE } from "@/constants/game/islands/island";
import { defineAnimation } from "@/game/animations/define-animation";
import { assetManager } from "@/game/managers/asset-manager";
import { Phaser } from "@/game/phaser";
import { getItem } from "@/utils/session-storage";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    assetManager.preloadCommonAsset(this);
  }

  create() {
    defineAnimation(this);
    const currentSceneKey = getItem("current_scene") || LOBY_SCENE;
    // const photoSceneKey = "PhotoScene";
    this.scene.start(currentSceneKey);
  }
}
