import { http } from "@/api/http";

type Provider = "GOOGLE" | "KAKAO";

export interface UserInfo {
  readonly id: string;
  readonly email: string;
  readonly nickname: string;
  readonly tag: string;
  readonly provider: Provider;
}

export interface NotRegisteredUserInfo {
  readonly email: string;
  readonly name: string;
  readonly provider: Provider;
}

export async function getMyProfile(): Promise<UserInfo> {
  const response = await http.get<UserInfo>(`/users/my`);
  return response.data;
}
