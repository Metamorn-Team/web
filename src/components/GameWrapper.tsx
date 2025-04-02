"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Game, { GameRef } from "@/components/Game";
import { LobyScene } from "@/game/scenes/loby-scene";
import MenuHeader from "@/components/MenuHeader";
import { EventBus } from "@/game/event/EventBus";
import { useModal } from "@/hook/useModal";
import FriendModal from "@/components/FriendModal";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { Phaser } from "@/game/phaser";
import { persistItem } from "@/utils/persistence";

interface GameWrapperProps {
  isLoading: boolean;
  changeIsLoading: (state: boolean) => void;
}

export default function GameWrapper({
  isLoading,
  changeIsLoading,
}: GameWrapperProps) {
  const gameRef = useRef<GameRef | null>(null);
  const [isPlayBgm, setIsPlayBgm] = useState(true);
  const { isModalOpen, changeModalOpen, onClose } = useModal();
  const {
    isModalOpen: isPortalModalOpen,
    onOpen: onPortalModalOpen,
    onClose: onPortalModalClose,
  } = useModal();

  const playBgmToggle = useCallback(() => {
    if (gameRef.current) {
      const scene = gameRef.current.game.scene.getScene<LobyScene>("LobyScene");
      scene.setBgmPlay(!isPlayBgm);
      setIsPlayBgm((state) => !state);
    }
  }, [gameRef, isPlayBgm]);

  useEffect(() => {
    const handleSceneReady = (scene: Phaser.Scene) => {
      if (gameRef.current) {
        persistItem("current_scene", scene.scene.key);
        gameRef.current.game.canvas.style.display = "block";
        gameRef.current.currnetScene = scene;
        changeIsLoading(false);
      }
    };

    const handleInPortal = () => {
      onPortalModalOpen();
    };

    const handleOutPortal = () => {
      onPortalModalClose();
    };

    const handleStartChangeScene = () => {
      if (gameRef.current) {
        changeIsLoading(true);
        gameRef.current.game.canvas.style.display = "none";
      }
    };

    const handleFinishChangeScene = () => {
      if (gameRef.current) {
        changeIsLoading(false);
        gameRef.current.game.canvas.style.display = "block";
      }
    };

    EventBus.on("current-scene-ready", handleSceneReady);
    EventBus.on("in-portal", handleInPortal);
    EventBus.on("out-portal", handleOutPortal);
    EventBus.on("start-change-scene", handleStartChangeScene);
    EventBus.on("finish-change-scene", handleFinishChangeScene);

    const handleResize = () => {
      if (gameRef.current) {
        gameRef.current.game.scale.resize(
          window.innerWidth,
          window.innerHeight
        );
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      EventBus.removeListener("current-scene-ready", handleSceneReady);
      window.removeEventListener("resize", handleResize);
    };
  }, [gameRef]);

  const moveToZone = () => {
    onPortalModalClose();
    EventBus.emit("move-to-zone");
  };

  return (
    <div>
      {!isLoading ? (
        <MenuHeader
          isPlayBgm={isPlayBgm}
          playBgmToggle={playBgmToggle}
          changeFriendModalOpen={changeModalOpen}
        />
      ) : null}

      <Game ref={gameRef} currentActiveScene={() => {}} />

      {isModalOpen ? <FriendModal onClose={onClose} /> : null}
      {isPortalModalOpen ? (
        <Modal onClose={onPortalModalClose}>
          <div className="flex flex-col justify-between">
            <div>이동 하실?</div>
            <Button
              onClick={moveToZone}
              color="yellow"
              title="이동"
              width={200}
            />
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
