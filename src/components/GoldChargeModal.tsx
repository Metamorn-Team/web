"use client";

import RetroModal from "@/components/common/RetroModal";
import RetroButton from "@/components/common/RetroButton";
import { useState } from "react";
import Image from "next/image";
import Alert from "@/utils/alert";
import classNames from "classnames";

interface GoldChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGold: number;
}

const PRESETS = [
  { gold: 100, value: 1100 },
  { gold: 500, value: 5500 },
  { gold: 1000, value: 11000 },
  { gold: 3000, value: 33000 },
  { gold: 5000, value: 55000 },
  { gold: 10000, value: 110000 },
];

export default function GoldChargeModal({
  isOpen,
  onClose,
  currentGold,
}: GoldChargeModalProps) {
  const [price, setPrice] = useState(0);
  const [gold, setGold] = useState(0);
  const totalPrice = price;

  const chargedGold = currentGold + gold;

  return (
    <RetroModal isOpen={isOpen} onClose={onClose} className="!w-[28rem]">
      <div className="flex flex-col gap-5">
        <h2 className="text-lg font-bold text-center text-[#2a1f14]">
          골드 충전하기
        </h2>

        {/* 보유 골드 */}
        <div className="flex justify-center text-sm text-[#5c4b32] font-semibold">
          현재 보유 골드:{" "}
          <span className="ml-1 text-[#a27c3f]">
            {currentGold.toLocaleString()} G
          </span>
        </div>

        {/* 골드 선택 영역 */}
        <div className="grid grid-cols-3 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => {
                setPrice(preset.value);
                setGold(preset.gold);
              }}
              className={classNames(
                "rounded-lg p-3 border flex flex-col items-center bg-white hover:shadow-md transition",
                price === preset.value
                  ? "border-yellow-600 bg-yellow-50 ring-2 ring-yellow-400"
                  : "border-[#d6c6aa]"
              )}
            >
              <Image
                src="/game/ui/gold.png"
                alt="gold"
                width={36}
                height={36}
              />
              <span className="font-bold text-sm mt-2 text-[#3d2c1b]">
                {preset.gold.toLocaleString()} G
              </span>
              <span className="text-sm text-[#7b6c57] mt-1">
                {preset.value.toLocaleString()}원
              </span>
            </button>
          ))}
        </div>

        {/* 요약 안내 */}
        <div className="text-sm text-right text-[#5c4b32] font-semibold">
          {price > 0 ? (
            <>
              <span className="text-[#a27c3f]">
                {totalPrice.toLocaleString()}원
              </span>
              으로{" "}
              <span className="text-[#a27c3f]">{gold.toLocaleString()} G</span>
              를 충전합니다.
              <br />
              충전 후 보유 골드:{" "}
              <span className="text-[#a27c3f]">
                {chargedGold.toLocaleString()} G
              </span>
            </>
          ) : (
            <>충전할 금액을 선택해주세요</>
          )}
        </div>

        {/* 동의 문구 */}
        <div className="flex justify-between items-center text-xs text-[#5c4b32]">
          <span>내용을 확인하였으며 골드 충전에 동의합니다.</span>
          <button className="underline">안내보기</button>
        </div>

        {/* 결제 버튼 */}
        <RetroButton
          disabled={price <= 0}
          className="w-full text-lg"
          onClick={() => Alert.warn("준비 중입니다.")}
        >
          <p className="text-base py-1">
            {price > 0 ? `${totalPrice.toLocaleString()}원 결제` : "충전하기"}
          </p>
        </RetroButton>
      </div>
    </RetroModal>
  );
}
