import { removeFriend } from "@/api/friend";
import { useMutation } from "@tanstack/react-query";

export const useRemoveFriend = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: removeFriend,
    onSuccess,
  });
};
