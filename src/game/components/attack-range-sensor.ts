import { Component } from "@/game/components/interface/component";
import { BaseEntity } from "@/game/entities/common/base-entity";
import { Renderer } from "@/game/components/renderer";
import { Phaser } from "@/game/phaser";

type SensorShape = "circle" | "rectangle" | "line" | "fan";

interface AttackRangeSensorOptions {
  shape?: SensorShape;
  radius?: number;
  width?: number;
  height?: number;
  angle?: number; // 부채형일 때 사용 (도 단위)
  color?: number;
  alpha?: number;
  showText?: boolean;
  enabled?: boolean;
}

/**
 * 공격 범위를 시각화하는 디버깅 컴포넌트
 *
 * 사용법:
 * ```typescript
 * // 원형 범위
 * new AttackRangeSensorComponent(this, {
 *   shape: "circle",
 *   radius: 50,
 *   color: 0xff0000,
 *   enabled: true
 * })
 *
 * // 사각형 범위
 * new AttackRangeSensorComponent(this, {
 *   shape: "rectangle",
 *   width: 100,
 *   height: 30,
 *   color: 0x00ff00,
 *   enabled: true
 * })
 *
 * // 선형 범위
 * new AttackRangeSensorComponent(this, {
 *   shape: "line",
 *   radius: 80,
 *   color: 0x0000ff,
 *   enabled: true
 * })
 *
 * // 부채형 범위
 * new AttackRangeSensorComponent(this, {
 *   shape: "fan",
 *   radius: 60,
 *   angle: 90,
 *   color: 0xffff00,
 *   enabled: true
 * })
 * ```
 */
export class AttackRangeSensorComponent implements Component {
  private host: BaseEntity;
  private scene: Phaser.Scene;
  private graphics?: Phaser.GameObjects.Graphics;
  private text?: Phaser.GameObjects.Text;

  private shape: SensorShape;
  private radius: number;
  private width: number;
  private height: number;
  private angle: number;
  private color: number;
  private alpha: number;
  private showText: boolean;
  private enabled: boolean;

  constructor(host: BaseEntity, options: AttackRangeSensorOptions = {}) {
    this.host = host;
    this.scene = host.scene;

    this.shape = options.shape ?? "circle";
    this.radius = options.radius ?? 50;
    this.width = options.width ?? 100;
    this.height = options.height ?? 30;
    this.angle = options.angle ?? 90;
    this.color = options.color ?? 0xff0000;
    this.alpha = options.alpha ?? 0.3;
    this.showText = options.showText ?? true;
    this.enabled = options.enabled ?? false;

    if (this.enabled) {
      this.createSensor();
    }
  }

  private createSensor(): void {
    this.graphics = this.scene.add.graphics();
    this.graphics.setDepth(1000); // 최상단에 표시

    if (this.showText) {
      const textContent = this.getTextContent();
      this.text = this.scene.add.text(0, 0, textContent, {
        fontSize: "12px",
        color: `#${this.color.toString(16).padStart(6, "0")}`,
        backgroundColor: "#000000",
        padding: { x: 4, y: 2 },
        resolution: this.host.scene.cameras.main.zoom,
      });
      this.text.setDepth(1001);
      this.text.setOrigin(0.5);
    }
  }

  private getTextContent(): string {
    switch (this.shape) {
      case "circle":
        return `원형범위: ${this.radius}px`;
      case "rectangle":
        return `사각범위: ${this.width}x${this.height}px`;
      case "line":
        return `선형범위: ${this.radius}px`;
      case "fan":
        return `부채범위: ${this.radius}px ${this.angle}°`;
      default:
        return `범위: ${this.radius}px`;
    }
  }

  private updateSensor(): void {
    if (!this.enabled || !this.graphics) return;

    this.graphics.clear();

    const renderer = this.host.getComponent(Renderer);
    const isRight = !renderer?.sprite.flipX || false;

    // 몸 중앙을 기준으로 위치 계산
    const centerX = this.host.x;
    const centerY = this.host.y;

    // 모양에 따라 다른 그리기 방식
    switch (this.shape) {
      case "circle":
        this.drawCircle(centerX, centerY);
        break;
      case "rectangle":
        this.drawRectangle(centerX, centerY, isRight);
        break;
      case "line":
        this.drawLine(centerX, centerY, isRight);
        break;
      case "fan":
        this.drawFan(centerX, centerY, isRight);
        break;
    }

    // 텍스트 위치 업데이트
    if (this.text) {
      const textY = centerY - this.radius - 20;
      this.text.setPosition(centerX, textY);
      this.text.setText(this.getTextContent());
    }
  }

