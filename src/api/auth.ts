import { http } from "@/api/http";
import { NotRegisteredUserInfo } from "@/api/user";

export interface RegisterPayload extends NotRegisteredUserInfo {
  readonly nickname: string;
  readonly tag: string;
}

export async function login(
  provider: "GOOGLE",
  body: {
    accessToken: string;
  }
): Promise<{ accessToken: string }> {
  const response = await http.post(`/auth/${provider}/login`, body);
  return response.data;
}
