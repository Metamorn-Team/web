import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";
import { InputManager } from "@/game/managers/input/input-manager";
import { Keys } from "@/types/game/enum/key";

export class VirtualJoystickInputManager implements InputManager {
  private joystick: VirtualJoystick;
  private cursor: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  private virtualKeysDown = new Set<Keys>();

  constructor(joystickInstance: VirtualJoystick) {
    this.joystick = joystickInstance;
    this.cursor = this.joystick.createCursorKeys();
  }

  pressVirtualKey(key: Keys) {
    this.virtualKeysDown.add(key);
  }

  releaseVirtualKey(key: Keys) {
    this.virtualKeysDown.delete(key);
  }

  getJustDownKeys(): Keys[] {
    const keys = Array.from(this.virtualKeysDown);
    return keys;
  }

  isKeyJustDown(key: Keys): boolean {
    return this.virtualKeysDown.has(key);
  }

  isKeyDown(key: Keys): boolean {
    return this.virtualKeysDown.has(key);
  }

  isMovementKeyDown(): boolean {
    return this.getCurrentMovementKeys().length > 0;
  }

  getCurrentMovementKeys(): Keys[] {
    const keys: Keys[] = [];

    if (this.cursor.up.isDown) keys.push(Keys.W);
    if (this.cursor.down.isDown) keys.push(Keys.S);
    if (this.cursor.left.isDown) keys.push(Keys.A);
    if (this.cursor.right.isDown) keys.push(Keys.D);

    return keys;
  }

  getPressedKeys(): Keys[] {
    const movementKeys = this.getCurrentMovementKeys();
    const virtualKeys = Array.from(this.virtualKeysDown);

    return [...movementKeys, ...virtualKeys];
  }

  resetKeyAll(): void {
    // this.virtualKeysDown.clear();
  }

  registerKey(): void {}
  resetKey(): void {}
}
