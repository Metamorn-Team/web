import { PawnColor } from "@/constants/game/entities";
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
        backgroundImage: `url("${process.env.NEXT_PUBLIC_CDN_BASE_URL}/anim/${color}_pawn_${animation}.png")`,
      }}
    />
  );
};

export default React.memo(Pawn);
