"use client";

import RetroModal from "@/components/common/RetroModal";
import RetroButton from "@/components/common/RetroButton";
import RetroInput from "@/components/common/RetroInput";
import React, { useEffect, useState } from "react";
import IslandCreationModal from "@/components/IslandCreationModal";
import { useModal } from "@/hook/useModal";
import { socketManager } from "@/game/managers/socket-manager";
import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import { CreatedIslandResponse, LiveIslandItem } from "mmorntype";
import { EventWrapper } from "@/game/event/EventBus";
import Image from "next/image";

interface Island {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  countParticipants: number;
  maxMembers: number;
  tag?: string;
}

interface IslandListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIsland: (islandId: string, password?: string) => void;
  onCreateIsland: () => void;
  onJoinRandomIsland: () => void;
}

export default function IslandListModal({
  isOpen,
  onClose,
  // onSelectIsland,
  // onCreateIsland,
  onJoinRandomIsland,
}: IslandListModalProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"normal" | "random">("normal");
  const [islands, setIslands] = useState<Island[]>([]);

  const {
    isModalOpen: isCreationModalOpen,
    onOpen: onCreationModalOpen,
    onClose: onCreationModalClose,
  } = useModal();

  const tags = ["전체", "자유", "수다", "공부"];

  useEffect(() => {
    if (isOpen) {
      const socket = socketManager.connect(SOCKET_NAMESPACES.ISLAND);
      console.log(socket);
      socket?.emit("getActiveIslands", { page: 1, limit: 10 });
    }
  }, [isOpen]);

  useEffect(() => {
    const socket = socketManager.connect(SOCKET_NAMESPACES.ISLAND);

    const handleGetAvticeIslands = (data: LiveIslandItem[]) => {
      const islands: Island[] = data.map((i) => ({ ...i, tag: "자유" }));
      setIslands(islands);
    };
    const handleCreatedIsland = (data: CreatedIslandResponse) => {
      onCreationModalClose();
      onClose();
      EventWrapper.emitToGame("createdIsland", data.islandId);
    };
    socket?.on("getActiveIslands", handleGetAvticeIslands);
    socket?.on("createdIsland", handleCreatedIsland);

    return () => {
      socket?.off("getActiveIslands", handleGetAvticeIslands);
      socket?.off("createdIsland", handleCreatedIsland);
    };
  }, []);

  const onJoinIsland = (islandId: string) => {
    onCreationModalClose();
    onClose();
    EventWrapper.emitToGame("join-island", islandId);
  };

  return (
    <>
      <RetroModal isOpen={isOpen} onClose={onClose}>
        <div className="flex flex-col h-[80vh]">
          {/* 상단 */}
          <div className="shrink-0 mb-4">
            <h3 className="text-xl font-bold text-[#2a1f14] text-center mb-6">
              🏝️ 섬 선택
            </h3>

            {/* 탭 */}
            <div className="flex justify-center gap-4 mb-4">
              <button
                className={`px-4 py-2 rounded text-sm font-bold transition ${
                  activeTab === "normal"
                    ? "bg-[#bfae96] text-white border border-[#5c4b32]"
                    : "bg-[#f3ece1] text-[#5c4b32] border border-[#5c4b32]"
                }`}
                onClick={() => setActiveTab("normal")}
              >
                일반 섬
              </button>
              <button
                className={`px-4 py-2 rounded text-sm font-bold transition ${
                  activeTab === "random"
                    ? "bg-[#bfae96] text-white border border-[#5c4b32]"
                    : "bg-[#f3ece1] text-[#5c4b32] border border-[#5c4b32]"
                }`}
                onClick={() => setActiveTab("random")}
              >
                🌴 무인도 입장
              </button>
            </div>

            {/* 검색 및 태그 */}
            {activeTab === "normal" && (
              <div className="flex flex-wrap items-center gap-2">
                <RetroInput
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="섬 검색..."
                  className="w-full sm:w-60"
                />
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        setSelectedTag(selectedTag === tag ? null : tag)
                      }
                      className={`text-xs px-2 py-1 rounded border transition ${
                        selectedTag === tag
                          ? "bg-[#bfae96] text-white border-[#5c4b32]"
                          : "bg-[#f3ece1] text-[#5c4b32] border-[#5c4b32]"
                      } shadow-[2px_2px_0_#5c4b32] hover:bg-[#e8e0d0]`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 중단 */}
          <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0 border-t border-b border-[#d2c4d2] py-6">
            {activeTab === "normal" ? (
              islands.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
                  {islands.map((island) => (
                    <div
                      key={island.id}
                      className="flex flex-col border border-[#d2c4ad] rounded-[6px] bg-[#f9f5ec] shadow-[3px_3px_0_#8c7a5c] overflow-hidden"
                    >
                      <div className="relative w-full aspect-[4/3] bg-[#ebe3d4]">
                        <Image
                          src={island.coverImage}
                          fill
                          alt={island.name}
                          objectFit="cover"
                          className="image-render-pixel"
                        />
                        <div className="absolute bottom-2 right-2 bg-[#5c4b32] text-white text-xs px-2 py-1 rounded-[4px] shadow-[2px_2px_0_#3d2c1b]">
                          {island.countParticipants}/{island.maxMembers}명
                        </div>
                      </div>

                      <div className="p-4 flex flex-col flex-grow justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-[#3d2c1b] flex items-center gap-1">
                            {island.name}
                          </h4>
                          <p className="text-xs text-[#5c4b32] mt-2">
                            {island.description}
                          </p>
                        </div>

                        <RetroButton
                          className="w-full mt-4"
                          onClick={() => onJoinIsland(island.id)}
                        >
                          섬으로 이동
                        </RetroButton>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-sm text-[#5c4b32]">
                    🏝️ 최초의 섬을 만들어봐요!
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                <p className="text-lg text-[#5c4b32] mb-2 font-bold">
                  🌴 무인도에 표류하기
                </p>
                <p className="text-sm text-[#5c4b32] mb-6">
                  무인도에 표류해보세요!
                  <br />
                  이곳은 아무도 모르는 비밀스러운 섬입니다.
                  <br />
                  운명처럼 다른 생존자를 만날지도 몰라요.
                </p>
              </div>
            )}
          </div>

          {/* 하단 버튼 */}
          <div className="shrink-0 mt-6 flex justify-end">
            {activeTab === "normal" ? (
              <RetroButton onClick={onCreationModalOpen} className="w-36">
                + 새 섬 생성
              </RetroButton>
            ) : (
              <RetroButton onClick={onJoinRandomIsland} className="w-36">
                무인도 입장
              </RetroButton>
            )}
          </div>
        </div>
      </RetroModal>

      {/* 비밀번호 입력 모달 */}
      {/* <RetroConfirmModal
        isOpen={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onConfirm={handleConfirmPassword}
        title="비밀번호 입력"
        confirmText="입장하기"
        cancelText="취소"
      >
        <RetroInput
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          required
        />
      </RetroConfirmModal> */}

      <IslandCreationModal
        isOpen={isCreationModalOpen}
        onClose={onCreationModalClose}
        onCreateIsland={() => {}}
      />
    </>
  );
}
