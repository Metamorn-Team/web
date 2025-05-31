"use client";

import { useEffect, useState } from "react";
// import GoblinTorch from "@/components/common/GoblinTorch";
import Pawn from "@/components/common/Pawn";
import { DotLoader } from "@/components/common/DotLoader";

const commonMessage = "섬을 만드는 중";

export default function LoadingPage() {
  const loaders = [
    // { loader: <GoblinTorch key={"goblin"} />, message: "불을 밝히러 가는 중" },
    {
      loader: <Pawn key={"red_pawn"} color="blue" animation="run" />,
      message: "검사가 되기 위해 수련 중",
    },
    {
      loader: <Pawn key={"red_pawn"} color="purple" animation="run" />,
      message: "활을 제작하는 중",
    },
    {
      loader: <Pawn key={"red_pawn"} color="red" animation="run" />,
      message: "빨간 버섯을 캐러 가는 중",
    },

    {
      loader: <Pawn key={"red_pawn"} color="yellow" animation="run" />,
      message: "망치를 가지러 가는 중",
    },
  ] as const;
  const [loader, setLoader] = useState<(typeof loaders)[number] | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * loaders.length);
    setLoader(loaders[randomIndex]);
  }, []);

  if (!loader) return null;

  return (
    <div className="absolute w-screen h-screen bg-darkBg flex flex-col justify-center items-center -z-50 gap-4">
      {loader.loader}
      <DotLoader loadingText={commonMessage} />
    </div>
  );
}
