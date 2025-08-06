import { http } from "@/api/http";
import {
  CreatePrivateIslandRequest,
  CreatePrivateIslandResponse,
  GetMyPrivateIslandRequest,
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
