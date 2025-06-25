"use client";

import RetroButton from "@/components/common/RetroButton";
import Pawn from "@/components/common/Pawn";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.replace("/");
  };

  return (
    <div className="w-full h-screen bg-[#303041] flex flex-col justify-center items-center text-[#fcebd5] gap-8 px-4 text-center">
      <div className="flex flex-col items-center gap-2">
        <div className="text-3xl font-bold">🌙 길을 잃으셨나요?</div>
        <p className="text-base text-[#e2d1b5]">따라오세요, 섬은 저쪽이에요!</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Pawn color="pure_shadow" animation="idle" />
        <RetroButton variant="ghost" onClick={handleGoHome} className="mt-2">
          <p className="text-lg">🏝️ 섬으로 가기</p>
        </RetroButton>
      </div>
    </div>
  );
}
