import { WARRIOR, WarriorColor } from "@/constants/entities";
import { BORN } from "@/game/animations/keys/common";
import {
  WARRIOR_ATTACK,
  WARRIOR_IDLE,
  WARRIOR_WALK,
} from "@/game/animations/keys/warrior";
import { Player } from "@/game/entities/players/player";
import { UserInfo } from "@/types/socket-io/response";
import type { Socket } from "socket.io-client";

export class Warrior extends Player {
  private readonly color: WarriorColor;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    color: WarriorColor,
    userInfo: UserInfo,
    isControllable?: boolean,
    io?: Socket
  ) {
    super(scene, x, y, WARRIOR(color), userInfo, isControllable, io);
    this.color = color;

    if (this.isControllable) {
      this.play(BORN);
      this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.isBeingBorn = false;
      });
    } else {
      this.isBeingBorn = false;
    }
  }

  protected setBodyConfig(): void {
    this.setScale(0.7);
    this.setRectangle(50, 50, { label: "PLAYER" });
  }

  update(delta: number): void {
    super.update(delta);
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

  hit(): void {
    this.setTint(0xffffff);

    // this.scene.time.delayedCall(1000, () => {
    //   this.clearTint();
    // });

    const originalX = this.x;

    this.scene.tweens.add({
      targets: this,
      x: {
        from: originalX - 1,
        to: originalX + 1,
      },
      duration: 50,
      yoyo: true,
      repeat: 2,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.x = originalX;
      },
    });
  }
}
