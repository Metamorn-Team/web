"use client";

import React, { memo } from "react";
import Image from "next/image";
import GlassCardAdvanced from "@/components/common/GlassCardAdvanced";
import GlassButton from "@/components/common/GlassButton";
import Pawn from "@/components/common/Pawn";
import { formatBoardDate } from "@/utils/date";
import { SERVICE_URL } from "@/constants/constants";

interface IslandCardProps {
  island: {
    id: string;
    name: string;
    description: string | null;
    coverImage?: string | null;
    isLive: boolean;
    maxMembers: number;
    createdAt: string;
    urlPath: string;
  };
  backgroundStyle: {
    textColor: string;
    secondaryTextColor: string;
    borderColor: string;
    shadowColor: string;
  };
  onJoinIsland: (islandId: string) => void;
  onShareLink: (shareLink: string) => void;
}

function IslandCard({
  island,
  backgroundStyle,
  onJoinIsland,
  onShareLink,
}: IslandCardProps) {
  const handleJoinClick = () => {
    onJoinIsland(island.id);
  };

  const handleShareClick = () => {
    onShareLink(`${SERVICE_URL}/islands/${island.urlPath}`);
  };

  return (
    <GlassCardAdvanced
      className="border-2 shadow-lg h-full"
      style={{
        borderColor: backgroundStyle.borderColor,
        boxShadow: `0 4px 6px -1px ${backgroundStyle.shadowColor}40`,
      }}
    >
      <div className="flex flex-col h-full p-4 sm:p-6">
        {/* 섬 이미지 */}
        <div className="relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-green-100 aspect-[4/3]">
          {island.coverImage ? (
            // 커버 이미지가 있는 경우
            <>
              <Image
                src={island.coverImage}
                alt={island.name}
                className="w-full h-full object-cover"
                fill
              />
              {/* 플레이어 수 표시 */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                {island.maxMembers}명
              </div>
            </>
          ) : (
            // 커버 이미지가 없는 경우 기존 UI
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-2">
                    <Pawn
                      color="blue"
                      animation="idle"
                      className="w-12 h-12 sm:w-16 sm:h-16 mx-auto"
                    />
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-600">
                    {island.name}
                  </div>
                </div>
              </div>
              {/* 플레이어 수 표시 */}
              {/* <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                {island.maxMembers}명
              </div> */}
            </>
          )}
        </div>

        {/* 섬 정보 */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-lg sm:text-xl font-bold flex-1"
              style={{ color: backgroundStyle.textColor }}
            >
              {island.name}
            </h3>
            {island.isLive && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full ml-2">
                활성
              </span>
            )}
            {!island.isLive && (
              <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded-full ml-2">
                비활성
              </span>
            )}
          </div>

          <p
            className="text-sm mb-4 flex-1"
            style={{
              color: backgroundStyle.secondaryTextColor,
            }}
          >
            {island.description || " "}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span>📅 {formatBoardDate(island.createdAt)}</span>
            <span>👥 최대 {island.maxMembers}명</span>
          </div>

          {/* 버튼들 */}
          <div className="flex gap-2 mt-auto">
            <GlassButton
              onClick={handleJoinClick}
              className="flex-1 px-3 py-2 text-sm"
            >
              섬 입장
            </GlassButton>
            <GlassButton
              onClick={handleShareClick}
              variant="ghost"
              className="px-3 py-2 text-sm"
            >
              공유
            </GlassButton>
          </div>
        </div>
      </div>
    </GlassCardAdvanced>
  );
}

export default memo(IslandCard);
