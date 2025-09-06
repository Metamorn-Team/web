"use client";

import React from "react";
import RetroModal from "@/components/common/RetroModal";
import PixelToggle from "./PixelToggle";
import { MdMic, MdVideocam } from "react-icons/md";

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PermissionModal({
  isOpen,
  onClose,
}: PermissionModalProps) {
  const getPermissionText = () => {
    return {
      title: "미디어 권한이 필요해요!",
      description: "미디어 공유를 위해 접근 권한을 허용해주세요.",
      icon: (
        <div className="flex gap-2">
          <MdMic size={32} className="text-blue-500" />
          <MdVideocam size={32} className="text-green-500" />
        </div>
      ),
    };
  };

  const { title, description, icon } = getPermissionText();

  return (
    <RetroModal isOpen={isOpen} onClose={onClose} className="!max-w-[400px]">
      <div className="flex flex-col items-center gap-4 p-4">
        <div className="text-center">{icon}</div>

        <h3 className="text-lg font-bold text-center text-[#3d2c1b]">
          {title}
        </h3>

        <p className="text-sm text-center text-[#6d4c41] leading-relaxed">
          {description}
        </p>

        <div className="w-full p-3 bg-[#f5f1e6] border border-[#bfae96] rounded-[8px]">
          <div className="text-xs text-[#8c7a5c] font-bold mb-2">
            권한 허용 방법:
          </div>
          <ol className="text-xs text-[#6d4c41] space-y-1 list-decimal list-inside">
            <li>브라우저 주소창 왼쪽의 🔒 아이콘 클릭</li>
            <li>권한 설정에서 사용할 미디어 권한 허용</li>
            <li>페이지 새로고침 후 다시 시도</li>
          </ol>
        </div>

        <div className="flex gap-3 w-full">
          <PixelToggle onClick={onClose} className="flex-1">
            닫기
          </PixelToggle>
        </div>
      </div>
    </RetroModal>
  );
}
