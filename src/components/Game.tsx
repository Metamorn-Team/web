"use client";

import React, { RefObject, useLayoutEffect, useRef } from "react";
import { Phaser } from "@/game/phaser";

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

  useLayoutEffect(() => {
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
  }, [ref]);

  return <div id="game-container" />;
};

export default React.memo(Game);
