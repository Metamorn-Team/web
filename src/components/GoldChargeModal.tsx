"use client";

import RetroModal from "@/components/common/RetroModal";
import RetroButton from "@/components/common/RetroButton";
import { useState } from "react";
import Image from "next/image";
import Alert from "@/utils/alert";

interface GoldChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESETS = [
  {
    label: "1천",
    value: 1000,
  },
  {
    label: "5천",
    value: 5000,
  },
  {
    label: "1만",
    value: 10000,
  },
  {
    label: "10만",
    value: 100000,
  },
];

export default function GoldChargeModal({
  isOpen,
  onClose,
}: GoldChargeModalProps) {
  const [amount, setAmount] = useState(0);
  const totalPrice = amount + Math.floor(amount * 0.1);

  const handlePresetClick = (value: number) => {
    setAmount((prev) => prev + value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  return (
    <RetroModal isOpen={isOpen} onClose={onClose} className="!w-96">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-center text-[#2a1f14]">
          골드 충전하기
        </h2>

        <div className="border border-[#d6c6aa] rounded-lg bg-[#fcf4e4] px-4 py-3">
          <label className="text-sm text-[#3d2c1b] font-semibold">
            충전할 골드
          </label>
          <div className="flex items-center border mt-2 px-3 py-2 rounded-md bg-white shadow-inner">
            <Image src="/game/ui/gold.png" width={20} height={20} alt="gold" />
            <input
              type="text"
              value={amount.toLocaleString()}
              onChange={handleInputChange}
              placeholder="충전할 골드를 입력하세요"
              className="ml-2 w-full outline-none text-lg font-bold appearance-none pointer-events-none select-none"
              onKeyDown={(e) => e.preventDefault()}
              readOnly
            />
            {amount > 0 && (
              <button
                onClick={() => setAmount(0)}
                className="text-[#a27c3f] font-bold ml-2"
              >
                ✕
              </button>
            )}
          </div>

          {/* 프리셋 버튼 */}
          <div className="flex flex-wrap gap-2 mt-3">
            {PRESETS.map((preset) => (
              <RetroButton
                key={preset.value}
                variant="primary"
                onClick={() => handlePresetClick(preset.value)}
                className="text-base"
              >
                <p className="text-sm">+{preset.label}</p>
              </RetroButton>
            ))}
          </div>
        </div>

        <div className="text-right text-sm font-bold text-[#5c4b32]">
          최종 결제금액:{" "}
          <span className="text-[#a27c3f]">
            {totalPrice.toLocaleString()}원
          </span>
        </div>

        <div className="flex justify-between items-center text-xs text-[#5c4b32]">
          <span>내용을 확인하였으며 골드 충전에 동의합니다.</span>
          <button className="underline">안내보기</button>
        </div>

        <RetroButton
          disabled={amount <= 0}
          className="w-full text-lg"
          onClick={() => Alert.warn("준비 중..")}
        >
          <p className="text-base py-1">충전하기</p>
        </RetroButton>
      </div>
    </RetroModal>
  );
}
