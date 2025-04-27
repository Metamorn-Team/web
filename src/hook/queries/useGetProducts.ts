import { getProducts } from "@/api/product";
import { useQuery } from "@tanstack/react-query";
import { GetProductListRequest } from "mmorntype";

export const QUERY_KEY = "products";

export const useGetProducts = (query: GetProductListRequest) => {
  const { page, order } = query;
  const fetcher = () => getProducts(query);

  return useQuery({
    queryKey: [QUERY_KEY, page, order],
    queryFn: fetcher,
    staleTime: 1000 * 60 * 5,
  });
};
