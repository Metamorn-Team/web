import { getAllTag } from "@/api/tag";
import { useQuery } from "@tanstack/react-query";

const QUERY_KEY = "tags";

export const useGetAllTags = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getAllTag(),
    staleTime: 12 * 60 * 60 * 1000, // 12시간
  });
};
