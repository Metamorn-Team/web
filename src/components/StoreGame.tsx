"use client";

import React, {
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Phaser } from "@/game/phaser";
import FontFaceObserver from "fontfaceobserver";

interface StoreGameProps {
  ref: RefObject<GameRef | null>;
  currentActiveScene: (scene: Phaser.Scene) => void;
}

export interface GameRef {
  game: Phaser.Game;
  currnetScene: Phaser.Scene | null;
}

const StoreGame = ({ ref }: StoreGameProps) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const checkFonts = async () => {
      try {
        const cookieRun = new FontFaceObserver("CookieRun");
        const pretendard = new FontFaceObserver("Pretendard");
        const dungGeunMo = new FontFaceObserver("DungGeunMo");
        await cookieRun.load();
        await pretendard.load();
        await dungGeunMo.load();

        setFontsLoaded(true);
      } catch (err) {
        console.error("폰트 로드 실패:", err);
        setFontsLoaded(true);
      }
    };

    checkFonts();
  }, []);

  useLayoutEffect(() => {
    if (!fontsLoaded) return;

    const initialize = async () => {
      const mod = await import("@/game/main");
      const { GameSingleton } = mod;
      let game: Phaser.Game;

      if (!gameRef.current) {
        game = GameSingleton.getStoreInstance(288, 288);
        gameRef.current = game;

        if (ref) {
          ref.current = { game, currnetScene: null };
        }
      }

      return () => {
        if (gameRef.current) {
          gameRef.current.destroy(true);
          GameSingleton.destroy();
          gameRef.current = null;
        }
      };
    };

    initialize();
  }, [ref, fontsLoaded]);

  return (
    <div className="relative w-[288px] h-[288px]">
      <div id="game-container" className="w-full h-full" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded shadow z-10 w-3/4">
        <p>💡 상점 기능은 아직 준비 중이에요..</p>
        <p>하지만 자유롭게 장착해볼 수 있어요!</p>
      </div>
    </div>
  );
};

export default React.memo(StoreGame);
