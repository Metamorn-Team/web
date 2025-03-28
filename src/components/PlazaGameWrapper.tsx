"use client";

import { useState, useRef, useCallback } from "react";
import { GameRef } from "@/components/PlazaGame";
import { PlazaScene } from "@/game/scenes/plaza-scene";
import MenuHeader from "@/components/MenuHeader";
import dynamic from "next/dynamic";

// PlazaGame 동적 임포트
const DynamicPlazaGame = dynamic(() => import("@/components/PlazaGame"), {
  ssr: false,
  loading: () => <div>Loading Plaza Game...</div>,
});

export default function PlazaGameWrapper() {
  const gameRef = useRef<GameRef | null>(null);
  const [isMute, setIsMute] = useState(false);

  const muteToggle = useCallback(() => {
    if (gameRef.current) {
      const scene =
        gameRef.current.game.scene.getScene<PlazaScene>("PlazaScene");
      setIsMute(scene.mute());
    }
  }, [gameRef]);

  return (
    <div>
      <MenuHeader isMute={isMute} muteToggle={muteToggle} />
      <DynamicPlazaGame ref={gameRef} currentActiveScene={() => {}} />
    </div>
  );
}
