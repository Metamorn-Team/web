import {
  DefaultEvents,
  Events,
  GameToUiEvent,
  UiToGameEvent,
} from "@/game/event/event-type";
import { Phaser } from "@/game/phaser";

let EventWrapper: EventBusWrapper<GameToUiEvent, UiToGameEvent>;

class EventBusWrapper<
  GameToUi extends Events = DefaultEvents,
  UiToGame extends Events = DefaultEvents
> {
  eventBus: Phaser.Events.EventEmitter;

  constructor() {
    this.eventBus = new Phaser.Events.EventEmitter();
  }

  emitToGame<K extends Extract<keyof UiToGame, string>>(
    name: K,
    ...args: Parameters<UiToGame[K]>
  ) {
    this.eventBus.emit(name, ...args);
  }

  emitToUi<K extends Extract<keyof GameToUi, string>>(
    name: K,
    ...args: Parameters<GameToUi[K]>
  ) {
    this.eventBus.emit(name, ...args);
  }

  onGameEvent<K extends Extract<keyof UiToGame, string>>(
    name: K,
    callback: UiToGame[K]
  ) {
    this.eventBus.on(name, callback);
  }

  onUiEvent<K extends Extract<keyof GameToUi, string>>(
    name: K,
    callback: GameToUi[K]
  ) {
    this.eventBus.on(name, callback);
  }

  offGameEvent<K extends Extract<keyof UiToGame, string>>(
    name: K,
    callback?: UiToGame[K]
  ) {
    this.eventBus.off(name, callback);
  }

  offUiEvent<K extends Extract<keyof GameToUi, string>>(
    name: K,
    callback?: GameToUi[K]
  ) {
    this.eventBus.off(name, callback);
  }

  destroy() {
    if (this.eventBus) {
      this.eventBus.removeAllListeners();
      this.eventBus.destroy();
    }
  }
}

if (typeof window !== "undefined") {
  EventWrapper = new EventBusWrapper();
}

export { EventWrapper };
