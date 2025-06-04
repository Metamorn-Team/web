import { http } from "@/api/http";
import { Provider } from "@/types/client/unions";
import {
  ChangeAvatarRequest,
  ChangeBioRequest,
  ChangeNicknameRequest,
  ChangeTagRequest,
  GetGoldBalance,
  GetMyResponse,
  GetUserResponse,
  SearchUserResponse,
  SearchUsersRequest,
} from "mmorntype";

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

export const getMyProfile = async () => {
  const response = await http.get<GetMyResponse>("/users/my");
  return response.data;
};

export const getProfile = async (userId: string) => {
  const response = await http.get<GetUserResponse>(`/users/${userId}`);
  return response.data;
};

export const getMyGoldBalance = async () => {
  const response = await http.get<GetGoldBalance>("/users/gold");
  return response.data;
};

export const searchUsers = async (query: SearchUsersRequest) => {
  const response = await http.get<SearchUserResponse>("/users/search", {
    params: query,
  });
  return response.data;
};

export const changeBio = async (body: ChangeBioRequest) => {
  return await http.patch("/users/bio", body);
};

export const changeAvatar = async (body: ChangeAvatarRequest) => {
  return await http.patch("/users/avatar", body);
};

export const changeTag = async (body: ChangeTagRequest) => {
  return await http.patch("/users/tag", body);
};

export const changeNickname = async (body: ChangeNicknameRequest) => {
  return await http.patch("/users/nickname", body);
};
