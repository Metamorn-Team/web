import { useQuery } from "@tanstack/react-query";
import { getIslandInfo } from "@/api/island";

export const QUERY_KEY = "island-info";

export const useGetIslandInfo = (islandId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, islandId],
    queryFn: () => getIslandInfo(islandId),
    staleTime: 1000 * 60 * 30,
  });
};
