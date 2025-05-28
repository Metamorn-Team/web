"use client";

import Image from "next/image";
import React from "react";
import PaperCard from "@/components/common/PaperCard";
import SquareButton from "@/components/common/SquareButton";
import { FriendRequest } from "@/types/client/friend.types";

interface FriendRequestItemProps {
  user: FriendRequest;
  status: "RECEIVED" | "SENT";
  onAccept?: (targetId: string) => void;
  onReject: (targetId: string) => void;
}

const FriendRequestItem = ({
  user,
  status,
  onAccept,
  onReject,
}: FriendRequestItemProps) => {
  return (
    <PaperCard className="w-full sm:w-2/3">
      <div className="flex justify-center items-center flex-grow-[1] basis-0">
        <Image
          src={user.profileImageUrl}
          width={32}
          height={32}
          alt="profile"
        />
      </div>
      <div className="flex-grow-[2] basis-0">
        <p>{user.nickname}</p>
      </div>
      <div className="flex items-center justify-around flex-grow-[1] basis-0">
        {status === "RECEIVED" && onAccept ? (
          <SquareButton
            color="blue"
            onClick={() => onAccept(user.id)}
            title="O"
            width={"45%"}
          />
        ) : null}
        <SquareButton
          color="red"
          onClick={() => onReject(user.id)}
          title="X"
          width={"45%"}
        />
      </div>
    </PaperCard>
  );
};

export default FriendRequestItem;
