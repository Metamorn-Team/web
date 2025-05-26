import { http } from "@/api/http";
import {
  CreateIslandRequest,
  GetIslandDetailResponse,
  GetLiveIslandListReqeust,
  GetLiveIslandListResponse,
} from "mmorntype";

export const creteIsland = async (body: CreateIslandRequest) => {
  return await http.post("/islands", body);
};

export const getActiveIslands = async (query: GetLiveIslandListReqeust) => {
  const response = await http.get<GetLiveIslandListResponse>(
    "/islands/active",
    {
      params: query,
    }
  );
  return response.data;
};

export const getIslandInfo = async (islandId: string) => {
  const response = await http.get<GetIslandDetailResponse>(
    `/islands/${islandId}`
  );
  return response.data;
};
