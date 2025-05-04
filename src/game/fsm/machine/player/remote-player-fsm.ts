import { Player } from "@/game/entities/players/player";
import { FiniteStateMachine } from "@/game/fsm/machine/interface/finite-state-machine";
import { PlayerState } from "@/game/fsm/states/enum/player/player-state";
import { State } from "@/game/fsm/states/interface/state";
import { AttackState } from "@/game/fsm/states/remote-player/attack-state";
import { IdleState } from "@/game/fsm/states/remote-player/idle-state";
import { JumpState } from "@/game/fsm/states/remote-player/jump-state";
import { WalkState } from "@/game/fsm/states/remote-player/walk-state";

export class RemotePlayerFSM extends FiniteStateMachine<PlayerState> {
  public gameObject: Player;

  constructor(gameObject: Player) {
    super();
    this.gameObject = gameObject;
    console.log(gameObject);
    this.init();
  }

  protected currentState: State<PlayerState> | null;

  init(): void {
    this.addState(PlayerState.IDLE, new IdleState(this))
      .addState(PlayerState.WALK, new WalkState(this))
      .addState(PlayerState.ATTACK, new AttackState(this))
      .addState(PlayerState.JUMP, new JumpState(this));

    this.setState(PlayerState.IDLE);
  }
}
