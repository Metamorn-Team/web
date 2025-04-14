import {
  PAWN,
  pawnColors,
  TORCH_GOBLIN,
  torchGoblinColors,
  WARRIOR,
  warriorColors,
} from "@/constants/game/entities";
import { TREE } from "@/constants/game/sprites/nature";
import { FOAM } from "@/constants/game/sprites/tile";
import { DEAD } from "@/game/animations/keys/common";
import { Phaser } from "@/game/phaser";

export class AssetManager {
  preloadCommonAsset(scene: Phaser.Scene) {
    this.loadSprites(scene);
    this.loadAudios(scene);
    this.loadMaps(scene);
    this.loadTileImages(scene);
    this.loadImages(scene);
  }

  loadSprites(scene: Phaser.Scene) {
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

    scene.load.spritesheet(FOAM, `/game/tiles/tiny-sward/sprites/foam.png`, {
      frameWidth: 96,
      frameHeight: 96,
      spacing: 96,
      margin: 48,
    });

    scene.load.spritesheet(TREE, `/game/object/sprites/tree.png`, {
      frameWidth: 192,
      frameHeight: 192,
    });
  }

  loadMaps(scene: Phaser.Scene) {
    scene.load.tilemapTiledJSON("loby", "/game/maps/tiny_sward.json");
  }

  loadTileImages(scene: Phaser.Scene) {
    scene.load.image("water", "/game/tiles/tiny-sward/water.png");
    scene.load.image("elevation", "/game/tiles/tiny-sward/elevation.png");
    scene.load.image("ground", "/game/tiles/tiny-sward/ground.png");
    scene.load.image("shadow", "/game/tiles/tiny-sward/shadow.png");

    scene.load.image("mushroom-l", "/game/tiles/tiny-sward/mushroom-l.png");
    scene.load.image("mushroom-m", "/game/tiles/tiny-sward/mushroom-m.png");
    scene.load.image("mushroom-s", "/game/tiles/tiny-sward/mushroom-s.png");

    scene.load.image("bone1", "/game/tiles/tiny-sward/bone1.png");
    scene.load.image("bone2", "/game/tiles/tiny-sward/bone2.png");

    scene.load.image("bridge", "/game/tiles/tiny-sward/bridge.png");
  }

  loadImages(scene: Phaser.Scene) {
    scene.load.image("paper-small", "/images/ui/paper-small.png");
    scene.load.image("mine", "/game/object/mine.png");
  }

  loadAudios(scene: Phaser.Scene) {
    scene.load.audio("town", "/game/sounds/town.mp3");
    scene.load.audio("woodland-fantasy", "/game/sounds/woodland-fantasy.mp3");
  }
}

export const assetManager = new AssetManager();
