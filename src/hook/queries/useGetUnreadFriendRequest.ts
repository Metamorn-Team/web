import { getUnreadRequestCount } from "@/api/friend";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = "unread-count";

export const useGetUnreadFriendRequest = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => getUnreadRequestCount(),
    staleTime: 10000000,
  });
};
