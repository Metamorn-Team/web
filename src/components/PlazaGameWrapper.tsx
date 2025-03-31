"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import PlazaGame, { GameRef } from "@/components/PlazaGame";
import { PlazaScene } from "@/game/scenes/plaza-scene";
import MenuHeader from "@/components/MenuHeader";
import { EventBus } from "@/game/event/EventBus";
import { useModal } from "@/hook/useModal";
import FriendModal from "@/components/FriendModal";

interface PlazaGameWrapperProps {
  isLoading: boolean;
  changeIsLoading: (stat: boolean) => void;
}

export default function PlazaGameWrapper({
  isLoading,
  changeIsLoading,
}: PlazaGameWrapperProps) {
  const gameRef = useRef<GameRef | null>(null);
  const [isMute, setIsMute] = useState(false);
  const { isModalOpen, changeModalOpen, onClose } = useModal();

  const muteToggle = useCallback(() => {
    if (gameRef.current) {
      const scene =
        gameRef.current.game.scene.getScene<PlazaScene>("PlazaScene");
      setIsMute(scene.muteToggle());
    }
  }, [gameRef]);

  useEffect(() => {
    const handleSceneReady = () => {
      if (gameRef.current !== null) {
        changeIsLoading(false);
        gameRef.current.game.canvas.style.display = "block";
      }
    };

    EventBus.on("current-scene-ready", handleSceneReady);

    const handleResize = () => {
      if (gameRef.current) {
        gameRef.current.game.scale.resize(
          window.innerWidth,
          window.innerHeight
        );
        gameRef.current.game.scene.scenes.forEach((scene) => {
          scene.cameras.main.setSize(window.innerWidth, window.innerHeight);
        });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      EventBus.removeListener("current-scene-ready", handleSceneReady);
      window.removeEventListener("resize", handleResize);
    };
  }, [gameRef]);

  return (
    <div>
      {!isLoading ? (
        <MenuHeader
          isMute={isMute}
          muteToggle={muteToggle}
          changeFriendModalOpen={changeModalOpen}
        />
      ) : null}

      <PlazaGame ref={gameRef} currentActiveScene={() => {}} />

      {isModalOpen ? <FriendModal onClose={onClose} /> : null}
    </div>
  );
}
