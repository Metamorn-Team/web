import { ClientToServer, ServerToClient } from "mmorntype";
import { Socket } from "socket.io-client";

export type TypedSocket = Socket<ServerToClient, ClientToServer>;
