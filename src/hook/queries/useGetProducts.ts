import { getProducts } from "@/api/product";
import { useQuery } from "@tanstack/react-query";
import { GetProductListRequest } from "mmorntype";

const QUERY_KEY = "products";

export const useGetProducts = (query: GetProductListRequest) => {
  const { page } = query;
  const fetcher = () => getProducts(query);

  return useQuery({
    queryKey: [QUERY_KEY, page],
    queryFn: fetcher,
    staleTime: 1000 * 60 * 5,
  });
};
