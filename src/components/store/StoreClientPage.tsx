"use client";

import dynamic from "next/dynamic";
import { useIsLogined } from "@/hook/useIsLogined";

const StoreGameWrapper = dynamic(
  () => import("@/components/StoreGameWrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-[#f9f5ec] text-[#5c4b32]">
        <div className="text-lg font-bold animate-pulse">상점 준비 중...</div>
      </div>
    ),
  }
);

const renderLoading = () => (
  <div className="w-full h-screen flex items-center justify-center bg-[#f9f5ec] text-[#5c4b32]">
    <div className="text-lg font-bold animate-pulse">상점 준비 중...</div>
  </div>
);

export default function StoreClientPage() {
  const { isLogined, isLoading } = useIsLogined();

  if (isLoading) {
    return renderLoading();
  }

  // 로그인하지 않은 사용자도 상점에 접근 가능
  return <StoreGameWrapper isLogined={isLogined} />;
}
