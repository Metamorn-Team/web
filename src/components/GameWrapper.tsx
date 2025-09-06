"use client";

import { useState, useRef, useEffect } from "react";
import { AxiosError } from "axios";
import { EventWrapper } from "@/game/event/EventBus";
import { useModal } from "@/hook/useModal";
import { Phaser } from "@/game/phaser";
import { setItem } from "@/utils/session-storage";
import { Npc } from "@/game/entities/npc/npc";
import { UserInfo } from "@/types/socket-io/response";
import { getMyProfile } from "@/api/user";
import { persistItem } from "@/utils/persistence";
import { useAttackedSound } from "@/hook/useAttackedSound";
import Alert from "@/utils/alert";
import { ISLAND_SCENE, MY_ISLAND_SCENE } from "@/constants/game/islands/island";
import { useGetMyProfile } from "@/hook/queries/useGetMyProfile";
import MyIsland from "@/components/my-island/MyIsland";
import { useCurrentSceneStore } from "@/stores/useCurrentSceneStore";
import MobileWarningBanner from "./common/MobileWarningBanner";
import HeaderSelector from "@/components/game/HeaderSelector";
import { useRouter } from "next/navigation";
import { PATH } from "@/constants/path";
import { socketManager } from "@/game/managers/socket-manager";
import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import { useIslandStore } from "@/stores/useIslandStore";
import RtcPanel from "@/components/rtc/RtcPanel";
import PlayersMediaPanel from "@/components/rtc/PlayersMediaPanel";
import { useRtc } from "@/hook/rtc/useRtc";
import Game, { GameRef } from "@/components/Game";
import CommonIslandModals from "@/components/islands/CommonIslandModals";
import DefaultIslandModals from "@/components/islands/DefaultIslandModals";
import PrivateIslandModals from "@/components/islands/PrivateIslandModals";

interface GameWrapperProps {
  isLoading: boolean;
  changeIsLoading: (state: boolean) => void;
  type?: "default" | "private";
}

