import { getMyPrivateIsland } from "@/api/private-island";
import { useQuery } from "@tanstack/react-query";
import { GetMyPrivateIslandRequest } from "mmorntype";

export const QUERY_KEY = "private-islands";

export const useGetPaginatedMyPrivateIsland = (
  query: GetMyPrivateIslandRequest
) => {
  const { page, order } = query;
  const fetcher = () => getMyPrivateIsland(query);

  return useQuery({
    queryKey: [QUERY_KEY, page, order],
    queryFn: fetcher,
    staleTime: 1000 * 60 * 3,
  });
};
