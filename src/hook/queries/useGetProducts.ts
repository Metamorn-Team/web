import { getProducts } from "@/api/product";
import { useQuery } from "@tanstack/react-query";
import { GetProductListRequest } from "mmorntype";

const QUERY_KEY = "products";

export const useGetProducts = (query: GetProductListRequest) => {
  const { type, order, page, limit } = query;
  const fetcher = () => getProducts(query);

  return useQuery({
    queryKey: [QUERY_KEY, type, order, page, limit],
    queryFn: fetcher,
    staleTime: 1000 * 60 * 5,
  });
};
