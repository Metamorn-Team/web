"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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
          comments={[
            "크크, 반갑구나! 혹시... 메타몬은 처음이지? 킁킁, 냄새가 새롭군그래!",
            "여긴 메타몬의 로비야~ 이곳에선 몇 가지... *절대로* 잊으면 안 될 것들이 있지. 알려줄까 말까?",
            "저기 있는 여러 관심사의 광산으로 들어가서 친구를 사귀고, 다양한 활동을 할 수 있지.",
            "저기 보이는 광산들 말이야, 다 다른 관심사를 가진 녀석들로 가득하지. 거기로 들어가면 친구도 사귈 수 있고, 신나는 일들이 펑펑 터질 거야!",
            "근데 말이지... 한 번 만난 친구는 광산을 떠나면 다시는 못 만날 수도 있어. 마음에 드는 친구는 꼭, 아주 꼭! 친구 신청을 하라고~ 내 말 듣고 후회하진 않을 걸?",
            "나도... 소중한 친구를 잃어봤거든. 으흐흐... 아직도 그때 생각하면 심장이 꼬물꼬물해...",
            "광산 앞에 가면... E키를 눌러봐! 그냥 누르지 말고, 살짝 긴장하면서 눌러야 제맛이야~",
            "흐흐, 내가 도와줄 수 있는 건 여기까지야. 그래도 걱정 마~ 로비에 오면 언제든지 나를 다시 볼 수 있을 테니까! 안녕~ 크크큭!",
          ]}
        />
      ) : null}

      {isModalOpen ? <FriendModal onClose={onClose} /> : null}

      {isPlayerModalOpen ? (
        <PlayerInfoModal onClose={onPlayerModalClose} playerInfo={playerInfo} />
      ) : null}
    </div>
  );
}
