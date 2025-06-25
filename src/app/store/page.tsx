"use client";

import { getMyProfile } from "@/api/user";
import StoreRedirectPage from "@/components/store/StoreRedirectPage";
import { AxiosError } from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const renderLoading = () => (
  <div className="w-full h-screen flex items-center justify-center bg-[#f9f5ec] text-[#5c4b32]">
    <div className="text-lg font-bold animate-pulse">상점 준비 중...</div>
  </div>
);

const StoreGameWrapper = dynamic(
  () => import("@/components/StoreGameWrapper"),
  {
    ssr: false,
    loading: () => renderLoading(),
  }
);

export default function StorePage() {
  const [isLogined, setIsLogined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkLogin = async () => {
    try {
      await getMyProfile();
      setIsLogined(true);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 401) {
          setIsLogined(false);
        }
      }
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  if (isLoading) {
    return renderLoading();
  }

  if (!isLoading && !isLogined) {
    return <StoreRedirectPage />;
  }

  return <StoreGameWrapper />;
}
