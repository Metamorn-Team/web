"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RetroButton from "@/components/common/RetroButton";
import RetroModal from "@/components/common/RetroModal";
import PaperCard from "@/components/common/PaperCard";
import Logo from "@/components/common/Logo";
import Pawn from "@/components/common/Pawn";
import Footer from "@/components/common/Footer";

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
  const router = useRouter();
  const [islands] = useState<Island[]>([
    {
      id: "1",
      name: "우리들의 평화로운 섬",
      description: "친구들과 함께 휴식을 취할 수 있는 평화로운 섬입니다.",
      playerCount: 3,
      maxPlayers: 10,
      isActive: true,
      shareLink: "https://livisland.com/island/1",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "모험가들의 섬",
      description: "모험과 탐험을 즐길 수 있는 신나는 섬입니다.",
      playerCount: 1,
      maxPlayers: 8,
      isActive: true,
      shareLink: "https://livisland.com/island/2",
      createdAt: "2024-01-10",
    },
  ]);
  const [showStoreModal, setShowStoreModal] = useState(false);

  const handleCreateIsland = () => {
    console.log("새 섬 생성");
  };

  const handleJoinIsland = (islandId: string) => {
    router.push(`/game?island=${islandId}`);
  };

  const handleShareLink = (shareLink: string) => {
    navigator.clipboard.writeText(shareLink);
    alert("링크가 클립보드에 복사되었습니다!");
  };

  const handleBackToMain = () => {
    router.push("/");
  };

  const handleVisitStore = () => {
    setShowStoreModal(true);
  };

  const handleStoreConfirm = () => {
    setShowStoreModal(false);
    router.push("/store");
  };

  return (
    <main className="w-full min-h-screen bg-[#f9f5ec] flex flex-col relative">
      {/* 배경 장식 */}
      <div className="absolute top-16 left-16 opacity-20">
        <Pawn color="blue" animation="idle" className="w-12 h-12" />
      </div>
      <div className="absolute top-24 right-20 opacity-20">
        <Pawn color="purple" animation="idle" className="w-14 h-14" />
      </div>

      {/* 상점 구경 버튼 */}
      <div className="absolute top-6 right-6 z-20">
        <RetroButton onClick={handleVisitStore} className="text-lg px-4 py-2">
          🏪 상점 구경
        </RetroButton>
      </div>

      {/* 헤더 */}
      <div className="flex items-center justify-between p-6 z-10">
        <RetroButton onClick={handleBackToMain} variant="ghost">
          ← 메인으로
        </RetroButton>
        <Logo width="180px" />
        <RetroButton onClick={handleCreateIsland}>새 섬 만들기</RetroButton>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 z-10 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#5c4b32] mb-4">
            내가 관리하는 섬
          </h1>
          <p className="text-lg text-[#7a6144]">
            친구들과 함께할 수 있는 나만의 섬들을 관리해보세요
          </p>
        </div>

        {/* 섬 목록 */}
        <div className="w-full max-w-4xl space-y-4">
          {islands.map((island) => (
            <PaperCard
              key={island.id}
              className="bg-paperBg bg-cover bg-center border-2 border-[#bfae96] shadow-[4px_4px_0_#8c7a5c] rounded-lg"
            >
              <div className="flex items-center justify-between p-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-2xl font-bold text-[#5c4b32]">
                      {island.name}
                    </h3>
                    <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                      활성
                    </span>
                  </div>
                  <p className="text-[#7a6144] mb-3">{island.description}</p>
                  <div className="flex items-center gap-6 text-sm text-[#8c7a5c]">
                    <span>
                      👥 {island.playerCount}/{island.maxPlayers}명
                    </span>
                    <span>📅 {island.createdAt}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <RetroButton
                    onClick={() => handleJoinIsland(island.id)}
                    className="px-4 py-2"
                  >
                    섬 입장
                  </RetroButton>
                  <RetroButton
                    onClick={() => handleShareLink(island.shareLink)}
                    variant="ghost"
                    className="px-4 py-2"
                  >
                    링크 공유
                  </RetroButton>
                </div>
              </div>
            </PaperCard>
          ))}

          {islands.length === 0 && (
            <PaperCard className="bg-paperBg bg-cover bg-center border-2 border-[#bfae96] shadow-[4px_4px_0_#8c7a5c] rounded-lg">
              <div className="text-center py-12">
                <div className="mb-4">
                  <Pawn
                    color="yellow"
                    animation="idle"
                    className="w-20 h-20 mx-auto opacity-50"
                  />
                </div>
                <h3 className="text-2xl font-bold text-[#5c4b32] mb-2">
                  아직 만든 섬이 없어요
                </h3>
                <p className="text-[#7a6144] mb-4">
                  첫 번째 섬을 만들어 친구들과 함께해보세요!
                </p>
                <RetroButton
                  onClick={handleCreateIsland}
                  className="text-lg px-6 py-3"
                >
                  첫 번째 섬 만들기
                </RetroButton>
              </div>
            </PaperCard>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center">
        <Footer className="text-[#7a6144] border-[#bfae96]/30" />
      </div>

      {/* 하단 장식 */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-30">
        <Pawn color="forest_green" animation="run" className="w-10 h-10" />
      </div>

      {/* 상점 모달 */}
      <RetroModal
        isOpen={showStoreModal}
        onClose={() => setShowStoreModal(false)}
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
            <RetroButton
              onClick={() => setShowStoreModal(false)}
              variant="ghost"
            >
              취소
            </RetroButton>
            <RetroButton onClick={handleStoreConfirm}>상점 가기</RetroButton>
          </div>
        </div>
      </RetroModal>
    </main>
  );
}
