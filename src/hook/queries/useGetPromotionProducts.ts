import { getPromotionProducts } from "@/api/promotion-product";
import { useQuery } from "@tanstack/react-query";
import { GetPromotionProductListRequest } from "mmorntype";

export const QUERY_KEY = "promotion-products";

export const useGetPromotionProducts = (
  query: GetPromotionProductListRequest
) => {
  const { page, order, name } = query;
  const fetcher = () => getPromotionProducts(query);

  return useQuery({
    queryKey: [QUERY_KEY, page, order, name],
    queryFn: fetcher,
    staleTime: 1000 * 60 * 5,
  });
};
