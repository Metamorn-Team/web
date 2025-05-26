"use client";

import Image from "next/image";
import { FaUser } from "react-icons/fa";
import RetroModal from "@/components/common/RetroModal";
import { useIslandStore } from "@/stores/useIslandStore";
import { useGetIslandInfo } from "@/hook/queries/useGetIslandInfo";

interface IslandInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IslandInfoModal({
  isOpen,
  onClose,
}: IslandInfoModalProps) {
  const currentIslandId = useIslandStore((state) => state.id);
  console.log("currentIslandId", currentIslandId);

  return (
    <RetroModal isOpen={isOpen} onClose={onClose} className="!max-w-xl">
      <div className="p-4 space-y-4">
        {currentIslandId ? (
          <NormalIslandInfo islandId={currentIslandId} />
        ) : (
          <DesertedIslandInfo />
        )}
      </div>
    </RetroModal>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="w-24 font-semibold shrink-0">{label}:</span>
      <span className="flex-1 break-words">{value}</span>
    </div>
  );
}

function NormalIslandInfo({ islandId }: { islandId: string }) {
  const { data: island, isLoading } = useGetIslandInfo(islandId);

  if (isLoading) {
    return <div className="text-[#3d2c1b]">로딩 중...</div>;
  }

  if (!island) {
    return <div className="text-[#3d2c1b]">무언가 잘못된 섬이에요..</div>;
  }

  return (
    <div className="text-[#3d2c1b] space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        🏝️ 참여 중인 섬 정보
      </h2>

      <div className="flex justify-center">
        <div className="relative mt-4 flex justify-center items-center max-w-[330px] w-2/3 aspect-[4/3] border border-[#8c7a5c] rounded-lg">
          <Image
            src={island.coverImage}
            alt="섬 이미지"
            width={800}
            height={160}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="text-sm space-y-2">
        <InfoRow label="이름" value={island.name} />
        <InfoRow label="최대 인원" value={`${island.maxMembers}명`} />
        <InfoRow
          label="태그"
          value={island.tags.map((tag) => `#${tag}`).join(" ")}
        />
        <InfoRow
          label="설명"
          value={island.description || "설명이 없습니다."}
        />
        <InfoRow
          label="섬 주인"
          value={
            <span className="flex items-center gap-1">
              <FaUser /> {island.owner.nickname}
            </span>
          }
        />
      </div>
    </div>
  );
}

function DesertedIslandInfo() {
  return (
    <div className="text-[#3d2c1b] space-y-4 text-sm">
      <h2 className="text-xl font-bold flex items-center gap-2">
        🏝️ 무인도에 오신 것을 환영합니다
      </h2>
      <p>이곳은 주인 없는 무인도예요</p>
      <p>언제, 누구라도 이곳에 닿을 수 있어요</p>
      <p>고요한 시간을 보내며 누군가 찾아오길 기다려보아요 🌊</p>
    </div>
  );
}
