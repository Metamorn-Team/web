"use client";

import { useEffect, useState } from "react";
// import GoblinTorch from "@/components/common/GoblinTorch";
import Pawn from "@/components/common/Pawn";
import { DotLoader } from "@/components/common/DotLoader";

const commonMessage = "섬을 만드는 중";

interface LoadingPageProps {
  message?: string;
}

export default function LoadingPage({ message }: LoadingPageProps) {
  const loaders = [
    // { loader: <GoblinTorch key={"goblin"} />, message: "불을 밝히러 가는 중" },
    {
      loader: <Pawn key={"blue_pawn"} color="blue" animation="run" />,
    },
    {
      loader: <Pawn key={"purple_pawn"} color="purple" animation="run" />,
    },
    {
      loader: <Pawn key={"red_pawn"} color="red" animation="run" />,
    },

    {
      loader: <Pawn key={"yellow_pawn"} color="yellow" animation="run" />,
    },
    {
      loader: (
        <Pawn key={"forest_green_pawn"} color="forest_green" animation="run" />
      ),
    },
    {
      loader: <Pawn key={"orange"} color="orange" animation="run" />,
    },
    {
      loader: (
        <Pawn key={"pure_shadow_pawn"} color="pure_shadow" animation="run" />
      ),
    },
  ] as const;
  const [loader, setLoader] = useState<(typeof loaders)[number] | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const randomIndex = Math.floor(Math.random() * loaders.length);
    setLoader(loaders[randomIndex]);
  }, []);

  if (!isClient || !loader) return null;

  return (
    <div className="absolute w-screen h-screen bg-darkBg flex flex-col justify-center items-center -z-50 gap-4">
      {loader.loader}
      <DotLoader
        loadingText={message || commonMessage}
        className="text-white text-4xl font-bold mt-4"
      />
    </div>
  );
}
