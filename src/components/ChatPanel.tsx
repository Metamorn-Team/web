"use client";

import { EventBus } from "@/game/event/EventBus";
import { playerStore } from "@/game/managers/player-store";
import { socketManager } from "@/game/managers/socket-manager";
import { MessageSent, PlayerJoinResponse, ReceiveMessage } from "mmorntype";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FiSend, FiChevronDown, FiChevronUp } from "react-icons/fi";

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  avatarKey?: string;
  isSystem?: boolean;
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [height, setHeight] = useState(448);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const isResizing = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const collapsedHeight = 40;
  const nsp = "zone";

  useEffect(() => {
    const handleNewPlayer = (data: PlayerJoinResponse) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          sender: "",
          message: `${data.nickname} 님이 입장하셨습니다.`,
          isSystem: true,
        },
      ]);
    };
    EventBus.on("newPlayer", handleNewPlayer);

    const socket = socketManager.connect(nsp);
    if (!socket) return;

    const handleMessageSent = (data: MessageSent) => {
      const { messageId, message } = data;

      setMessages((prev) => [
        ...prev,
        { id: messageId, sender: "나", message, avatarKey: "purple_pawn" },
      ]);

      EventBus.emit("mySpeechBubble", data);
    };

    const handleReceiveMessage = (data: ReceiveMessage) => {
      const { senderId, message } = data;
      const player = playerStore.getPlayer(senderId);
      const playerInfo = player?.getPlayerInfo();
      const nickname = playerInfo?.nickname || "누군가";
      const avatarKey = playerInfo?.avatarKey || "blue_pawn";

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}${nickname}`,
          sender: nickname,
          message,
          avatarKey: avatarKey,
        },
      ]);

      EventBus.emit("otherSpeechBubble", data);
    };

    socket.on("messageSent", handleMessageSent);
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("messageSent", handleMessageSent);
      socket.off("receiveMessage", handleReceiveMessage);
      EventBus.off("newPlayer", handleNewPlayer);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || isCollapsed) return;
      const newHeight = startHeight.current + (startY.current - e.clientY);
      setHeight(Math.max(300, Math.min(newHeight, 700)));
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isCollapsed]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    startY.current = e.clientY;
    startHeight.current = panelRef.current?.getBoundingClientRect().height || 0;
    document.body.style.cursor = "ns-resize";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const socket = socketManager.connect("zone");
    socket?.emit("sendMessage", { message: input });
    setInput("");
  };

  return (
    <div
      ref={panelRef}
      style={{
        height: isCollapsed ? collapsedHeight : height,
      }}
      className="fixed bottom-4 left-4 w-80
      bg-[#f9f5ec]/10 hover:bg-[#f9f5ec]/80 
      backdrop-blur-none hover:backdrop-blur-md 
      border border-[#d6c6aa]/30 hover:border-[#d6c6aa] 
      rounded-2xl shadow-none hover:shadow-lg 
      transition-all duration-300 ease-in-out 
      z-30 flex flex-col overflow-hidden"
    >
      {/* 드래그 핸들 */}
      {!isCollapsed && (
        <div
          onMouseDown={handleMouseDown}
          className="h-3 cursor-ns-resize bg-[#d6c6aa]/30 hover:bg-[#d6c6aa]/50 transition"
          title="위로 드래그해서 크기 조절"
        />
      )}

      {/* 상단 헤더 */}
      <div className="p-4 border-b border-[#d6c6aa] text-[#2a1f14] font-bold text-lg flex justify-between items-center">
        채팅
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-[#2a1f14] hover:text-[#7c6f58] transition"
        >
          {isCollapsed ? (
            <FiChevronUp size={20} />
          ) : (
            <FiChevronDown size={20} />
          )}
        </button>
      </div>

      {/* 메시지 영역 */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4 pb-20 space-y-3 text-sm text-[#2a1f14] scrollbar-hide">
          {messages.map((msg) => {
            if (msg.isSystem) {
              return (
                <div
                  key={msg.id}
                  className="text-center text-xs text-[#7c6f58]"
                >
                  {msg.message}
                </div>
              );
            }

            const isMine = msg.sender === "나";
            return (
              <div
                key={msg.id}
                className={`flex gap-2 max-w-[85%] ${
                  isMine ? "ml-auto flex-row-reverse text-right" : ""
                }`}
              >
                <div className="relative w-8 h-8 object-cover">
                  <Image
                    src={`/images/avatar/${msg.avatarKey || "purple_pawn"}.png`}
                    fill
                    className={isMine ? "scale-x-[-1]" : ""}
                    alt="avatar"
                  />
                </div>
                <div
                  className={`px-3 py-2 rounded-md ${
                    isMine ? "bg-[#e8e0d0]" : "bg-[#f3ece1]"
                  }`}
                >
                  <div className="font-semibold">{msg.sender}</div>
                  <div>{msg.message}</div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      )}

      {/* 인풋 */}
      {!isCollapsed && (
        <ChatInput input={input} setInput={setInput} onSend={handleSend} />
      )}
    </div>
  );
}

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
}

function ChatInput({ input, setInput, onSend }: ChatInputProps) {
  return (
    <div className="p-3 border-t border-[#d6c6aa] bg-[#f3ece1]/90 flex items-center gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && onSend()}
        placeholder="메시지를 입력하세요..."
        className="flex-1 px-3 py-2 rounded-md border border-[#d6c6aa] bg-white text-[#2a1f14] text-sm outline-none focus:ring-2 focus:ring-[#d6c6aa]"
      />
      <button
        onClick={onSend}
        className="text-[#2a1f14] hover:text-[#7c6f58] transition"
      >
        <FiSend size={18} />
      </button>
    </div>
  );
}
