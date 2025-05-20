import { logout } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

export const useLogout = (onSuccess: () => void, onError?: () => void) => {
  return useMutation({
    mutationFn: logout,
    onSuccess,
    onError,
  });
};
