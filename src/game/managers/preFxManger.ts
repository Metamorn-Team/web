import { AURAS } from "@/constants/game/products/auras";
import { Phaser } from "@/game/phaser";

class PreFxManager {
  applyEffect(
    target: Phaser.Physics.Matter.Sprite | Phaser.Physics.Matter.Image,
    type: string,
    key: string
  ) {
    if (type === "aura") {
      const color = AURAS[key as keyof typeof AURAS];
      if (!color) return;

      target.preFX?.clear();
      target.preFX?.addGlow(color);
    }
  }
}

export const preFxManager = new PreFxManager();
