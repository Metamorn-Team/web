import { getItem } from "@/utils/persistence";
import { io, Socket } from "socket.io-client";

class SocketManager {
  private store: Map<string, Socket> = new Map();

  connect(nsp: string) {
    if (!this.store.has(nsp)) {
      const accessToken = getItem("access_token");
      const socket = io(`http://localhost:4000/game/${nsp}`, {
        auth: {
          authorization: accessToken,
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
