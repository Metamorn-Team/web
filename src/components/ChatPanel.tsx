"use client";

import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import { EventWrapper } from "@/game/event/EventBus";
import { playerStore } from "@/game/managers/player-store";
import { socketManager } from "@/game/managers/socket-manager";
import Alert from "@/utils/alert";
import { getItem } from "@/utils/persistence";
import {
  MessageSent,
  PlayerJoinResponse,
  PlayerLeftResponse,
  ReceiveMessage,
} from "mmorntype";
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
  const CHAT_THRESHOLD = 500;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [height, setHeight] = useState(448);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastChat, setLastChat] = useState(Date.now());

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isResizing = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const collapsedHeight = 40;
  const nsp = SOCKET_NAMESPACES.ISLAND;

  useEffect(() => {
    const handleNewPlayer = (data: PlayerJoinResponse) => {
      const message = `${data.nickname} 님이 입장했어요 🏝️`;
      Alert.info(message, false);

      setMessages((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          sender: "",
          message,
          isSystem: true,
        },
      ]);
      if (isCollapsed) setUnreadCount((prev) => prev + 1);
    };

    const handlePlayerLeftChat = (data: PlayerLeftResponse) => {
      const player = playerStore.getPlayer(data.id);
      const info = player?.getPlayerInfo();

      const message = `${info?.nickname ?? "알 수 없음"} 님이 떠났어요 ⛵️`;
      Alert.info(message, false);

      setMessages((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          sender: "",
          message,
          isSystem: true,
        },
      ]);
      if (isCollapsed) setUnreadCount((prev) => prev + 1);
    };

    const handleActiveChatInput = () => {
      inputRef?.current?.focus();
    };

    const handleBlurChatInput = () => {
      inputRef?.current?.blur();
    };

    EventWrapper.onUiEvent("newPlayer", handleNewPlayer);
    EventWrapper.onUiEvent("playerLeftChat", handlePlayerLeftChat);
    EventWrapper.onUiEvent("activeChatInput", handleActiveChatInput);
    EventWrapper.onUiEvent("blurChatInput", handleBlurChatInput);

    const socket = socketManager.connect(nsp);
    if (!socket) return;

    const handleMessageSent = (data: MessageSent) => {
      const { messageId, message } = data;
      const profile = getItem("profile");

      setMessages((prev) => [
        ...prev,
        {
          id: messageId,
          sender: "나",
          message,
          avatarKey: profile?.avatarKey || "purple_pawn",
        },
      ]);

      EventWrapper.emitToGame("mySpeechBubble", data);
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

      if (isCollapsed) setUnreadCount((prev) => prev + 1);

      EventWrapper.emitToGame("otherSpeechBubble", data);
    };

    socket.on("messageSent", handleMessageSent);
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("messageSent", handleMessageSent);
      socket.off("receiveMessage", handleReceiveMessage);

      EventWrapper.offUiEvent("newPlayer", handleNewPlayer);
      EventWrapper.offUiEvent("playerLeftChat", handlePlayerLeftChat);
      EventWrapper.offUiEvent("activeChatInput", handleActiveChatInput);
      EventWrapper.offUiEvent("blurChatInput", handleBlurChatInput);
    };
  }, [isCollapsed]);

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

    const handleEscapeDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        inputRef.current?.blur();
        EventWrapper.emitToGame("enableGameKeyboardInput");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleEscapeDown);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleEscapeDown);
    };
  }, [isCollapsed]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    startY.current = e.clientY;
    startHeight.current = panelRef.current?.getBoundingClientRect().height || 0;
    document.body.style.cursor = "ns-resize";
  };

  const handleSend = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e?.nativeEvent.isComposing) return;
    if (!input.trim()) {
      inputRef.current?.blur();
      EventWrapper.emitToGame("enableGameKeyboardInput");
      return;
    }

    if (lastChat + CHAT_THRESHOLD > Date.now()) {
      setMessages((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          sender: "",
          message: "잠시후 입력해주세요 🙂‍↔️",
          isSystem: true,
        },
      ]);
      return;
    }

    const socket = socketManager.connect(nsp);
    socket?.emit("sendMessage", { message: input });
    setLastChat(Date.now());
    setInput("");
  };

  const toggleCollapse = () => {
    if (isCollapsed) setUnreadCount(0);
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      ref={panelRef}
      style={{ height: isCollapsed ? collapsedHeight : height }}
      className="fixed bottom-4 left-4 w-80 bg-[#f9f5ec]/10 hover:bg-[#f9f5ec]/80 backdrop-blur-none hover:backdrop-blur-md border border-[#d6c6aa]/30 hover:border-[#d6c6aa] rounded-2xl shadow-none hover:shadow-lg transition-all duration-300 ease-in-out z-30 flex flex-col overflow-hidden"
    >
      {!isCollapsed && (
        <div
          onMouseDown={handleMouseDown}
          className="h-3 cursor-ns-resize bg-[#d6c6aa]/30 hover:bg-[#d6c6aa]/50 transition"
          title="위로 드래그해서 크기 조절"
        />
      )}

      <div className="p-2 text-[#2a1f14] font-bold text-lg flex justify-end gap-2 items-center relative">
        <div className="relative">
          {isCollapsed && unreadCount > 0 && (
            <span className="w-[22px] h-[22px] text-[10px] px-[4px] text-white bg-red-600 rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={toggleCollapse}
          className="text-[#2a1f14] hover:text-[#7c6f58] transition"
        >
          {isCollapsed ? (
            <FiChevronUp size={20} />
          ) : (
            <FiChevronDown size={20} />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm text-[#2a1f14] scrollbar-hide">
          {messages.map((msg) => {
            if (msg.isSystem) {
              return (
                <div
                  key={msg.id}
                  className="text-center text-xs text-[#2a1f14]"
                >
                  {msg.message}
                </div>
              );
            }

            const isMine = msg.sender === "나";
            return (
              <div
                key={msg.id}
                className={`flex gap-2 max-w-[85%] text-[#2a1f14] ${
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
                  <div className="font-semibold opacity-80">{msg.sender}</div>
                  <div>{msg.message}</div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      )}

      {!isCollapsed && (
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
          inputRef={inputRef}
        />
      )}
    </div>
  );
}

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: (e?: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

function ChatInput({ input, setInput, onSend, inputRef }: ChatInputProps) {
  return (
    <div className="p-3 border-t border-[#d6c6aa] bg-[#f3ece1]/90 flex items-center gap-2">
      <input
        type="text"
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend(e)}
        placeholder="메시지를 입력하세요..."
        className="flex-1 px-3 py-2 rounded-md border border-[#d6c6aa] bg-white text-[#2a1f14] text-sm outline-none focus:ring-2 focus:ring-[#d6c6aa]"
      />
      <button
        onClick={() => onSend()}
        className="text-[#2a1f14] hover:text-[#7c6f58] transition"
      >
        <FiSend size={18} />
      </button>
    </div>
  );
}
