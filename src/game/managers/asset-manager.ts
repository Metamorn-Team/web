import {
  PAWN,
  pawnColors,
  TORCH_GOBLIN,
  torchGoblinColors,
  WARRIOR,
  warriorColors,
} from "@/constants/game/entities";
import { SKULL_SIGN, TREE } from "@/constants/game/sprites/nature";
import {
  FOAM,
  ROCK_L,
  ROCK_M,
  ROCK_S,
  ROCK_XL,
} from "@/constants/game/sprites/tile";
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
          frameWidth: 192,
          frameHeight: 192,
        }
      );
    });

    const ROCKS = [ROCK_S, ROCK_M, ROCK_L, ROCK_XL];
    ROCKS.forEach((ROCK) =>
      scene.load.spritesheet(
        ROCK,
        `/game/tiles/tiny-sward/sprites/${ROCK}.png`,
        {
          frameWidth: 128,
          frameHeight: 128,
        }
      )
    );

    scene.load.spritesheet("sleep", `/game/player/pawn/sleep.png`, {
      frameWidth: 192,
      frameHeight: 192,
    });

    scene.load.spritesheet(FOAM, `/game/tiles/tiny-sward/sprites/foam.png`, {
      frameWidth: 192,
      frameHeight: 192,
    });

    scene.load.spritesheet(TREE, `/game/object/sprites/tree.png`, {
      frameWidth: 192,
      frameHeight: 192,
    });
  }

  loadMaps(scene: Phaser.Scene) {
    scene.load.tilemapTiledJSON("loby", "/game/maps/tiny_sward.json");
    scene.load.tilemapTiledJSON("island", "/game/maps/island.json");
    scene.load.tilemapTiledJSON("store", "/game/maps/store.json");
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
    scene.load.image(SKULL_SIGN, "/game/tiles/tiny-sward/skull-sign.png");
  }

  loadImages(scene: Phaser.Scene) {
    scene.load.image("paper-small", "/images/ui/paper-small.png");
    scene.load.image("mine", "/game/object/mine.png");
  }

  loadAudios(scene: Phaser.Scene) {
    scene.load.audio("town", "/game/sounds/town.mp3");
    scene.load.audio("store", "/game/sounds/store.mp3");
    scene.load.audio("woodland-fantasy", "/game/sounds/woodland-fantasy.mp3");
    scene.load.audio("hit", "/game/sounds/hit.wav");
    scene.load.audio("jump", "/game/sounds/jump.wav");
  }
}

export const assetManager = new AssetManager();
