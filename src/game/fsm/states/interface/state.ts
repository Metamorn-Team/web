import { FiniteStateMachine } from "@/game/fsm/machine/interface/finite-state-machine";
import { Keys } from "@/types/game/enum/key";

export abstract class State<E> {
  protected abstract parent: FiniteStateMachine<E>;

  abstract get name(): E;

  abstract enter(currentState?: State<E>): void;
  abstract update(input?: Keys[]): void;
  abstract exit(): void;
}
