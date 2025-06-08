/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ClassType<T = any> {
  new (...args: any[]): T;
}
