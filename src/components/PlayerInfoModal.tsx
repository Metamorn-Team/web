import React from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import SquareModal from "@/components/common/SquareModal";
import { UserInfo } from "@/types/socket-io/response";
import { useSendFriendRequest } from "@/hook/queries/useSendFriendRequest";
import { getItem } from "@/utils/persistence";

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
  const { mutate } = useSendFriendRequest();
  const myProfile = getItem("profile");
  const isMe = (myProfile?.id || " ") === playerInfo.id;

  const onSendRequest = () => {
    mutate({ targetUserId: playerInfo.id });
  };

  return (
    <SquareModal onClose={onClose} width={"30%"} className={`${className}`}>
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
            💬 {"자기소개가 아직 없어요!"}
          </div>
        </div>

        {!isMe ? (
          <Button
            color="yellow"
            onClick={onSendRequest}
            title="친구 요청"
            width={"40%"}
            fontSize={"text-sm"}
          />
        ) : null}
      </div>
    </SquareModal>
  );
};

export default PlayerInfoModal;
