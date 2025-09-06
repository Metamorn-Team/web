"use client";

import React from "react";
import PlayerMediaBox from "./PlayerMediaBox";
import { useGetMyProfile } from "@/hook/queries/useGetMyProfile";
import classNames from "classnames";
import { PAWN_AVATAR_URL } from "@/constants/image-path";
import { useIsMobile } from "@/hook/useIsMobile";

interface PlayersMediaPanelProps {
  peerConnections: Map<string, RTCPeerConnection>;
  peerMediaStreams: Map<string, MediaStream>;
  localMediaStream: MediaStream | null;
  className?: string;
}

export default function PlayersMediaPanel({
  peerConnections,
  peerMediaStreams,
  localMediaStream,
  className,
}: PlayersMediaPanelProps) {
  const { data: profile } = useGetMyProfile();
  const isMobile = useIsMobile();

  // peer ids
  const peerIds = Array.from(peerConnections.keys());

  return (
    <div
      className={classNames(
        `fixed z-30 pb-2 ${
          isMobile
            ? "left-3 flex gap-2 overflow-x-scroll scrollbar-hide"
            : "top-4 right-4 space-y-4"
        }`,
        className
      )}
    >
      {/* 로컬 플레이어 (스트림이 없다면 아바타) */}
      <PlayerMediaBox
        key={profile?.id || "local-player"}
        playerId={profile?.id || "local-player"}
        nickname={"나"}
        avatarUrl={PAWN_AVATAR_URL(profile?.avatarKey || "blue_pawn.png")}
        isSpeaking={false}
        isLocalPlayer={true}
        stream={localMediaStream}
      />

      {/* 리모트 플레이어들 - peerMediaStreams 기준으로 생성 */}
      {peerIds.map((peerId) => {
        const stream = peerMediaStreams.get(peerId) ?? null;
        return (
          <RemotePlayerMediaBox key={peerId} peerId={peerId} stream={stream} />
        );
      })}
    </div>
  );
}

// RemotePlayerMediaBox
interface RemotePlayerMediaBoxProps {
  peerId: string;
  stream?: MediaStream | null;
}

function RemotePlayerMediaBox({ peerId, stream }: RemotePlayerMediaBoxProps) {
  // TODO: 플레이어 닉네임/아바타를 playerStore에서 찾을 수 있으면 넘겨주기
  return (
    <PlayerMediaBox
      playerId={peerId}
      isSpeaking={false}
      isLocalPlayer={false}
      stream={stream ?? null}
    />
  );
}
