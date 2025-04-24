import { getProducts } from "@/api/product";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GetProductListRequest } from "mmorntype";

const QUERY_KEY = "products";

export const useGetProducts = (query: GetProductListRequest) => {
  const { category, order, page, limit } = query;
  const fetcher = () => getProducts(query);

  return useSuspenseQuery({
    queryKey: [QUERY_KEY, category, order, page, limit],
    queryFn: fetcher,
    staleTime: 1000 * 60 * 5,
  });
};
