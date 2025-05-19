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
  cdnUrl = process.env.NEXT_PUBLIC_CDN_BASE_URL;
  spriteUrl = `${this.cdnUrl}/asset/sprite`;
  imageUrl = `${this.cdnUrl}/asset/image`;
  tileUrl = `${this.cdnUrl}/asset/tile`;

  preloadCommonAsset(scene: Phaser.Scene) {
    this.loadSprites(scene);
    this.loadAudios(scene);
    this.loadMaps(scene);
    this.loadTileImages(scene);
    this.loadImages(scene);
  }

  loadSprites(scene: Phaser.Scene) {
    scene.load.spritesheet("sheep", `${this.spriteUrl}/sheep.png`, {
      frameWidth: 128,
      frameHeight: 128,
    });

    scene.load.spritesheet(DEAD, `${this.spriteUrl}/dead.png`, {
      frameWidth: 128,
      frameHeight: 128,
    });

    torchGoblinColors.forEach((color) => {
      scene.load.spritesheet(
        TORCH_GOBLIN(color),
        `${this.spriteUrl}/${TORCH_GOBLIN(color)}.png`,
        {
          frameWidth: 192,
          frameHeight: 192,
        }
      );
    });

    warriorColors.forEach((color) => {
      scene.load.spritesheet(
        WARRIOR(color),
        `${this.spriteUrl}/${WARRIOR(color)}.png`,
        {
          frameWidth: 192,
          frameHeight: 192,
        }
      );
    });

    pawnColors.forEach((color) => {
      scene.load.spritesheet(
        PAWN(color),
        `${this.spriteUrl}/${PAWN(color)}.png`,
        {
          frameWidth: 192,
          frameHeight: 192,
        }
      );
    });

    const ROCKS = [ROCK_S, ROCK_M, ROCK_L, ROCK_XL];
    ROCKS.forEach((ROCK) =>
      scene.load.spritesheet(ROCK, `${this.spriteUrl}/${ROCK}.png`, {
        frameWidth: 128,
        frameHeight: 128,
      })
    );

    scene.load.spritesheet("sleep", `${this.spriteUrl}/sleep.png`, {
      frameWidth: 192,
      frameHeight: 192,
    });

    scene.load.spritesheet(FOAM, `${this.spriteUrl}/foam.png`, {
      frameWidth: 192,
      frameHeight: 192,
    });

    scene.load.spritesheet(TREE, `${this.spriteUrl}/tree.png`, {
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
    scene.load.image("water", `${this.tileUrl}/water.png`);
    scene.load.image("elevation", `${this.tileUrl}/elevation.png`);
    scene.load.image("ground", `${this.tileUrl}/ground.png`);
    scene.load.image("shadow", `${this.tileUrl}/shadow.png`);

    scene.load.image("mushroom-l", `${this.imageUrl}/mushroom-l.png`);
    scene.load.image("mushroom-m", `${this.imageUrl}/mushroom-m.png`);
    scene.load.image("mushroom-s", `${this.imageUrl}/mushroom-s.png`);

    scene.load.image("bone1", `${this.imageUrl}/bone1.png`);
    scene.load.image("bone2", `${this.imageUrl}/bone2.png`);
    scene.load.image(SKULL_SIGN, `${this.imageUrl}/skull-sign.png`);

    scene.load.image("bridge", `${this.tileUrl}/bridge.png`);
  }

  loadImages(scene: Phaser.Scene) {
    // scene.load.image("paper-small", `${this.imageUrl}/paper-small.png`);
    scene.load.image("mine", `${this.imageUrl}/mine.png`);
    scene.load.image("base", `${this.imageUrl}/base.png`);
    scene.load.image("thumb", `${this.imageUrl}/thumb.png`);
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
