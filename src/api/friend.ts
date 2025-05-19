import { http } from "@/api/http";
import {
  CheckFriendshipResponse,
  GetFriendRequestListRequest,
  GetFriendRequestsResponse,
  GetFriendsRequest,
  GetFriendsResponse,
  GetUnreadRequestResponse,
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
  const response = await http.get<GetFriendRequestsResponse>(
    "/friends/requests",
    {
      params: query,
    }
  );
  return response.data;
};

export const acceptFriend = async (requestId: string) => {
  return await http.patch(`/friends/requests/${requestId}/accept`);
};

export const rejectFriend = async (requestId: string) => {
  return await http.patch(`/friends/requests/${requestId}/reject`);
};

export const getFriends = async (query: GetFriendsRequest) => {
  const response = await http.get<GetFriendsResponse>("/friends", {
    params: query,
  });
  return response.data;
};

export const checkFriendRequestStatus = async (targetId: string) => {
  const response = await http.get<CheckFriendshipResponse>("/friends/check", {
    params: { targetId },
  });
  return response.data;
};

export const getUnreadRequestCount = async () => {
  const response = await http.get<GetUnreadRequestResponse>(
    "friends/unread-count"
  );
  return response.data;
};

export const markAllRequestAsRead = async () => {
  return await http.patch("/friends/read");
};

export const removeFriend = async (id: string) => {
  return await http.delete(`/friends/${id}`);
};
