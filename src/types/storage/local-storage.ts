import { GetMyResponse } from "mmorntype";

export interface LocalStorageData {
  access_token: string;
  profile: GetMyResponse;
  play_bgm: boolean;
  sound_volume: number;
  fps_limit: number;
  aura_updated: string;
  bubble_updated: string;
  seen_control_guide: boolean;
  seen_mobile_warning: boolean;
}
