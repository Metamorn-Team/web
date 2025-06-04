import { equipItem } from "@/api/equipment";
import { useMutation } from "@tanstack/react-query";

export const useEquipItem = () => {
  return useMutation({
    mutationFn: equipItem,
  });
};
