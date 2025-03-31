"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import PlazaGame, { GameRef } from "@/components/PlazaGame";
import { PlazaScene } from "@/game/scenes/plaza-scene";
import MenuHeader from "@/components/MenuHeader";
import { EventBus } from "@/game/event/EventBus";
import { useModal } from "@/hook/useModal";
import FriendModal from "@/components/FriendModal";

export default function PlazaGameWrapper() {
  const gameRef = useRef<GameRef | null>(null);
  const [isMute, setIsMute] = useState(false);
  const { isModalOpen, changeModalOpen, close } = useModal();

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
        console.log("ready!");
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
  }, [gameRef.current?.game]);

  return (
    <div>
      <MenuHeader
        isMute={isMute}
        muteToggle={muteToggle}
        changeFriendModalOpen={changeModalOpen}
      />
      <PlazaGame ref={gameRef} currentActiveScene={() => {}} />

      {isModalOpen ? <FriendModal onClose={close} /> : null}
    </div>
  );
}
