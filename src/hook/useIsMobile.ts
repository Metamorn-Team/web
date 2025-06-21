import { useEffect, useState } from "react";

/**
 * 모바일 환경을 감지하는 커스텀 훅
 * @returns {boolean} 모바일 환경 여부
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // 화면 너비가 640px 이하이거나 터치 디바이스인 경우 모바일로 판단
      const isMobileByWidth = window.innerWidth <= 640;
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      setIsMobile(isMobileByWidth || isTouchDevice);
    };

    // 초기 체크
    checkIsMobile();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener("resize", checkIsMobile);
    window.addEventListener("orientationchange", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
      window.removeEventListener("orientationchange", checkIsMobile);
    };
  }, []);

  return isMobile;
}
