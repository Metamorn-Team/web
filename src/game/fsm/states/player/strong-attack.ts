import { PlayerFSM } from "@/game/fsm/machine/player/player-fsm";
import { PlayerState } from "@/game/fsm/states/enum/player/player-state";
import { State } from "@/game/fsm/states/interface/state";

export class StrongAttackState implements State<PlayerState> {
  protected parent: PlayerFSM;

  constructor(parent: PlayerFSM) {
    this.parent = parent;
  }

  enter() {
    this.parent.gameObject.onStrongAttack();
    this.parent.gameObject.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      () => {
        this.parent.setState(PlayerState.IDLE);
      }
    );
  }

  update() {}

  exit() {}

  get name() {
    return PlayerState.ATTACK;
  }
}
