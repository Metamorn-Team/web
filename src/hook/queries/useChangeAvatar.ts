import { changeAvatar } from "@/api/user";
import { useMutation } from "@tanstack/react-query";

export const useChangeAvatar = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: changeAvatar,
    onSuccess,
  });
};
