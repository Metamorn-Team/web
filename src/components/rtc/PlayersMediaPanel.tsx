"use client";

import React from "react";
import PlayerMediaBox from "./PlayerMediaBox";
import { useGetMyProfile } from "@/hook/queries/useGetMyProfile";
import classNames from "classnames";

interface PlayersMediaPanelProps {
  videoRefs: { [userId: string]: React.RefObject<HTMLVideoElement | null> }[];
  myVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
  className?: string;
}

export default function PlayersMediaPanel({
  myVideoRef,
  remoteVideoRef,
  className,
}: PlayersMediaPanelProps) {
  // const {
  //   localStream,
  //   isScreenSharing,
  //   remotePlayers,
  //   isSpeaking,
  //   remoteStreams,
  // } = useRtc();
  const { data: profile } = useGetMyProfile();

  // const voiceDetectorsRef = useRef<Map<string, VoiceDetector>>(new Map());

  // 원격 플레이어들의 음성 감지 설정
  // useEffect(() => {
  //   // 기존 음성 감지기 정리
  //   voiceDetectorsRef.current.forEach((detector) => detector.stop());
  //   voiceDetectorsRef.current.clear();

  //   // 각 원격 플레이어에 대해 음성 감지기 생성
  //   remoteStreams.forEach((stream, peerId) => {
  //     const detector = new VoiceDetector((speaking) => {
  //       setPlayers((prev) => {
  //         const newPlayers = [...prev];
  //         const playerIndex = newPlayers.findIndex((p) => p.id === peerId);
  //         if (playerIndex !== -1) {
  //           newPlayers[playerIndex] = {
  //             ...newPlayers[playerIndex],
  //             isSpeaking: speaking,
  //           };
  //         }
  //         return newPlayers;
  //       });
  //     });

  //     detector.start(stream);
  //     voiceDetectorsRef.current.set(peerId, detector);
  //   });

  //   // 정리 함수
  //   return () => {
  //     voiceDetectorsRef.current.forEach((detector) => detector.stop());
  //     voiceDetectorsRef.current.clear();
  //   };
  // }, [remoteStreams]);

  // 로컬 플레이어와 원격 플레이어 정보 설정
  // useEffect(() => {
  //   if (profile) {
  //     const localPlayer: Player = {
  //       id: profile.id,
  //       name: profile.nickname || "나",
  //       avatarUrl: profile.avatarKey
  //         ? `/images/avatar/${profile.avatarKey}.png`
  //         : undefined,
  //       isSpeaking: false, // RtcProvider에서 가져온 실시간 음성 상태
  //     };

  //     // 원격 플레이어들을 배열로 변환
  //     const remotePlayersArray: Player[] = Array.from(
  //       remotePlayers.values()
  //     ).map((player) => ({
  //       id: player.id,
  //       name: player.name,
  //       avatarUrl: player.avatarUrl,
  //       isSpeaking: player.isSpeaking,
  //     }));

  //     // 로컬 플레이어를 맨 앞에, 원격 플레이어들을 뒤에 배치
  //     setPlayers([localPlayer, ...remotePlayersArray]);
  //   }
  // }, [profile, isSpeaking, remotePlayers]);

  // 카메라와 화면공유를 동시에 할 때만 별도 박스 생성
  // const shouldShowSeparateScreenBox =
  //   isScreenSharing &&
  //   localStream &&
  //   localStream.getVideoTracks().length > 0 &&
  //   localStream.getVideoTracks().some((track) => track.enabled);
  // const shouldShowSeparateScreenBox = false;

  return (
    <div
      className={classNames("fixed top-4 right-4 z-40 space-y-4", className)}
    >
      {/* 플레이어들 미디어 박스 */}
      <PlayerMediaBox
        key={profile?.id || "local-player"}
        playerId={profile?.id || "local-player"}
        playerName={"나"}
        avatarUrl={
          profile?.avatarKey
            ? `/images/avatar/${profile.avatarKey}.png`
            : undefined
        }
        isSpeaking={false}
        isLocalPlayer={true}
        videoRef={myVideoRef}
      />

      <PlayerMediaBox
        key={"remote-player"}
        playerId={profile?.id || "local-player"}
        playerName={"다른넘"}
        avatarUrl={
          profile?.avatarKey
            ? `/images/avatar/${profile.avatarKey}.png`
            : undefined
        }
        isSpeaking={false}
        isLocalPlayer={true}
        videoRef={remoteVideoRef}
      />

      {/* 화면공유 전용 박스 (카메라가 켜진 상태에서 화면공유 시에만) */}
      {/* {shouldShowSeparateScreenBox && (
        <div className="relative">
          <PlayerMediaBox
            playerId="screen-share"
            playerName="화면 공유"
            avatarUrl="/images/avatar/blue_pawn.png"
            isSpeaking={false}
            isLocalPlayer={true}
            isScreenShareBox={true}
          />
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">🖥️</span>
          </div>
        </div>
      )} */}
    </div>
  );
}
