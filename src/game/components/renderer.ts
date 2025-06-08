/* eslint-disable @typescript-eslint/no-explicit-any */
// RendererComponent.ts
import { Component } from "@/game/components/interface/component";

export class Renderer implements Component {
  private _sprite: Phaser.GameObjects.Sprite;

  constructor(
    private host: Phaser.GameObjects.Container,
    private texture: string
  ) {
    this.init();
  }

  init(): void {
    this._sprite = this.host.scene.add.sprite(0, 0, this.texture);
    this._sprite.setOrigin(0.5);
  }

  get sprite() {
    return this._sprite;
  }

  update(): void {
    this._sprite.x = this.host.x;
    this._sprite.y = this.host.y;
    this._sprite.setDepth(this._sprite.y);
  }

  play(key: string, ignoreIfPlaying?: boolean) {
    this._sprite.play(key, ignoreIfPlaying);
  }

  setTint(color: number) {
    this._sprite.setTintFill(color);
  }

  clearTint() {
    this._sprite.clearTint();
  }

  setFlip(x = false, y = false) {
    this._sprite.setFlip(x, y);
  }

  setFlipX(isFlip = false) {
    this._sprite.setFlipX(isFlip);
  }

  setFlipY(isFlip = false) {
    this._sprite.setFlipY(isFlip);
  }

  setScale(weight: number) {
    this._sprite.setScale(weight);
    return this;
  }

  setTexture(key: string) {
    this._sprite.setTexture(key);
  }

  once(event: string | symbol, fn: (...args: any[]) => void, context?: any) {
    this._sprite.once(event, fn, context);
  }

  destroy(fromScene = true): void {
    this._sprite.destroy(fromScene);
  }
}
