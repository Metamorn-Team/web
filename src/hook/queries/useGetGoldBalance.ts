import { getMyGoldBalance } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = "gold";

interface UseGetGoldBalanceOptions {
  enabled?: boolean;
}

export const useGetGoldBalance = (options: UseGetGoldBalanceOptions = {}) => {
  const { enabled = true } = options;

  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getMyGoldBalance,
    enabled,
  });
};
