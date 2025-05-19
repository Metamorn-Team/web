export interface Friend {
  id: string;
  profileImageUrl: string;
  tag: string;
  nickname: string;
  friendshipId: string;
  isOnline: boolean;
}

export interface FriendRequest {
  id: string;
  profileImageUrl: string;
  nickname: string;
}
