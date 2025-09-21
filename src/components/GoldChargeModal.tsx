"use client";

import React, { useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import { FiArrowLeft } from "react-icons/fi";
import RetroModal from "@/components/common/RetroModal";
import RetroButton from "@/components/common/RetroButton";
import RadioButton from "@/components/common/RadioButton";
import Alert from "@/utils/alert";
// import * as PortOne from "@portone/browser-sdk/v2";
// import { v4 } from "uuid";
// import { useQueryClient } from "@tanstack/react-query";
// import { QUERY_KEY as GOLD_BALANCE_QUERY_KEY } from "@/hook/queries/useGetGoldBalance";
// import { useGetMyProfile } from "@/hook/queries/useGetMyProfile";
// import { getPaymentStatus } from "@/api/payment";
import Pawn from "@/components/common/Pawn";
import { getRandomPawnColor } from "@/utils/random";
import { FaCheck } from "react-icons/fa";

type PaymentMethod = "KAKAO_PAY";

interface PaymentMethodInfo {
  value: PaymentMethod;
  label: string;
  icon: React.ReactNode;
}

interface GoldChargeProduct {
  id: string;
  amount: number;
  price: number;
}

interface GoldChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGold: number;
  products: GoldChargeProduct[];
}

const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    value: "KAKAO_PAY",
    label: "카카오페이",
    icon: (
      <Image
        src={"https://cdn.metamorn.com/image/system/kakao-pay-logo-s.png"}
        alt="kakao-pay"
        width={64}
        height={26}
      />
    ),
  },
];

export default function GoldChargeModal({
  isOpen,
  onClose,
  currentGold,
  products,
}: GoldChargeModalProps) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [step, setStep] = useState<"select" | "confirm">("select");
  const [price, setPrice] = useState(0);
  const [gold, setGold] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing">(
    "idle"
  );

  const totalPrice = price;
  const chargedGold = currentGold + gold;

  const handleClose = () => {
    setStep("select");
    setPrice(0);
    setGold(0);
    setSelectedMethod(null);
    setSelectedProductId(null);
    onClose();
  };

  return (
    <RetroModal isOpen={isOpen} onClose={handleClose} className="!w-[28rem]">
      {/* 결제 진행 중 모달 */}
      {paymentStatus === "processing" && (
        <div className="absolute inset-0 z-50 bg-black/30 flex items-center justify-center rounded-lg">
          <div className="bg-white px-6 py-4 rounded-md shadow-md flex flex-col items-center gap-2 w-40">
            <span className="font-semibold text-[#3d2c1b]">결제 진행 중</span>
            <Pawn
              color={getRandomPawnColor()}
              className="w-[64px] h-[64px]"
              animation="run"
            />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          {step === "confirm" ? (
            <RetroButton
              variant="ghost"
              className="flex items-center gap-2 text-sm w-9"
              onClick={() => setStep("select")}
            >
              <FiArrowLeft size={18} />
            </RetroButton>
          ) : (
            <div className="w-9" />
          )}
          <h2 className="text-lg font-bold text-center text-[#2a1f14]">
            골드 충전하기
          </h2>
          <div className="w-9" />
        </div>

        {step === "select" && (
          <SelectStep
            currentGold={currentGold}
            setPrice={setPrice}
            setGold={setGold}
            setSelectedProductId={setSelectedProductId}
            price={price}
            gold={gold}
            totalPrice={totalPrice}
            chargedGold={chargedGold}
            setStep={setStep}
            products={products}
          />
        )}

        {step === "confirm" && (
          <ConfirmStep
            productId={selectedProductId}
            price={price}
            gold={gold}
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
            handleClose={handleClose}
            setPaymentStatus={setPaymentStatus}
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
  setSelectedProductId: (id: string | null) => void;
  price: number;
  gold: number;
  totalPrice: number;
  chargedGold: number;
  setStep: (step: "select" | "confirm") => void;
  products: GoldChargeProduct[];
}

function SelectStep({
  currentGold,
  setPrice,
  setGold,
  setSelectedProductId,
  price,
  gold,
  totalPrice,
  chargedGold,
  setStep,
  products,
}: SelectStepProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-center text-sm text-[#5c4b32] font-semibold">
        현재 보유 골드:{" "}
        <span className="ml-1 text-[#a27c3f]">
          {currentGold.toLocaleString()} G
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => {
              setPrice(product.price);
              setGold(product.amount);
              setSelectedProductId(product.id);
            }}
            className={classNames(
              "rounded-lg p-3 border flex flex-col items-center bg-white hover:shadow-md transition",
              price === product.price
                ? "border-yellow-600 bg-yellow-50 ring-2 ring-yellow-400"
                : "border-[#d6c6aa]"
            )}
          >
            <Image src="/game/ui/gold.png" alt="gold" width={36} height={36} />
            <span className="font-bold text-sm mt-2 text-[#3d2c1b]">
              {product.amount.toLocaleString()} G
            </span>
            <span className="text-sm text-[#7b6c57] mt-1">
              {product.price.toLocaleString()}원
            </span>
          </button>
        ))}
      </div>

      <div className="text-sm text-right text-[#5c4b32] font-semibold">
        {price > 0 ? (
          <div className="flex flex-col gap-1">
            <div>
              <span className="text-[#a27c3f]">
                {totalPrice.toLocaleString()}원
              </span>
              으로{" "}
              <span className="text-[#a27c3f]">{gold.toLocaleString()}G</span>를
              충전합니다.
            </div>
            <div>
              충전 후 보유 골드:{" "}
              <span className="text-[#a27c3f]">
                {chargedGold.toLocaleString()}G
              </span>
            </div>
          </div>
        ) : (
          <>충전할 금액을 선택해주세요</>
        )}
      </div>

      <div className="flex justify-between items-center text-xs text-[#5c4b32]"></div>

      <RetroButton
        disabled={price <= 0}
        className="w-full text-lg"
        onClick={() => setStep("confirm")}
      >
        <p className="text-base py-1">
          {price > 0 ? `${price.toLocaleString()}원 결제하기` : "결제하기"}
        </p>
      </RetroButton>
    </div>
  );
}

