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
  const { setIsland, id } = useIslandStore();
  const { path } = useParams();
  const { isLogined, isLoading: isLoginLoading } = useIsLogined();
  const {
    data: island,
    isLoading,
    isError,
    isSuccess,
  } = useGetPrivateIslandId(path as string, isLogined);

  const [isGameLoading, setIsGameLoading] = useState(true);
  const [isIslandReady, setIsIslandReady] = useState(false);
  const [showWrapper, setShowWrapper] = useState(false);

  useEffect(() => {
    if (isSuccess && island && !island.hasPassword) {
      setIsland(island.id, "PRIVATE");

      // island store 설정 후 약간의 지연을 두어 완전히 초기화되도록 함
      setTimeout(() => {
        setIsIslandReady(true);
      }, 100);
    }
  }, [isSuccess, island, setIsland]);

  useEffect(() => {
    // isIslandReady가 true가 된 후에만 wrapper를 보여줌
    if (isIslandReady) {
      setTimeout(() => {
        setShowWrapper(true);
      }, 50); // 추가 지연으로 store 상태 안정화
    }
  }, [isIslandReady]);

  if (isLoginLoading) {
    return <LoadingPage message="정보를 확인하는 중" />;
  }

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

  if (island?.hasPassword) {
    return <PasswordPage islandId={island.id} />;
  }

  // hasPassword 없는 경우 → island store 설정 완료될 때까지 대기
  if (!isIslandReady || !id) {
    return <LoadingPage message="섬 정보를 불러오는 중" />;
  }

  return (
    <>
      {isGameLoading ? <LoadingPage message="섬으로 가는 중" /> : null}

      {showWrapper && (
        <PrivateIslandGameWrapper
          isLoading={isGameLoading}
          changeIsLoading={setIsGameLoading}
        />
      )}
    </>
  );
}
