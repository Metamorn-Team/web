import { getAllMap } from "@/api/map";
import { useSuspenseQuery } from "@tanstack/react-query";

export const QUERY_KEY = "all-map";

export const useGetAllMap = () => {
  const result = useSuspenseQuery({
    queryKey: [QUERY_KEY],
    queryFn: getAllMap,
    staleTime: 1000 * 60 * 30,
  });

  return {
    ...result,
    data: result.data.maps,
  };
};
