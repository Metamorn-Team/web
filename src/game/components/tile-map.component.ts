import { Component } from "@/game/components/interface/component";
import { MapKeys, tileMapManager } from "@/game/managers/tile-map-manager";
import { Phaser } from "@/game/phaser";

export class TilemapComponent implements Component {
  public map: Phaser.Tilemaps.Tilemap;
  public mapWidth: number;
  public mapHeight: number;
  public centerOfMap: { x: number; y: number };

  constructor(scene: Phaser.Scene, mapKey: MapKeys) {
    this.map = tileMapManager.registerTileMap(scene, mapKey);

    this.mapWidth = this.map.widthInPixels;
    this.mapHeight = this.map.heightInPixels;
    this.centerOfMap = {
      x: this.mapWidth / 2,
      y: this.mapHeight / 2,
    };

    scene.matter.world.setBounds(0, 0, this.mapWidth, this.mapHeight);

    scene.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    scene.cameras.main.setScroll(this.centerOfMap.x, this.centerOfMap.y);
  }

  destroy(): void {
    this.map.destroy();
  }
}
