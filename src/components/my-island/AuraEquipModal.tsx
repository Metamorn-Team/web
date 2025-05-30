"use client";

import { useState } from "react";
import RetroSideModal from "@/components/common/RetroSideModal";
import RetroButton from "@/components/common/RetroButton";
import classNames from "classnames";
import Image from "next/image";

export const AURA_TIERS = ["일반", "고급", "희귀", "전설"] as const;
export type AuraTier = (typeof AURA_TIERS)[number];

export interface AuraData {
  id: string;
  name: string;
  tier: AuraTier;
  icon: string;
}

export const AURA_LIST: AuraData[] = [
  {
    id: "aura_white",
    name: "하얀 기운",
    tier: "일반",
    icon: "/auras/aura_white.png",
  },
  {
    id: "aura_blueish",
    name: "푸른 기운",
    tier: "일반",
    icon: "/auras/aura_blueish.png",
  },
  {
    id: "aura_blueish1",
    name: "푸른 기운",
    tier: "일반",
    icon: "/auras/aura_blueish.png",
  },
  {
    id: "a2ura_blueish",
    name: "푸른 기운",
    tier: "일반",
    icon: "/auras/aura_blueish.png",
  },
  {
    id: "3aura_blueish",
    name: "푸른 기운",
    tier: "일반",
    icon: "/auras/aura_blueish.png",
  },
  {
    id: "aura_blu6eish",
    name: "푸른 기운",
    tier: "일반",
    icon: "/auras/aura_blueish.png",
  },
  {
    id: "au5ra_blueish",
    name: "푸른 기운",
    tier: "일반",
    icon: "/auras/aura_blueish.png",
  },
  {
    id: "aura_gold",
    name: "황금빛 오라",
    tier: "고급",
    icon: "/auras/aura_gold.png",
  },
  {
    id: "aura_leaf",
    name: "숲의 숨결",
    tier: "고급",
    icon: "/auras/aura_leaf.png",
  },
  {
    id: "aura_shadow",
    name: "그림자 흔적",
    tier: "희귀",
    icon: "/auras/aura_shadow.png",
  },
  {
    id: "aura_crystal",
    name: "수정의 파동",
    tier: "희귀",
    icon: "/auras/aura_crystal.png",
  },
  {
    id: "aura_flame",
    name: "불꽃의 심장",
    tier: "전설",
    icon: "/auras/aura_flame.png",
  },
  {
    id: "aura_void",
    name: "공허의 파장",
    tier: "전설",
    icon: "/auras/aura_void.png",
  },
];

export const getAuraListByTier = (tier: AuraTier): AuraData[] =>
  AURA_LIST.filter((aura) => aura.tier === tier);

interface AuraEquipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuraEquipModal({
  isOpen,
  onClose,
}: AuraEquipModalProps) {
  const [selectedTier, setSelectedTier] = useState<AuraTier>("일반");

  const auraList = getAuraListByTier(selectedTier);

  return (
    <RetroSideModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">🌀 오라 장착</h2>
      <div className="flex w-full">
        {/* 좌측 등급 메뉴 */}
        <div className="flex flex-col gap-2 pr-4 border-r border-[#bfae96] min-w-[90px]">
          {AURA_TIERS.map((tier) => (
            <button
              key={tier}
              className={classNames(
                "px-3 py-1 text-sm rounded border border-[#8c7a5c]",
                selectedTier === tier
                  ? "bg-yellow-200 font-bold shadow-inner"
                  : "bg-[#fdf8ef] hover:bg-yellow-100"
              )}
              onClick={() => setSelectedTier(tier)}
            >
              {tier}
            </button>
          ))}
        </div>

        {/* 우측 오라 목록 */}
        <div className="grid grid-cols-3 gap-4 pl-4 w-full">
          {auraList.map((aura) => (
            <div
              key={aura.id}
              className="border border-[#bfae96] p-3 rounded bg-white flex flex-col items-center"
            >
              <div className="relative w-12 h-12 mb-2">
                <Image src={"/images/avatar/purple_pawn.png"} fill alt="오라" />
              </div>
              <p className="text-sm font-bold text-center">{aura.name}</p>
              <RetroButton
                className="w-full text-xs mt-2"
                onClick={() => console.log("장착:", aura.id)}
              >
                장착
              </RetroButton>
            </div>
          ))}
        </div>
      </div>
    </RetroSideModal>
  );
}
