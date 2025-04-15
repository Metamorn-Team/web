/* eslint-disable @typescript-eslint/no-explicit-any */
import { Npc } from "@/game/entities/npc/npc";
import { Phaser } from "@/game/phaser";
import { UserInfo } from "@/types/socket-io/response";
import {
  MessageSent,
  PlayerJoinResponse,
  PlayerLeftResponse,
  ReceiveMessage,
} from "mmorntype";

export interface Events {
  [name: string]: any;
}

export interface DefaultEvents {
  [name: string]: (...args: any[]) => void;
}

export interface GameToUiEvent {
  "current-scene-ready": (data: {
    scene: Phaser.Scene;
    socketNsp: string;
  }) => void;
  "start-change-scene": () => void;
  "finish-change-scene": () => void;
  "npc-interaction-started": (data: { npc: Npc; type: "guide" }) => void;
  "player-click": (userInfo: UserInfo) => void;
  "request-join-island": (data: { type: "dev" | "design" }) => void;
  newPlayer: (data: PlayerJoinResponse) => void;
  playerLeftChat: (data: PlayerLeftResponse) => void;
  activeChatInput: () => void;
}

export interface UiToGameEvent {
  mySpeechBubble: (data: MessageSent) => void;
  otherSpeechBubble: (data: ReceiveMessage) => void;
  "left-island": () => void;
  "join-island": (data: { type: "dev" | "design" }) => void;
  disabledChatInput: () => void;
}
