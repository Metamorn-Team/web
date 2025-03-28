import { Phaser } from "@/game/phaser";

let EventBus: Phaser.Events.EventEmitter;

if (typeof window !== "undefined") {
  EventBus = new Phaser.Events.EventEmitter();
}

export { EventBus };
