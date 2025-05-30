import { InputManager } from "@/game/managers/input/input-manager";
import { Phaser } from "@/game/phaser";
import { Keys } from "@/types/game/enum/key";

export class KeyboardInputManager implements InputManager {
  private keyMap: Map<Keys, Phaser.Input.Keyboard.Key> = new Map();
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    if (!scene.input.keyboard) {
      console.warn("Keyboard input is not enabled in this scene!");
      return;
    }

    this.registerKey(
      Keys.UP,
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    );
    this.registerKey(
      Keys.W,
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    );
    this.registerKey(
      Keys.DOWN,
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    );
    this.registerKey(
      Keys.S,
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    );
    this.registerKey(
      Keys.LEFT,
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    );
    this.registerKey(
      Keys.A,
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    );
    this.registerKey(
      Keys.RIGHT,
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    );
    this.registerKey(
      Keys.D,
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    );

    this.registerKey(
      Keys.SPACE,
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    );
    this.registerKey(
      Keys.ENTER,
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    );
    this.registerKey(
      Keys.E,
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    );
    this.registerKey(
      Keys.Z,
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
    );
    this.registerKey(
      Keys.X,
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)
    );
  }

  registerKey(keyEnum: Keys, keyCode: Phaser.Input.Keyboard.Key): void {
    if (!this.scene.input.keyboard) return;
    this.keyMap.set(keyEnum, this.scene.input.keyboard.addKey(keyCode));
  }

  getPressedKeys(): Keys[] {
    const keys: Keys[] = [];

    this.keyMap.forEach((key, keyEnum) => {
      if (key.isDown) {
        keys.push(keyEnum);
      }
    });

    return keys;
  }

  getJustDownKeys(): Keys[] {
    const keys: Keys[] = [];

    this.keyMap.forEach((key, keyEnum) => {
      if (Phaser.Input.Keyboard.JustDown(key)) {
        keys.push(keyEnum);
      }
    });

    return keys;
  }

  isKeyDown(key: Keys): boolean {
    return this.keyMap.get(key)?.isDown || false;
  }

  isKeyJustDown(key: Keys): boolean {
    const phaserKey = this.keyMap.get(key);
    return phaserKey ? Phaser.Input.Keyboard.JustDown(phaserKey) : false;
  }

  resetKey(key: Keys): void {
    const phaserKey = this.keyMap.get(key);
    if (!phaserKey) return;

    phaserKey.reset();
  }

  resetKeyAll(): void {
    this.keyMap.forEach((_, key) => this.resetKey(key));
  }

  isMovementKeyDown() {
    const keys = this.getPressedKeys();

    return (
      keys.includes(Keys.UP) ||
      keys.includes(Keys.W) ||
      keys.includes(Keys.DOWN) ||
      keys.includes(Keys.S) ||
      keys.includes(Keys.LEFT) ||
      keys.includes(Keys.A) ||
      keys.includes(Keys.RIGHT) ||
      keys.includes(Keys.D)
    );
  }
}
