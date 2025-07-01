import { getAllPromotion } from "@/api/promotion";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = "promotions";

interface UseGetAllPromotionOptions {
  enabled?: boolean;
}

export const useGetAllPromotion = (options: UseGetAllPromotionOptions = {}) => {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getAllPromotion,
    staleTime: 1000 * 60 * 60,
    enabled,
  });

  return {
    ...query,
    promotions: query.data?.promotions || [],
  };
};
