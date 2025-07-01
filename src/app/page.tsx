"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Pawn from "@/components/common/Pawn";

import RetroModal from "@/components/common/RetroModal";

import GlassCardAdvanced from "@/components/common/GlassCardAdvanced";
import GlassButton from "@/components/common/GlassButton";
import Logo from "@/components/common/Logo";
import Footer from "@/components/common/Footer";
import { PawnColor } from "@/constants/game/entities";

// Pawn 색상 배열
const PAWN_COLORS: PawnColor[] = [
  "blue",
  "purple",
  "red",
  "yellow",
  "forest_green",
  "orange",
];

// 랜덤 Pawn 생성 함수
const generateRandomPawns = (count: number = 6) => {
  const pawns = [];
  for (let i = 0; i < count; i++) {
    pawns.push({
      id: i,
      color: PAWN_COLORS[Math.floor(Math.random() * PAWN_COLORS.length)],
      top: Math.random() * 70 + 10, // 10% ~ 80%
      left: Math.random() * 80 + 10, // 10% ~ 90%
      size: Math.random() * 0.4 + 0.8, // 0.8 ~ 1.2 배율
      opacity: Math.random() * 0.3 + 0.1, // 0.1 ~ 0.4
    });
  }
  return pawns;
};

// 시간대별 배경 설정
const getTimeOfDay = ():
  | "dawn"
  | "morning"
  | "afternoon"
  | "evening"
  | "night" => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 6) return "dawn";
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
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

  const [showStoreModal, setShowStoreModal] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState("night");
  const [backgroundStyle, setBackgroundStyle] = useState(
    getBackgroundStyle("night")
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

  // 클라이언트 사이드에서만 랜덤 값들 생성
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
    setBackgroundPawns(generateRandomPawns(6));
  }, []);

  // 시간대 업데이트
  useEffect(() => {
    const updateTimeOfDay = () => {
      const newTimeOfDay = getTimeOfDay();
      if (newTimeOfDay !== timeOfDay) {
        setTimeOfDay(newTimeOfDay);
        setBackgroundStyle(getBackgroundStyle(newTimeOfDay));
        // 시간대가 바뀔 때마다 Pawn들도 새로 배치
        setBackgroundPawns(generateRandomPawns(6));
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

  const handleVisitStore = () => {
    setShowStoreModal(true);
  };

  const handleStoreConfirm = () => {
    setShowStoreModal(false);
    router.push("/store");
  };

  return (
    <main
      className="w-full min-h-screen flex flex-col relative transition-all duration-1000"
      style={{ background: backgroundStyle.background }}
    >
      {/* 배경 장식용 Pawn들 - 클라이언트에서만 렌더링 */}
      {isClient &&
        backgroundPawns.map((pawn) => (
          <div
            key={pawn.id}
            className="absolute pointer-events-none transition-all duration-1000"
            style={{
              top: `${pawn.top}%`,
              left: `${pawn.left}%`,
              transform: `scale(${pawn.size})`,
              opacity: pawn.opacity,
            }}
          >
            <Pawn color={pawn.color} animation="idle" className="w-16 h-16" />
          </div>
        ))}

      {/* 상점 구경 버튼 */}
      <div className="absolute top-6 right-6 z-20">
        <GlassButton
          onClick={handleVisitStore}
          variant="auto"
          size="md"
          hover
          timeOfDay={timeOfDay}
        >
          🎁 리아 상점
        </GlassButton>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 z-10 px-4 py-8">
        {/* 로고 */}
        <div className="mb-8">
          <Logo
            width="280px"
            timeOfDay={timeOfDay}
            textColor={backgroundStyle.textColor}
          />
        </div>

        {/* 메인 타이틀 */}
        <div className="text-center mb-12">
          <h1
            className="text-5xl font-bold mb-4 transition-colors duration-1000"
            style={{ color: backgroundStyle.textColor }}
          >
            {backgroundStyle.greeting}
          </h1>
          <h2
            className="text-3xl font-bold transition-colors duration-1000"
            style={{ color: backgroundStyle.secondaryTextColor }}
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

      {/* 상점 모달 */}
      <RetroModal
        isOpen={showStoreModal}
        onClose={() => setShowStoreModal(false)}
        className="!max-w-[400px]"
      >
        <div className="text-center">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-[#5c4b32] mb-2">
              🎁 리아 상점
            </h2>
            <p className="text-[#7a6144]">귀여운 아이템들을 만나보세요!</p>
          </div>

          <div className="flex justify-center mb-6">
            <Pawn color="orange" animation="idle" className="w-20 h-20" />
          </div>

          <div className="flex gap-4 justify-center">
            <GlassButton
              onClick={() => setShowStoreModal(false)}
              variant="auto"
              size="md"
              hover
              timeOfDay={"evening"}
            >
              취소
            </GlassButton>
            <GlassButton
              onClick={handleStoreConfirm}
              variant="auto"
              size="md"
              hover
              timeOfDay={"evening"}
            >
              상점 가기
            </GlassButton>
          </div>
        </div>
      </RetroModal>
    </main>
  );
}
