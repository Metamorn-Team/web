"use client";

import { Phaser } from "@/game/phaser";
import { RefObject, useLayoutEffect, useRef } from "react";

interface PlazaGameProps {
  ref: RefObject<GameRef | null>;
  currentActiveScene: (scene: Phaser.Scene) => void;
}

export interface GameRef {
  game: Phaser.Game;
}

export default function Game({ ref }: PlazaGameProps) {
  const gameRef = useRef<Phaser.Game | null>(null);

  useLayoutEffect(() => {
    console.log("햐이");
    const initialize = async () => {
      console.log("이닛");
      const mod = await import("@/game/main");
      const { GameSingleton } = mod;
      let game: Phaser.Game;

      if (!gameRef.current) {
        game = GameSingleton.getInstance(window.innerWidth, window.innerHeight);
        gameRef.current = game;

        if (ref) {
          ref.current = { game };
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
  }, [ref]);

  return <div id="game-container" />;
}
