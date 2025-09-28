import { http } from "@/api/http";
import { CreatePaymentRequest, GetPaymentStatusResponse } from "mmorntype";

export const startPayment = async (body: CreatePaymentRequest) => {
  return await http.post("/payments", body);
};

export const getPaymentStatus = async (merchantPaymentId: string) => {
  const response = await http.get<GetPaymentStatusResponse>(
    "/payments/status",
    {
      params: { merchantPaymentId },
    }
  );
  return response.data;
};
