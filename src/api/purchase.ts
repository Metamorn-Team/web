import { http } from "@/api/http";
import { PurchaseRequest } from "mmorntype";

export const purchase = async (body: PurchaseRequest) => {
  return await http.post("/purchases", body);
};
