import { FOAM } from "@/constants/game/sprites/tile";
import { skullSpawner } from "@/game/managers/spawners/skull-sign-spawner";
import { Phaser } from "@/game/phaser";

export const mapKeys = ["island", "loby", "store", "tiny-island"] as const;
export type MapKeys = (typeof mapKeys)[number];

class TileMapManager {
  private scene: Phaser.Scene;

  registerTileMap(scene: Phaser.Scene, mapKey: MapKeys) {
    this.scene = scene;

    console.log(scene);
    const map = scene.make.tilemap({ key: mapKey });

    if (mapKey === "island") {
      this.createIslandMapLayer(map);
    }
    if (mapKey === "loby") {
      this.createLobyMapLayers(map);
    }
    if (mapKey === "store") {
      this.createStoreMapLayer(map);
    }
    if (mapKey === "tiny-island") {
      this.createTinyIslandLayer(map);
    }

    return map;
  }

  createStoreMapLayer(map: Phaser.Tilemaps.Tilemap) {
    const groundTileset = map.addTilesetImage("ground", "ground");

    if (groundTileset) {
      map.createLayer("ground", groundTileset);
    }
  }

  createTinyIslandLayer(map: Phaser.Tilemaps.Tilemap) {
    const shadowTileset = map.addTilesetImage("shadow", "shadow");
    const seaTileset = map.addTilesetImage("water", "water");
    const groundTileset = map.addTilesetImage("ground", "ground");

    this.createLayer(map, "sea", seaTileset);
    const foamLayer = this.createLayer(map, "foam", shadowTileset);
    const foams = foamLayer?.createFromTiles(46, -1, {
      key: FOAM,
      origin: 0.33,
    });

    if (foams) {
      this.scene.anims.staggerPlay(FOAM, foams, 50);
    }

    this.createLayer(map, "ground", groundTileset);
    this.setRectanleCollisionObjects(map);
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

      // const rockLayer = map.createLayer("rock", shadowTileset);
      // const sRocks = rockLayer?.createFromTiles([169], -1, {
      //   key: ROCK_S,
      //   origin: 0.2,
      // });
      // const mRocks = rockLayer?.createFromTiles([168], -1, {
      //   key: ROCK_M,
      //   origin: 0.2,
      // });
      // const lRocks = rockLayer?.createFromTiles([95], -1, {
      //   key: ROCK_L,
      //   origin: 0.2,
      // });

      // const rockMaps = [
      //   { title: ROCK_S, value: sRocks },
      //   { title: ROCK_M, value: mRocks },
      //   { title: ROCK_L, value: lRocks },
      // ];
      // rockMaps.forEach((rock) => {
      //   if (rock.value) {
      //     this.scene.anims.staggerPlay(rock.title, rock.value, 50);
      //   }
      // });

      this.setRectanleCollisionObjects(map);
    }
  }

  createLobyMapLayers(map: Phaser.Tilemaps.Tilemap) {
    const waterTileset = map.addTilesetImage("water", "water");
    const shadowTileset = map.addTilesetImage("shadow", "shadow");

    const stonTileset = map.addTilesetImage("elevation", "elevation");
    const bone1Tileset = map.addTilesetImage("bone1", "bone1");
    const bone2ileset = map.addTilesetImage("bone2", "bone2");
    const bridgeileset = map.addTilesetImage("bridge", "bridge");
    const mushroomLTileset = map.addTilesetImage("mushroom-l", "mushroom-l");
    const mushroomMTileset = map.addTilesetImage("mushroom-m", "mushroom-m");
    const mushroomSTileset = map.addTilesetImage("mushroom-s", "mushroom-s");

    map.createLayer("water", waterTileset!);
    map.createLayer("shadow", shadowTileset!);

    const foamLayer = map.createLayer("foam", shadowTileset!);
    const foams = foamLayer?.createFromTiles(55, -1, {
      key: FOAM,
      origin: 0.33,
    });

    if (foams) {
      this.scene.anims.staggerPlay(FOAM, foams, 50);
    }

    map.createLayer("ston", stonTileset!);
    map.createLayer("bone", [bone1Tileset!, bone2ileset!]);
    map.createLayer("bridge", bridgeileset!);
    map.createLayer("mushroom", [
      mushroomLTileset!,
      mushroomMTileset!,
      mushroomSTileset!,
    ]);

    this.setRectanleCollisionObjects(map);

    skullSpawner.spawnSkullSign(this.scene, 16, 7);
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

  createLayer(
    map: Phaser.Tilemaps.Tilemap,
    name: string,
    tile: Phaser.Tilemaps.Tileset | null
  ) {
    if (tile) {
      return map.createLayer(name, tile);
    }
  }
}

export const tileMapManager = new TileMapManager();
