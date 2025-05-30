"use client";

import React, { useEffect, useState } from "react";
import RetroModal from "@/components/common/RetroModal";
import Pawn from "@/components/common/Pawn";
import { pawnColors, PAWN } from "@/constants/game/entities";
import useRegisterPayloadStore from "@/stores/useRegisterPayloadStore";
import RetroButton from "@/components/common/RetroButton";
import { useChangeAvatar } from "@/hook/queries/useChangeAvatar";
import { EventWrapper } from "@/game/event/EventBus";
import Alert from "@/utils/alert";
import { removeItem } from "@/utils/persistence";

interface OutfitChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OutfitChangeModal({
  isOpen,
  onClose,
}: OutfitChangeModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { updatePayload } = useRegisterPayloadStore();
  const { mutate: changeAvatar } = useChangeAvatar(
    () => {
      EventWrapper.emitToGame("changeAvatarColor", pawnColors[currentIndex]);
      removeItem("profile");
      onClose();
    },
    () => Alert.error("문제가 생겼어요 잠시후 다시 갈아입어주세요..")
  );

  const onPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + pawnColors.length) % pawnColors.length
    );
  };

  const onNext = () => {
    setCurrentIndex((prev) => (prev + 1) % pawnColors.length);
  };

  const onConfirm = () => {
    changeAvatar({ avatarKey: PAWN(pawnColors[currentIndex]) });
  };

  const currentColor = pawnColors[currentIndex];
  const mapColor = () => {
    switch (currentColor) {
      case "blue":
        return "파랑";
      case "red":
        return "빨강";
      case "yellow":
        return "노랑";
      case "purple":
        return "보라";
    }
  };

  useEffect(() => {
    updatePayload({ avatarKey: PAWN(currentColor) });
  }, [currentColor]);

  return (
    <RetroModal isOpen={isOpen} onClose={onClose} className="!max-w-[400px]">
      <div className="flex flex-col items-center gap-12">
        <h2 className="text-xl font-bold">의상 선택</h2>
        <div className="relative w-full flex justify-center gap-14">
          <div className="flex items-center">
            <RetroButton onClick={onPrev} variant="ghost">
              <p className="text-base">이전</p>
            </RetroButton>
          </div>
          <div className="flex flex-col items-center gap-6 text-base">
            <Pawn
              color={currentColor}
              animation="idle"
              className="w-3/5 aspect-[1/1] h-auto"
            />
            <h2>{mapColor()}</h2>
          </div>
          <div className="flex items-center">
            <RetroButton onClick={onNext} variant="ghost">
              <p className="text-base">다음</p>
            </RetroButton>
          </div>
        </div>
        <RetroButton onClick={onConfirm} variant="ghost">
          <h2 className="text-lg font-bold">갈아입기</h2>
        </RetroButton>
      </div>
    </RetroModal>
  );
}
