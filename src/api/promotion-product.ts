import { http } from "@/api/http";
import {
  GetProductListResponseV2,
  GetPromotionProductListRequest,
} from "mmorntype";

export const getPromotionProducts = async (
  query: GetPromotionProductListRequest
) => {
  const response = await http.get<GetProductListResponseV2>(
    "/promotion-products",
    {
      params: query,
    }
  );
  return response.data;
};
