"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IslandHeartbeatResponse } from "mmorntype";
import { UserInfo } from "@/types/socket-io/response";
import { playerStore } from "@/game/managers/player-store";
import { EventWrapper } from "@/game/event/EventBus";

export default function ParticipantPanel() {
  const [players, setPlayer] = useState<UserInfo[]>([]);
  const [lastActivityies, setLastActivities] = useState<
    {
      id: string;
      lastActivity: number;
    }[]
  >([]);

  useEffect(() => {
    const updatePlayers = () => {
      const players = playerStore
        .getAllPlayers()
        .map((player) => player.getPlayerInfo());

      setPlayer(players);
    };

    const handleUpdateOnlineStatus = (data: IslandHeartbeatResponse) => {
      console.log(data);
      setLastActivities(data);
    };

    EventWrapper.onUiEvent("updateParticipantsPanel", updatePlayers);
    EventWrapper.onUiEvent("updateOnlineStatus", handleUpdateOnlineStatus);

    return () => {
      EventWrapper.offUiEvent("updateParticipantsPanel", updatePlayers);
      EventWrapper.offUiEvent("updateOnlineStatus", handleUpdateOnlineStatus);
    };
  }, []);

  const getInactivityDuration = (id: string) => {
    const activity = lastActivityies.find((activities) => activities.id === id);
    if (!activity) return Date.now();

    console.log(Date.now() - activity.lastActivity);
    return Date.now() - activity.lastActivity;
  };

  return (
    <div
      className="fixed top-24 right-4 w-64 border border-[#d6c6aa] rounded-2xl shadow-md 
    z-30 p-3 text-sm text-[#2a1f14] space-y-3
    bg-[#f9f5ec]/20 hover:bg-[#f9f5ec]/90 transition-colors duration-300"
    >
      <div className="font-bold text-lg border-b pb-1 border-[#d6c6aa]">
        참여자 목록
      </div>
      <ul className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide">
        {players.map((user) => {
          const duration = getInactivityDuration(user.id);
          const minutes = Math.floor(duration / 60000);
          console.log(minutes);
          const isOnline = minutes < 1;

          const statusText = isOnline
            ? "온라인"
            : `${minutes < 5 ? "최근 활동" : "잠수"} (${minutes}분 전)`;

          return (
            <li key={user.id} className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <Image
                  src={`/images/avatar/${user.avatarKey}.png`}
                  alt="avatar"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="font-semibold">{user.nickname}</div>
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
    </div>
  );
}
