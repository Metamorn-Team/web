import { http } from "@/api/http";
import { GetPaymentStatusResponse } from "mmorntype";

export const getPaymentStatus = async (merchantPaymentId: string) => {
  const response = await http.get<GetPaymentStatusResponse>(
    "/payments/status",
    {
      params: { merchantPaymentId },
    }
  );
  return response.data;
};
