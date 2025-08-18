"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FiUser,
  FiSettings,
  FiMenu,
  FiLogOut,
  FiFileText,
  FiShield,
} from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import { GiIsland, GiSailboat } from "react-icons/gi";
import { getItem, setItem } from "@/utils/session-storage";
import { EventWrapper } from "@/game/event/EventBus";
import { removeItem, getItem as getPersistenceItem } from "@/utils/persistence";
import { SoundManager } from "@/game/managers/sound-manager";
import { socketManager } from "@/game/managers/socket-manager";
import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import { useGetUnreadFriendRequest } from "@/hook/queries/useGetUnreadFriendRequest";
import { QUERY_KEY as UNREAD_COUNT_QUERY_KEY } from "@/hook/queries/useGetUnreadFriendRequest";
import Image from "next/image";
import { useLogout } from "@/hook/queries/useLogout";
import Alert from "@/utils/alert";
import { FaCompass } from "react-icons/fa";
import { QUERY_KEY as ISLAND_INFO_QUERY_KEY } from "@/hook/queries/useGetIslandInfo";
import {
  ISLAND_SCENE,
  LOBY_SCENE,
  MY_ISLAND_SCENE,
} from "@/constants/game/islands/island";
import { useCurrentSceneStore } from "@/stores/useCurrentSceneStore";
import Reload from "@/utils/reload";
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from "@/constants/constants";
import DropdownItem from "./common/dropdown/DropdownItem";
import Dropdown from "@/components/common/dropdown/Dropdown";
import RetroHeader from "@/components/common/header/RetroHeader";
import RetroHeaderButton from "@/components/common/header/RetroHeaderButton";
import { useBgmToggle } from "@/hook/useBgmToggle";
import BgmToggleButton from "@/components/common/header/BgmToggleButton";
import StoreButton from "@/components/common/header/StoreButton";
import MenuButton from "@/components/common/header/MenuButton";

interface MenuHeaderProps {
  onFriendModalOpen: () => void;
  onSettingsModalOpen: () => void;
  onDevModalOpen: () => void;
  onUpdateOpen: () => void;
  onIslandInfoModalOpen: () => void;
}

