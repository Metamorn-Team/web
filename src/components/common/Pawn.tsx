import { PawnColor } from "@/constants/game/entities";
import { PAWN_ANIMATION_URL } from "@/constants/image-path";
import React from "react";

interface PawnProps {
  color: PawnColor;
  animation: "run" | "idle";
  className?: string;
}

const Pawn = ({ color, animation, className }: PawnProps) => {
  return (
    <div
      className={`w-[100px] h-[100px] bg-[length:600%_100%] animate-pawn ${className}`}
      style={{
        backgroundImage: `url("${PAWN_ANIMATION_URL(color, animation)}")`,
      }}
    />
  );
};

export default React.memo(Pawn);
