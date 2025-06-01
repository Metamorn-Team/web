import { NORMAL_AURAS } from "@/constants/game/products/auras";
import { Component } from "@/game/components/interface/component";
import { Phaser } from "@/game/phaser";
import { ItemGrade } from "mmorntype/dist/src/domain/types/item.types";

export class AuraEffect implements Component {
  private gameObj: Phaser.GameObjects.Sprite;
  private activeFX?: Phaser.FX.Glow;

  constructor(
    sprite: Phaser.GameObjects.Sprite,
    config?: { key: string; grade: ItemGrade }
  ) {
    this.gameObj = sprite;

    if (config) {
      this.changeAura(config.key, config.grade);
    }
  }

  changeAura(key: string, grade: ItemGrade) {
    this.activeFX?.destroy();
    this.gameObj.preFX?.clear();

    if (grade === "NORMAL") {
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
  }

  destroy(): void {
    this.activeFX?.destroy();
    this.gameObj.preFX?.clear();
  }
}
