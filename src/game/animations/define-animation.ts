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
import { BORN, DEAD } from "@/game/animations/keys/common";
import { TREE_IDLE } from "@/game/animations/keys/objects/tree";
import { PAWN_ATTACK, PAWN_IDLE, PAWN_WALK } from "@/game/animations/keys/pawn";
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
      frameRate: 13,
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
      frames: scene.anims.generateFrameNumbers(TREE, {
        start: 0,
        end: 3,
      }),
      frameRate: 6,
      repeat: -1,
    });
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
};
