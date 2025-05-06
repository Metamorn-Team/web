import { http } from "@/api/http";
import { TagItem } from "mmorntype";

export const getAllTag = () => async () => {
  const response = await http.get<TagItem[]>("/tags/all");
  return response.data;
};
