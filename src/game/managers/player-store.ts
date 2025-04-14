import { Player } from "@/game/entities/players/player";

type PlayerMap = Map<string, Player>;

class PlayerStore {
  private static instance: PlayerStore;
  private players: PlayerMap = new Map();

  private constructor() {}

  get count(): number {
    return this.players.size;
  }

  static getInstance(): PlayerStore {
    if (!PlayerStore.instance) {
      PlayerStore.instance = new PlayerStore();
    }
    return PlayerStore.instance;
  }

  addPlayer(id: string, player: Player): boolean {
    if (this.players.has(id)) {
      console.warn(`Player ${id} already exists`);
      return false;
    }
    this.players.set(id, player);
    return true;
  }

  deletePlayer(id: string): boolean {
    if (!this.players.has(id)) {
      console.warn(`Player ${id} not found`);
      return false;
    }

    this.players.delete(id);
    return true;
  }

  getPlayer(id: string): Player | null {
    return this.players.get(id) || null;
  }

  has(id: string): boolean {
    return this.players.has(id);
  }

  getAllPlayers(): Readonly<PlayerMap> {
    return this.players;
  }

  findPlayers(predicate: (player: Player) => boolean): Player[] {
    return Array.from(this.players.values()).filter(predicate);
  }

  clear(): void {
    this.players.clear();
  }
}

export const playerStore = PlayerStore.getInstance();
