"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { UserInfo } from "@/types/socket-io/response";
import { playerStore } from "@/game/managers/player-store";
import { EventWrapper } from "@/game/event/EventBus";
import { FiUsers, FiX } from "react-icons/fi";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function ParticipantStatusLabel({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#2a1f14]">
      <span className="truncate">{count}명</span>
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
    </div>
  );
}

export default function ParticipantPanel() {
  const isMobile = useIsMobile();
  const [players, setPlayers] = useState<UserInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const updatePlayers = () => {
      const players = playerStore
        .getAllPlayers()
        .map((player) => player.getPlayerInfo());
      setPlayers(players);
    };

    EventWrapper.onUiEvent("updateParticipantsPanel", updatePlayers);
    EventWrapper.onUiEvent("updateOnlineStatus", updatePlayers);

    return () => {
      EventWrapper.offUiEvent("updateParticipantsPanel", updatePlayers);
      EventWrapper.offUiEvent("updateOnlineStatus", updatePlayers);
    };
  }, []);

  const getInactivityDuration = (id: string) => {
    const player = players.find((player) => player.id === id);
    if (!player) return Date.now();
    return player.lastActivity ? Date.now() - player.lastActivity : Date.now();
  };

  const onlineCount = players.length;

  const panelContent = (
    <div className="w-full sm:w-64 bg-[#f9f5ec] border-2 border-[#d6c6aa] shadow-lg z-40 p-4 text-sm text-[#2a1f14] transition-all rounded-t-2xl sm:rounded-2xl max-h-[70vh] sm:max-h-[80vh] overflow-hidden">
      <div className="flex justify-between items-center border-b border-[#d6c6aa] pb-2 mb-2">
        <ParticipantStatusLabel count={onlineCount} />
        <button
          onClick={() => setIsOpen(false)}
          className="text-[#5c4b32] hover:text-[#2a1f14]"
        >
          <FiX size={20} />
        </button>
      </div>

      {players.length === 0 ? (
        <div className="text-xs text-gray-500 text-center py-6">
          <p>조용한 섬이네요</p>
          <p>곧 누군가가 찾아올지도 몰라요 🌊</p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-hide">
          {players.map((user) => {
            const duration = getInactivityDuration(user.id);
            const minutes = Math.floor(duration / 60000);
            const isOnline = minutes < 1;

            const statusText = isOnline
              ? "온라인"
              : `${minutes < 5 ? "최근 활동" : "잠수"} (${minutes}분 전)`;

            return (
              <li key={user.id} className="flex items-center gap-3">
                <div className="relative w-8 h-8 shrink-0">
                  <Image
                    src={`/images/avatar/${user.avatarKey}.png`}
                    alt="avatar"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 truncate">
                  <div className="font-semibold truncate">{user.nickname}</div>
                  <div
                    className={`text-xs ${
                      isOnline ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {statusText}
                  </div>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOnline
                      ? "bg-green-500 animate-pulse"
                      : "bg-gray-400 animate-none"
                  }`}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-[68px] sm:top-[76px] right-3 sm:right-5 z-30 bg-[#f3ece1] border border-[#5c4b32] text-[#5c4b32] px-3 py-1 rounded-full shadow-md flex items-center gap-2 text-xs sm:text-sm"
        >
          <FiUsers size={14} />
          <ParticipantStatusLabel count={onlineCount} />
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed z-50 ${
            isMobile ? "bottom-0 left-0 w-full" : "top-24 right-4 w-64"
          }`}
        >
          {panelContent}
        </div>
      )}
    </>
  );
}
