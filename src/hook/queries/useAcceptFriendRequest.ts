import { acceptFriend, FriendRequestDirection } from "@/api/friend";
import { useMutation } from "@tanstack/react-query";

export const useAcceptFriendRequest = (
  direction: FriendRequestDirection,
  onSuccess: () => void
) => {
  const fetcher = (targetId: string) => acceptFriend(targetId);

  return useMutation({
    mutationFn: fetcher,
    onSuccess,
  });
};
