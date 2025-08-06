"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Pawn from "@/components/common/Pawn";
import GlassCardAdvanced from "@/components/common/GlassCardAdvanced";
import GlassButton from "@/components/common/GlassButton";
import Logo from "@/components/common/Logo";
import Footer from "@/components/common/Footer";
import { PawnColor } from "@/constants/game/entities";
import { useGetMyProfile } from "@/hook/queries/useGetMyProfile";
import LoginModal from "@/components/login/LoginModal";
import { useModal } from "@/hook/useModal";
import { useLogout } from "@/hook/queries/useLogout";
import { removeItem } from "@/utils/persistence";
import Alert from "@/utils/alert";
import { QUERY_KEY as GET_MY_PROFILE_QUERY_KEY } from "@/hook/queries/useGetMyProfile";
import { Header } from "@/components/common/Header";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
import { getTimeOfDay, TimeOfDay } from "@/utils/date";

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
        greeting: "🌌 고요한 새벽이에요!",
        description: "새로운 하루가 시작되기 전 평화로운 시간",
      };
    case "morning":
      return {
        background: "linear-gradient(135deg, #a8c0ff 0%, #b8a9c9 100%)",
        textColor: "#f8f9ff",
        secondaryTextColor: "#e8eaff",
        borderColor: "#9ba3d0",
        shadowColor: "#7c8bc0",
        greeting: "🌅 좋은 아침이에요!",
        description: "새로운 하루가 시작되었어요",
      };
    case "afternoon":
      return {
        background: "linear-gradient(135deg, #f9f5ec 0%, #e8d5c4 100%)",
        textColor: "#5c4b32",
        secondaryTextColor: "#7a6144",
        borderColor: "#bfae96",
        shadowColor: "#8c7a5c",
        greeting: "☀️ 즐거운 오후에요!",
        description: "친구들과 함께 즐거운 시간을 보내세요",
      };
    case "evening":
      return {
        background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        textColor: "#5c4b32",
        secondaryTextColor: "#7a6144",
        borderColor: "#bfae96",
        shadowColor: "#8c7a5c",
        greeting: "🌆 아름다운 저녁이에요!",
        description: "하루를 마무리하며 친구들과 함께해요",
      };
    case "night":
      return {
        background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
        textColor: "#ecf0f1",
        secondaryTextColor: "#bdc3c7",
        borderColor: "#7f8c8d",
        shadowColor: "#2c3e50",
        greeting: "🌙 평화로운 밤이에요!",
        description: "별빛 아래에서 친구들과 이야기해요",
      };
    default:
      return {
        background: "linear-gradient(135deg, #f9f5ec 0%, #e8d5c4 100%)",
        textColor: "#5c4b32",
        secondaryTextColor: "#7a6144",
        borderColor: "#bfae96",
        shadowColor: "#8c7a5c",
        greeting: "🏝️ 섬으로 떠나",
        description: "친구를 만나요~!",
      };
  }
};