interface ConfirmStepProps {
  productId: string | null;
  price: number;
  gold: number;
  selectedMethod: PaymentMethod | null;
  setSelectedMethod: (method: PaymentMethod) => void;
  setPaymentStatus: (status: "idle" | "processing") => void;
  handleClose: () => void;
}

function ConfirmStep({
  // productId,
  price,
  gold,
  selectedMethod,
  setSelectedMethod,
}: // setPaymentStatus,
// handleClose,
ConfirmStepProps) {
  const [isPaymentAgreed, setIsPaymentAgreed] = useState(false);
  // const queryClient = useQueryClient();
  // const { data: profile } = useGetMyProfile();

  // const pollPaymentStatus = async (paymentId: string) => {
  //   const interval = setInterval(async () => {
  //     const payment = await getPaymentStatus(paymentId);
  //     if (payment.status === "COMPLETE") {
  //       clearInterval(interval);

  //       queryClient.invalidateQueries({ queryKey: [GOLD_BALANCE_QUERY_KEY] });
  //       handleClose();
  //       Alert.done("결제가 완료되었어요!");
  //       setPaymentStatus("idle");
  //     } else if (payment.status === "FAILED") {
  //       clearInterval(interval);

  //       Alert.error("결제에 실패했어요..");
  //       setPaymentStatus("idle");
  //     }
  //   }, 2000); // 2초마다 확인
  // };

  // const requestPayment = async (orderName: string, totalAmount: number) => {
  //   const paymentId = v4();
  //   await PortOne.requestPayment({
  //     storeId: "",
  //     channelKey: "",
  //     // 결제 건 구분, portone에서 이 값으로 결제 정보를 조회해서 서버에서 검증함
  //     paymentId,
  //     // 주문 내용, 상품 이름 넣자
  //     orderName,
  //     totalAmount,
  //     currency: "CURRENCY_KRW",
  //     // TODO 결제 수단 추가되면 매개변수로 받거나 분기
  //     payMethod: "EASY_PAY",
  //     customData: {
  //       productId,
  //       userId: profile?.id,
  //       productType: "GOLD_CHARGE",
  //     },
  //   });
  //   setPaymentStatus("processing");

  //   // 웹훅으로 처리해서 폴링으로 확인해야함
  //   pollPaymentStatus(paymentId);
  // };

  const handlePayment = () => {
    Alert.info("준비 중이에요..");
    // if (!selectedMethod) {
    //   Alert.warn("결제 수단을 선택해주세요.");
    //   return;
    // }
    // requestPayment(`리아 골드 ${gold}G 충전`, price);
  };

  return (
    <div className="flex flex-col gap-8">
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
          {PAYMENT_METHODS.map((method) => (
            <RadioButton
              key={method.value}
              label={method.label}
              icon={method.icon}
              selected={selectedMethod === method.value}
              onClick={() => setSelectedMethod(method.value)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-2">
        <label className="flex gap-2 items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isPaymentAgreed}
            onChange={(e) => setIsPaymentAgreed(e.target.checked)}
            className="hidden peer"
          />
          <span
            className={`w-5 h-5 flex items-center justify-center border rounded ${
              isPaymentAgreed ? "bg-[#bfae96]" : "bg-white"
            }`}
          >
            {isPaymentAgreed && <FaCheck size={12} />}
          </span>
          <p className="text-xs font-semibold">
            모든 내용을 확인하였으며 결제에 동의합니다
          </p>
        </label>

        <RetroButton
          className="flex-1"
          disabled={!selectedMethod || !isPaymentAgreed}
          onClick={handlePayment}
        >
          <p className="text-base py-1">
            {price > 0 ? `${price.toLocaleString()}원 결제하기` : "결제하기"}
          </p>
        </RetroButton>
      </div>
    </div>
  );
}
