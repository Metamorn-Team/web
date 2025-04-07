import { http } from "@/api/http";
import { Provider } from "@/types/client/unions";
import { GetUserResponse } from "mmorn-type";

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
