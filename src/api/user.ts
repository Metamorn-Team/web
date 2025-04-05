import { http } from "@/api/http";

type Provider = "GOOGLE" | "KAKAO";

export interface UserInfo {
  readonly id: string;
  readonly email: string;
  readonly nickname: string;
  readonly tag: string;
  readonly provider: Provider;
}

export interface NotRegisteredUserResponse {
  readonly message: string;
  readonly statusCode: number;
  readonly error: string;
  readonly name: string;
  readonly email: string;
  readonly provider: Provider;
}

export interface BaseRegisterDate {
  readonly email: string;
  readonly provider: Provider;
}

export interface AdditionalRegisterData {
  readonly nickname: string;
  readonly tag: string;
}

export async function getMyProfile(): Promise<UserInfo> {
  const response = await http.get<UserInfo>(`/users/my`);
  return response.data;
}
