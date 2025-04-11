import { http } from "@/api/http";
import { Provider } from "@/types/client/unions";
import { GetUserResponse, SearchUserResponse } from "mmorntype";

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
  readonly avatarKey: string;
}

export async function getMyProfile(): Promise<GetUserResponse> {
  const response = await http.get<GetUserResponse>(`/users/my`);
  return response.data;
}

// TODO 타입 배포되면 대치
interface SearchUserRequest {
  readonly search: string;
  readonly varient: "NICKNAME" | "TAG";
  readonly cursor?: string;
  readonly limit?: number;
}
export async function searchUsers(query: SearchUserRequest) {
  const response = await http.get<SearchUserResponse>("/users/search", {
    params: query,
  });
  return response.data;
}
