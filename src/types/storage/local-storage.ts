import { GetMyResponse } from "mmorntype";

export interface LocalStorageData {
  access_token: string;
  profile: GetMyResponse;
  play_bgm: boolean;
  sound_volume: number;
  fps_limit: number;
  seen_control_guide: boolean;
  aura_updated: string;
  bubble_updated: string;
}
