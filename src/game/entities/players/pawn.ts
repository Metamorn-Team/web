import { PAWN, PawnColor } from "@/constants/game/entities";
import {
  PAWN_ATTACK,
  PAWN_IDLE,
  PAWN_JUMP,
  PAWN_STRONG_ATTACK,
  PAWN_WALK,
} from "@/game/animations/keys/pawn";
import { Player } from "@/game/entities/players/player";
import { InputManager } from "@/game/managers/input/input-manager";
import { AttackType } from "@/types/game/enum/state";
import { TypedSocket } from "@/types/socket-io";
import { UserInfo } from "@/types/socket-io/response";

export class Pawn extends Player {
  private readonly color: PawnColor;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    color: PawnColor,
    userInfo: UserInfo,
    isControllable?: boolean,
    inputManager?: InputManager,
    io?: TypedSocket
  ) {
    super(scene, x, y, PAWN(color), userInfo, isControllable, inputManager, io);
    this.color = color;

    this.isBeingBorn = false;
  }

  getColor() {
    return this.color;
  }

  protected setBodyConfig(): void {
    this.setScale(0.7);
    this.setCircle(15, {
      label: this.isControllable ? "MY_PLAYER" : "PLAYER",
    });
  }

  update(delta: number): void {
    if (this.isBeingBorn) return;

    super.update(delta);
  }

  walk(side: "right" | "left" | "none"): void {
    if (this.isSleep) {
      this.awake();
    }

    this.play(PAWN_WALK(this.color), true);

    if (side === "right") {
      this.setFlipX(false);
    }

    if (side === "left") {
      this.setFlipX(true);
    }
  }

  idle(): void {
    this.play(PAWN_IDLE(this.color), true);
  }

  attack(attackType: AttackType): void {
    if (this.isSleep) {
      this.awake();
    }

    this.scene.time.delayedCall(250, () => {
      this.scene.sound.play("hit", { volume: 0.1 });
    });

    this.play(
      attackType === AttackType.STRONG_ATTACK
        ? PAWN_STRONG_ATTACK(this.color)
        : PAWN_ATTACK(this.color),
      true
    );
  }

  public jump(side: "right" | "left" | "none"): void {
    this.play(PAWN_JUMP(this.color), true);
    this.scene.sound.play("jump", { volume: 0.05 });

    if (side === "right") {
      this.setFlipX(false);
    }

    if (side === "left") {
      this.setFlipX(true);
    }
  }
}
