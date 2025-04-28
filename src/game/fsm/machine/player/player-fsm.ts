import { Player } from "@/game/entities/players/player";
import { FiniteStateMachine } from "@/game/fsm/machine/interface/finite-state-machine";
import { PlayerState } from "@/game/fsm/states/enum/player/player-state";
import { AttackState } from "@/game/fsm/states/player/attack-state";
import { IdleState } from "@/game/fsm/states/player/idle-state";
import { WalkState } from "@/game/fsm/states/player/walk-state";

export class PlayerFSM extends FiniteStateMachine<PlayerState> {
  public gameObject: Player;

  constructor(gameObject: Player) {
    super();
    this.gameObject = gameObject;
    this.init();
  }

  init() {
    const idle = new IdleState(this);

    this.addState(PlayerState.IDLE, idle)
      .addState(PlayerState.WALK, new WalkState(this))
      .addState(PlayerState.ATTACK, new AttackState(this));

    this.currentState = idle;
    this.currentState.enter();
  }
}
