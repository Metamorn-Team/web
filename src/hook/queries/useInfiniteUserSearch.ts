import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import { searchUsers } from "@/api/user";
import { useMemo } from "react";
import { SearchVarient } from "mmorntype/dist/src/domain/types/uesr.types";

export const QUERY_KEY = "user-search";

export const useInfiniteUserSearch = (
  search: string,
  varient: SearchVarient,
  limit: number = 10
) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY, search, varient],
    queryFn: async (
      context: QueryFunctionContext<string[], string | undefined>
    ) => {
      const response = await searchUsers({
        search,
        varient,
        cursor: context.pageParam,
        limit,
      });
      return response;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    initialPageParam: undefined,
    enabled: false,
    staleTime: 5 * 60 * 1000,
  });

  const users = useMemo(() => {
    return data?.pages.map((page) => page.data).flat();
  }, [data]);

  return {
    users,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    hasNextPage,
  };
};
