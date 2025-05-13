import { markAllRequestAsRead } from "@/api/friend";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as UNREAD_COUNT_QUERY_KEY } from "@/hook/queries/useGetUnreadFriendRequest";

export const useMarkAllFriendRequestAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllRequestAsRead,
    onSuccess: () => {
      queryClient.setQueryData([UNREAD_COUNT_QUERY_KEY], { count: 0 });
    },
  });
};
