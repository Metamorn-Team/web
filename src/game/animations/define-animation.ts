import {
  PAWN,
  pawnColors,
  TORCH_GOBLIN,
  torchGoblinColors,
  WARRIOR,
  warriorColors,
} from "@/constants/game/entities";
import { NATURE_SPRITE } from "@/constants/game/sprites/nature";
import { SPRITE } from "@/constants/game/sprites/object";
import { FOAM } from "@/constants/game/sprites/tile";
import { BORN, DEAD } from "@/game/animations/keys/common";
import { SHEEP } from "@/game/animations/keys/creatures/sheep/sheep";
import { BOAT_IDLE } from "@/game/animations/keys/objects/boat";
import { TREE_IDLE } from "@/game/animations/keys/objects/tree";
import {
  PAWN_ATTACK,
  PAWN_IDLE,
  PAWN_JUMP,
  PAWN_STRONG_ATTACK,
  PAWN_WALK,
} from "@/game/animations/keys/pawn";
import { TORCH_GOBLIN_IDLE } from "@/game/animations/keys/torch-goblin";
import {
  WARRIOR_ATTACK,
  WARRIOR_IDLE,
  WARRIOR_WALK,
} from "@/game/animations/keys/warrior";

export const defineAnimation = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: DEAD,
    frames: scene.anims.generateFrameNumbers(DEAD, {
      start: 0,
      end: 13,
    }),
    frameRate: 20,
  });

  scene.anims.create({
    key: BORN,
    frames: scene.anims.generateFrameNumbers(DEAD, {
      start: 13,
      end: 0,
    }),
    frameRate: 20,
  });

  warriorColors.forEach((color) => {
    scene.anims.create({
      key: WARRIOR_IDLE(color),
      frames: scene.anims.generateFrameNumbers(WARRIOR(color), {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: WARRIOR_WALK(color),
      frames: scene.anims.generateFrameNumbers(WARRIOR(color), {
        start: 6,
        end: 11,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: WARRIOR_ATTACK(color),
      frames: scene.anims.generateFrameNumbers(WARRIOR(color), {
        start: 12,
        end: 17,
      }),
      frameRate: 13,
    });
  });

  pawnColors.forEach((color) => {
    scene.anims.create({
      key: PAWN_IDLE(color),
      frames: scene.anims.generateFrameNumbers(PAWN(color), {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: PAWN_WALK(color),
      frames: scene.anims.generateFrameNumbers(PAWN(color), {
        start: 6,
        end: 11,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: PAWN_ATTACK(color),
      frames: scene.anims.generateFrameNumbers(PAWN(color), {
        start: 12,
        end: 17,
      }),
      frameRate: 12,
    });

    scene.anims.create({
      key: PAWN_STRONG_ATTACK(color),
      frames: scene.anims.generateFrameNumbers(PAWN(color), {
        start: 18,
        end: 23,
      }),
      frameRate: 12,
    });

    scene.anims.create({
      key: PAWN_JUMP(color),
      frames: scene.anims.generateFrameNumbers(PAWN(color), {
        start: 36,
        end: 41,
      }),
      frameRate: 15,
    });
  });

  scene.anims.create({
    key: "sleep",
    frames: scene.anims.generateFrameNumbers("sleep", {
      start: 0,
      end: 4,
    }),
    frameRate: 7,
    repeat: -1,
  });

  torchGoblinColors.forEach((color) => {
    scene.anims.create({
      key: TORCH_GOBLIN_IDLE(color),
      frames: scene.anims.generateFrameNumbers(TORCH_GOBLIN(color), {
        start: 0,
        end: 6,
      }),
      frameRate: 13,
      repeat: -1,
    });
  });

  scene.anims.create({
    key: FOAM,
    frames: scene.anims.generateFrameNumbers(FOAM, {
      start: 0,
      end: 7,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: TREE_IDLE,
    frames: scene.anims.generateFrameNumbers(NATURE_SPRITE.TREE, {
      start: 0,
      end: 7,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: SHEEP.IDLE,
    frames: scene.anims.generateFrameNumbers(SPRITE.SHEEP_IDLE, {
      start: 0,
      end: 5,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: SHEEP.MOVE,
    frames: scene.anims.generateFrameNumbers(SPRITE.SHEEP_MOVE, {
      start: 0,
      end: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: SHEEP.GRASS,
    frames: scene.anims.generateFrameNumbers(SPRITE.SHEEP_GRASS, {
      start: 0,
      end: 11,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: BOAT_IDLE,
    frames: scene.anims.generateFrameNumbers(SPRITE.BOAT, {
      start: 0,
      end: 7,
    }),
    frameRate: 10,
    repeat: -1,
  });

  // const rocks = [ROCK_S, ROCK_M, ROCK_L, ROCK_XL];
  // rocks.forEach((rock) =>
  //   scene.anims.create({
  //     key: rock,
  //     frames: scene.anims.generateFrameNumbers(rock, {
  //       start: 0,
  //       end: 7,
  //     }),
  //     frameRate: 6,
  //     repeat: -1,
  //   })
  // );
};
