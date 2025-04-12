import { Phaser } from "@/game/phaser";
import { Keys } from "@/types/game/enum/key";

export class InputManager {
  private keyMap: Map<Keys, Phaser.Input.Keyboard.Key> = new Map();

  constructor(scene: Phaser.Scene) {
    console.log(scene);
    if (scene.input.keyboard) {
      this.keyMap.set(
        Keys.UP,
        scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
      );
      this.keyMap.set(
        Keys.DOWN,
        scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
      );
      this.keyMap.set(
        Keys.LEFT,
        scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
      );
      this.keyMap.set(
        Keys.RIGHT,
        scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
      );

      this.keyMap.set(
        Keys.SPACE,
        scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      );
    }
  }

  getPressedKeys(): Keys[] {
    const keys: Keys[] = [];

    if (this.keyMap.get(Keys.UP)!.isDown) keys.push(Keys.UP);
    if (this.keyMap.get(Keys.DOWN)!.isDown) keys.push(Keys.DOWN);
    if (this.keyMap.get(Keys.LEFT)!.isDown) keys.push(Keys.LEFT);
    if (this.keyMap.get(Keys.RIGHT)!.isDown) keys.push(Keys.RIGHT);
    if (Phaser.Input.Keyboard.JustDown(this.keyMap.get(Keys.SPACE)!))
      keys.push(Keys.SPACE);

    return keys;
  }
}
