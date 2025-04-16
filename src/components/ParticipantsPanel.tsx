"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { UserInfo } from "@/types/socket-io/response";
import { playerStore } from "@/game/managers/player-store";
import { EventWrapper } from "@/game/event/EventBus";

export default function ParticipantPanel() {
  const [players, setPlayer] = useState<UserInfo[]>([]);

  useEffect(() => {
    const updatePlayers = () => {
      const players = playerStore
        .getAllPlayers()
        .map((player) => player.getPlayerInfo());

      setPlayer(players);
    };

    EventWrapper.onUiEvent("updateParticipantsPanel", updatePlayers);

    return () => {
      EventWrapper.offUiEvent("updateParticipantsPanel", updatePlayers);
    };
  }, []);

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
        {players.map((user) => (
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
              <div className={`text-xs text-green-600`}>{"온라인"}</div>
            </div>
            <span className={`w-2 h-2 rounded-full bg-green-500`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
