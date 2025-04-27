import { getMyGoldBalance } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = "gold";

export const useGetGoldBalance = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getMyGoldBalance,
  });
};