export default function MainPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: isLoadingProfile } = useGetMyProfile();

  const {
    isModalOpen: isOpenLoginModal,
    onOpen: onOpenLoginModal,
    onClose: onCloseLoginModal,
  } = useModal();
  const {
    isModalOpen: isOpenLogoutConfirmModal,
    onOpen: onOpenLogoutConfirmModal,
    onClose: onCloseLogoutConfirmModal,
  } = useModal();
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay());
  const [backgroundStyle, setBackgroundStyle] = useState(() =>
    getBackgroundStyle(timeOfDay)
  );
  const [backgroundPawns, setBackgroundPawns] = useState<
    Array<{
      id: number;
      color: PawnColor;
      top: number;
      left: number;
      size: number;
      opacity: number;
    }>
  >([]);
  const [isClient, setIsClient] = useState(false);
  const [randomPawnColor, setRandomPawnColor] = useState<PawnColor>("blue");
  const { mutate: logoutMutate } = useLogout(
    () => {
      if (window.Kakao && window.Kakao.isInitialized()) {
        window.Kakao.Auth.logout();
      }

      removeItem("access_token");
      removeItem("profile");

      // profile 관련 캐시만 초기화
      queryClient.removeQueries({ queryKey: [GET_MY_PROFILE_QUERY_KEY] });
      queryClient.setQueryData([GET_MY_PROFILE_QUERY_KEY], null);
    },
    () => Alert.error("로그아웃에 실패했어요.. 나중에 다시 시도해주세요.")
  );

  useEffect(() => {
    setIsClient(true);

    // 랜덤 Pawn 색상 생성
    const colors: PawnColor[] = [
      "blue",
      "purple",
      "red",
      "yellow",
      "forest_green",
      "orange",
    ];
    setRandomPawnColor(colors[Math.floor(Math.random() * colors.length)]);

    // 배경 Pawn들 생성
    setBackgroundPawns(generateFixedPawns());
  }, []);

  // 시간대 업데이트
  useEffect(() => {
    const updateTimeOfDay = () => {
      const newTimeOfDay = getTimeOfDay();
      if (newTimeOfDay !== timeOfDay) {
        setTimeOfDay(newTimeOfDay);
        setBackgroundStyle(getBackgroundStyle(newTimeOfDay));
        // 고정된 Pawn 배치는 시간대가 바뀌어도 동일하게 유지
      }
    };

    // 1분마다 시간대 체크
    const interval = setInterval(updateTimeOfDay, 60000);

    // 초기 체크
    updateTimeOfDay();

    return () => clearInterval(interval);
  }, [timeOfDay]);

  const handleMeetNewFriends = () => {
    router.push("/game");
  };

  const handlePlayWithFriends = () => {
    router.push("/my-islands");
  };

  const handleVisitStore = () => {
    router.push("/store");
  };

  const handleLogin = () => {
    onOpenLoginModal();
  };

  const handleLogout = () => {
    logoutMutate();
    onCloseLogoutConfirmModal();
  };

  return (
    <main
      className="w-full min-h-screen flex flex-col relative"
      style={{ background: backgroundStyle.background }}
      itemScope
      itemType="https://schema.org/WebPage"
    >
      {/* 배경 장식용 Pawn들 - 클라이언트에서만 렌더링 */}
      {isClient &&
        backgroundPawns.map((pawn) => (
          <div
            key={pawn.id}
            className="absolute pointer-events-none"
            style={{
              top: `${pawn.top}%`,
              left: `${pawn.left}%`,
              transform: `scale(${pawn.size})`,
              opacity: pawn.opacity,
            }}
          >
            <Pawn
              color={pawn.color}
              animation="idle"
              className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16"
            />
          </div>
        ))}

      <Header
        isLogin={!!profile}
        onOpenLogoutConfirmModal={onOpenLogoutConfirmModal}
        handleLogin={handleLogin}
        handleVisitStore={handleVisitStore}
        timeOfDay={timeOfDay}
      />

      <div className="w-full max-w-[1150px] mx-auto p-4">
        {/* 메인 컨텐츠 */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8 z-10 py-8">
          {/* 로고 */}
          <div className="mb-8">
            <Logo
              width="280px"
              timeOfDay={timeOfDay}
              textColor={backgroundStyle.textColor}
            />
          </div>

          {/* 메인 타이틀 */}
          <div className="text-center mb-12 px-4">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight min-h-[1.2em] transition-all duration-1000 ease-out break-keep"
              style={{ color: backgroundStyle.textColor }}
              itemProp="headline"
            >
              {isLoadingProfile
                ? ""
                : profile?.nickname
                ? `${profile.nickname}님, ${backgroundStyle.greeting}`
                : backgroundStyle.greeting}
            </h1>
            <h2
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold transition-all duration-1000 ease-out leading-tight break-keep"
              style={{ color: backgroundStyle.secondaryTextColor }}
              itemProp="description"
            >
              {backgroundStyle.description}
            </h2>
          </div>

          {/* 선택 카드들 */}
          <div className="flex flex-col gap-6 w-full max-w-md">
            <GlassCardAdvanced
              variant="tinted"
              blur="sm"
              shadow="xl"
              opacity={0.1}
              hover
              className="transition-all duration-1000"
            >
              {/* Coming Soon 오버레이 */}
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10 rounded-lg">
                <div className="flex flex-col items-center">
                  <Pawn color="blue" animation="build" className="w-[150px]" />
                  <h2 className="text-4xl font-bold mb-2 text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.6)]">
                    Coming Soon
                  </h2>
                  <p className="text-gray-200 text-lg">곧 만나요!</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 p-6">
                <div className="flex gap-2">
                  <Pawn
                    color="blue"
                    animation="run"
                    className="w-12 h-12"
                    paused
                  />
                  <Pawn
                    color="purple"
                    animation="run"
                    className="w-12 h-12"
                    paused
                  />
                  <Pawn
                    color="red"
                    animation="run"
                    className="w-12 h-12"
                    paused
                  />
                </div>
                <div className="text-center">
                  <h3
                    className="text-2xl font-bold mb-2 transition-colors duration-1000"
                    style={{ color: backgroundStyle.textColor }}
                  >
                    친구와 함께하기
                  </h3>
                  <p
                    className="text-sm mb-4 transition-colors duration-1000"
                    style={{ color: backgroundStyle.secondaryTextColor }}
                  >
                    내가 만든 섬에서 친구들과 함께
                  </p>
                  <GlassButton
                    onClick={() => {}}
                    variant="auto"
                    size="lg"
                    disabled
                    className="font-bold"
                    timeOfDay={timeOfDay}
                  >
                    시작하기
                  </GlassButton>
                </div>
              </div>
            </GlassCardAdvanced>
            <GlassButton
              onClick={handlePlayWithFriends}
              variant="auto"
              size="lg"
              className="font-bold"
              timeOfDay={timeOfDay}
            >
              시작하기
            </GlassButton>
            <GlassCardAdvanced
              variant="tinted"
              blur="sm"
              shadow="xl"
              opacity={0.1}
              hover
              className="transition-all duration-1000"
            >
              <div className="flex flex-col items-center gap-4 p-6">
                <div className="flex justify-center">
                  <Pawn
                    color={randomPawnColor}
                    animation="run"
                    className="w-12 h-12"
                  />
                </div>
                <div className="text-center">
                  <h3
                    className="text-2xl font-bold mb-2 transition-colors duration-1000"
                    style={{ color: backgroundStyle.textColor }}
                  >
                    새로운 친구 만나기
                  </h3>
                  <p
                    className="text-sm mb-4 transition-colors duration-1000"
                    style={{ color: backgroundStyle.secondaryTextColor }}
                  >
                    다른 사람들의 섬에서 새로운 친구를 만나요
                  </p>
                  <GlassButton
                    onClick={handleMeetNewFriends}
                    variant="auto"
                    size="lg"
                    blur="md"
                    opacity={0.2}
                    hover
                    className="font-bold"
                    timeOfDay={timeOfDay}
                  >
                    시작하기
                  </GlassButton>
                </div>
              </div>
            </GlassCardAdvanced>
          </div>

          {/* 하단 설명 */}
          <div
            className="text-center mt-8 text-base transition-colors duration-1000"
            style={{ color: backgroundStyle.secondaryTextColor }}
          >
            <p className="mb-2">✨ 친구들과 함께하는 평화로운 섬 여행</p>
            <p>🎮 새로운 모험과 추억을 만들어보세요</p>
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

      {/* 로그아웃 */}
      <LogoutConfirmModal
        isOpen={isOpenLogoutConfirmModal}
        onClose={onCloseLogoutConfirmModal}
        handleLogout={handleLogout}
      />

      {/* 로그인 모달 */}
      {isOpenLoginModal && (
        <LoginModal isOpen={isOpenLoginModal} onClose={onCloseLoginModal} />
      )}
    </main>
  );
}
