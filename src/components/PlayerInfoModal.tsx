import React, { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import SquareModal from "@/components/common/SquareModal";
import { UserInfo } from "@/types/socket-io/response";
import { useSendFriendRequest } from "@/hook/queries/useSendFriendRequest";
import { getItem } from "@/utils/persistence";
import { FriendRequestStatus } from "mmorntype/dist/src/presentation/dto/shared";
import { useCheckFriendRequestStatus } from "@/hook/queries/useCheckFriendRequestStatus";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as FRIEND_STATUS_QUERY_KEY } from "@/hook/queries/useCheckFriendRequestStatus";

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
  const queryClient = useQueryClient();
  const { data } = useCheckFriendRequestStatus(playerInfo.id);
  const [status, setStatus] = useState<FriendRequestStatus | null>(null);

  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [FRIEND_STATUS_QUERY_KEY, playerInfo.id],
    });
  };

  const { mutate } = useSendFriendRequest(onSuccess);
  const myProfile = getItem("profile");
  const isMe = (myProfile?.id || " ") === playerInfo.id;

  const onSendRequest = () => {
    mutate({ targetUserId: playerInfo.id });
  };

  useEffect(() => {
    if (data) {
      setStatus(data.status);
    }
  }, [data]);

  const renderFriendButton = () => {
    if (isMe) return null;

    switch (status) {
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
      width={"30%"}
      className={`${className} min-w-[500px]`}
    >
      <div className="w-full h-full flex flex-col items-center justify-between py-6 px-2">
        <div className="flex flex-col items-center gap-4">
          <div>
            <Image
              src={`/images/avatar/${
                playerInfo.avatarKey || "purple_pawn"
              }.png`}
              width={64}
              height={64}
              alt="avatar"
            />
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">{playerInfo.nickname}</div>

            <div className="text-sm text-[#5c4b32] bg-[#f9f5ec] border border-[#d6c6aa]  rounded-full px-3 py-1">
              @{playerInfo.tag}
            </div>
          </div>

          <div className="w-full bg-[#f9f5ec] border border-[#d6c6aa] rounded-md px-5 py-5 text-sm text-[#5c4b32] text-center shadow-inner max-w-[340px]">
            💬{"자기소개가 아직 없어요!"}
          </div>
        </div>

        {renderFriendButton()}
      </div>
    </SquareModal>
  );
};

export default PlayerInfoModal;
