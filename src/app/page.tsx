"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import LoadingPage from "@/components/LoadingPage";
import { GameRef } from "@/components/PlazaGame";
import Image from "next/image";
import { PlazaScene } from "@/game/scenes/plaza-scene";

const DynamicPlazaGame = dynamic(() => import("@/components/PlazaGame"), {
  ssr: false,
});

export default function MainPage() {
  const [isLoading, setIsLoading] = useState(true);
  const gameRef = useRef<GameRef | null>(null);
  const [isMute, setIsMute] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (gameRef.current) {
      console.log(gameRef.current);
    }
  }, [gameRef]);

  const muteSound = useCallback(() => {
    if (gameRef.current) {
      const scene =
        gameRef.current.game.scene.getScene<PlazaScene>("PlazaScene");
      setIsMute(scene.mute());
    }
  }, [gameRef]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div>
      <DynamicPlazaGame ref={gameRef} currentActiveScene={() => {}} />
      <button
        className="absolute left-1/2 round w-[fit-content] h-[fit-content] focus:outline-none"
        onClick={muteSound}
      >
        {isMute ? (
          <Image
            src={"/icons/mute-icon.svg"}
            width={64}
            height={64}
            alt="mute-icon"
          />
        ) : (
          <Image
            src={"/icons/none-mute-icon.svg"}
            width={64}
            height={64}
            alt="none-mute-icon"
          />
        )}
      </button>
    </div>
  );
}
