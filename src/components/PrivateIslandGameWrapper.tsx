"use client";

import { useState, useRef, useEffect } from "react";
import { EventWrapper } from "@/game/event/EventBus";
import { useModal } from "@/hook/useModal";
import { Phaser } from "@/game/phaser";
import { setItem } from "@/utils/session-storage";
import { UserInfo } from "@/types/socket-io/response";
import { persistItem } from "@/utils/persistence";
import { useAttackedSound } from "@/hook/useAttackedSound";
import { ISLAND_SCENE, MY_ISLAND_SCENE } from "@/constants/game/islands/island";
import { useGetMyProfile } from "@/hook/queries/useGetMyProfile";
import MyIsland from "@/components/my-island/MyIsland";
import { useCurrentSceneStore } from "@/stores/useCurrentSceneStore";
import MobileWarningBanner from "./common/MobileWarningBanner";
import { useRouter } from "next/navigation";
import { PATH } from "@/constants/path";
import { socketManager } from "@/game/managers/socket-manager";
import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import RtcPanel from "@/components/rtc/RtcPanel";
import PlayersMediaPanel from "@/components/rtc/PlayersMediaPanel";
import { useRtc } from "@/hook/rtc/useRtc";
import Game, { GameRef } from "@/components/Game";
import CommonIslandModals from "@/components/islands/CommonIslandModals";
import PrivateIslandModals from "@/components/islands/PrivateIslandModals";
import { useDisableGameInputWhenOpen } from "@/hook/useDisableGameInputWhenOpen";
import PrivateIslandHeader from "@/components/game/PrivateIslandHeader";

interface PrivateIslandGameWrapperProps {
  isLoading: boolean;
  changeIsLoading: (state: boolean) => void;
}

export default function PrivateIslandGameWrapper({
  isLoading,
  changeIsLoading,
}: PrivateIslandGameWrapperProps) {
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

  // 모달 열릴 때 phaser 키 이벤트 비활성화
  useDisableGameInputWhenOpen(
    isFriendModalOpen,
    isPlayerModalOpen,
    isIslandInfoModalOpen
  );

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

    const handlePlayerClick = (userInfo: UserInfo) => {
      console.log(userInfo);
      setPlayerInfo(userInfo);
      onPlayerModalOpen();
    };

    EventWrapper.onUiEvent("current-scene-ready", handleSceneReady);
    EventWrapper.onUiEvent("start-change-scene", handleStartChangeScene);
    EventWrapper.onUiEvent("finish-change-scene", handleFinishChangeScene);
    EventWrapper.onUiEvent("player-click", handlePlayerClick);

    return () => {
      EventWrapper.offUiEvent("current-scene-ready", handleSceneReady);
      EventWrapper.offUiEvent("start-change-scene", handleStartChangeScene);
      EventWrapper.offUiEvent("finish-change-scene", handleFinishChangeScene);
      EventWrapper.offUiEvent("player-click", handlePlayerClick);
    };
  }, [gameRef]);

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
          <PrivateIslandHeader
            onDevModalOpen={onDevOpen}
            onExitModalOpen={onExitModalOpen}
            onFriendModalOpen={onFriendModalOpen}
            onInviteModalOpen={onInviteModalOpen}
            onIslandInfoModalOpen={onIslandInfoModalOpen}
            onSettingsModalOpen={onSettingsModalOpen}
            onUpdateOpen={onUpdateOpen}
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

      {/* 내섬 */}
      {currentScene === MY_ISLAND_SCENE ? <MyIsland /> : null}

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
