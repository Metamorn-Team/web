"use client";

import ErrorFallback from "@/components/common/ErrorFallback";
import LoadingPage from "@/components/common/LoadingPage";
import { useGetPrivateIslandId } from "@/hook/queries/useGetPrivateIslandId";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PasswordPage from "./PasswordPage";
import { useIslandStore } from "@/stores/useIslandStore";
import GameWrapper from "@/components/GameWrapper";

export default function Wrapper() {
  const router = useRouter();
  const { setIsland } = useIslandStore();
  const { path } = useParams();
  const {
    data: island,
    isLoading,
    isError,
    isSuccess,
  } = useGetPrivateIslandId(path as string);
  const [isGameLoading, setIsGameLoading] = useState(true);

  useEffect(() => {
    if (isSuccess && !island.hasPassword) {
      setIsland(island.id, "PRIVATE");
    }
  }, [isSuccess, path, router, setIsland, island]);

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
    <GameWrapper
      type="private"
      isLoading={isGameLoading}
      changeIsLoading={(state) => setIsGameLoading(state)}
    />
  );
}
