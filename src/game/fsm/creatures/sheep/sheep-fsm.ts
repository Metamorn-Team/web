import { Sheep } from "@/game/entities/sheep";
import { FiniteStateMachine } from "@/game/fsm/machine/interface/finite-state-machine";
import { IdleState } from "@/game/fsm/states/creatures/sheep/idle-state";
import { MoveState } from "@/game/fsm/states/creatures/sheep/move-state";
import { SheepState } from "@/game/fsm/states/enum/creatures/sheep/sheep-state";

export class SheepFSM extends FiniteStateMachine<SheepState> {
  public gameObject: Sheep;

  constructor(gameObject: Sheep) {
    super();
    this.gameObject = gameObject;
    this.init();
  }

  init(): void {
    const idle = new IdleState(this);

    this.addState(SheepState.IDLE, idle).addState(
      SheepState.MOVE,
      new MoveState(this)
    );

    this.currentState = idle;
    this.currentState.enter();
  }
}
