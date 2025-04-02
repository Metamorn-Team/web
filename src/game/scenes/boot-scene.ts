import { defineAnimation } from "@/game/animations/define-animation";
import { assetManager } from "@/game/managers/asset-manager";
import { Phaser } from "@/game/phaser";
import { getItem } from "@/utils/persistence";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    assetManager.preloadCommonAsset(this);
  }

  create() {
    defineAnimation(this);
    const currentSceneKey = getItem<string>("current_scene") || "LobyScene";
    this.scene.start(currentSceneKey);
  }
}
