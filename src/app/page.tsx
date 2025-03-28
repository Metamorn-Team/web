"use client";

import dynamic from "next/dynamic";
import LoadingPage from "@/components/LoadingPage";

// PlazaGameWrapper 컴포넌트를 동적으로 임포트
const DynamicPlazaGameWrapper = dynamic(
  () => import("@/components/PlazaGameWrapper"),
  {
    ssr: false,
    loading: () => <LoadingPage />,
  }
);

export default function MainPage() {
  return (
    <div>
      <DynamicPlazaGameWrapper />
    </div>
  );
}
