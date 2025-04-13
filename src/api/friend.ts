import { http } from "@/api/http";

export const sendFriendRequest = async (body: { targetUserId: string }) => {
  return await http.post("/friends/requests", body);
};
