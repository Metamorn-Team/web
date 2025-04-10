"use client";

import Image from "next/image";
import { Friend } from "@/types/client/friend.types";
import PaperCard from "@/components/common/PaperCard";

interface FriendItem {
  friend: Friend;
}

export default function FriendItem({ friend }: FriendItem) {
  return (
    <PaperCard width={"60%"} className="group">
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
        <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
          @{friend.tag}
        </p>
      </div>
      <div className="flex items-center justify-center flex-grow-[1] basis-0">
        <button>
          <Image
            src={"/icons/setting.svg"}
            width={34}
            height={34}
            alt="setting"
          />
        </button>
      </div>
    </PaperCard>
  );
}
