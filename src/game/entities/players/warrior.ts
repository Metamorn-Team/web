import { WARRIOR, WarriorColor } from "@/constants/game/entities";
import { BORN } from "@/game/animations/keys/common";
import {
  WARRIOR_ATTACK,
  WARRIOR_IDLE,
  WARRIOR_WALK,
} from "@/game/animations/keys/warrior";
import { Player } from "@/game/entities/players/player";
import { InputManager } from "@/game/managers/input-manager";
import { PlayerAnimationState } from "@/types/game/enum/animation";
import { AttackType } from "@/types/game/enum/state";
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
    inputManager?: InputManager,
    io?: Socket
  ) {
    super(
      scene,
      x,
      y,
      WARRIOR(color),
      userInfo,
      isControllable,
      inputManager,
      io
    );
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

  attack(attackType: AttackType): void {
    if (this.currAnimationState === PlayerAnimationState.ATTACK) return;
    this.currAnimationState = PlayerAnimationState.ATTACK;

    this.play(WARRIOR_ATTACK(this.color), true).once(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      () => {
        this.currAnimationState = PlayerAnimationState.IDLE;
      }
    );

    if (attackType === AttackType.VISUAL) return;
    this.io?.emit("attack");
  }
}
