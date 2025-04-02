import { TORCH_GOBLIN, WARRIOR } from "@/constants/entities";
import { Phaser } from "@/game/phaser";

export class AssetManager {
  preloadCommonAsset(scene: Phaser.Scene) {
    scene.load.audio("town", "/game/sounds/town.mp3");
    scene.load.audio("woodland-fantasy", "/game/sounds/woodland-fantasy.mp3");

    scene.load.spritesheet("sheep", `/game/animal/sheep.png`, {
      frameWidth: 128,
      frameHeight: 128,
    });

    scene.load.spritesheet(
      TORCH_GOBLIN("red"),
      `/game/enemy/${TORCH_GOBLIN("red")}.png`,
      {
        frameWidth: 192,
        frameHeight: 192,
      }
    );

    scene.load.spritesheet(
      WARRIOR("blue"),
      `/game/player/${WARRIOR("blue")}.png`,
      {
        frameWidth: 192,
        frameHeight: 192,
      }
    );
    scene.load.spritesheet(
      WARRIOR("purple"),
      `/game/player/${WARRIOR("purple")}.png`,
      {
        frameWidth: 192,
        frameHeight: 192,
      }
    );

    scene.load.spritesheet(
      WARRIOR("yellow"),
      `/game/player/${WARRIOR("yellow")}.png`,
      {
        frameWidth: 192,
        frameHeight: 192,
      }
    );

    scene.load.spritesheet(
      WARRIOR("red"),
      `/game/player/${WARRIOR("red")}.png`,
      {
        frameWidth: 192,
        frameHeight: 192,
      }
    );

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
