import { http } from "@/api/http";
import { AdditionalRegisterData, BaseRegisterDate } from "@/api/user";

export type RegisterPayload = BaseRegisterDate & AdditionalRegisterData;

export interface RegisterResponse {
  readonly id: string;
  readonly accessToken: string;
  readonly email: string;
  readonly nickname: string;
  readonly tag: string;
}

export async function login(
  provider: "GOOGLE",
  body: {
    accessToken: string;
  }
): Promise<RegisterResponse> {
  const response = await http.post<RegisterResponse>(
    `/auth/${provider}/login`,
    body
  );
  return response.data;
}

export async function register(
  body: RegisterPayload
): Promise<RegisterResponse> {
  const response = await http.post<RegisterResponse>("/auth/register", body);
  return response.data;
}
