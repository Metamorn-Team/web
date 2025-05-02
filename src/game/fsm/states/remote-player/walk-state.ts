import { RemotePlayerFSM } from "@/game/fsm/machine/player/remote-player-fsm";
import { PlayerState } from "@/game/fsm/states/enum/player/player-state";
import { State } from "@/game/fsm/states/interface/state";

export class WalkState implements State<PlayerState> {
  protected parent: RemotePlayerFSM;

  constructor(parent: RemotePlayerFSM) {
    this.parent = parent;
  }

  get name(): PlayerState {
    return PlayerState.WALK;
  }

  enter(): void {}

  update(): void {
    const x = this.parent.gameObject.x;
    const y = this.parent.gameObject.y;
    const targetPosition = this.parent.gameObject.targetPosition;

    const dx = x - targetPosition.x;

    const distance = Phaser.Math.Distance.Between(
      x,
      y,
      targetPosition.x,
      targetPosition.y
    );

    if (distance < 0.5) {
      this.parent.setState(PlayerState.IDLE);
      return;
    }

    this.parent.gameObject.walk(dx > 0 ? "left" : dx < 0 ? "right" : "none");
    this.parent.gameObject.x = Phaser.Math.Linear(x, targetPosition.x, 0.1);
    this.parent.gameObject.y = Phaser.Math.Linear(y, targetPosition.y, 0.1);
  }

  exit(): void {}
}
