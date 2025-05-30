import { Player } from "@/game/entities/players/player";
import { FiniteStateMachine } from "@/game/fsm/machine/interface/finite-state-machine";
import { PlayerState } from "@/game/fsm/states/enum/player/player-state";
import { AttackState } from "@/game/fsm/states/player/attack-state";
import { IdleState } from "@/game/fsm/states/player/idle-state";
import { JumpState } from "@/game/fsm/states/player/jump-state";
import { StrongAttackState } from "@/game/fsm/states/player/strong-attack";
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
      .addState(PlayerState.ATTACK, new AttackState(this))
      .addState(PlayerState.STRONG_ATTACK, new StrongAttackState(this))
      .addState(PlayerState.JUMP, new JumpState(this));

    this.currentState = idle;
    this.currentState.enter();
  }
}
