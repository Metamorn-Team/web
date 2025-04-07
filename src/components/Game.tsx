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

interface GameProps {
  ref: RefObject<GameRef | null>;
  currentActiveScene: (scene: Phaser.Scene) => void;
}

export interface GameRef {
  game: Phaser.Game;
  currnetScene: Phaser.Scene | null;
}

const Game = ({ ref }: GameProps) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const checkFonts = async () => {
      try {
        const font = new FontFaceObserver("CookieRun");
        await font.load();

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
        game = GameSingleton.getInstance(window.innerWidth, window.innerHeight);
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

  return <div id="game-container" />;
};

export default React.memo(Game);
