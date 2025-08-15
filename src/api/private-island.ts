import { http } from "@/api/http";
import {
  CheckPrivatePasswordRequest,
  CreatePrivateIslandRequest,
  CreatePrivateIslandResponse,
  GetMyPrivateIslandRequest,
  GetPrivateIslandIdRequest,
  GetPrivateIslandIdResponse,
  GetPrivateIslandListResponse,
} from "mmorntype";

const prefix = "/private-islands";

export const createPrivateIsland = async (body: CreatePrivateIslandRequest) => {
  const response = await http.post<CreatePrivateIslandResponse>(prefix, body);
  return response.data;
};

export const getMyPrivateIsland = async (query: GetMyPrivateIslandRequest) => {
  const response = await http.get<GetPrivateIslandListResponse>(
    `${prefix}/my`,
    { params: query }
  );
  return response.data;
};

export const getPrivateIslandId = async (query: GetPrivateIslandIdRequest) => {
  const response = await http.get<GetPrivateIslandIdResponse>(`${prefix}/id`, {
    params: query,
  });
  return response.data;
};

export const checkPrivateIslandPassword = async (
  islandId: string,
  body: CheckPrivatePasswordRequest
) => {
  // 실패시 400번대
  await http.post(`${prefix}/${islandId}/password`, body);
};
