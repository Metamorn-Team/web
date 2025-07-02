"use client";

import { useState, useEffect } from "react";
import GlassButton from "./GlassButton";

interface HeaderProps {
  isLogin: boolean;
  onOpenLogoutConfirmModal: () => void;
  handleLogin: () => void;
  handleVisitStore: () => void;
  handleBackToMain?: () => void;
  timeOfDay: string;
}

export function Header({
  isLogin,
  onOpenLogoutConfirmModal,
  handleLogin,
  handleVisitStore,
  handleBackToMain,
  timeOfDay,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 16);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 w-full mx-auto px-4 py-2 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-sm bg-transparent shadow-md" : ""
      }`}
    >
      <div className="flex justify-between items-center w-full max-w-[1150px] mx-auto">
        {/* 상단 버튼들 */}
        <div>
          {handleBackToMain && (
            <GlassButton
              onClick={handleBackToMain}
              variant="auto"
              size="sm"
              hover
              timeOfDay={timeOfDay}
              className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
            >
              뒤로가기
            </GlassButton>
          )}
        </div>
        <div className="flex justify-center sm:justify-end gap-2 sm:gap-3">
          <GlassButton
            onClick={isLogin ? onOpenLogoutConfirmModal : handleLogin}
            variant="auto"
            size="sm"
            hover
            timeOfDay={timeOfDay}
            className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
          >
            {isLogin ? "로그아웃" : "로그인"}
          </GlassButton>
          <GlassButton
            onClick={handleVisitStore}
            variant="auto"
            size="sm"
            hover
            timeOfDay={timeOfDay}
            className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
          >
            🎁 리아 상점
          </GlassButton>
        </div>
      </div>
    </div>
  );
}
