"use client";

import dynamic from "next/dynamic";
import LoadingPage from "@/components/common/LoadingPage";

const DynamicPlazaGameWrapper = dynamic(
  () => import("@/components/PlazaGameWrapper"),
  {
    ssr: false,
    loading: () => <LoadingPage />,
  }
);

export default function MainPage() {
  return (
    <main>
      <DynamicPlazaGameWrapper />
    </main>
  );
}
