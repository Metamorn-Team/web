import { http } from "@/api/http";
import { AdditionalRegisterData, BaseRegisterDate } from "@/api/user";
import { RegisterRequest, RegisterResponse } from "mmorntype";

export type RegisterPayload = BaseRegisterDate & AdditionalRegisterData;

export async function login(
  provider: "GOOGLE" | "KAKAO",
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

export const logout = async () => {
  return await http.delete("/auth/logout");
};

export async function register(
  body: RegisterRequest
): Promise<RegisterResponse> {
  const response = await http.post<RegisterResponse>("/auth/register", body);
  return response.data;
}

export const refreshAuthToken = async () => {
  return await http.post("/auth/token");
};

export const getTurnCredentials = async () => {
  try {
    const response = await http.get("/auth/turn-credentials");
    return response.data;
  } catch (err) {
    console.error("TURN credentials fetch failed:", err);
    return null;
  }
};
