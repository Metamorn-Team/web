// import { WARRIOR, WarriorColor } from "@/constants/game/entities";
// import {
//   WARRIOR_ATTACK,
//   WARRIOR_IDLE,
//   WARRIOR_WALK,
// } from "@/game/animations/keys/warrior";
// import { Player } from "@/game/entities/players/player";
// import { InputManager } from "@/game/managers/input/input-manager";
// import { AttackType } from "@/types/game/enum/state";
// import { UserInfo } from "@/types/socket-io/response";
// import type { Socket } from "socket.io-client";

// export class Warrior extends Player {
//   private readonly color: WarriorColor;

//   constructor(
//     scene: Phaser.Scene,
//     x: number,
//     y: number,
//     color: WarriorColor,
//     userInfo: UserInfo,
//     isControllable?: boolean,
//     inputManager?: InputManager,
//     equimentState: Equimentsta
//     io?: Socket
//   ) {
//     super(
//       scene,
//       x,
//       y,
//       WARRIOR(color),
//       userInfo,
//       isControllable,
//       inputManager,
//       io
//     );
//     this.color = color;

//     this.isBeingBorn = false;
//   }

//   protected setBodyConfig(): void {
//     this.setScale(0.7);
//     this.setRectangle(50, 50, { label: "PLAYER" });
//   }

//   update(delta: number): void {
//     super.update(delta);
//   }

//   walk(side: "right" | "left" | "none"): void {
//     if (this.isSleep) {
//       this.awake();
//     }

//     this.play(WARRIOR_WALK(this.color), true);

//     if (side === "right") {
//       this.setFlipX(false);
//     }

//     if (side === "left") {
//       this.setFlipX(true);
//     }
//   }

//   idle(): void {
//     this.play(WARRIOR_IDLE(this.color), true);
//   }

//   attack(attackType: AttackType): void {
//     if (this.isSleep) {
//       this.awake();
//     }

//     this.scene.time.delayedCall(250, () => {
//       this.scene.sound.play("hit");
//     });

//     this.play(WARRIOR_ATTACK(this.color), true);

//     if (attackType === AttackType.STRONG_ATTACK) return;
//   }

//   public jump(side: "right" | "left" | "none"): void {
//     console.log(side);
//   }
// }
