import { http } from "@/api/http";
import {
  CreateIslandRequest,
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
