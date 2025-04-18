"use client";

import Image from "next/image";
import { useState } from "react";
import PaperCard from "@/components/common/PaperCard";
import SquareButton from "@/components/common/SquareButton";
import { useSendFriendRequest } from "@/hook/queries/useSendFriendRequest";

interface SearchedUser {
  id: string;
  profileImageUrl: string;
  tag: string;
  nickname: string;
}

interface SearchUserItemProps {
  friend: SearchedUser;
}

const SearchUserItem = ({ friend }: SearchUserItemProps) => {
  const { mutate } = useSendFriendRequest(() => setStatus("SENT"));
  const [status, setStatus] = useState<"NONE" | "SENT">("NONE");

  const onSend = () => {
    mutate({ targetUserId: friend.id });
  };

  return (
    <PaperCard width={"60%"}>
      <div className="flex items-center justify-center flex-grow-[1] basis-0">
        <Image
          src={friend.profileImageUrl}
          width={32}
          height={32}
          alt="profile"
        />
      </div>
      <div className="flex flex-col gap-1 flex-grow-[2] basis-0">
        <p className="text-base">{friend.nickname}</p>
        <p className="text-sm">@{friend.tag}</p>
      </div>
      <div className="flex items-center justify-center flex-grow-[1] basis-0">
        {status === "NONE" ? (
          <SquareButton
            color="blue"
            onClick={onSend}
            title="요청"
            fontSize={12}
            width={"70%"}
          />
        ) : (
          <SquareButton
            color="red"
            onClick={() => {
              // 취소 요청
            }}
            title="취소"
            fontSize={12}
            width={"70%"}
          />
        )}
      </div>
    </PaperCard>
  );
};

export default SearchUserItem;
