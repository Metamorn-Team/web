import { acceptFriend, FriendRequestDirection } from "@/api/friend";
import { QUERY_KEY as FRIEND_REQUEST_QUERY_KEY } from "@/hook/queries/useInfiniteGetFriendRequests";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAcceptFriendRequest = (direction: FriendRequestDirection) => {
  const queryClient = useQueryClient();

  const fetcher = (requestId: string) => acceptFriend(requestId);

  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [FRIEND_REQUEST_QUERY_KEY, direction],
      });
    },
  });
};
