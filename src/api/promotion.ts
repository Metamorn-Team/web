import { http } from "@/api/http";
import { GetAllPromotionResponse } from "mmorntype";

export const getAllPromotion = async () => {
  const response = await http.get<GetAllPromotionResponse>("/promotions/all");
  return response.data;
};