export default function GameWrapper({
  isLoading,
  changeIsLoading,
  type = "default",
}: GameWrapperProps) {
  const gameRef = useRef<GameRef | null>(null);
  const router = useRouter();

  const [playerInfo, setPlayerInfo] = useState<UserInfo>({
    id: "",
    tag: "",
    avatarKey: "",
    nickname: "",
  });
  const { currentScene, setCurrentScene } = useCurrentSceneStore();

  // NOTE COMMON
  const {
    isModalOpen: isFriendModalOpen,
    onOpen: onFriendModalOpen,
    onClose: onFriendClose,
  } = useModal();
  const {
    isModalOpen: isIslandInfoModalOpen,
    onOpen: onIslandInfoModalOpen,
    onClose: onIslandInfoModalClose,
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

  // NOTE Default
  const {
    isModalOpen: isLoginModalOpen,
    onClose: onLoginModalClose,
    onOpen: onLoginModalOpen,
  } = useModal();
  const {
    isModalOpen: isHelpModalOpen,
    onOpen: onHelpOpen,
    onClose: onHelpClose,
  } = useModal();
  const {
    isModalOpen: isIslandListModalOpen,
    onClose: onIslandListModalClose,
    onOpen: onIslandListModalOpen,
  } = useModal();

  // NOTE PRIVATE
  const {
    isModalOpen: isInviteModalOpen,
    onOpen: onInviteModalOpen,
    onClose: onInviteModalClose,
  } = useModal();

  const {
    isModalOpen: isExitModalOpen,
    onOpen: onExitModalOpen,
    onClose: onExitModalClose,
  } = useModal();
  useAttackedSound();
  const {
    isModalOpen: isRtcSettingModalOpen,
    onOpen: onRtcSettingModalOpen,
    onClose: onRtcSettingModalClose,
  } = useModal();

  const { data: profile } = useGetMyProfile();
  const { id: islandId } = useIslandStore();

  const handleExitIsland = () => {
    socketManager.disconnect(SOCKET_NAMESPACES.ISLAND);
    router.replace(PATH.ISLANDS);
  };

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

  // 섬 입장 시 자동으로 RTC 방 참여
  useEffect(() => {
    if (islandId && !isLoading) {
      // RTC 방 참여는 RtcProvider 내부에서 처리됨
    }
  }, [islandId, isLoading]);

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

  // ----------------------- RTC -----------------------

  const {
    isCamOn,
    isMicOn,
    selectedMicId,
    selectedCamId,
    isPermissionModalOpen,
    localMediaStream,
    peerMediaStreams,
    peerConnections,
    toggleCam,
    toggleMic,
    onPermissionModalClose,
    changeMicDevice,
    changeCamDevice,
  } = useRtc();

  return (
    <div>
      {!isLoading ? (
        <>
          <HeaderSelector
            type={type}
            onExitModalOpen={onExitModalOpen}
            onFriendModalOpen={onFriendModalOpen}
            onSettingsModalOpen={onSettingsModalOpen}
            onDevModalOpen={onDevOpen}
            onUpdateOpen={onUpdateOpen}
            onIslandInfoModalOpen={onIslandInfoModalOpen}
            onInviteModalOpen={onInviteModalOpen}
          />
          <MobileWarningBanner />

          {/* RTC 컨트롤 패널 */}
          <RtcPanel
            camOn={isCamOn}
            micOn={isMicOn}
            openSettings={onRtcSettingModalOpen}
            toggleCam={toggleCam}
            toggleMic={toggleMic}
          />
          <PlayersMediaPanel
            peerConnections={peerConnections}
            peerMediaStreams={peerMediaStreams}
            localMediaStream={localMediaStream}
            className="fixed top-28 sm:top-32 right-3 sm:right-5"
          />
        </>
      ) : null}

      {/* SCENE */}
      <Game ref={gameRef} currentActiveScene={() => {}} />

      {/* NORMAL ONLY */}
      <DefaultIslandModals
        isHelpModalOpen={isHelpModalOpen}
        isLoginModalOpen={isLoginModalOpen}
        isIslandListModalOpen={isIslandListModalOpen}
        onHelpClose={onHelpClose}
        onLoginModalClose={onLoginModalClose}
        onIslandListModalClose={onIslandListModalClose}
      />

      {/* COMMON */}
      <CommonIslandModals
        playerInfo={playerInfo}
        isVisibleChat={isVisibleChat}
        isFriendModalOpen={isFriendModalOpen}
        isIslandInfoModalOpen={isIslandInfoModalOpen}
        isPlayerModalOpen={isPlayerModalOpen}
        isSettingsModalOpen={isSettingsModalOpen}
        isDevModalOpen={isDevModalOpen}
        isUpdateModalOpen={isUpdateModalOpen}
        onFriendClose={onFriendClose}
        onIslandInfoModalClose={onIslandInfoModalClose}
        onPlayerModalClose={onPlayerModalClose}
        onSettingsModalClose={onSettingsModalClose}
        onDevClose={onDevClose}
        onUpdateClose={onUpdateClose}
      />

      {/* 내섬? */}
      {currentScene === MY_ISLAND_SCENE ? <MyIsland /> : null}

      {/* PRIVATE ONLY */}
      <PrivateIslandModals
        isInviteModalOpen={isInviteModalOpen}
        onInviteModalClose={onInviteModalClose}
        isExitModalOpen={isExitModalOpen}
        onExitModalClose={onExitModalClose}
        handleExitIsland={handleExitIsland}
        isPermissionModalOpen={isPermissionModalOpen}
        onPermissionModalClose={onPermissionModalClose}
        isRtcSettingModalOpen={isRtcSettingModalOpen}
        onRtcSettingModalClose={onRtcSettingModalClose}
        selectedCamId={selectedCamId}
        selectedMicId={selectedMicId}
        changeMicDevice={changeMicDevice}
        changeCamDevice={changeCamDevice}
      />
    </div>
  );
}
