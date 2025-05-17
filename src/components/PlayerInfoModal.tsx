"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import SquareModal from "@/components/common/SquareModal";
import { UserInfo } from "@/types/socket-io/response";
import { useSendFriendRequest } from "@/hook/queries/useSendFriendRequest";
import { getItem } from "@/utils/persistence";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as USER_QUERY_KEY } from "@/hook/queries/useGetUserProfile";
import { useChangeBio } from "@/hook/queries/useChangeBio";
import { useGetUserProfile } from "@/hook/queries/useGetUserProfile";
import { socketManager } from "@/game/managers/socket-manager";
import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import { INITIAL_PROFILE } from "@/constants/game/initial-profile";
import Pawn from "@/components/common/Pawn";
import { PawnColor } from "@/constants/game/entities";

interface PlayerInfoModalProps {
  playerInfo: UserInfo;
  onClose: () => void;
  className?: string;
}

const PlayerInfoModal = ({
  onClose,
  playerInfo,
  className,
}: PlayerInfoModalProps) => {
  const myProfile = getItem("profile");
  const isLogined = !!myProfile;
  const isMe = myProfile?.id === playerInfo.id;

  const queryClient = useQueryClient();

  const { data: user } = useGetUserProfile(playerInfo.id, isLogined);

  const displayedUser = user ?? INITIAL_PROFILE;

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState<string>("");

  useEffect(() => {
    if (isMe && user?.bio) {
      setBio(user.bio);
    }
  }, [isMe, user]);

  const onSuccess = () =>
    queryClient.invalidateQueries({
      queryKey: [USER_QUERY_KEY, playerInfo.id],
    });

  const { mutate: sendRequest } = useSendFriendRequest(onSuccess);
  const { mutate: changeBio } = useChangeBio(() => {
    onSuccess();
    setIsEditing(false);
  });

  const onSendRequest = () => {
    const socket = socketManager.connect(SOCKET_NAMESPACES.ISLAND);

    if (socket?.connected) {
      socket.emit("sendFriendRequest", { targetUserId: playerInfo.id });
      onSuccess();
      return;
    }

    sendRequest({ targetUserId: playerInfo.id });
  };

  const renderFriendButton = () => {
    if (isMe || !isLogined) return null;

    switch (user?.friendStatus) {
      case "NONE":
        return (
          <Button
            color="yellow"
            onClick={onSendRequest}
            title="친구 요청"
            width={"40%"}
            fontSize={"text-sm"}
          />
        );
      case "SENT":
        return <p>수락 대기중</p>;
      case "RECEIVED":
        return <p>친구 요청 받음</p>;
      case "ACCEPTED":
        return (
          <div className="relative w-24 h-12">
            <Image
              src={"/images/pawn_friend.png"}
              fill
              objectFit="cover"
              alt="친구"
            />
            <p className="absolute -bottom-5 right-1/2 translate-x-1/2 text-lg">
              친구
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <SquareModal
      onClose={onClose}
      className={`${className} w-[95%] max-w-[500px]`}
    >
      <div className="w-full h-full flex flex-col items-center justify-between px-2">
        <div className="flex flex-col items-center gap-4">
          <div>
            <Pawn
              color={
                (displayedUser.avatarKey || "purple_pawn").split(
                  "_"
                )[0] as PawnColor
              }
              animation="idle"
              className="w-[60px] h-[60px] sm:w-[72px] sm:h-[72px]"
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-xl font-bold">{displayedUser.nickname}</div>
            <div className="text-sm text-[#5c4b32] bg-[#f9f5ec] border border-[#d6c6aa] rounded-full px-3 py-1">
              @{displayedUser.tag}
            </div>
          </div>

          {/* 자기소개 영역 */}
          <div
            className={`relative w-full bg-[#f9f5ec] border border-[#d6c6aa] rounded-md p-2 sm:p-5 text-sm text-[#5c4b32] text-center shadow-inner min-w-[200px] max-w-[340px] overflow-y-scroll scrollbar-hide ${
              isEditing ? "h-fit" : "max-h-[80px] sm:max-h-[150px]"
            }`}
          >
            {!isEditing && (
              <>
                {isMe && isLogined && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute top-1 right-2 text-xs text-[#5c4b32] hover:underline"
                  >
                    ✏️ 수정
                  </button>
                )}
                {displayedUser.bio
                  ? `💬 ${displayedUser.bio}`
                  : "💬 자기소개가 아직 없어요!"}
              </>
            )}

            {isEditing && (
              <div className="flex flex-col w-[250px] gap-2 animate-fadeIn">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={300}
                  className="w-full p-2 rounded-md border border-[#bfae96] text-sm text-[#3d2c1b] bg-[#fff9ee] shadow-inner resize-none focus:outline-none focus:ring-2 focus:ring-[#e7d6b8]"
                  rows={4}
                  placeholder="자기소개를 입력해보세요 ✨"
                />
                <div className="flex justify-end gap-2 text-sm mt-1">
                  <button
                    onClick={() => {
                      setBio("");
                      setIsEditing(false);
                    }}
                    className="px-3 py-1 rounded-full bg-[#e0e0e0] text-gray-700 hover:bg-[#d4d4d4] shadow-sm transition-all"
                  >
                    취소
                  </button>
                  <button
                    onClick={() =>
                      changeBio({ bio: bio.trim().length === 0 ? null : bio })
                    }
                    className="px-3 py-1 rounded-full bg-[#f5c36c] text-white hover:bg-[#e5b05a] shadow-md transition-all"
                  >
                    저장
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {renderFriendButton()}
      </div>
    </SquareModal>
  );
};

export default PlayerInfoModal;
