"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlassButton from "@/components/common/GlassButton";
import Pawn from "@/components/common/Pawn";
import Footer from "@/components/common/Footer";
import { PawnColor } from "@/constants/game/entities";
import { useGetMyProfile } from "@/hook/queries/useGetMyProfile";
import { useLogout } from "@/hook/queries/useLogout";
import { useQueryClient } from "@tanstack/react-query";
import Alert from "@/utils/alert";
import { Header } from "@/components/common/Header";
import CreateIslandModal from "@/components/my-island/CreateIslandModal";
import { useGetPaginatedMyPrivateIsland } from "@/hook/queries/useGetPaginatedPrivateIsland";
import {
  Order,
  SortBy,
} from "mmorntype/dist/src/domain/types/private-island.types";
import { DotLoader } from "@/components/common/DotLoader";
import Pagination from "@/components/common/Pagination";
import { getTimeOfDay } from "@/utils/date";
import { PATH } from "@/constants/path";
import { getBackgroundStyle } from "@/styles/time-of-date-style";
import IslandCardList from "@/components/my-island/IslandCardList";
import ErrorFallback from "@/components/common/ErrorFallback";

// 고정된 Pawn 배치 정의
const FIXED_PAWNS = [
  {
    id: 1,
    color: "blue" as PawnColor,
    top: 25,
    left: 20,
    size: 0.8,
    opacity: 0.25,
  },
  {
    id: 2,
    color: "purple" as PawnColor,
    top: 35,
    left: 65,
    size: 0.9,
    opacity: 0.2,
  },
  {
    id: 3,
    color: "red" as PawnColor,
    top: 55,
    left: 15,
    size: 0.7,
    opacity: 0.3,
  },
  {
    id: 4,
    color: "yellow" as PawnColor,
    top: 65,
    left: 70,
    size: 0.85,
    opacity: 0.15,
  },
  {
    id: 5,
    color: "forest_green" as PawnColor,
    top: 80,
    left: 25,
    size: 0.8,
    opacity: 0.2,
  },
  {
    id: 6,
    color: "orange" as PawnColor,
    top: 90,
    left: 60,
    size: 0.9,
    opacity: 0.25,
  },
];

// 고정된 Pawn 생성 함수
const generateFixedPawns = () => {
  return FIXED_PAWNS;
};

export default function Wrapper() {
  const limit = 12;
  const [page, setPage] = useState(1);
  // TODO 정렬 기준 추가되면 set 함수 추가
  const [order] = useState<Order>("desc");
  const [sortBy] = useState<SortBy>("createdAt");
  const { data, isLoading, isError } = useGetPaginatedMyPrivateIsland({
    page,
    limit,
    order,
    sortBy,
  });

  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profile } = useGetMyProfile();
  const logoutMutation = useLogout(
    () => {
      queryClient.clear();
      router.push("/");
    },
    () => {
      Alert.error("로그아웃 중 오류가 발생했습니다.");
    }
  );

  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  const backgroundStyle = getBackgroundStyle(timeOfDay);
  const [fixedPawns] = useState(generateFixedPawns());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const updateTimeOfDay = () => {
      const newTimeOfDay = getTimeOfDay();
      if (newTimeOfDay !== timeOfDay) {
        setTimeOfDay(newTimeOfDay);
      }
    };

    // 초기 설정
    updateTimeOfDay();

    // 1분마다 시간대 확인
    const interval = setInterval(updateTimeOfDay, 60000);

    return () => clearInterval(interval);
  }, [timeOfDay]);

  // 새로고침 시 스크롤 위치 초기화
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleCreateIsland = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleBackToMain = () => {
    router.push(PATH.HOME);
  };

  const handleVisitStore = () => {
    router.push(PATH.STORE);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <main
      className="w-full min-h-screen flex flex-col relative break-keep"
      style={{ background: backgroundStyle.background }}
    >
      {/* 고정된 배경 Pawn들 */}
      {fixedPawns.map((pawn) => (
        <div
          key={pawn.id}
          className="absolute animate-fade-in"
          style={{
            top: `${pawn.top}%`,
            left: `${pawn.left}%`,
            opacity: pawn.opacity,
            transform: `scale(${pawn.size})`,
            animationDelay: `${pawn.id * 0.2}s`,
          }}
        >
          <Pawn
            color={pawn.color}
            animation="idle"
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20"
          />
        </div>
      ))}

      <Header
        isLogin={!!profile}
        onOpenLogoutConfirmModal={handleLogout}
        handleLogin={() => {}}
        handleVisitStore={handleVisitStore}
        handleBackToMain={handleBackToMain}
        timeOfDay={timeOfDay}
      />

      <div className="w-full max-w-[1150px] mx-auto px-4">
        {/* 메인 컨텐츠 */}
        <div className="flex-1 flex flex-col items-center justify-center z-10 py-8">
          <div className="text-center mb-8">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight min-h-[1.2em] transition-all duration-1000 ease-out break-keep"
              style={{ color: backgroundStyle.textColor }}
            >
              {backgroundStyle.greeting}
            </h1>
            <h2
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold transition-all duration-1000 ease-out leading-tight break-keep"
              style={{ color: backgroundStyle.secondaryTextColor }}
            >
              {backgroundStyle.description}
            </h2>
          </div>

          {/* 섬 생성 버튼 */}
          <div className="w-full max-w-6xl mb-6">
            <GlassButton
              onClick={handleCreateIsland}
              variant="auto"
              timeOfDay={timeOfDay}
              className="text-lg px-6 py-3"
            >
              🏝️ 새 섬 만들기
            </GlassButton>
          </div>

          {/* 섬 목록 */}
          <div className="w-full max-w-6xl">
            {isLoading && <DotLoader loadingText="불러오는 중" />}

            {!isLoading && isError && (
              <ErrorFallback
                message="섬 목록을 불러오는 중 오류가 발생했어요."
                size="l"
                backgroundColor="bg-transparent"
                fullScreen={false}
              />
            )}

            {!isLoading && data?.islands && (
              <>
                <IslandCardList islands={data.islands} timeOfDay={timeOfDay} />
              </>
            )}

            {data?.islands.length === 0 && (
              <ErrorFallback
                message="섬을 만들어보아요!"
                size="l"
                backgroundColor="bg-transparent"
                fullScreen={false}
              />
            )}

            {/* 페이징 */}
            {data?.count && data.count > 0 ? (
              <div className="mt-8 ">
                <Pagination
                  currentPage={page}
                  totalPages={Math.ceil(data.count / limit)}
                  onPageChange={handlePageChange}
                  className="justify-center"
                />
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center">
          <Footer
            theme={
              timeOfDay === "night" || timeOfDay === "morning"
                ? "dark"
                : "default"
            }
          />
        </div>
      </div>

      {/* 섬 생성 모달 */}
      <CreateIslandModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={() => {
          // 섬 생성 성공 후 처리
          console.log("섬 생성 완료");
        }}
      />
    </main>
  );
}
