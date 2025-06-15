import { unequipItem } from "@/api/equipment";
import { useMutation } from "@tanstack/react-query";

export const useUnequipItem = (
  onSuccess?: () => void,
  onError?: () => void
) => {
  return useMutation({
    mutationFn: unequipItem,
    onSuccess,
    onError,
  });
};
