import { RemotePlayerFSM } from "@/game/fsm/machine/player/remote-player-fsm";
import { PlayerState } from "@/game/fsm/states/enum/player/player-state";
import { State } from "@/game/fsm/states/interface/state";

export class IdleState extends State<PlayerState> {
  protected parent: RemotePlayerFSM;

  constructor(parent: RemotePlayerFSM) {
    super();
    this.parent = parent;
  }

  get name(): PlayerState {
    return PlayerState.IDLE;
  }

  enter(): void {
    this.parent.gameObject.idle();
  }

  update(): void {
    const x = this.parent.gameObject.x;
    const y = this.parent.gameObject.y;
    const targetPosition = this.parent.gameObject.targetPosition;

    const distance = Phaser.Math.Distance.Between(
      x,
      y,
      targetPosition.x,
      targetPosition.y
    );

    if (distance > 0.5) {
      this.parent.setState(PlayerState.WALK);
    }
  }

  exit(): void {}
}
