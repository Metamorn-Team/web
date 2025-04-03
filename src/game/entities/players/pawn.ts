import { PAWN, PawnColor } from "@/constants/entities";
import { PAWN_ATTACK, PAWN_IDLE, PAWN_WALK } from "@/game/animations/keys/pawn";
import { Player } from "@/game/entities/players/player";
import { Socket } from "socket.io-client";

export class Pawn extends Player {
  private readonly color: PawnColor;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    color: PawnColor,
    nickname: string,
    isControllable?: boolean,
    io?: Socket
  ) {
    super(scene, x, y, PAWN(color), nickname, isControllable, io);
    this.speed = 1;
    this.color = color;

    this.setScale(0.7);
    this.setRectangle(50, 50, { label: "PLAYER" });
    this.setFixedRotation();
    // this.setStatic(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation: any) => {
      if (animation.key === PAWN_ATTACK(color)) {
        this.isAttack = false;
      }
    });

    this.idle();
  }

  update(): void {
    super.update();
  }

  walk(side: "right" | "left" | "up" | "down"): number {
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

  attack(): void {
    if (this.isAttack) return;
    this.isAttack = true;
    this.play(PAWN_ATTACK(this.color), true);
  }
}
