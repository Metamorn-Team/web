"use client";

import ErrorFallback from "@/components/common/ErrorFallback";
import LoadingPage from "@/components/common/LoadingPage";
import { useGetPrivateIslandId } from "@/hook/queries/useGetPrivateIslandId";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PasswordPage from "./PasswordPage";
import { useIslandStore } from "@/stores/useIslandStore";
import { useIsLogined } from "@/hook/useIsLogined";
import LoginModal from "@/components/login/LoginModal";
import PrivateIslandGameWrapper from "@/components/PrivateIslandGameWrapper";

export default function Wrapper() {
  const router = useRouter();
  const { setIsland } = useIslandStore();
  const { path } = useParams();
  const { isLogined, isLoading: isLoginLoading } = useIsLogined();
  const {
    data: island,
    isLoading,
    isError,
    isSuccess,
  } = useGetPrivateIslandId(path as string, isLogined);
  const [isGameLoading, setIsGameLoading] = useState(true);

  useEffect(() => {
    if (isSuccess && !island.hasPassword) {
      setIsland(island.id, "PRIVATE");
    }
  }, [isSuccess, path, router, setIsland, island]);

  if (isLoginLoading) return <LoadingPage message="정보를 확인하는 중" />;
  if (!isLogined) {
    return <LoginModal isOpen={true} onClose={() => {}} />;
  }

  if (isLoading) {
    return <LoadingPage message="섬을 찾는 중" />;
  }

  if (isError) {
    return (
      <ErrorFallback
        message="섬을 찾지 못 했어요.."
        size="l"
        onClick={() => {
          router.push("/islands");
        }}
        buttonText="돌아가기"
      />
    );
  }

  return island?.hasPassword ? (
    <PasswordPage islandId={island.id} />
  ) : (
    <>
      {isGameLoading ? <LoadingPage message="섬으로 가는 중" /> : null}
      <PrivateIslandGameWrapper
        isLoading={isGameLoading}
        changeIsLoading={(state) => setIsGameLoading(state)}
      />
    </>
  );
}
