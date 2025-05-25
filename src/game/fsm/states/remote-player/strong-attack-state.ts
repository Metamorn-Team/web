import { RemotePlayerFSM } from "@/game/fsm/machine/player/remote-player-fsm";
import { PlayerState } from "@/game/fsm/states/enum/player/player-state";
import { State } from "@/game/fsm/states/interface/state";
import { AttackType } from "@/types/game/enum/state";

export class StrongAttackState implements State<PlayerState> {
  protected parent: RemotePlayerFSM;

  constructor(parent: RemotePlayerFSM) {
    this.parent = parent;
  }

  get name(): PlayerState {
    return PlayerState.ATTACK;
  }

  enter(): void {
    this.parent.gameObject.attack(AttackType.STRONG_ATTACK);
    this.parent.gameObject.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      () => {
        this.parent.setState(PlayerState.IDLE);
      }
    );
  }

  update(): void {}

  exit(): void {}
}
