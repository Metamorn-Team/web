import { http } from "@/api/http";
import { GetAllMapResponse } from "mmorntype";

export const getAllMap = async () => {
  const response = await http.get<GetAllMapResponse>("/maps");
  return response.data;
};
