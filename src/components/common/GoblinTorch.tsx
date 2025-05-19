import { CDN_BASE_URL } from "@/constants/constants";
import { TORCH_GOBLIN } from "@/constants/game/entities";
import React from "react";

const GoblinTorch = ({ className }: { className?: string }) => {
  return (
    <div
      className={`w-60 h-60 bg-[url(${CDN_BASE_URL}/sprite/${TORCH_GOBLIN(
        "red"
      )}.png)] bg-[length:700%_500%] animate-fire ${className}`}
    />
  );
};

export default React.memo(GoblinTorch);
