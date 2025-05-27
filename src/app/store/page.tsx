"use client";

import dynamic from "next/dynamic";

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

export default function StorePage() {
  return <StoreGameWrapper />;
}
