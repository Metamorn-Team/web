import {
  PAWN,
  pawnColors,
  SHEEP,
  TORCH_GOBLIN,
  torchGoblinColors,
  WARRIOR,
  warriorColors,
} from "@/constants/game/entities";
import {
  STORE,
  TOWN,
  WOODLAND_FANTASY,
} from "@/constants/game/sounds/bgm/bgms";
import { CASH, HIT, JUMP, STRONG_HIT } from "@/constants/game/sounds/sfx/sfxs";
import {
  MUSHROOM_L,
  NATURE_SPRITE,
  SKULL_SIGN,
} from "@/constants/game/sprites/nature";
import { SPRITE } from "@/constants/game/sprites/object";
import { FOAM } from "@/constants/game/sprites/tile";
import { DEAD } from "@/game/animations/keys/common";
import { Phaser } from "@/game/phaser";

export class AssetManager {
  cdnUrl = process.env.NEXT_PUBLIC_CDN_BASE_URL;
  spriteUrl = `${this.cdnUrl}/asset/sprite`;
  imageUrl = `${this.cdnUrl}/asset/image`;
  tileUrl = `${this.cdnUrl}/asset/tile`;
  itemUrl = `${this.cdnUrl}/product`;

  preloadCommonAsset(scene: Phaser.Scene) {
    this.loadSprites(scene);
    this.loadAudios(scene);
    this.loadMaps(scene);
    this.loadTileImages(scene);
    this.loadImages(scene);
  }

  loadSprites(scene: Phaser.Scene) {
    scene.load.spritesheet(SHEEP, `${this.spriteUrl}/sheep.png`, {
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

    // const ROCKS = [ROCK_S, ROCK_M, ROCK_L, ROCK_XL];
    // ROCKS.forEach((ROCK) =>
    //   scene.load.spritesheet(ROCK, `${this.spriteUrl}/${ROCK}.png`, {
    //     frameWidth: 128,
    //     frameHeight: 128,
    //   })
    // );

    scene.load.spritesheet("sleep", `${this.spriteUrl}/sleep.png`, {
      frameWidth: 192,
      frameHeight: 192,
    });

    scene.load.spritesheet(FOAM, `${this.spriteUrl}/foam.png`, {
      frameWidth: 192,
      frameHeight: 192,
    });

    scene.load.spritesheet(
      NATURE_SPRITE.TREE,
      `${this.spriteUrl}/tree-basic.png`,
      {
        frameWidth: 192,
        frameHeight: 256,
      }
    );

    scene.load.spritesheet(SPRITE.BOAT, `${this.spriteUrl}/boat.png`, {
      frameWidth: 256,
      frameHeight: 256,
    });

    scene.load.spritesheet(
      NATURE_SPRITE.ROCK_XS,
      `${this.spriteUrl}/rock-xs.png`,
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );

    scene.load.spritesheet(
      NATURE_SPRITE.ROCK_S,
      `${this.spriteUrl}/rock-s.png`,
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );

    scene.load.spritesheet(
      NATURE_SPRITE.ROCK_M,
      `${this.spriteUrl}/rock-m.png`,
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );

    scene.load.spritesheet(
      NATURE_SPRITE.ROCK_L,
      `${this.spriteUrl}/rock-l.png`,
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );
  }

  loadMaps(scene: Phaser.Scene) {
    scene.load.tilemapTiledJSON("loby", "/game/maps/tiny_sward.json");
    scene.load.tilemapTiledJSON("island", "/game/maps/island.json");
    scene.load.tilemapTiledJSON("store", "/game/maps/store.json");
    scene.load.tilemapTiledJSON("tiny-island", "/game/maps/tiny-island.json");
  }

  loadTileImages(scene: Phaser.Scene) {
    scene.load.image("water", `${this.tileUrl}/water.png`);
    scene.load.image("elevation", `${this.tileUrl}/elevation.png`);
    scene.load.image("ground", `${this.tileUrl}/ground.png`);
    scene.load.image("shadow", `${this.tileUrl}/shadow.png`);

    scene.load.image(MUSHROOM_L, `${this.imageUrl}/mushroom-l.png`);
    scene.load.image("mushroom-m", `${this.imageUrl}/mushroom-m.png`);
    scene.load.image("mushroom-s", `${this.imageUrl}/mushroom-s.png`);

    scene.load.image("bone1", `${this.imageUrl}/bone1.png`);
    scene.load.image("bone2", `${this.imageUrl}/bone2.png`);
    scene.load.image(SKULL_SIGN, `${this.imageUrl}/skull-sign.png`);

    scene.load.image("brown-bubble", `${this.itemUrl}/brown_bubble.png`);
    scene.load.image("brown-tail", `${this.itemUrl}/brown_tail.png`);

    scene.load.image("white-bubble", `${this.itemUrl}/white_bubble.png`);
    scene.load.image("white-tail", `${this.itemUrl}/white_tail.png`);

    scene.load.image("bridge", `${this.tileUrl}/bridge.png`);
  }

  loadImages(scene: Phaser.Scene) {
    // scene.load.image("paper-small", `${this.imageUrl}/paper-small.png`);
    scene.load.image("mine", `${this.imageUrl}/mine.png`);
    scene.load.image("base", `${this.imageUrl}/base.png`);
    scene.load.image("thumb", `${this.imageUrl}/thumb.png`);
  }

  loadAudios(scene: Phaser.Scene) {
    scene.load.audio(TOWN, "/game/sounds/town.mp3");
    scene.load.audio(STORE, "/game/sounds/store.mp3");
    scene.load.audio(WOODLAND_FANTASY, "/game/sounds/woodland-fantasy.mp3");
    scene.load.audio(HIT, "/game/sounds/hit.wav");
    scene.load.audio(STRONG_HIT, "/game/sounds/strong-hit.wav");
    scene.load.audio(JUMP, "/game/sounds/jump.wav");
    scene.load.audio(CASH, "/game/sounds/cash.mp3");
  }
}

export const assetManager = new AssetManager();
