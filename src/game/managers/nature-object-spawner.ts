import { Mushroom } from "@/game/entities/nature/mushroom";
import { NatureObject } from "@/game/entities/nature/nature-object";
import { Tree } from "@/game/entities/nature/tree";
import { Phaser } from "@/game/phaser";
import { IslandActiveObject } from "mmorntype";

// const natureObjectTypes = ["TREE"] as const;

export class NatureObjectSpawner {
  static spawnNatureObject(
    scene: Phaser.Scene,
    object: IslandActiveObject
  ): NatureObject | null {
    const position = {
      x: object.x,
      y: object.y,
    };

    switch (object.type) {
      case "TREE":
        return new Tree(scene, {
          id: object.id,
          hp: object.hp,
          position,
        });
      case "MUSHROOM":
        return new Mushroom(scene, {
          id: object.id,
          hp: object.hp,
          position,
        });
      default:
        return null;
    }
  }

  static spawnNatureObjects(
    scene: Phaser.Scene,
    objects: IslandActiveObject[]
  ): NatureObject[] {
    const natureObjects: NatureObject[] = [];
    objects.forEach((object) => {
      const natureObject = this.spawnNatureObject(scene, object);
      if (natureObject) {
        natureObjects.push(natureObject);
      }
    });
    return natureObjects;
  }
}
