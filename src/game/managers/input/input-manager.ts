import { Keys } from "@/types/game/enum/key";

export interface InputManager {
  registerKey(keyEnum: Keys, keyCode: Phaser.Input.Keyboard.Key): void;
  getPressedKeys(): Keys[];
  getJustDownKeys(): Keys[];
  isKeyDown(key: Keys): boolean;
  isKeyJustDown(key: Keys): boolean;
  resetKey(key: Keys): void;
  resetKeyAll(): void;
  isMovementKeyDown(): boolean;
}
