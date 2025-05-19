import { TORCH_GOBLIN } from "@/constants/game/entities";
import React from "react";

const GoblinTorch = ({ className }: { className?: string }) => {
  return (
    <div
      className={`w-60 h-60 bg-[length:700%_500%] animate-fire ${className}`}
      style={{
        backgroundImage: `url(${
          process.env.NEXT_PUBLIC_CDN_BASE_URL
        }/asset/sprite/${TORCH_GOBLIN("red")}.png)`,
      }}
    />
  );
};

export default React.memo(GoblinTorch);
