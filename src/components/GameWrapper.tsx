"use client";

import { useState, useRef, useEffect } from "react";
import { AxiosError } from "axios";
import Game, { GameRef } from "@/components/Game";
import MenuHeader from "@/components/MenuHeader";
import { EventWrapper } from "@/game/event/EventBus";
import { useModal } from "@/hook/useModal";
import FriendModal from "@/components/FriendModal";
import { Phaser } from "@/game/phaser";
import { setItem } from "@/utils/session-storage";
import TalkModal from "@/components/common/TalkModal";
import { Npc } from "@/game/entities/npc/npc";
import GoblinTorch from "@/components/common/GoblinTorch";
import { UserInfo } from "@/types/socket-io/response";
import PlayerInfoModal from "@/components/PlayerInfoModal";
import { 친절한_토치_고블린 } from "@/constants/game/talk-scripts";
import LoginModal from "@/components/login/LoginModal";
import { getMyProfile } from "@/api/user";
import { persistItem } from "@/utils/persistence";
import ChatPanel from "@/components/ChatPanel";
import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import { useAttackedSound } from "@/hook/useAttackedSound";
import Alert from "@/utils/alert";
import ParticipantPanel from "@/components/ParticipantsPanel";

interface GameWrapperProps {
  isLoading: boolean;
  changeIsLoading: (state: boolean) => void;
}

export default function GameWrapper({
  isLoading,
  changeIsLoading,
}: GameWrapperProps) {
  const gameRef = useRef<GameRef | null>(null);

  const [playerInfo, setPlayerInfo] = useState<UserInfo>({
    id: "",
    tag: "",
    avatarKey: "",
    nickname: "",
  });

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
  const [isVisibleChat, setIsVisibleChat] = useState(false);
  useAttackedSound();

  useEffect(() => {
    const handleSceneReady = (data: {
      scene: Phaser.Scene;
      socketNsp?: string;
    }) => {
      const { socketNsp } = data;

      if (gameRef.current) {
        setItem("current_scene", data.scene.scene.key);
        gameRef.current.game.canvas.style.display = "block";
        gameRef.current.currnetScene = data.scene;

        changeIsLoading(false);

        if (socketNsp === SOCKET_NAMESPACES.ISLAND) {
          setIsVisibleChat(true);
        } else {
          setIsVisibleChat(false);
        }
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

        EventWrapper.emitToGame("join-island", data);
      } catch (e: unknown) {
        if (e instanceof AxiosError) {
          if (e.status === 401 || e.status === 404) {
            onLoginModalOpen();
            return;
          }

          Alert.error("서버에 문제가 생겼어요 🛠️ 잠시후 다시 시도해주세요..");
        }
      }
    };

    EventWrapper.onUiEvent("current-scene-ready", handleSceneReady);
    EventWrapper.onUiEvent("start-change-scene", handleStartChangeScene);
    EventWrapper.onUiEvent("finish-change-scene", handleFinishChangeScene);
    EventWrapper.onUiEvent("npc-interaction-started", handleNpcInteraction);
    EventWrapper.onUiEvent("player-click", handlePlayerClick);
    EventWrapper.onUiEvent("request-join-island", handleRequestJoinIsland);

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
      EventWrapper.offUiEvent("current-scene-ready", handleSceneReady);
      EventWrapper.offUiEvent("start-change-scene", handleStartChangeScene);
      EventWrapper.offUiEvent("finish-change-scene", handleFinishChangeScene);
      EventWrapper.offUiEvent("npc-interaction-started", handleNpcInteraction);
      EventWrapper.offUiEvent("player-click", handlePlayerClick);
      EventWrapper.offUiEvent("request-join-island", handleRequestJoinIsland);

      window.removeEventListener("resize", handleResize);
    };
  }, [gameRef]);

  // 로그인 모달 떠 있을 떄 phaser 키 이벤트 비활성화
  useEffect(() => {
    if (
      !gameRef.current?.game.input.keyboard ||
      !gameRef.current?.game.input.mouse
    ) {
      return;
    }

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
        <MenuHeader changeFriendModalOpen={changeFriendModalOpen} />
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

      <LoginModal isOpen={isLoginModalOpen} onClose={onLoginModalClose} />

      {isVisibleChat ? <ChatPanel /> : null}
      {isVisibleChat ? <ParticipantPanel /> : null}
    </div>
  );
}
