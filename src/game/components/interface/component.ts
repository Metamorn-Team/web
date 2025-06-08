export interface Component {
  init?(...args: unknown[]): void;
  update(delta?: number): void;
  destroy(fromScene?: boolean): void;
}
