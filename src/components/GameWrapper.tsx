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
import { setItem } from "@/utils/session-storage";
import TalkModal from "@/components/common/TalkModal";
import { Npc } from "@/game/entities/npc/npc";
import GoblinTorch from "@/components/common/GoblinTorch";
import { Socket } from "socket.io-client";
import { socketManager } from "@/game/managers/socket-manager";
import { UserInfo } from "@/types/socket-io/response";
import PlayerInfoModal from "@/components/PlayerInfoModal";

interface GameWrapperProps {
  isLoading: boolean;
  changeIsLoading: (state: boolean) => void;
}

export default function GameWrapper({
  isLoading,
  changeIsLoading,
}: GameWrapperProps) {
  const gameRef = useRef<GameRef | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [playerInfo, setPlayerInfo] = useState<UserInfo>({
    id: "",
    nickname: "",
  });

  const [isPlayBgm, setIsPlayBgm] = useState(true);
  const { isModalOpen, changeModalOpen, onClose } = useModal();
  const {
    isModalOpen: isPortalModalOpen,
    onOpen: onPortalModalOpen,
    onClose: onPortalModalClose,
  } = useModal();
  const {
    isModalOpen: isHelpModalOpen,
    onOpen: onHelpOpen,
    onClose: onHelpClose,
  } = useModal();
  const {
    isModalOpen: isPlayerModalOpen,
    onClose: onPlayerModalClose,
    onOpen: onPlayerModalOpen,
  } = useModal();

  const playBgmToggle = useCallback(() => {
    if (gameRef.current) {
      const scene = gameRef.current.game.scene.getScene<LobyScene>("LobyScene");
      // scene.setBgmPlay(!isPlayBgm);
      scene.setBgmPlay(false);
      setIsPlayBgm((state) => !state);
    }
  }, [gameRef, isPlayBgm]);

  useEffect(() => {
    const handleSceneReady = (data: {
      scene: Phaser.Scene;
      socketNsp: string;
    }) => {
      if (gameRef.current) {
        setItem("current_scene", data.scene.scene.key);
        socketRef.current = socketManager.connect(data.socketNsp)!;
        gameRef.current.game.canvas.style.display = "block";
        gameRef.current.currnetScene = data.scene;

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

    const handleNpcInteraction = (data: { npc: Npc; type: "guide" }) => {
      if (data.type === "guide") {
        onHelpOpen();
      }
    };

    const handlePlayerClick = (userInfo: UserInfo) => {
      console.log(userInfo);
      setPlayerInfo(userInfo);
      onPlayerModalOpen();
    };

    EventBus.on("current-scene-ready", handleSceneReady);
    EventBus.on("in-portal", handleInPortal);
    EventBus.on("out-portal", handleOutPortal);
    EventBus.on("start-change-scene", handleStartChangeScene);
    EventBus.on("finish-change-scene", handleFinishChangeScene);
    EventBus.on("npc-interaction-started", handleNpcInteraction);
    EventBus.on("player-click", handlePlayerClick);

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

      {isHelpModalOpen ? (
        <TalkModal
          onClose={onHelpClose}
          avatar={<GoblinTorch />}
          name="친절한 토치 고블린"
        >
          <div>안녕 스넬 메타몬은 처음인가?</div>
        </TalkModal>
      ) : null}

      {isModalOpen ? <FriendModal onClose={onClose} /> : null}

      {isPortalModalOpen ? (
        <Modal onClose={onPortalModalClose} className="w-2/6">
          <div className="flex flex-col justify-between">
            <div>이동 하실?</div>
            <Button
              onClick={moveToZone}
              color="yellow"
              title="이동"
              width={"50%"}
            />
          </div>
        </Modal>
      ) : null}

      {isPlayerModalOpen ? (
        <PlayerInfoModal onClose={onPlayerModalClose} playerInfo={playerInfo} />
      ) : null}
    </div>
  );
}
