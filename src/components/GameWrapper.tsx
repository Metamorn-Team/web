"use client";

import { useState, useRef, useEffect } from "react";
import { AxiosError } from "axios";
// import MenuHeader from "@/components/MenuHeader";
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
import HeaderSelector from "@/components/game/HeaderSelector";
import InviteModal from "@/components/islands/InviteModal";
import { useRouter } from "next/navigation";
import { PATH } from "@/constants/path";
import { socketManager } from "@/game/managers/socket-manager";
import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import RetroConfirmModalV2 from "@/components/common/RetroConfirmModalV2";
import { useIslandStore } from "@/stores/useIslandStore";
import RtcPanel from "@/components/rtc/RtcPanel";
import PlayersMediaPanel from "@/components/rtc/PlayersMediaPanel";
// import { useRtc } from "@/hook/rtc/useWebRtc";
import PermissionModal from "@/components/rtc/PermissionModal";
import { useRtc } from "@/hook/rtc/useRtc";
import Game, { GameRef } from "@/components/Game";

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

  const {
    isModalOpen: isLoginModalOpen,
    onClose: onLoginModalClose,
    onOpen: onLoginModalOpen,
  } = useModal();
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
  const {
    isModalOpen: isInviteModalOpen,
    onOpen: onInviteModalOpen,
    onClose: onInviteModalClose,
  } = useModal();
  const [isVisibleChat, setIsVisibleChat] = useState(false);
  const {
    isModalOpen: isIslandListModalOpen,
    onClose: onIslandListModalClose,
    onOpen: onIslandListModalOpen,
  } = useModal();
  const {
    isModalOpen: isExitModalOpen,
    onOpen: onExitModalOpen,
    onClose: onExitModalClose,
  } = useModal();
  useAttackedSound();

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

  // ----------------------- RTC TEST -----------------------

  // const myVideoRef = useRef<HTMLVideoElement | null>(null);
  // const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const {
    isCamOn,
    isConnected,
    isMicOn,
    isPermissionModalOpen,
    localMediaStream,
    peerMediaStreams,
    peerConnections,
    toggleCam,
    toggleMic,
    onPermissionModalClose,
    onPermissionModalOpen,
  } = useRtc();
  // const {
  //   camOn,
  //   micOn,
  //   screenSharing,
  //   mediaInitialized,
  //   isPermissionModalOpen,

  //   toggleCam,
  //   toggleMic,
  //   toggleScreenShare,
  //   stopUserMedia,
  //   onPermissionModalClose,
  // } = useRtc({
  //   islandId,
  //   myVideoRef,
  //   remoteVideoRef,
  // });

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // 로컬 비디오 스트림 연결
  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localMediaStream;
    }
    console.log("localMediaStream", localMediaStream);
  }, [localMediaStream]);

  // 원격 비디오 스트림 연결 (첫 번째 피어의 스트림)
  useEffect(() => {
    if (remoteVideoRef.current && peerMediaStreams.size > 0) {
      const firstStream = Array.from(peerMediaStreams.values())[0];
      remoteVideoRef.current.srcObject = firstStream;
      console.log("firstStream", firstStream.getTracks());
    }
  }, [peerMediaStreams]);

  // ----------------------- RTC TEST -----------------------

  return (
    <div>
      {/* <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
        <video
          ref={localVideoRef}
          autoPlay
          className="w-32 h-24 bg-black scale-x-[-1]"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          muted={false}
          className="w-32 h-24 bg-black scale-x-[-1]"
        />
      </div> */}
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
        </>
      ) : null}

      <Game ref={gameRef} currentActiveScene={() => {}} />

      {/* RTC 컨트롤 패널 */}
      <RtcPanel
        camOn={isCamOn}
        micOn={isMicOn}
        screenSharing={false}
        mediaInitialized={false}
        toggleCam={toggleCam}
        toggleMic={toggleMic}
        toggleScreenShare={() => {}}
        stopUserMedia={() => {}}
      />
      {/* fixed top-[68px] sm:top-[76px] right-3 sm:right-5 */}
      <PlayersMediaPanel
        peerConnections={peerConnections}
        peerMediaStreams={peerMediaStreams}
        localMediaStream={localMediaStream}
        className="fixed top-28 sm:top-32 right-3 sm:right-5"
      />

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
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={onInviteModalClose}
        inviteUrl={typeof window !== "undefined" ? window.location.href : ""}
      />
      {isExitModalOpen ? (
        <RetroConfirmModalV2
          isOpen={isExitModalOpen}
          onClose={onExitModalClose}
          onConfirm={handleExitIsland}
          title="섬을 떠나시겠어요?"
          modalClassName="!max-w-[320px]"
        />
      ) : null}

      {isPermissionModalOpen ? (
        <PermissionModal
          isOpen={isPermissionModalOpen}
          onClose={onPermissionModalClose}
        />
      ) : null}
    </div>
  );
}
