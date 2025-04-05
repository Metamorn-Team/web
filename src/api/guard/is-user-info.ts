import { NotRegisteredUserResponse } from "@/api/user";

export const isErrorUserInfo = (
  data: unknown
): data is NotRegisteredUserResponse => {
  if (typeof data !== "object" || !data) return false;

  return "email" in data && "name" in data && "provider" in data;
};
