import { getGoldChargePaymentProduct } from "@/api/payment-products";
import { useQuery } from "@tanstack/react-query";

interface UseGetAllGoldChargePaymentProductProps {
  enabled: boolean;
}

export const QUERY_KEY = "gold-charge-payment-products";

export const useGetAllGoldPaymentProduct = ({
  enabled = true,
}: UseGetAllGoldChargePaymentProductProps) => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getGoldChargePaymentProduct,
    staleTime: 1000 * 60 * 60 * 3,
    enabled,
  });
};
