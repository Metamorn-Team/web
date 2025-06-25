import StoreClientPage from "@/components/store/StoreClientPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "🎁 리아 상점",
  description: "귀여운 아이템을 골라보세요!",
};

export default function StorePage() {
  return <StoreClientPage />;
}
