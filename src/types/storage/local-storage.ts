interface PlayerProfile {
  id: string;
  tag: string;
  nickname: string;
}

export interface LocalStorageData {
  access_token: string;
  profile: PlayerProfile;
}
