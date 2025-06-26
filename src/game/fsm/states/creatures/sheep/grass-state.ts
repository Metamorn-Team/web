import { SheepFSM } from "@/game/fsm/creatures/sheep/sheep-fsm";
import { SheepState } from "@/game/fsm/states/enum/creatures/sheep/sheep-state";
import { State } from "@/game/fsm/states/interface/state";

export class GrassState implements State<SheepState> {
  protected parent: SheepFSM;
  private timer = 0;
  private duration = 0;

  constructor(parent: SheepFSM) {
    this.parent = parent;
  }

  get name(): SheepState {
    return SheepState.GRASS;
  }

  enter(): void {
    this.parent.gameObject.onGrass();
    this.timer = 0;
    this.duration = Phaser.Math.Between(2000, 5000);
  }

  update(delta: number): void {
    this.timer += delta;

    if (this.timer < this.duration) return;

    const r = Math.random();

    if (r < 0.3) {
      this.parent.setState(SheepState.MOVE);
      return;
    }

    if (r < 0.8) {
      this.parent.setState(SheepState.IDLE);
      return;
    }

    this.timer = 0;
    this.duration = Phaser.Math.Between(2000, 5000);
  }

  exit(): void {}
}
