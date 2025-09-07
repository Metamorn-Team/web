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
import { SoundManager } from "@/game/managers/sound-manager";
import { EventWrapper } from "@/game/event/EventBus";
import { socketManager } from "@/game/managers/socket-manager";
import { playerStore } from "@/game/managers/player-store";
import { natureObjectStore } from "@/game/managers/nature-object-store";
import { removeItem } from "@/utils/session-storage";

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
        const mapleStory = new FontFaceObserver("MapleStory");
        await mapleStory.load();

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
      let game: Phaser.Game;

      if (!gameRef.current) {
        game = mod.GameSingleton.getInstance();
        gameRef.current = game;

        if (ref) {
          ref.current = { game, currnetScene: null };
        }
      }
    };

    initialize();

    // Cleanup function
    return () => {
      if (gameRef.current) {
        try {
          // SoundManager 완전 정리
          SoundManager.destroy();

          // EventWrapper의 모든 이벤트 리스너 제거
          EventWrapper.destroy();

          // Socket 연결 해제
          socketManager.clear();

          // Store 인스턴스들 정리
          playerStore.clear();
          natureObjectStore.clearAllNatureObjects();

          // Session Storage 정리
          removeItem("current_scene");
          removeItem("current_island_id");
          removeItem("current_island_type");

          // 모든 씬을 완전히 정리
          if (gameRef.current) {
            gameRef.current.scene.scenes.forEach((scene) => {
              if (scene.scene.isActive()) {
                scene.scene.stop();
              }
              scene.scene.remove();
            });
          }

          gameRef.current.destroy(true);
        } catch (error) {
          console.error("Game cleanup error:", error);
        }
        gameRef.current = null;
        if (ref && ref.current) {
          ref.current = null;
        }
      }
    };
  }, [ref, fontsLoaded]);

  // Additional cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameRef.current) {
        try {
          // SoundManager 완전 정리
          SoundManager.destroy();

          // EventWrapper의 모든 이벤트 리스너 제거
          EventWrapper.destroy();

          // Socket 연결 해제
          socketManager.clear();

          // Store 인스턴스들 정리
          playerStore.clear();
          natureObjectStore.clearAllNatureObjects();

          // Session Storage 정리
          removeItem("current_scene");
          removeItem("current_island_id");
          removeItem("current_island_type");

          // 모든 씬을 완전히 정리
          if (gameRef.current) {
            gameRef.current.scene.scenes.forEach((scene) => {
              if (scene.scene.isActive()) {
                scene.scene.stop();
              }
              scene.scene.remove();
            });
          }

          gameRef.current.destroy(true);
        } catch (error) {
          console.error("Game unmount cleanup error:", error);
        }
        gameRef.current = null;
        if (ref && ref.current) {
          ref.current = null;
        }
      }
    };
  }, [ref]);

  return <div id="game-container" />;
};

export default React.memo(Game);