export default function MenuHeader({
  onFriendModalOpen,
  onSettingsModalOpen,
  onDevModalOpen,
  onUpdateOpen,
  onIslandInfoModalOpen,
}: MenuHeaderProps) {
  const queryClient = useQueryClient();
  const { isPlayBgm, toggleBgm } = useBgmToggle();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isVisibleExit, setIsVisibleExit] = useState(true);
  const { currentScene } = useCurrentSceneStore();

  const [showNewRequestMessage, setShowNewRequestMessage] = useState(false);
  const { data: unreadRequestCount } = useGetUnreadFriendRequest();
  const { mutate: logoutMutate } = useLogout(
    () => {
      if (window.Kakao && window.Kakao.isInitialized()) {
        window.Kakao.Auth.logout();
      }

      removeItem("access_token");
      removeItem("profile");
      setItem("current_scene", "LobyScene");
      window.location.reload();
    },
    () => Alert.error("로그아웃에 실패했어요.. 나중에 다시 시도해주세요.")
  );

  const isLogined = !!getPersistenceItem("access_token");

  useEffect(() => {
    const socket = socketManager.connect(SOCKET_NAMESPACES.ISLAND);

    const handleReceiveFriendRequest = () => {
      const prev = queryClient.getQueryData<{ count: number }>([
        UNREAD_COUNT_QUERY_KEY,
      ]);

      if (prev && typeof prev.count === "number") {
        queryClient.setQueryData([UNREAD_COUNT_QUERY_KEY], {
          count: prev.count + 1,
        });
      } else {
        queryClient.setQueryData([UNREAD_COUNT_QUERY_KEY], { count: 1 });
      }

      setShowNewRequestMessage(true);
      setTimeout(() => setShowNewRequestMessage(false), 5000);
    };

    const hadleIslandInfoUpdated = (data: { islandId: string }) => {
      queryClient.invalidateQueries({
        queryKey: [ISLAND_INFO_QUERY_KEY, data.islandId],
      });
    };

    socket?.on("receiveFriendRequest", handleReceiveFriendRequest);
    socket?.on("islandInfoUpdated", hadleIslandInfoUpdated);

    return () => {
      socket?.off("receiveFriendRequest");
      socket?.off("islandInfoUpdated");
    };
  }, []);

  const onLeftIsland = useCallback(() => {
    EventWrapper.emitToGame("left-island");
  }, []);

  const onMoveToMyIsland = useCallback(() => {
    EventWrapper.emitToGame("changeToMyIsland");
  }, []);

  const onMoveToLoby = useCallback(() => {
    EventWrapper.emitToGame("changeToLoby");
  }, []);

  const onLogout = () => logoutMutate();

  useEffect(() => {
    const isPlayBgm = getPersistenceItem("play_bgm") ?? true;

    if (!isPlayBgm) {
      SoundManager.getInstance().pauseBgm();
    }

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
    <RetroHeader
      leftItems={
        <>
          <BgmToggleButton isPlayBgm={isPlayBgm} onClick={toggleBgm} />
          {isLogined && (
            <div className="relative">
              <RetroHeaderButton
                icon={<FiUser size={20} />}
                label="친구"
                onClick={onFriendModalOpen}
              />
              {unreadRequestCount && unreadRequestCount?.count > 0 && (
                <span className="absolute -top-2 -right-2 w-[18px] h-[18px] text-[10px] px-[4px] text-white bg-red-600 rounded-full flex items-center justify-center">
                  {unreadRequestCount.count > 99
                    ? "99+"
                    : unreadRequestCount.count}
                </span>
              )}
              {showNewRequestMessage && (
                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-3 py-1 rounded shadow animate-pulse whitespace-nowrap">
                  새로운 친구 요청이 왔어요!
                </div>
              )}
            </div>
          )}
          {isLogined && <StoreButton />}
          {isLogined && currentScene === LOBY_SCENE && (
            <div>
              <RetroHeaderButton
                icon={<GiIsland size={20} />}
                label="내 섬"
                onClick={onMoveToMyIsland}
              />
            </div>
          )}
        </>
      }
      rightItems={
        <>
          {isVisibleExit && currentScene === ISLAND_SCENE && (
            <RetroHeaderButton
              icon={<FaCompass size={20} />}
              label="섬 정보"
              onClick={onIslandInfoModalOpen}
            />
          )}
          {isVisibleExit && currentScene !== LOBY_SCENE && (
            <RetroHeaderButton
              icon={<GiSailboat size={20} />}
              label="섬 떠나기"
              onClick={
                currentScene === ISLAND_SCENE
                  ? onLeftIsland
                  : currentScene === MY_ISLAND_SCENE
                  ? onMoveToLoby
                  : () => {
                      Reload.open(
                        "문제가 발생했어요 새로고침 시 해결될 거에요!.."
                      );
                    }
              }
            />
          )}
          <Dropdown
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            anchor={<MenuButton onClick={() => setMenuOpen((prev) => !prev)} />}
            className="w-44 bg-[#fdf8ef] border border-[#bfae96] shadow-[4px_4px_0_#8c7a5c] p-2 flex flex-col gap-2 text-sm text-[#3d2c1b] animate-fadeIn rounded-[6px] sm:mt-2"
          >
            <DropdownItem
              icon={
                <Image
                  src={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}/asset/image/axe_pawn.png`}
                  width={34}
                  height={40}
                  alt="리브아일랜드에 힘을 주세요"
                />
              }
              label={
                <>
                  리브아일랜드에 <br /> 힘을 주세요
                </>
              }
              onClick={onDevModalOpen}
            />
            {isLogined ? (
              <DropdownItem
                icon={<FiLogOut />}
                label="로그아웃"
                onClick={onLogout}
              />
            ) : (
              <DropdownItem
                icon={<FiUser />}
                label="로그인"
                onClick={() => EventWrapper.emitToUi("openLoginModal")}
              />
            )}
            <DropdownItem
              icon={<FiMenu />}
              label="업데이트 노트"
              onClick={onUpdateOpen}
            />
            <DropdownItem
              icon={<FiSettings />}
              label="환경 설정"
              onClick={onSettingsModalOpen}
            />
            <DropdownItem
              icon={<FiFileText />}
              label="이용 약관"
              onClick={() => window.open(TERMS_OF_USE_URL, "_blank")}
            />
            <DropdownItem
              icon={<FiShield />}
              label="개인정보 처리방침"
              onClick={() => window.open(PRIVACY_POLICY_URL, "_blank")}
            />
          </Dropdown>
        </>
      }
    />
  );
}
