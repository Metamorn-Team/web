import { PawnColor } from "@/constants/entities";
import React from "react";

const Pawn = ({
  color,
  className,
}: {
  color: PawnColor;
  className?: string;
}) => {
  const pawnImg = `url('/game/player/pawn/${color}_pawn.png')`;

  return (
    <div
      className={`w-60 h-60 bg-[length:600%_600%] animate-pawn ${className}`}
      style={{
        backgroundImage: pawnImg,
      }}
    />
  );
};

export default React.memo(Pawn);