  private drawCircle(centerX: number, centerY: number): void {
    if (!this.graphics) return;

    this.graphics.lineStyle(2, this.color, 0.8);
    this.graphics.fillStyle(this.color, this.alpha);
    this.graphics.strokeCircle(centerX, centerY, this.radius);
    this.graphics.fillCircle(centerX, centerY, this.radius);
  }

  private drawRectangle(
    centerX: number,
    centerY: number,
    isRight: boolean
  ): void {
    if (!this.graphics) return;

    // 사각형의 끝 부분이 몸 중앙에 위치하도록 계산
    const rectX = isRight ? centerX : centerX - this.width;
    const rectY = centerY - this.height / 2;

    this.graphics.lineStyle(2, this.color, 0.8);
    this.graphics.fillStyle(this.color, this.alpha);
    this.graphics.strokeRect(rectX, rectY, this.width, this.height);
    this.graphics.fillRect(rectX, rectY, this.width, this.height);

    // 방향 표시 (몸 중앙에서 시작)
    this.graphics.lineStyle(3, this.color, 1);
    const startX = centerX;
    const endX = isRight ? centerX + this.width : centerX - this.width;
    this.graphics.lineBetween(startX, centerY, endX, centerY);
  }

  private drawLine(centerX: number, centerY: number, isRight: boolean): void {
    if (!this.graphics) return;

    // 선의 시작점을 몸 중앙으로 설정
    const startX = centerX;
    const endX = centerX + (isRight ? this.radius : -this.radius);

    this.graphics.lineStyle(4, this.color, 0.8);
    this.graphics.lineBetween(startX, centerY, endX, centerY);

    // 선 끝에 원 그리기
    this.graphics.lineStyle(2, this.color, 0.8);
    this.graphics.fillStyle(this.color, this.alpha);
    this.graphics.strokeCircle(endX, centerY, 5);
    this.graphics.fillCircle(endX, centerY, 5);
  }

  private drawFan(centerX: number, centerY: number, isRight: boolean): void {
    if (!this.graphics) return;

    // 부채의 시작점을 몸 중앙으로 설정
    const startX = centerX;
    const startY = centerY;

    // 부채의 중심각 계산 (라디안)
    const angleRad = Phaser.Math.DegToRad(this.angle);
    const startAngle = isRight ? -angleRad / 2 : Math.PI - angleRad / 2;
    const endAngle = isRight ? angleRad / 2 : Math.PI + angleRad / 2;

    // 부채 그리기
    this.graphics.lineStyle(2, this.color, 0.8);
    this.graphics.fillStyle(this.color, this.alpha);
    this.graphics.beginPath();
    this.graphics.moveTo(startX, startY);
    this.graphics.arc(startX, startY, this.radius, startAngle, endAngle, false);
    this.graphics.closePath();
    this.graphics.strokePath();
    this.graphics.fillPath();

    // 방향선 그리기
    this.graphics.lineStyle(3, this.color, 1);
    const midAngle = (startAngle + endAngle) / 2;
    const endX = startX + Math.cos(midAngle) * this.radius;
    const endY = startY + Math.sin(midAngle) * this.radius;
    this.graphics.lineBetween(startX, startY, endX, endY);
  }

  public highlight(
    duration: number = 500,
    highlightColor: number = 0xffff00
  ): void {
    if (!this.enabled || !this.graphics) return;

    const originalColor = this.color;
    const originalAlpha = this.alpha;

    // 하이라이트 색상으로 변경
    this.color = highlightColor;
    this.alpha = 0.4;
    this.updateSensor();

    // 지정된 시간 후 원래 색상으로 복원
    this.scene.time.delayedCall(duration, () => {
      this.color = originalColor;
      this.alpha = originalAlpha;
      this.updateSensor();
    });
  }

  public getAttackRange(): {
    x: number;
    y: number;
    radius: number;
    shape: SensorShape;
  } {
    // 몸 중앙을 기준으로 위치 계산
    const centerX = this.host.x;
    const centerY = this.host.y;

    return {
      x: centerX,
      y: centerY,
      radius: this.radius,
      shape: this.shape,
    };
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

  public setShape(shape: SensorShape): void {
    this.shape = shape;
  }

  public setRadius(radius: number): void {
    this.radius = radius;
  }

  public setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  public setAngle(angle: number): void {
    this.angle = angle;
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
    return AttackRangeSensorComponent.name;
  }

  destroy(): void {
    if (this.graphics) {
      this.graphics.destroy();
      this.graphics = undefined;
    }
    if (this.text) {
      this.text.destroy();
      this.text = undefined;
    }
  }
}
