import { http } from "@/api/http";
import { EquipRequest } from "mmorntype";

export const equipItem = async (body: EquipRequest) => {
  return await http.post("/equipments", body);
};
