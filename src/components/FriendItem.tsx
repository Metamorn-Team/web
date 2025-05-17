"use client";

import Image from "next/image";
import { Friend } from "@/types/client/friend.types";
import PaperCard from "@/components/common/PaperCard";
import { useState } from "react";

interface FriendItem {
  friend: Friend;
}

export default function FriendItem({ friend }: FriendItem) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <PaperCard className="group w-full sm:w-2/3">
      <div className="relative flex items-center justify-center flex-grow-[1] basis-0">
        <Image
          src={friend.profileImageUrl}
          width={40}
          height={40}
          alt="profile"
        />

        <span
          className={`absolute top-0 right-3 w-2 h-2 rounded-full ${
            friend.isOnline ? "bg-green-700 animate-pulse" : "bg-gray-400"
          }`}
        />
      </div>
      <div className="flex flex-col gap-1 flex-grow-[2] basis-0">
        <div className="flex items-center gap-2">
          <p className="text-base">{friend.nickname}</p>
          <div className="flex items-center gap-1">
            <span
              className={`text-xs ${
                friend.isOnline ? "text-green-700" : "text-gray-500"
              }`}
            >
              {friend.isOnline ? "온라인" : "오프라인"}
            </span>
          </div>
        </div>
        <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
          @{friend.tag}
        </p>
      </div>
      <div
        className="flex items-center justify-center flex-grow-[1] basis-0"
        onClick={() => setShowMenu((prev) => !prev)}
      >
        <div className="relative">
          <button>
            <Image
              src={"/icons/setting.svg"}
              width={40}
              height={40}
              alt="setting"
            />
          </button>

          {showMenu && (
            <div className="absolute top-4 right-0 mt-2 bg-white border border-gray-300 shadow-lg rounded-md z-10 w-24 animate-fadeIn overflow-hidden">
              <button
                onClick={() => {
                  // 친구 삭제 로직
                  console.log("delete friend", friend.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                친구 삭제
              </button>
            </div>
          )}
        </div>
      </div>
    </PaperCard>
  );
}
