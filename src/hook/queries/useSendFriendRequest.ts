import { sendFriendRequest } from "@/api/friend";
import { useMutation } from "@tanstack/react-query";

export const useSendFriendRequest = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: sendFriendRequest,
    onSuccess:
      onSuccess ||
      (() => {
        console.log("요청 성공");
      }),
  });
};
