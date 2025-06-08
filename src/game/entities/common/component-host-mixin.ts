import { Component } from "@/game/components/interface/component";
import { ClassType } from "@/types/game/common";

export function ComponentHostMixin<TBase extends ClassType>(Base: TBase) {
  return class extends Base {
    private _components: Component[] = [];

    get components() {
      return this._components;
    }

    addComponent(component: Component): void {
      this._components.push(component);
    }

    getComponent<T extends Component>(cls: ClassType<T>): T | undefined {
      const component = this._components.find((c) => c instanceof cls) as
        | T
        | undefined;

      return component;
    }
  };
}
