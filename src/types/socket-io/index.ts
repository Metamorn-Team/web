export interface ServerToClientEvents {
  playerJoin: (data: { playerId: string }) => void;
  playerLeft: (data: { playerId: string }) => void;
  playerMoved: (data: { playerId: string; x: number; y: number }) => void;
  activeUsers: (activeUsers: {
    [playerId: string]: { x: number; y: number };
  }) => void;
}

export interface ClientToServerEvents {
  playerJoin: (data: { x: number; y: number }) => void;
  playerMoved: (data: { x: number; y: number }) => void;
}

export interface InterServerEvents {
  pong: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
