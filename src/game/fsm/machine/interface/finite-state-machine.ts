import { BaseEntity } from "@/game/entities/common/base-entity";
import { State } from "@/game/fsm/states/interface/state";
// import { Phaser } from "@/game/phaser";
import { Keys } from "@/types/game/enum/key";

/**
 * @E 각 상태의 키 값 (name)으로 사용할 타입
 */
export abstract class FiniteStateMachine<E = unknown> {
  // public abstract gameObject: Phaser.Physics.Matter.Sprite;
  public abstract gameObject: BaseEntity;

  private states = new Map<E, State<E>>();
  protected currentState: State<E> | null = null;

  abstract init(): void;

  addState(name: E, state: State<E>) {
    this.states.set(name, state);
    return this;
  }

  setState(name: E) {
    if (this.currentState) {
      if (this.currentState.name === name) {
        return;
      }
      this.currentState.exit();
    }

    const state = this.states.get(name);
    if (!state) return;

    this.currentState = state;
    state.enter(this.currentState);
  }

  update(delta: number, input?: Keys[]) {
    if (this.currentState) {
      this.currentState.update(delta, input);
    }
  }
}
