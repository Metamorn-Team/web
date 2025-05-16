import { CDN_BASE_URL } from "@/constants/constants";
import { PawnColor } from "@/constants/game/entities";
import React from "react";

interface PawnProps {
  color: PawnColor;
  animation: "run";
  className?: string;
}

const Pawn = ({ color, animation, className }: PawnProps) => {
  return (
    <div
      className={`w-[100px] h-[100px] bg-[length:600%_100%] animate-pawn ${className}`}
      style={{
        backgroundImage: `url("${CDN_BASE_URL}/loader/${color}_pawn_${animation}.png")`,
      }}
    />
  );
};

export default React.memo(Pawn);
