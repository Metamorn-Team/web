type ZoneType = "dev" | "design";

export interface SessionStorageData {
  current_scene: string;
  current_island_id: string;
  zone_type: ZoneType;
}
