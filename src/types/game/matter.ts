import { Phaser } from "@/game/phaser";

export interface CollisionBody {
  gameObject: typeof Phaser.GameObjects | null;
  label: string;
}
