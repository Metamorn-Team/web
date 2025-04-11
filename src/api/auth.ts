import { http } from "@/api/http";
import { AdditionalRegisterData, BaseRegisterDate } from "@/api/user";
import { RegisterRequest, RegisterResponse } from "mmorntype";

export type RegisterPayload = BaseRegisterDate & AdditionalRegisterData;

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
  body: RegisterRequest
): Promise<RegisterResponse> {
  const response = await http.post<RegisterResponse>("/auth/register", body);
  return response.data;
}
