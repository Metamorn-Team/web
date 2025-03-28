"use client";

import { EventBus } from "@/game/event/EventBus";
import { RefObject, useEffect, useLayoutEffect, useRef } from "react";

interface GameProps {
  ref: RefObject<GameRef | null>;
  currentActiveScene: (scene: Phaser.Scene) => void;
}

export interface GameRef {
  game: Phaser.Game;
  scene: Phaser.Scene | null;
}

export default function PlazaGame({ currentActiveScene, ref }: GameProps) {
  const gameRef = useRef<Phaser.Game | null>(null);

  useLayoutEffect(() => {
    const initialize = async () => {
      const mod = await import("@/game/main");
      const initializeGame = mod.initializeGame;
      let game: Phaser.Game;

      if (!gameRef.current) {
        game = initializeGame(
          window.innerWidth,
          window.innerHeight,
          "game-containter"
        );
        gameRef.current = game;

        if (ref) {
          ref.current = { game, scene: null };
        }
      }

      return () => {
        if (gameRef.current) {
          gameRef.current.destroy(true);
          gameRef.current = null;
        }
      };
    };

    // 비동기적으로 초기화 시작
    initialize();
  }, [ref]);

  useEffect(() => {
    EventBus.on("current-scene-ready", (currentScene: Phaser.Scene) => {
      if (currentActiveScene instanceof Function) {
        currentActiveScene(currentScene);
      }
      if (ref.current) {
        ref.current.scene = currentScene;
      }
    });

    const handleResize = () => {
      if (gameRef.current) {
        gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
        gameRef.current.scene.scenes.forEach((scene) => {
          scene.cameras.main.setSize(window.innerWidth, window.innerHeight);
        });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      EventBus.removeListener("current-scene-ready");
      window.removeEventListener("resize", handleResize);
    };
  }, [currentActiveScene, ref]);

  return <div id="game-container" className="z-0"></div>;
}
