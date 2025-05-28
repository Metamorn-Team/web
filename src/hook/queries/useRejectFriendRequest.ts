import { FriendRequestDirection, rejectFriend } from "@/api/friend";
import { useMutation } from "@tanstack/react-query";

export const useRejectFriendRequest = (
  direction: FriendRequestDirection,
  onSuccess: () => void
) => {
  const fetcher = (targetId: string) => rejectFriend(targetId);

  return useMutation({
    mutationFn: fetcher,
    onSuccess,
  });
};
