import { http } from "@/api/http";
import { EquipRequest } from "mmorntype";
import { SlotType } from "mmorntype/dist/src/domain/types/equipment.types";

export const equipItem = async (body: EquipRequest) => {
  return await http.post("/equipments", body);
};

export const unequipItem = async (slot: SlotType) => {
  return await http.delete(`/equipments/${slot}`);
};
