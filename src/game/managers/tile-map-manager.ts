import { Tree } from "@/game/entities/nature/tree";
import { Phaser } from "@/game/phaser";
import { getPositionCenterByCell } from "@/game/utils/calc-cell";

type MapKeys = "island" | "loby";

export class TileMapManager {
  private scene: Phaser.Scene;

  registerTileMap(scene: Phaser.Scene, mapKey: MapKeys) {
    this.scene = scene;

    const map = scene.make.tilemap({ key: mapKey });

    if (mapKey === "island") {
      this.createIslandMapLayer(map);
    }
    if (mapKey === "loby") {
      this.createLobyMapLayers(map);
    }

    return map;
  }

  createIslandMapLayer(map: Phaser.Tilemaps.Tilemap) {
    const seaTileset = map.addTilesetImage("water", "water");
    const elevationTileset = map.addTilesetImage("elevation", "elevation");
    const groundTileset = map.addTilesetImage("ground", "ground");
    const shadowTileset = map.addTilesetImage("shadow", "shadow");
    const bridgeTileset = map.addTilesetImage("bridge", "bridge");
    const mushroomLTileset = map.addTilesetImage("mushroom-l", "mushroom-l");

    if (
      seaTileset &&
      elevationTileset &&
      groundTileset &&
      shadowTileset &&
      bridgeTileset &&
      mushroomLTileset
    ) {
      map.createLayer("sea", seaTileset);
      map.createLayer("shadow", shadowTileset);
      map.createLayer("sand", groundTileset);
      map.createLayer("elevation", elevationTileset);
      map.createLayer("sand-deco", groundTileset);
      map.createLayer("ground", groundTileset);
      map.createLayer("hill-shadow", shadowTileset);
      map.createLayer("hill", elevationTileset);
      map.createLayer("grass-deco", groundTileset);
      map.createLayer("hill-ground", groundTileset);
      map.createLayer("bridge", bridgeTileset);
      map.createLayer("deco", mushroomLTileset);

      // const foamLayer = map.createLayer("foam", seaTileset);
      // const foams = foamLayer?.createFromTiles(1, -1, {
      //   key: FOAM,
      //   origin: 0,
      // });

      // if (foams) {
      //   this.scene.anims.staggerPlay(FOAM_ANIM_KEY, foams, 50);
      // }

      // console.log(foamLayer);
      // console.log(foams);

      this.setRectanleCollisionObjects(map);

      const position1 = getPositionCenterByCell(25, 4);
      const position2 = getPositionCenterByCell(22, 5);
      const position3 = getPositionCenterByCell(24, 6);
      new Tree(this.scene, position1.x, position1.y);
      new Tree(this.scene, position2.x, position2.y);
      new Tree(this.scene, position3.x, position3.y);
    }
  }

  createLobyMapLayers(map: Phaser.Tilemaps.Tilemap) {
    const waterTileset = map.addTilesetImage("water", "water");
    const stonTileset = map.addTilesetImage("elevation", "elevation");
    const bone1Tileset = map.addTilesetImage("bone1", "bone1");
    const bone2ileset = map.addTilesetImage("bone2", "bone2");
    const bridgeileset = map.addTilesetImage("bridge", "bridge");
    const mushroomLTileset = map.addTilesetImage("mushroom-l", "mushroom-l");
    const mushroomMTileset = map.addTilesetImage("mushroom-m", "mushroom-m");
    const mushroomSTileset = map.addTilesetImage("mushroom-s", "mushroom-s");

    map.createLayer("water", waterTileset!);
    map.createLayer("ston", stonTileset!);
    map.createLayer("bone", [bone1Tileset!, bone2ileset!]);
    map.createLayer("bridge", bridgeileset!);
    map.createLayer("mushroom", [
      mushroomLTileset!,
      mushroomMTileset!,
      mushroomSTileset!,
    ]);

    this.setRectanleCollisionObjects(map);
  }

  setRectanleCollisionObjects(map: Phaser.Tilemaps.Tilemap) {
    const collisionLines = map.getObjectLayer("collision")?.objects;
    if (collisionLines && collisionLines?.length > 0) {
      collisionLines!.forEach((line) => {
        if (line.rectangle) {
          if (line.x && line.y && line.width && line.height) {
            this.scene.matter.add.rectangle(
              line.x + line.width / 2,
              line.y + line.height / 2,
              line.width,
              line.height,
              {
                isStatic: true,
                collisionFilter: {
                  category: 0x0001,
                },
              }
            );
          }
        }
      });
    }
  }
}

export const tileMapManager = new TileMapManager();
