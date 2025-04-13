"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FiUser,
  FiSettings,
  FiMenu,
  FiLogOut,
  FiEdit2,
  FiShoppingBag, // ✅ 추가
} from "react-icons/fi";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { RiBookOpenLine } from "react-icons/ri";
import { GiSailboat } from "react-icons/gi";
import { getItem } from "@/utils/session-storage";
import { EventBus } from "@/game/event/EventBus";
import { removeItem } from "@/utils/persistence";

interface MenuHeaderProps {
  isPlayBgm: boolean;
  playBgmToggle: () => void;
  changeFriendModalOpen: (state: boolean) => void;
}

export default function MenuHeader({
  isPlayBgm,
  playBgmToggle,
  changeFriendModalOpen,
}: MenuHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isVisibleExit, setIsVisibleExit] = useState(true);

  const onLeftIsland = useCallback(() => {
    EventBus.emit("left-island");
  }, []);

  const onLogout = () => {
    removeItem("access_token");
    removeItem("profile");

    window.location.reload();
  };

  useEffect(() => {
    const currentScene = getItem("current_scene");
    if (currentScene === "LobyScene" || !currentScene) {
      setIsVisibleExit(false);
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="absolute top-0 w-screen h-16 z-40 flex justify-between items-center px-4 bg-[#f9f5ec] bg-opacity-95 border-b border-[#d6c6aa] shadow-sm">
      {/* 👈 왼쪽 버튼들 */}
      <div className="flex items-center gap-3">
        <MenuItem
          icon={
            isPlayBgm ? (
              <BsMusicNoteBeamed size={18} />
            ) : (
              <BsMusicNoteBeamed size={18} className="opacity-40" />
            )
          }
          label="BGM"
          onClick={playBgmToggle}
        />

        <MenuItem
          icon={<FiUser size={18} />}
          label="친구"
          onClick={() => changeFriendModalOpen(true)}
        />

        <MenuItem
          icon={<FiShoppingBag size={18} />}
          label="상점"
          onClick={() => {
            console.log("상점 열기!");
          }}
        />
      </div>

      <div className="relative flex gap-3" ref={menuRef}>
        {isVisibleExit ? (
          <MenuItem
            icon={<GiSailboat size={18} />}
            label="섬 떠나기"
            onClick={onLeftIsland}
          />
        ) : null}

        <MenuItem
          icon={<FiMenu size={18} />}
          label="메뉴"
          onClick={() => setMenuOpen((prev) => !prev)}
        />
        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-40 bg-[#f9f5ec] border border-[#d6c6aa] rounded-md shadow-lg p-2 flex flex-col gap-1 text-sm text-[#5c4b32] animate-fadeIn">
            <DropdownItem icon={<FiEdit2 />} label="정보 수정" />
            <DropdownItem
              icon={<FiLogOut />}
              label="로그아웃"
              onClick={onLogout}
            />
            <DropdownItem icon={<RiBookOpenLine />} label="내 로그 보기" />
            <DropdownItem icon={<FiSettings />} label="환경 설정" />
            <DropdownItem icon={<FiUser />} label="프로필 보기" />
          </div>
        )}
      </div>
    </header>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-3 py-1 bg-[#f3ece1] border border-[#d6c6aa] rounded-full text-[#5c4b32] text-xs hover:bg-[#e8e0d0] transition"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function DropdownItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-[#f1e8d8] transition"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
