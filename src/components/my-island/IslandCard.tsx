"use client";

import React, { memo } from "react";
import GlassCardAdvanced from "@/components/common/GlassCardAdvanced";
import GlassButton from "@/components/common/GlassButton";
import Pawn from "@/components/common/Pawn";
import { SERVICE_URL } from "@/constants/constants";
import ImageWithLoading from "@/components/common/ImageWithLoading";
import { getRandomPawnColor } from "@/utils/random";
import { PrivateIslandItem } from "mmorntype";

interface IslandCardProps {
  island: PrivateIslandItem;
  backgroundStyle: {
    textColor: string;
    secondaryTextColor: string;
    borderColor: string;
    shadowColor: string;
  };
  onJoinIsland: (islandId: string) => void;
  onShareLink: (shareLink: string) => void;
  timeOfDay: string;
}

function IslandCard({
  island,
  backgroundStyle,
  onJoinIsland,
  onShareLink,
  timeOfDay,
}: IslandCardProps) {
  const handleJoinClick = () => {
    onJoinIsland(island.id);
  };

  const handleShareClick = () => {
    onShareLink(
      window.location.origin
        ? `${window.location.origin}/islands/${island.urlPath}`
        : `${SERVICE_URL}/islands/${island.urlPath}`
    );
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
            <ImageWithLoading
              src={island.coverImage}
              alt={island.name}
              className="w-full h-full object-cover"
              fill
            />
          ) : (
            // 커버 이미지가 없는 경우 기존 UI
            <>
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <div className="text-center">
                  <div className="mb-2">
                    <Pawn
                      color={getRandomPawnColor()}
                      animation="idle"
                      paused
                      className="w-[60px] h-[60px] sm:w-16 sm:h-16 mx-auto"
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
          {/* 활성 여부 - 이미지 우측 상단 작은 원 */}
          <div
            className={`absolute top-2 right-2 w-4 h-4 rounded-full border-1 ${
              !island.isLive
                ? "bg-green-500 border-green-700"
                : "bg-gray-400 border-gray-600"
            }`}
            title={island.isLive ? "활성 섬" : "비활성 섬"}
            aria-label={island.isLive ? "활성 섬" : "비활성 섬"}
          />
        </div>

        {/* 섬 정보 */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-end items-center gap-3">
            {/* 공개 여부 */}
            <div
              className={`text-xs font-semibold px-2 py-0.5 rounded-full select-none ${
                island.isPublic
                  ? "bg-blue-200 text-blue-800"
                  : "bg-red-200 text-red-800"
              }`}
              title={island.isPublic ? "공개 섬" : "비공개 섬"}
              aria-label={island.isPublic ? "공개 섬" : "비공개 섬"}
            >
              {island.isPublic ? "🌐 공개" : "🔒 비공개"}
            </div>

            {/* 비밀번호 여부 - 있을 때만 */}
            {island.hasPassword && (
              <div
                className="text-xs font-semibold px-2 py-0.5 rounded-full select-none bg-yellow-100 text-yellow-800 flex items-center gap-1"
                title="비밀번호"
                aria-label="비밀번호"
              >
                <span>🔐</span> <span>비밀번호</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-lg sm:text-xl font-bold flex-1"
              style={{ color: backgroundStyle.textColor }}
            >
              {island.name}
            </h3>
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
            {/* 최대 인원 */}
            <span>👥 최대 {island.maxMembers}명</span>
          </div>

          {/* 버튼들 */}
          <div className="flex gap-2 mt-auto">
            <GlassButton
              onClick={handleJoinClick}
              variant="auto"
              timeOfDay={timeOfDay}
              className="flex-1 px-3 py-2 text-sm"
            >
              섬 입장
            </GlassButton>
            <GlassButton
              onClick={handleShareClick}
              variant="auto"
              timeOfDay={timeOfDay}
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
