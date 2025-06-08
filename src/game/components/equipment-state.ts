import { Component } from "@/game/components/interface/component";

export class EquipmentState implements Component {
  constructor(private _aura: { key: string; name: string } | null) {}

  get aura() {
    return this._aura;
  }

  set aura(aura: { key: string; name: string } | null) {
    this._aura = aura;
  }

  update(): void {}

  destroy(): void {}
}
