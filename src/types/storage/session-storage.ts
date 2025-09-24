type ZoneType = "dev" | "design";

export interface SessionStorageData {
  current_scene: string;
  current_island_id: string;
  current_island_name: string;
  current_island_type: "NORMAL" | "DESERTED" | "PRIVATE";
  zone_type: ZoneType;
}
