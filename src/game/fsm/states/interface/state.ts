import { Keys } from "@/types/game/enum/key";

export interface State<E> {
  get name(): E;

  enter(currentState?: State<E>): void;
  update(input?: Keys[]): void;
  exit(): void;
}
