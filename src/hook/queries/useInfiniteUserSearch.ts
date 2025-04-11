import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import { searchUsers } from "@/api/user";
import { useMemo } from "react";

export const useInfiniteUserSearch = (
  search: string,
  varient: "NICKNAME" | "TAG",
  limit: number = 10
) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["userSearch", search, varient],
    queryFn: async (
      context: QueryFunctionContext<string[], string | undefined>
    ) => {
      const response = await searchUsers({
        search,
        varient,
        cursor: context.pageParam, // 명시적으로 pageParam 사용
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
    console.log(data);
    return data?.pages.map((page) => page.data).flat();
  }, [data]);

  return {
    users,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  };
};
