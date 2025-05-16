import React, { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import Pawn from "@/components/common/Pawn";
import SquareButton from "@/components/common/SquareButton";
import { PAWN, pawnColors } from "@/constants/game/entities";
import useRegisterPayloadStore from "@/stores/useRegisterPayloadStore";

interface SelectAvatarStep {
  nextStep: () => void;
}

const SelectAvatarStep = ({ nextStep }: SelectAvatarStep) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { updatePayload } = useRegisterPayloadStore();

  const onPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + pawnColors.length) % pawnColors.length
    );
  };

  const onNext = () => {
    setCurrentIndex((prev) => (prev + 1) % pawnColors.length);
  };

  const currentColor = pawnColors[currentIndex];

  useEffect(() => {
    updatePayload({ avatarKey: PAWN(currentColor) });
  }, [currentIndex]);

  return (
    <div className="flex flex-col justify-between items-center w-full h-full">
      <h2 className="text-xl font-bold">캐릭터 선택</h2>
      <div className="flex justify-center relative w-full">
        <div className="absolute left-0 h-full flex flex-col justify-center">
          <SquareButton color="blue" onClick={onPrev} title="<<" width={48} />
        </div>
        <Pawn
          color={currentColor}
          animation="idle"
          className="w-3/5 aspect-[1/1] h-auto"
        />
        <div className="absolute right-0 h-full flex flex-col justify-center">
          <SquareButton color="blue" onClick={onNext} title=">>" width={48} />
        </div>
      </div>
      <Button title="선택하기" onClick={nextStep} color="yellow" width="50%" />
    </div>
  );
};

export default SelectAvatarStep;
