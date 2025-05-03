import { http } from "@/api/http";
import {
  CreateIslandRequest,
  GetIslandListReqeust,
  LiveIslandItem,
} from "mmorntype";

export const creteIsland = async (body: CreateIslandRequest) => {
  return await http.post("/islands", body);
};

export const getActiveIslands = async (query: GetIslandListReqeust) => {
  const response = await http.get<LiveIslandItem[]>("/islands/active", {
    params: query,
  });
  return response.data;
};
