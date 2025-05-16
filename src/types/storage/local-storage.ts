interface PlayerProfile {
  id: string;
  tag: string;
  nickname: string;
  avatarKey: string;
}

export interface LocalStorageData {
  access_token: string;
  profile: PlayerProfile;
  play_bgm: boolean;
  sound_volume: number;
  fps_limit: number;
  seen_control_guide: boolean;
}
