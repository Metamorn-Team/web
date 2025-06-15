/* eslint-disable @typescript-eslint/no-explicit-any */
import { PawnColor } from "@/constants/game/entities";
import { Npc } from "@/game/entities/npc/npc";
import { Phaser } from "@/game/phaser";
import { UserInfo } from "@/types/socket-io/response";
import {
  IslandHeartbeatResponse,
  MessageSent,
  PlayerJoinResponse,
  PlayerLeftResponse,
  ReceiveMessage,
} from "mmorntype";
import { ItemGrade } from "mmorntype/dist/src/domain/types/item.types";

export interface Events {
  [name: string]: any;
}

export interface DefaultEvents {
  [name: string]: (...args: any[]) => void;
}

export interface GameToUiEvent {
  "current-scene-ready": (data: {
    scene: Phaser.Scene;
    socketNsp?: string;
  }) => void;
  "start-change-scene": () => void;
  "finish-change-scene": () => void;
  "npc-interaction-started": (data: { npc: Npc; type: "guide" }) => void;
  "player-click": (userInfo: UserInfo) => void;
  requestJoinIsland: () => void;
  openLoginModal: () => void;
  updateParticipantsPanel: () => void;
  newPlayer: (data: PlayerJoinResponse) => void;
  playerLeftChat: (data: PlayerLeftResponse) => void;
  activeChatInput: () => void;
  attacked: () => void;
  updateOnlineStatus: (data: IslandHeartbeatResponse) => void;
  initBgmStatus: (isPlay: boolean) => void;
  blurChatInput: () => void;
  openIslandList: () => void;
}

export interface UiToGameEvent {
  mySpeechBubble: (data: MessageSent) => void;
  otherSpeechBubble: (data: ReceiveMessage) => void;
  "left-island": () => void;
  joinNormalIsland: (islandId: string) => void;
  joinDesertedIsland: () => void;
  playBgmToggle: () => void;
  enableGameKeyboardInput: () => void;
  disableGameInput: () => void;
  createdIsland: (islandId: string) => void;

  tryOnProduct: (type: string, key: string) => void;
  goIsland: () => void;
  changeToMyIsland: () => void;
  changeToLoby: () => void;
  changeAvatarColor: (color: PawnColor) => void;
  changeNickname: (nickname: string) => void;
  changeAura: (key: string, grade: ItemGrade) => void;
  changeSpeechBubble: (key: string) => void;
}
