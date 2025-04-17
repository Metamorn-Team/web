import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import { useMemo } from "react";
import { GetFriendRequestListRequest } from "mmorntype";
import { getFriendRequests } from "@/api/friend";

export const QUERY_KEY = "friendRequests";

export const useInfiniteGetFriendRequests = (
  query: GetFriendRequestListRequest
) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY, query.direction],
    queryFn: async (
      context: QueryFunctionContext<string[], string | undefined>
    ) => {
      const response = await getFriendRequests({
        ...query,
        cursor: context.pageParam,
      });
      return response;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    initialPageParam: undefined,
    // enabled: false,
    staleTime: 0,
  });

  const friendRequests = useMemo(() => {
    return data?.pages.map((page) => page.data).flat();
  }, [data]);

  return {
    friendRequests,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  };
};
