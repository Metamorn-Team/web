"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlassCardAdvanced from "@/components/common/GlassCardAdvanced";
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
import IslandCard from "@/components/my-island/IslandCard";
import { getTimeOfDay } from "@/utils/date";

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

const getBackgroundStyle = (timeOfDay: string) => {
  switch (timeOfDay) {
    case "dawn":
      return {
        background: "linear-gradient(135deg, #ffd89b 0%, #19547b 100%)",
        textColor: "#2a1f14",
        secondaryTextColor: "#4a3c2a",
        borderColor: "#8c7a5c",
        shadowColor: "#5c4b32",
        greeting: "🏝️ 내가 관리하는 섬",
        description: "친구들과 함께할 수 있는 나만의 섬들을 관리해보세요",
      };
    case "morning":
      return {
        background: "linear-gradient(135deg, #a8c0ff 0%, #b8a9c9 100%)",
        textColor: "#f8f9ff",
        secondaryTextColor: "#e8eaff",
        borderColor: "#9ba3d0",
        shadowColor: "#7c8bc0",
        greeting: "🏝️ 내가 관리하는 섬",
        description: "친구들과 함께할 수 있는 나만의 섬들을 관리해보세요",
      };
    case "afternoon":
      return {
        background: "linear-gradient(135deg, #f9f5ec 0%, #e8d5c4 100%)",
        textColor: "#5c4b32",
        secondaryTextColor: "#7a6144",
        borderColor: "#bfae96",
        shadowColor: "#8c7a5c",
        greeting: "🏝️ 내가 관리하는 섬",
        description: "친구들과 함께할 수 있는 나만의 섬들을 관리해보세요",
      };
    case "evening":
      return {
        background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        textColor: "#5c4b32",
        secondaryTextColor: "#7a6144",
        borderColor: "#bfae96",
        shadowColor: "#8c7a5c",
        greeting: "🏝️ 내가 관리하는 섬",
        description: "친구들과 함께할 수 있는 나만의 섬들을 관리해보세요",
      };
    case "night":
      return {
        background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
        textColor: "#ecf0f1",
        secondaryTextColor: "#bdc3c7",
        borderColor: "#7f8c8d",
        shadowColor: "#2c3e50",
        greeting: "🏝️ 내가 관리하는 섬",
        description: "친구들과 함께할 수 있는 나만의 섬들을 관리해보세요",
      };
    default:
      return {
        background: "linear-gradient(135deg, #f9f5ec 0%, #e8d5c4 100%)",
        textColor: "#5c4b32",
        secondaryTextColor: "#7a6144",
        borderColor: "#bfae96",
        shadowColor: "#8c7a5c",
        greeting: "🏝️ 내가 관리하는 섬",
        description: "친구들과 함께할 수 있는 나만의 섬들을 관리해보세요",
      };
  }
};

interface Island {
  id: string;
  name: string;
  description: string;
  playerCount: number;
  maxPlayers: number;
  isActive: boolean;
  shareLink: string;
  createdAt: string;
}

export default function MyIslandsPage() {
  const limit = 6;
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
  const [backgroundStyle, setBackgroundStyle] = useState(
    getBackgroundStyle(timeOfDay)
  );
  const [fixedPawns] = useState(generateFixedPawns());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [islands] = useState<Island[]>(
    Array.from({ length: 12 }, (_, i) => ({
      id: i.toString(),
      name: "우리들의 평화로운 섬",
      description: "친구들과 함께 휴식을 취할 수 있는 평화로운 섬입니다.",
      playerCount: 3,
      maxPlayers: 10,
      isActive: true,
      shareLink: "https://livisland.com/island/1",
      createdAt: "2024-01-15",
    }))
  );

  useEffect(() => {
    const updateTimeOfDay = () => {
      const newTimeOfDay = getTimeOfDay();
      if (newTimeOfDay !== timeOfDay) {
        setTimeOfDay(newTimeOfDay);
        setBackgroundStyle(getBackgroundStyle(newTimeOfDay));
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

  const handleJoinIsland = (islandId: string) => {
    router.push(`/game?island=${islandId}`);
  };

  const handleShareLink = (shareLink: string) => {
    navigator.clipboard.writeText(shareLink);
    Alert.info("링크가 클립보드에 복사되었습니다!");
  };

  const handleBackToMain = () => {
    router.push("/");
  };

  const handleVisitStore = () => {
    router.push("/store");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isError) {
    return <div>Error</div>;
  }

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
              className="text-lg px-6 py-3"
            >
              🏝️ 새 섬 만들기
            </GlassButton>
          </div>

          {/* 섬 목록 */}
          <div className="w-full max-w-6xl">
            {isLoading && (
              <DotLoader
                loadingText="섬을 찾는 중..."
                className="text-center text-2xl font-bold mt-10"
              />
            )}
            {!isLoading && data?.islands && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {data.islands.map((island) => (
                    <IslandCard
                      key={island.id}
                      island={island}
                      backgroundStyle={backgroundStyle}
                      onJoinIsland={handleJoinIsland}
                      onShareLink={handleShareLink}
                    />
                  ))}
                </div>

                {/* 페이징 */}
                {data.count && (
                  <div className="mt-8 ">
                    <Pagination
                      currentPage={page}
                      totalPages={Math.ceil(data.count / limit)}
                      onPageChange={handlePageChange}
                      className="justify-center"
                    />
                  </div>
                )}
              </>
            )}

            {islands.length === 0 && (
              <div className="col-span-1 lg:col-span-2">
                <GlassCardAdvanced
                  className="border-2 shadow-lg"
                  style={{
                    borderColor: backgroundStyle.borderColor,
                    boxShadow: `0 4px 6px -1px ${backgroundStyle.shadowColor}40`,
                  }}
                >
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <Pawn
                        color="yellow"
                        animation="idle"
                        className="w-16 h-16 sm:w-20 sm:h-20 mx-auto opacity-50"
                      />
                    </div>
                    <h3
                      className="text-xl sm:text-2xl font-bold mb-2"
                      style={{ color: backgroundStyle.textColor }}
                    >
                      아직 만든 섬이 없어요
                    </h3>
                    <p
                      className="mb-4"
                      style={{ color: backgroundStyle.secondaryTextColor }}
                    >
                      첫 번째 섬을 만들어 친구들과 함께해보세요!
                    </p>
                    <GlassButton
                      onClick={handleCreateIsland}
                      className="text-lg px-6 py-3"
                    >
                      첫 번째 섬 만들기
                    </GlassButton>
                  </div>
                </GlassCardAdvanced>
              </div>
            )}
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
