"use client";

import Image from "next/image";
import { FiRotateCcw } from "react-icons/fi";
import RetroModal from "@/components/common/RetroModal";
import RetroButton from "@/components/common/RetroButton";
import RetroInput from "@/components/common/RetroInput";
import React, { useEffect, useRef, useState } from "react";
import IslandCreationModal from "@/components/IslandCreationModal";
import { useModal } from "@/hook/useModal";
import { socketManager } from "@/game/managers/socket-manager";
import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import {
  ClientToServer,
  CreatedIslandResponse,
  GetLiveIslandListReqeust,
  GetLiveIslandListResponse,
  ServerToClient,
} from "mmorntype";
import { EventWrapper } from "@/game/event/EventBus";
import { useKeydownClose } from "@/hook/useKeydownClose";
import { useGetAllTags } from "@/hook/queries/useGetAllTags";
import { Socket } from "socket.io-client";
import { usePageGroup } from "@/hook/usePageGroup";

interface Island {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  countParticipants: number;
  maxMembers: number;
  tags: string[];
}

interface IslandListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIsland: (islandId: string, password?: string) => void;
  onCreateIsland: () => void;
  onJoinRandomIsland: () => void;
}

const limit = 20;
const initialTag = "전체";

export default function IslandListModal({
  isOpen,
  onClose,
  // onSelectIsland,
  // onCreateIsland,
  onJoinRandomIsland,
}: IslandListModalProps) {
  useKeydownClose(onClose);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState<"normal" | "random">("normal");
  const [islands, setIslands] = useState<Island[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: tags } = useGetAllTags();
  const socketRef = useRef<Socket<ServerToClient, ClientToServer>>(null);

  const [query, setQuery] = useState<GetLiveIslandListReqeust>({
    page: 1,
    limit,
    tag: null,
  });
  const {
    pageGroupStart,
    visiblePageCount,
    getPageGroup,
    handleNextGroup,
    handlePrevGroup,
  } = usePageGroup(totalCount, query.page, limit);

  const onChangeQuery = <K extends keyof GetLiveIslandListReqeust>(
    key: K,
    value: GetLiveIslandListReqeust[K]
  ) => {
    setQuery({
      ...query,
      [key]: value,
    });
  };

  const {
    isModalOpen: isCreationModalOpen,
    onOpen: onCreationModalOpen,
    onClose: onCreationModalClose,
  } = useModal();

  useEffect(() => {
    if (isOpen) {
      const socket = socketManager.connect(SOCKET_NAMESPACES.ISLAND);
      if (socket) {
        socketRef.current = socket;
        console.log(socket);
        socket.emit("getActiveIslands", query);
      }
    }
  }, [isOpen, query]);

  useEffect(() => {
    const socket = socketManager.connect(SOCKET_NAMESPACES.ISLAND);

    const handleGetAvticeIslands = (data: GetLiveIslandListResponse) => {
      const { islands, count } = data;
      setIslands(islands);
      setTotalCount(count);
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
    EventWrapper.emitToGame("joinNormalIsland", islandId);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    const socket = socketManager.connect(SOCKET_NAMESPACES.ISLAND);
    socket?.emit("getActiveIslands", { page: 1, limit });

    setTimeout(() => {
      setIsRefreshing(false);
    }, 650);
  };

  useEffect(() => {
    console.log(query);
  }, [query]);

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
            <div className="flex justify-between">
              {activeTab === "normal" && (
                <div className="flex flex-wrap items-center gap-2">
                  <RetroInput
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="섬 검색..."
                    className="w-full sm:w-60 text-sm"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Tag
                      key={initialTag}
                      onClick={() =>
                        setQuery({
                          page: 1,
                          limit,
                          tag: null,
                        })
                      }
                      selectedTag={query.tag || initialTag}
                      name={initialTag}
                    />
                    {tags &&
                      tags.map((tag) => (
                        <Tag
                          key={tag.name}
                          onClick={() =>
                            setQuery({
                              page: 1,
                              limit,
                              tag: tag.name,
                            })
                          }
                          selectedTag={query.tag || initialTag}
                          name={tag.name}
                        />
                      ))}
                  </div>
                </div>
              )}

              {activeTab == "normal" ? (
                <button
                  onClick={handleRefresh}
                  className="ml-2 sm:ml-0 text-xs px-2 py-1 rounded border border-[#5c4b32] bg-[#f3ece1] text-[#5c4b32] shadow-[2px_2px_0_#5c4b32] hover:bg-[#e8e0d0] flex items-center gap-1"
                  title="섬 목록 새로고침"
                >
                  <FiRotateCcw
                    width={32}
                    hanging={32}
                    className={`transition-transform duration-100 ${
                      isRefreshing ? "animate-spinOnce" : ""
                    }`}
                  />
                  <p className="hidden sm:block">새로고침</p>
                </button>
              ) : null}
            </div>
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
                          <h4 className="text-sm font-bold text-[#3d2c1b] flex items-center gap-1 truncate">
                            {island.name}
                          </h4>

                          <p className="text-xs text-[#5c4b32] mt-2 truncate">
                            {island.description}
                          </p>

                          {island.tags && island.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {island.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] px-2 py-[2px] rounded-full bg-[#f3ece1] text-[#5c4b32] border border-[#8c7a5c] shadow-[1px_1px_0_#8c7a5c]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
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
          <div className="mt-6 flex justify-center">
            <div className="mt-4 flex justify-center gap-2 flex-wrap">
              {/* 이전 그룹 버튼 */}
              {pageGroupStart > 1 && (
                <button
                  onClick={handlePrevGroup}
                  className="px-3 py-1 rounded border text-sm font-bold bg-[#f3ece1] text-[#5c4b32] border-[#5c4b32] hover:bg-[#e8e0d0] shadow-[2px_2px_0_#5c4b32]"
                >
                  &lt;
                </button>
              )}

              {/* 현재 그룹 페이지 번호 */}
              {getPageGroup().map((page) => (
                <button
                  key={page}
                  onClick={() => onChangeQuery("page", page)}
                  className={`px-3 py-1 rounded border text-sm font-bold shadow-[2px_2px_0_#5c4b32] transition ${
                    query.page === page
                      ? "bg-[#bfae96] text-white border-[#5c4b32]"
                      : "bg-[#f3ece1] text-[#5c4b32] border-[#5c4b32] hover:bg-[#e8e0d0]"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* 다음 그룹 버튼 */}
              {pageGroupStart + visiblePageCount <=
                Math.ceil(totalCount / limit) && (
                <button
                  onClick={handleNextGroup}
                  className="px-3 py-1 rounded border text-sm font-bold bg-[#f3ece1] text-[#5c4b32] border-[#5c4b32] hover:bg-[#e8e0d0] shadow-[2px_2px_0_#5c4b32]"
                >
                  &gt;
                </button>
              )}
            </div>
            <div className="flex flex-1 justify-end">
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
        </div>
      </RetroModal>

      <IslandCreationModal
        isOpen={isCreationModalOpen}
        onClose={onCreationModalClose}
        onCreateIsland={() => {}}
      />
    </>
  );
}

interface TagProps {
  onClick: () => void;
  selectedTag: string;
  name: string;
}

const Tag = ({ onClick, selectedTag, name }: TagProps) => {
  return (
    <button
      key={name}
      onClick={onClick}
      className={`text-xs px-2 py-1 rounded border transition ${
        selectedTag === name
          ? "bg-[#bfae96] text-white border-[#5c4b32]"
          : "bg-[#f3ece1] text-[#5c4b32] border-[#5c4b32]"
      } shadow-[2px_2px_0_#5c4b32] hover:bg-[#e8e0d0]`}
    >
      {name}
    </button>
  );
};
