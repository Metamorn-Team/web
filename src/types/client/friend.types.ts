export interface Friend {
  id: string;
  profileImageUrl: string;
  tag: string;
  nickname: string;
  isOnline: boolean;
}

export interface FriendRequest {
  id: string;
  profileImageUrl: string;
  nickname: string;
}

export interface Product {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  price: number;
  type: string;
  key: string;
}
