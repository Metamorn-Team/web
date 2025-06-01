import { http } from "@/api/http";
import { GetOwnedItemListRequest, GetOwnedItemListResponse } from "mmorntype";

export const getAllOwnedItems = async (query: GetOwnedItemListRequest) => {
  const response = await http.get<GetOwnedItemListResponse>("/items/owned", {
    params: query,
  });
  return response.data;
};
