import { WARRIOR, WarriorColor } from "@/constants/entities";
import {
  WARRIOR_ATTACK,
  WARRIOR_IDLE,
  WARRIOR_WALK,
} from "@/game/animations/keys/warrior";
import { Player } from "@/game/entities/players/player";
import type { Socket } from "socket.io-client";

export class Warrior extends Player {
  private readonly color: WarriorColor;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    color: WarriorColor,
    nickname: string,
    isControllable?: boolean,
    io?: Socket
  ) {
    super(scene, x, y, WARRIOR(color), nickname, isControllable, io);
    this.speed = 1;
    this.color = color;

    this.setScale(0.7);
    this.setRectangle(50, 50, { label: "PLAYER" });
    this.setFixedRotation();
    // this.setStatic(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation: any) => {
      if (animation.key === WARRIOR_ATTACK(color)) {
        this.isAttack = false;
      }
    });

    this.idle();
  }

  update(): void {
    super.update();
  }

  walk(side: "right" | "left" | "up" | "down"): number {
    this.play(WARRIOR_WALK(this.color), true);

    if (side === "right") {
      this.setFlipX(false);
      return this.speed;
    }

    if (side === "left") {
      this.setFlipX(true);
      return -this.speed;
    }

    if (side === "up") {
      return -this.speed;
    }

    if (side === "down") {
      return this.speed;
    }

    return this.speed;
  }

  idle(): void {
    this.play(WARRIOR_IDLE(this.color), true);
  }

  attack(): void {
    if (this.isAttack) return;
    this.isAttack = true;
    this.play(WARRIOR_ATTACK(this.color), true);
  }
}
