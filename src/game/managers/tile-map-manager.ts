import { FOAM, ROCK_L, ROCK_M, ROCK_S } from "@/constants/game/sprites/tile";
import { treeSpawner } from "@/game/managers/tree-spawner";
import { Phaser } from "@/game/phaser";

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

      const foamLayer = map.createLayer("foam", shadowTileset);
      const foams = foamLayer?.createFromTiles(78, -1, {
        key: FOAM,
        origin: 0.33,
      });

      if (foams) {
        this.scene.anims.staggerPlay(FOAM, foams, 50);
      }

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

      const rockLayer = map.createLayer("rock", shadowTileset);
      const sRocks = rockLayer?.createFromTiles([169], -1, {
        key: ROCK_S,
        origin: 0.2,
      });
      const mRocks = rockLayer?.createFromTiles([168], -1, {
        key: ROCK_M,
        origin: 0.2,
      });
      const lRocks = rockLayer?.createFromTiles([95], -1, {
        key: ROCK_L,
        origin: 0.2,
      });

      const rockMaps = [
        { title: ROCK_S, value: sRocks },
        { title: ROCK_M, value: mRocks },
        { title: ROCK_L, value: lRocks },
      ];
      rockMaps.forEach((rock) => {
        if (rock.value) {
          this.scene.anims.staggerPlay(rock.title, rock.value, 50);
        }
      });

      this.setRectanleCollisionObjects(map);

      const positions = [
        { cellX: 25, cellY: 4 },
        { cellX: 22, cellY: 5 },
        { cellX: 24, cellY: 6 },
        { cellX: 4, cellY: 12 },
        { cellX: 5, cellY: 12 },
        { cellX: 4, cellY: 13 },
        { cellX: 5, cellY: 13 },
      ];

      positions.map((position) =>
        treeSpawner.spawnTree(this.scene, position.cellX, position.cellY)
      );
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
