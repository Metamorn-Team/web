"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { AxiosError } from "axios";
import Game, { GameRef } from "@/components/Game";
import { LobyScene } from "@/game/scenes/loby-scene";
import MenuHeader from "@/components/MenuHeader";
import { EventBus } from "@/game/event/EventBus";
import { useModal } from "@/hook/useModal";
import FriendModal from "@/components/FriendModal";
import { Phaser } from "@/game/phaser";
import { setItem } from "@/utils/session-storage";
import TalkModal from "@/components/common/TalkModal";
import { Npc } from "@/game/entities/npc/npc";
import GoblinTorch from "@/components/common/GoblinTorch";
import { Socket } from "socket.io-client";
import { socketManager } from "@/game/managers/socket-manager";
import { UserInfo } from "@/types/socket-io/response";
import PlayerInfoModal from "@/components/PlayerInfoModal";
import { 친절한_토치_고블린 } from "@/constants/game/talk-scripts";
import LoginModal from "@/components/login/LoginModal";
import { getMyProfile } from "@/api/user";
import { persistItem } from "@/utils/persistence";
import ChatPanel from "@/components/ChatPanel";

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
    tag: "",
    avatarKey: "",
    nickname: "",
  });

  const [isPlayBgm, setIsPlayBgm] = useState(true);
  const {
    isModalOpen: isLoginModalOpen,
    onClose: onLoginModalClose,
    onOpen: onLoginModalOpen,
  } = useModal();
  const {
    isModalOpen: isFriendModalOpen,
    changeModalOpen: changeFriendModalOpen,
    onClose: onFriendClose,
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
  }, [gameRef]);

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

    const handleRequestJoinIsland = async (data: {
      type: "dev" | "design";
    }) => {
      try {
        const userInfo = await getMyProfile();
        persistItem("profile", userInfo);

        EventBus.emit("join-island", data);
      } catch (e: unknown) {
        if (e instanceof AxiosError && e.status === 401) {
          onLoginModalOpen();
        }
      }
    };

    EventBus.on("current-scene-ready", handleSceneReady);
    EventBus.on("start-change-scene", handleStartChangeScene);
    EventBus.on("finish-change-scene", handleFinishChangeScene);
    EventBus.on("npc-interaction-started", handleNpcInteraction);
    EventBus.on("player-click", handlePlayerClick);
    EventBus.on("request-join-island", handleRequestJoinIsland);

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
      EventBus.removeListener("start-change-scene", handleStartChangeScene);
      EventBus.removeListener("finish-change-scene", handleFinishChangeScene);
      EventBus.removeListener("npc-interaction-started", handleNpcInteraction);
      EventBus.removeListener("player-click", handlePlayerClick);
      EventBus.removeListener("request-join-island", handleRequestJoinIsland);

      window.removeEventListener("resize", handleResize);
    };
  }, [gameRef]);

  // 로그인 모달 떠 있을 떄 phaser 키 이벤트 비활성화
  useEffect(() => {
    if (
      !gameRef.current?.game.input.keyboard ||
      !gameRef.current?.game.input.mouse
    )
      return;
    if (
      isHelpModalOpen ||
      isFriendModalOpen ||
      isPlayerModalOpen ||
      isLoginModalOpen
    ) {
      gameRef.current.game.input.keyboard.enabled = false;
      gameRef.current.game.input.mouse.enabled = false;
    } else {
      gameRef.current.game.input.keyboard.enabled = true;
      gameRef.current.game.input.mouse.enabled = true;
    }
  }, [isFriendModalOpen, isHelpModalOpen, isLoginModalOpen, isPlayerModalOpen]);

  return (
    <div>
      {!isLoading ? (
        <MenuHeader
          isPlayBgm={isPlayBgm}
          playBgmToggle={playBgmToggle}
          changeFriendModalOpen={changeFriendModalOpen}
        />
      ) : null}

      <Game ref={gameRef} currentActiveScene={() => {}} />

      {isHelpModalOpen ? (
        <TalkModal
          onClose={onHelpClose}
          avatar={<GoblinTorch />}
          name="친절한 토치 고블린"
          comments={친절한_토치_고블린}
        />
      ) : null}

      {isFriendModalOpen ? <FriendModal onClose={onFriendClose} /> : null}

      {isPlayerModalOpen ? (
        <PlayerInfoModal onClose={onPlayerModalClose} playerInfo={playerInfo} />
      ) : null}

      {isLoginModalOpen ? <LoginModal onClose={onLoginModalClose} /> : null}

      <ChatPanel />
    </div>
  );
}
