"use client";

import RetroModal from "@/components/common/RetroModal";
import RetroButton from "@/components/common/RetroButton";
import RadioButton from "@/components/common/RadioButton";
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
  const [step, setStep] = useState<"select" | "confirm">("select");
  const [price, setPrice] = useState(0);
  const [gold, setGold] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState<"kakao" | "card" | null>(
    null
  );

  const totalPrice = price;
  const chargedGold = currentGold + gold;

  const handleClose = () => {
    setStep("select");
    setPrice(0);
    setGold(0);
    setSelectedMethod(null);
    onClose();
  };

  return (
    <RetroModal isOpen={isOpen} onClose={handleClose} className="!w-[28rem]">
      <div className="flex flex-col gap-5">
        <h2 className="text-lg font-bold text-center text-[#2a1f14]">
          골드 충전하기
        </h2>

        {step === "select" && (
          <SelectStep
            currentGold={currentGold}
            setPrice={setPrice}
            setGold={setGold}
            price={price}
            gold={gold}
            totalPrice={totalPrice}
            chargedGold={chargedGold}
            setStep={setStep}
          />
        )}

        {step === "confirm" && (
          <ConfirmStep
            price={price}
            gold={gold}
            totalPrice={totalPrice}
            chargedGold={chargedGold}
            setStep={setStep}
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
          />
        )}
      </div>
    </RetroModal>
  );
}

interface SelectStepProps {
  currentGold: number;
  setPrice: (price: number) => void;
  setGold: (gold: number) => void;
  price: number;
  gold: number;
  totalPrice: number;
  chargedGold: number;
  setStep: (step: "select" | "confirm") => void;
}

function SelectStep({
  currentGold,
  setPrice,
  setGold,
  price,
  gold,
  totalPrice,
  chargedGold,
  setStep,
}: SelectStepProps) {
  return (
    <>
      <div className="flex justify-center text-sm text-[#5c4b32] font-semibold">
        현재 보유 골드:{" "}
        <span className="ml-1 text-[#a27c3f]">
          {currentGold.toLocaleString()} G
        </span>
      </div>

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
            <Image src="/game/ui/gold.png" alt="gold" width={36} height={36} />
            <span className="font-bold text-sm mt-2 text-[#3d2c1b]">
              {preset.gold.toLocaleString()} G
            </span>
            <span className="text-sm text-[#7b6c57] mt-1">
              {preset.value.toLocaleString()}원
            </span>
          </button>
        ))}
      </div>

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

      <div className="flex justify-between items-center text-xs text-[#5c4b32]">
        <span>내용을 확인하였으며 골드 충전에 동의합니다.</span>
        <button className="underline">안내보기</button>
      </div>

      <RetroButton
        disabled={price <= 0}
        className="w-full text-lg"
        onClick={() => setStep("confirm")}
      >
        <p className="text-base py-1">결제하기</p>
      </RetroButton>
    </>
  );
}

interface ConfirmStepProps {
  price: number;
  gold: number;
  totalPrice: number;
  chargedGold: number;
  setStep: (step: "select" | "confirm") => void;
  selectedMethod: "kakao" | "card" | null;
  setSelectedMethod: (method: "kakao" | "card") => void;
}

function ConfirmStep({
  price,
  gold,
  setStep,
  selectedMethod,
  setSelectedMethod,
}: ConfirmStepProps) {
  return (
    <>
      <div className="bg-[#fcf4e4] border border-[#d6c6aa] rounded-lg p-4 text-[#3d2c1b]">
        <div className="flex justify-between">
          <span className="font-semibold">상품</span>
          <span>{gold.toLocaleString()} G</span>
        </div>
        <div className="flex justify-between mt-2">
          <span className="font-semibold">금액</span>
          <span>{price.toLocaleString()}원</span>
        </div>
        <div className="mt-4 text-xs text-[#7b6c57]">
          부가세 포함 / 결제 완료 후 골드가 즉시 지급됩니다.
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#3d2c1b] mb-1">
          결제 방법
        </label>
        <div className="flex gap-2">
          <RadioButton
            label="카카오페이"
            selected={selectedMethod === "kakao"}
            onClick={() => setSelectedMethod("kakao")}
          />
          <RadioButton
            label="신용카드"
            selected={selectedMethod === "card"}
            onClick={() => setSelectedMethod("card")}
          />
        </div>
      </div>

      <div className="flex justify-between gap-2">
        <RetroButton
          variant="ghost"
          className="flex-1"
          onClick={() => setStep("select")}
        >
          <p className="text-base py-1">이전</p>
        </RetroButton>
        <RetroButton
          className="flex-1"
          onClick={() => {
            if (!selectedMethod) {
              Alert.warn("결제 수단을 선택해주세요.");
              return;
            }
            Alert.warn(
              `${
                selectedMethod === "kakao" ? "카카오페이" : "신용카드"
              } 결제 처리 중입니다.`
            );
          }}
        >
          <p className="text-base py-1">결제하기</p>
        </RetroButton>
      </div>
    </>
  );
}
