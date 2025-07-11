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
import { 지친_토치_고블린 } from "@/constants/game/talk-scripts";
import LoginModal from "@/components/login/LoginModal";
import { getMyProfile } from "@/api/user";
import { persistItem } from "@/utils/persistence";
import ChatPanel from "@/components/chat/ChatPanel";
import { useAttackedSound } from "@/hook/useAttackedSound";
import Alert from "@/utils/alert";
import ParticipantPanel from "@/components/ParticipantsPanel";
import SettingsModal from "@/components/SettingsModal";
import IslandListModal from "@/components/islands/IslandListModal";
import { ISLAND_SCENE, MY_ISLAND_SCENE } from "@/constants/game/islands/island";
import ControlGuide from "@/components/ControlGuide";
import HelpModal from "@/components/HelpModal";
import IslandInfoModal from "@/components/IslandInfoModal";
import { useGetMyProfile } from "@/hook/queries/useGetMyProfile";
import MyIsland from "@/components/my-island/MyIsland";
import { useCurrentSceneStore } from "@/stores/useCurrentSceneStore";
import UpdateNoteModal from "@/components/UpdateNoteModal";
import MobileWarningBanner from "./common/MobileWarningBanner";

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
  const { currentScene, setCurrentScene } = useCurrentSceneStore();

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
    isModalOpen: isIslandInfoModalOpen,
    onOpen: onIslandInfoModalOpen,
    onClose: onIslandInfoModalClose,
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
  const {
    isModalOpen: isSettingsModalOpen,
    onClose: onSettingsModalClose,
    onOpen: onSettingsModalOpen,
  } = useModal();
  const {
    isModalOpen: isDevModalOpen,
    onOpen: onDevOpen,
    onClose: onDevClose,
  } = useModal();
  const {
    isModalOpen: isUpdateModalOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useModal();
  const [isVisibleChat, setIsVisibleChat] = useState(false);
  const {
    isModalOpen: isIslandListModalOpen,
    onClose: onIslandListModalClose,
    onOpen: onIslandListModalOpen,
  } = useModal();
  useAttackedSound();

  const { data: profile } = useGetMyProfile();

  useEffect(() => {
    if (profile) {
      persistItem("profile", profile);
    }
  }, [profile]);

  useEffect(() => {
    const handleSceneReady = (data: {
      scene: Phaser.Scene;
      socketNsp?: string;
    }) => {
      const { scene } = data;
      if (gameRef.current) {
        const currentSceneKey = data.scene.scene.key;

        setItem("current_scene", currentSceneKey);
        setCurrentScene(currentSceneKey);
        gameRef.current.game.canvas.style.opacity = "1";
        gameRef.current.currnetScene = data.scene;

        changeIsLoading(false);

        if (scene.sys.settings.key === ISLAND_SCENE) {
          setIsVisibleChat(true);
        } else {
          setIsVisibleChat(false);
        }
      }
    };

    const handleStartChangeScene = () => {
      if (gameRef.current) {
        changeIsLoading(true);
        gameRef.current.game.canvas.style.opacity = "0";
      }
    };

    const handleFinishChangeScene = () => {
      if (gameRef.current) {
        changeIsLoading(false);
        // gameRef.current.game.canvas.style.display = "block";
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

    const handleRequestJoinIsland = async () => {
      try {
        const userInfo = await getMyProfile();
        persistItem("profile", userInfo);

        onIslandListModalOpen();
      } catch (e: unknown) {
        if (e instanceof AxiosError) {
          if (e.status === 401 || e.status === 404) {
            onLoginModalOpen();
            return;
          }

          Alert.error("서버에 문제가 생겼어요 잠시후 다시 시도해주세요..");
        }
      }
    };

    const handleOpenLoginModal = () => onLoginModalOpen();

    EventWrapper.onUiEvent("current-scene-ready", handleSceneReady);
    EventWrapper.onUiEvent("start-change-scene", handleStartChangeScene);
    EventWrapper.onUiEvent("finish-change-scene", handleFinishChangeScene);
    EventWrapper.onUiEvent("npc-interaction-started", handleNpcInteraction);
    EventWrapper.onUiEvent("player-click", handlePlayerClick);
    EventWrapper.onUiEvent("requestJoinIsland", handleRequestJoinIsland);
    EventWrapper.onUiEvent("openLoginModal", handleOpenLoginModal);

    return () => {
      EventWrapper.offUiEvent("current-scene-ready", handleSceneReady);
      EventWrapper.offUiEvent("start-change-scene", handleStartChangeScene);
      EventWrapper.offUiEvent("finish-change-scene", handleFinishChangeScene);
      EventWrapper.offUiEvent("npc-interaction-started", handleNpcInteraction);
      EventWrapper.offUiEvent("player-click", handlePlayerClick);
      EventWrapper.offUiEvent("requestJoinIsland", handleRequestJoinIsland);
      EventWrapper.offUiEvent("openLoginModal", handleOpenLoginModal);
    };
  }, [gameRef]);

  // 로그인 모달 떠 있을 떄 phaser 키 이벤트 비활성화
  useEffect(() => {
    if (
      isHelpModalOpen ||
      isFriendModalOpen ||
      isPlayerModalOpen ||
      isLoginModalOpen ||
      isIslandListModalOpen ||
      isIslandInfoModalOpen
    ) {
      EventWrapper.emitToGame("disableGameInput");
    } else {
      EventWrapper.emitToGame("enableGameKeyboardInput");
    }
  }, [
    isFriendModalOpen,
    isHelpModalOpen,
    isIslandListModalOpen,
    isLoginModalOpen,
    isPlayerModalOpen,
    isIslandInfoModalOpen,
  ]);

  return (
    <div>
      {!isLoading ? (
        <>
          <MenuHeader
            changeFriendModalOpen={changeFriendModalOpen}
            onSettingsModalOpen={onSettingsModalOpen}
            onDevModalOpen={onDevOpen}
            onUpdateOpen={onUpdateOpen}
            onIslandInfoModalOpen={onIslandInfoModalOpen}
          />
          <MobileWarningBanner />
        </>
      ) : null}

      <Game ref={gameRef} currentActiveScene={() => {}} />

      {isHelpModalOpen ? (
        <TalkModal
          onClose={onHelpClose}
          avatar={<GoblinTorch />}
          name="토치 고블린"
          comments={지친_토치_고블린}
        />
      ) : null}

      {isFriendModalOpen ? <FriendModal onClose={onFriendClose} /> : null}

      <IslandInfoModal
        isOpen={isIslandInfoModalOpen}
        onClose={onIslandInfoModalClose}
      />

      {isPlayerModalOpen ? (
        <PlayerInfoModal onClose={onPlayerModalClose} playerInfo={playerInfo} />
      ) : null}

      <LoginModal isOpen={isLoginModalOpen} onClose={onLoginModalClose} />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={onSettingsModalClose}
      />

      {isIslandListModalOpen ? (
        <IslandListModal
          isOpen={isIslandListModalOpen}
          onClose={onIslandListModalClose}
          onSelectIsland={() => {}}
          onCreateIsland={() => {}}
          onJoinRandomIsland={() => {
            EventWrapper.emitToGame("joinDesertedIsland");
            onIslandListModalClose();
          }}
        />
      ) : null}
      {isVisibleChat ? <ChatPanel /> : null}
      {isVisibleChat ? <ParticipantPanel /> : null}
      {<ControlGuide />}
      {isDevModalOpen ? (
        <HelpModal isOpen={isDevModalOpen} onClose={onDevClose} />
      ) : null}

      {isUpdateModalOpen ? (
        <UpdateNoteModal isOpen={isUpdateModalOpen} onClose={onUpdateClose} />
      ) : null}

      {currentScene === MY_ISLAND_SCENE ? <MyIsland /> : null}
    </div>
  );
}
