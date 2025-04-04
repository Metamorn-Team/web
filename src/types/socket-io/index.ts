import { UserInfo } from "@/types/socket-io/response";

export interface ServerToClientEvents {
  playerJoin: (data: UserInfo & { x: number; y: number }) => void;
  playerLeft: (data: { id: string }) => void;
  playerMoved: (data: UserInfo & { x: number; y: number }) => void;
  activeUsers: (activeUsers: (UserInfo & { x: number; y: number })[]) => void;
}

export interface ClientToServerEvents {
  playerJoin: (data: { type?: "dev" | "design"; x: number; y: number }) => void;
  playerMoved: (data: { x: number; y: number }) => void;
}

export interface InterServerEvents {
  pong: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
