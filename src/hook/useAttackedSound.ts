import { EventWrapper } from "@/game/event/EventBus";
import { useCallback, useEffect, useRef } from "react";

export const useAttackedSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAlertSound = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/game/sounds/hit.wav");
    }
    audioRef.current.play().catch((e) => {
      console.error("알림 소리 재생 실패:", e);
    });
  }, []);

  useEffect(() => {
    const handleAttacked = () => {
      playAlertSound();
    };

    EventWrapper.onUiEvent("attacked", handleAttacked);
    return () => {
      EventWrapper.offUiEvent("attacked", handleAttacked);
    };
  }, [playAlertSound]);

  return { playAlertSound };
};
