"use client";

import LoadingPage from "@/components/common/LoadingPage";
import dynamic from "next/dynamic";
import { useState } from "react";

const DynamicGameWrapper = dynamic(() => import("@/components/GameWrapper"), {
  ssr: false,
});

export default function MainPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main>
      {isLoading ? <LoadingPage /> : null}
      <DynamicGameWrapper
        isLoading={isLoading}
        changeIsLoading={(state: boolean) => setIsLoading(state)}
      />
    </main>
  );
}
