import * as msgpackParser from "socket.io-msgpack-parser";
import { getItem } from "@/utils/persistence";
import { io, Socket } from "socket.io-client";
import { ClientToServer, ServerToClient } from "mmorntype";
import { API_BASE_URL, APP_VERSION } from "@/constants/constants";

class SocketManager {
  private store: Map<string, Socket<ServerToClient, ClientToServer>> =
    new Map();

  connect(nsp: string) {
    if (!this.store.has(nsp)) {
      const accessToken = getItem("access_token");
      const socket = io(`${API_BASE_URL}/${nsp}`, {
        parser: msgpackParser,
        path: "/game",
        auth: {
          authorization: accessToken,
          "app-version": APP_VERSION,
        },
      });
      socket.connect();
      this.store.set(nsp, socket);
    }
    return this.store.get(nsp);
  }

  disconnect(nsp: string) {
    const socket = this.store.get(nsp);
    if (socket) {
      socket.disconnect();
      this.store.delete(nsp);
    }
  }

  clear() {
    for (const socket of this.store.values()) {
      socket.disconnect();
    }
    this.store.clear();
  }
}

export const socketManager = new SocketManager();
