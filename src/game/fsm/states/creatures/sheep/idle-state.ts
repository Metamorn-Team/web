import { SheepFSM } from "@/game/fsm/creatures/sheep/sheep-fsm";
import { SheepState } from "@/game/fsm/states/enum/creatures/sheep/sheep-state";
import { State } from "@/game/fsm/states/interface/state";

export class IdleState implements State<SheepState> {
  protected parent: SheepFSM;
  private timer = 0;
  private moveDuration = 0;

  constructor(parent: SheepFSM) {
    this.parent = parent;
  }

  get name(): SheepState {
    return SheepState.IDLE;
  }

  enter(): void {
    this.parent.gameObject.onIdle();
    this.timer = 0;
    this.moveDuration = Phaser.Math.Between(2000, 5000);
  }

  update(delta: number): void {
    this.timer += delta;

    if (this.timer > this.moveDuration) {
      const r = Math.random();

      // if (r < 0.2) {
      //   this.parent.setState(SheepState.JUMP);
      //   return;
      // }

      if (r < 0.7) {
        this.parent.setState(SheepState.MOVE);
        return;
      }

      this.timer = 0;
      this.moveDuration = Phaser.Math.Between(2000, 5000);
    }
  }

  exit(): void {}
}
