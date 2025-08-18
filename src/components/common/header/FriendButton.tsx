import React from "react";
import { FiUser } from "react-icons/fi";
import RetroHeaderButton from "@/components/common/header/RetroHeaderButton";

interface FriendButtonProps {
  unreadRequestCount?: { count: number };
  showNewRequestMessage: boolean;
  onClick: () => void;
}

export default function FriendButton({
  unreadRequestCount,
  showNewRequestMessage,
  onClick,
}: FriendButtonProps) {
  return (
    <div className="relative">
      <RetroHeaderButton
        icon={<FiUser size={20} />}
        label="친구"
        onClick={onClick}
      />
      {unreadRequestCount && unreadRequestCount.count > 0 && (
        <span className="absolute -top-2 -right-2 w-[18px] h-[18px] text-[10px] px-[4px] text-white bg-red-600 rounded-full flex items-center justify-center">
          {unreadRequestCount.count > 99 ? "99+" : unreadRequestCount.count}
        </span>
      )}
      {showNewRequestMessage && (
        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-3 py-1 rounded shadow animate-pulse whitespace-nowrap">
          새로운 친구 요청이 왔어요!
        </div>
      )}
    </div>
  );
}
