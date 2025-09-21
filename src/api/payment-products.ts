import { http } from "@/api/http";
import { GoldChargePaymentProductListResponse } from "mmorntype";

export const getGoldChargePaymentProduct =
  async (): Promise<GoldChargePaymentProductListResponse> => {
    const response = await http.get<GoldChargePaymentProductListResponse>(
      "/payment-products/gold-charge"
    );
    return response.data;
  };
