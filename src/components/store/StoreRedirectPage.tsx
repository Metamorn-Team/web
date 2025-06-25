"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DotLoader } from "@/components/common/DotLoader";
import RetroButton from "@/components/common/RetroButton";
import Pawn from "@/components/common/Pawn";

export default function StoreRedirectPage() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    if (secondsLeft <= 0) {
      router.replace("/");
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, router]);

  const handleLoginClick = () => {
    router.push("/");
  };

  return (
    <div className="w-full h-screen bg-[#f9f5ec] flex flex-col justify-center items-center text-[#5c4b32] gap-6 px-4 text-center">
      <div className="flex flex-col items-center gap-2">
        <div className="text-3xl font-bold">
          🎁 섬에서 먼저 로그인을 해주세요!
        </div>
        <p className="text-base text-[#7a6144]">
          로그인하고 귀여운 아이템들을 만나보아요 ✨
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Pawn color="orange" animation="idle" />
        <RetroButton onClick={handleLoginClick} className="mt-2">
          <p className="text-lg">얼른 섬으로 가기</p>
        </RetroButton>
      </div>

      <DotLoader
        loadingText={`${secondsLeft}초 후 섬으로 이동합니다`}
        dotInterval={1000}
        className="text-xl mt-4"
      />
    </div>
  );
}
