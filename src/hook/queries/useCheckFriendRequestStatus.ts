import { checkFriendRequestStatus } from "@/api/friend";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = "friend-status";

export const useCheckFriendRequestStatus = (targetId: string) => {
  const fetcher = () => checkFriendRequestStatus(targetId);

  return useQuery({
    queryKey: [QUERY_KEY, targetId],
    queryFn: fetcher,
    staleTime: 0,
  });
};
