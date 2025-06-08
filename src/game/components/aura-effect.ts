import { NORMAL_AURAS } from "@/constants/game/products/auras";
import { Component } from "@/game/components/interface/component";
import { Phaser } from "@/game/phaser";

export class AuraEffect implements Component {
  private gameObj: Phaser.GameObjects.Sprite;
  private activeFX?: Phaser.FX.Glow;

  constructor(
    sprite: Phaser.GameObjects.Sprite,
    config?: { key: string; name: string } | null
  ) {
    this.gameObj = sprite;

    if (config) {
      this.changeAura(config.key);
    }
  }

  changeAura(key: string) {
    this.activeFX?.destroy();
    this.gameObj.preFX?.clear();

    const config = NORMAL_AURAS[key];
    const { color, innerStrength, outerStrength } = config;

    if (config && this.gameObj.preFX) {
      this.activeFX = this.gameObj.preFX.addGlow(
        color,
        outerStrength,
        innerStrength
      );
    }
  }

  update(): void {}

  destroy(): void {
    this.activeFX?.destroy();
    this.gameObj.preFX?.clear();
  }
}
