import { Component } from "@/game/components/interface/component";
import { BaseEntity } from "@/game/entities/common/base-entity";
import { Renderer } from "@/game/components/renderer";
import { Phaser } from "@/game/phaser";

interface CollisionRangeSensorOptions {
  color?: number;
  alpha?: number;
  width?: number;
  height?: number;
  radius?: number;
  shape?: "circle" | "rectangle";
  offsetX?: number;
  offsetY?: number;
  enabled?: boolean;
}

export class CollisionRangeSensorComponent implements Component {
  private host: BaseEntity;
  private scene: Phaser.Scene;
  private graphics?: Phaser.GameObjects.Graphics;

  private color: number;
  private alpha: number;
  private width: number;
  private height: number;
  private radius: number;
  private shape: "circle" | "rectangle";
  private offsetX: number;
  private offsetY: number;
  private enabled: boolean;

  constructor(host: BaseEntity, options: CollisionRangeSensorOptions = {}) {
    this.host = host;
    this.scene = host.scene;

    this.color = options.color ?? 0xff8800;
    this.alpha = options.alpha ?? 0.3;
    this.width = options.width ?? 30;
    this.height = options.height ?? 30;
    this.radius = options.radius ?? 15;
    this.shape = options.shape ?? "circle";
    this.offsetX = options.offsetX ?? 0;
    this.offsetY = options.offsetY ?? 0;
    this.enabled = options.enabled ?? false;

    if (this.enabled) {
      this.createSensor();
    }
  }

  private createSensor(): void {
    this.graphics = this.scene.add.graphics();
    this.graphics.setDepth(1000);
  }

  private updateSensor(): void {
    if (!this.enabled || !this.graphics) return;

    this.graphics.clear();

    const renderer = this.host.getComponent(Renderer);
    const isRight = !renderer?.sprite.flipX || false;

    const centerX = this.host.x + this.offsetX;
    const centerY = this.host.y + this.offsetY;

    if (this.shape === "circle") {
      this.drawCircle(centerX, centerY);
    } else {
      this.drawRectangle(centerX, centerY, isRight);
    }
  }

  private drawCircle(x: number, y: number): void {
    this.graphics!.lineStyle(2, this.color, 0.8);
    this.graphics!.fillStyle(this.color, this.alpha);
    this.graphics!.strokeCircle(x, y, this.radius);
    this.graphics!.fillCircle(x, y, this.radius);
  }

  private drawRectangle(x: number, y: number, isRight: boolean): void {
    const offsetX = isRight ? 0 : -this.width;
    const drawX = x + offsetX - this.width / 2;
    const drawY = y - this.height / 2;

    this.graphics!.lineStyle(2, this.color, 0.8);
    this.graphics!.fillStyle(this.color, this.alpha);
    this.graphics!.strokeRect(drawX, drawY, this.width, this.height);
    this.graphics!.fillRect(drawX, drawY, this.width, this.height);
  }

  public highlight(
    duration: number = 500,
    highlightColor: number = 0xffff00
  ): void {
    if (!this.enabled || !this.graphics) return;

    const originalColor = this.color;
    const originalAlpha = this.alpha;

    this.color = highlightColor;
    this.alpha = 0.4;
    this.updateSensor();

    this.scene.time.delayedCall(duration, () => {
      this.color = originalColor;
      this.alpha = originalAlpha;
      this.updateSensor();
    });
  }

  public setEnabled(enabled: boolean): void {
    if (this.enabled === enabled) return;

    this.enabled = enabled;

    if (enabled) {
      this.createSensor();
    } else {
      this.destroy();
    }
  }

  public toggle(): void {
    this.setEnabled(!this.enabled);
  }

  public setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  public setRadius(radius: number): void {
    this.radius = radius;
  }

  public setShape(shape: "circle" | "rectangle"): void {
    this.shape = shape;
  }

  public setOffset(offsetX: number, offsetY: number): void {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  public setColor(color: number): void {
    this.color = color;
  }

  public setAlpha(alpha: number): void {
    this.alpha = alpha;
  }

  update(): void {
    this.updateSensor();
  }

  get name() {
    return CollisionRangeSensorComponent.name;
  }

  destroy(): void {
    this.graphics?.destroy();
    this.graphics = undefined;
  }
}
