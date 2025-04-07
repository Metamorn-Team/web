import {
  PAWN,
  pawnColors,
  TORCH_GOBLIN,
  torchGoblinColors,
  WARRIOR,
  warriorColors,
} from "@/constants/entities";
import { DEAD } from "@/game/animations/keys/common";
import { Phaser } from "@/game/phaser";

export class AssetManager {
  preloadCommonAsset(scene: Phaser.Scene) {
    scene.load.audio("town", "/game/sounds/town.mp3");
    scene.load.audio("woodland-fantasy", "/game/sounds/woodland-fantasy.mp3");

    scene.load.spritesheet("sheep", `/game/animal/sheep.png`, {
      frameWidth: 128,
      frameHeight: 128,
    });

    scene.load.spritesheet(DEAD, `/game/player/dead.png`, {
      frameWidth: 128,
      frameHeight: 128,
    });

    torchGoblinColors.forEach((color) => {
      scene.load.spritesheet(
        TORCH_GOBLIN(color),
        `/game/enemy/${TORCH_GOBLIN(color)}.png`,
        {
          frameWidth: 192,
          frameHeight: 192,
        }
      );
    });

    warriorColors.forEach((color) => {
      scene.load.spritesheet(
        WARRIOR(color),
        `/game/player/${WARRIOR(color)}.png`,
        {
          frameWidth: 192,
          frameHeight: 192,
        }
      );
    });

    pawnColors.forEach((color) => {
      scene.load.spritesheet(
        PAWN(color),
        `/game/player/pawn/${PAWN(color)}.png`,
        {
          frameWidth: 144,
          frameHeight: 144,
          spacing: 48,
          margin: 24,
        }
      );
    });

    scene.load.image("paper-small", "/images/ui/paper-small.png");
    scene.load.image("mine", "/game/object/mine.png");

    scene.load.image("water", "/game/tiles/tiny-sward/water.png");
    scene.load.image("elevation", "/game/tiles/tiny-sward/elevation.png");

    scene.load.image("mushroom-l", "/game/tiles/tiny-sward/mushroom-l.png");
    scene.load.image("mushroom-m", "/game/tiles/tiny-sward/mushroom-m.png");
    scene.load.image("mushroom-s", "/game/tiles/tiny-sward/mushroom-s.png");

    scene.load.image("bone1", "/game/tiles/tiny-sward/bone1.png");
    scene.load.image("bone2", "/game/tiles/tiny-sward/bone2.png");

    scene.load.image("bridge", "/game/tiles/tiny-sward/bridge.png");

    scene.load.tilemapTiledJSON("home", "/game/maps/tiny_sward.json");
  }
}

export const assetManager = new AssetManager();
