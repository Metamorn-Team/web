// import { SheepFSM } from "@/game/fsm/creatures/sheep/sheep-fsm";
// import { SheepState } from "@/game/fsm/states/enum/creatures/sheep/sheep-state";
// import { State } from "@/game/fsm/states/interface/state";
// import { Keys } from "@/types/game/enum/key";

// export class JumpState implements State<SheepState> {
//   protected parent: SheepFSM;

//   constructor(parent: SheepFSM) {
//     this.parent = parent;
//   }

//   get name(): SheepState {
//     return SheepState.JUMP;
//   }

//   enter(): void {
//     this.parent.gameObject.onJump();
//   }

//   update(delta: number, input?: Keys[]): void {}

//   exit(): void {}
// }
