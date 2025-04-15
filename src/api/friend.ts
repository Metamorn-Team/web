import { http } from "@/api/http";
import {
  GetFriendRequestListRequest,
  GetFriendRequestsResponseDto,
  SendFriendRequest,
} from "mmorntype";

export enum FriendRequestDirection {
  SENT = "sent",
  RECEIVED = "received",
}

export const sendFriendRequest = async (body: SendFriendRequest) => {
  return await http.post("/friends/requests", body);
};

export const getFriendRequests = async (query: GetFriendRequestListRequest) => {
  const response = await http.get<GetFriendRequestsResponseDto>(
    "/friends/requests",
    {
      params: query,
    }
  );
  return response.data;
};
