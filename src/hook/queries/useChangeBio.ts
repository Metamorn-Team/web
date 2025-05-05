// src/hook/queries/useUpdateBio.ts
import { changeBio } from "@/api/user";
import { useMutation } from "@tanstack/react-query";

export const useChangeBio = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: changeBio,
    onSuccess,
  });
};
