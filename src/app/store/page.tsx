import StoreClientPage from "@/components/store/StoreClientPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "🎁 리아 상점",
  description: "귀여운 아이템을 골라보세요!",
  keywords: ["리아", "메타버스", "픽셀", "아이템", "상점", "리브아일랜드"],
  robots: "index, follow",
};

export default function StorePage() {
  return <StoreClientPage />;
}
