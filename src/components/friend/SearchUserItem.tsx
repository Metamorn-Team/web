"use client";

import Image from "next/image";
import PaperCard from "@/components/common/PaperCard";
import SquareButton from "@/components/common/SquareButton";
import { useSendFriendRequest } from "@/hook/queries/useSendFriendRequest";
import { socketManager } from "@/game/managers/socket-manager";
import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import { FriendRequestStatus } from "mmorntype/dist/src/presentation/dto/shared";
// import { useAcceptFriendRequest } from "@/hook/queries/useAcceptFriendRequest";
import { useRejectFriendRequest } from "@/hook/queries/useRejectFriendRequest";
import { FriendRequestDirection } from "@/api/friend";

interface SearchedUser {
  id: string;
  profileImageUrl: string;
  tag: string;
  nickname: string;
  friendStatus: FriendRequestStatus;
}

interface SearchUserItemProps {
  user: SearchedUser;
  onSuccess: (targetId: string, status: FriendRequestStatus) => void;
}

const SearchUserItem = ({ user, onSuccess }: SearchUserItemProps) => {
  const { mutate } = useSendFriendRequest(() => onSuccess(user.id, "SENT"));
  // const { mutate: acceptMutate } = useAcceptFriendRequest(
  //   FriendRequestDirection.RECEIVED,
  //   () => onSuccess(user.id, "ACCEPTED")
  // );
  const { mutate: rejectMutate } = useRejectFriendRequest(
    FriendRequestDirection.RECEIVED,
    () => onSuccess(user.id, "NONE")
  );

  const onSend = () => {
    const socket = socketManager.connect(SOCKET_NAMESPACES.ISLAND);

    if (socket?.connected) {
      socket?.emit("sendFriendRequest", { targetUserId: user.id });
      return;
    }

    mutate({ targetUserId: user.id });
  };

  // const onAccept = () => acceptMutate(user.id);
  const onReject = () => rejectMutate(user.id);

  const renderFriendButton = () => {
    switch (user.friendStatus) {
      case "NONE":
        return (
          <SquareButton
            color="blue"
            onClick={onSend}
            title="요청"
            fontSize={12}
            width={"70%"}
            className="max-w-[42px]"
          />
        );
      case "SENT":
        return (
          <SquareButton
            color="red"
            onClick={onReject}
            title="취소"
            fontSize={12}
            width={"70%"}
            className="max-w-[42px]"
          />
        );
      case "RECEIVED":
        return <p className="text-base">대기중</p>;
      case "ACCEPTED":
        return (
          <div className="relative w-42 h-42">
            <Image
              src={"/images/pawn_friend.png"}
              width={42}
              height={21}
              alt="친구"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <PaperCard className="w-full sm:w-2/3">
      <div className="flex items-center justify-center flex-grow-[1] basis-0">
        <Image
          src={user.profileImageUrl}
          width={32}
          height={32}
          alt="profile"
        />
      </div>
      <div className="flex flex-col gap-1 flex-grow-[2] basis-0">
        <p className="text-base">{user.nickname}</p>
        <p className="text-sm">@{user.tag}</p>
      </div>
      <div className="flex items-center justify-center flex-grow-[1] basis-0">
        {renderFriendButton()}
      </div>
    </PaperCard>
  );
};

export default SearchUserItem;
