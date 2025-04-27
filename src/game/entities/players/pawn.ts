import { PAWN, PawnColor } from "@/constants/game/entities";
import { PAWN_ATTACK, PAWN_IDLE, PAWN_WALK } from "@/game/animations/keys/pawn";
import { Player } from "@/game/entities/players/player";
import { InputManager } from "@/game/managers/input-manager";
import { PlayerAnimationState } from "@/types/game/enum/animation";
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

    // born 애니메이션 추가
    this.isBeingBorn = false;
  }

  getColor() {
    return this.color;
  }

  protected setBodyConfig(): void {
    this.setScale(0.7);
    this.setCircle(20, {
      label: this.isControllable ? "MY_PLAYER" : "PLAYER",
    });
  }

  update(): void {
    if (this.isBeingBorn) return;

    super.update();
  }

  walk(side: "right" | "left" | "up" | "down"): number {
    if (this.isSleep) {
      this.awake();
    }

    this.play(PAWN_WALK(this.color), true);

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
    this.play(PAWN_IDLE(this.color), true);
  }

  attack(attackType: AttackType): void {
    if (this.currAnimationState === PlayerAnimationState.ATTACK) return;
    this.currAnimationState = PlayerAnimationState.ATTACK;

    if (this.isSleep) {
      this.awake();
    }

    this.scene.time.delayedCall(250, () => {
      this.scene.sound.play("hit");
    });

    this.play(PAWN_ATTACK(this.color), true).once(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      () => {
        this.currAnimationState = PlayerAnimationState.IDLE;
      }
    );

    if (attackType === AttackType.VISUAL) return;
    this.io?.emit("attack");
  }
}
