import { getAllPromotion } from "@/api/promotion";
import { useSuspenseQuery } from "@tanstack/react-query";

export const QUERY_KEY = "promotions";

export const useGetAllPromotion = () => {
  const query = useSuspenseQuery({
    queryKey: [QUERY_KEY],
    queryFn: getAllPromotion,
    staleTime: 1000 * 60 * 60,
  });

  return {
    ...query,
    promotions: query.data.promotions,
  };
};
