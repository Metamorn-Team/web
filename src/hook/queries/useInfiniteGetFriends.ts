import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import { useMemo } from "react";
import { GetFriendsRequest } from "mmorntype";
import { getFriends } from "@/api/friend";

export const QUERY_KEY = "friends";

export const useInfiniteGetFriends = (query: GetFriendsRequest) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY],
    queryFn: async (
      context: QueryFunctionContext<string[], string | undefined>
    ) => {
      const response = await getFriends({
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

  const friends = useMemo(() => {
    return data?.pages.map((page) => page.data).flat();
  }, [data]);

  return {
    friends,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  };
};
