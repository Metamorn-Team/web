import { LOBY_SCENE, MY_ISLAND_SCENE } from "@/constants/game/islands/island";
import { STORE } from "@/constants/game/sounds/bgm/bgms";
import { TilemapComponent } from "@/game/components/tile-map.component";
import { Pawn } from "@/game/entities/players/pawn";
import { EventWrapper } from "@/game/event/EventBus";
import { controllablePlayerManager } from "@/game/managers/controllable-player-manager";
import { SoundManager } from "@/game/managers/sound-manager";
import { MetamornScene } from "@/game/scenes/metamorn-scene";
import { changeScene } from "@/game/utils/change-scene";

export class MyIslandScene extends MetamornScene {
  private mapComponent: TilemapComponent;

  constructor() {
    super(MY_ISLAND_SCENE);
  }

  create(): void {
    super.create();

    this.mapComponent = new TilemapComponent(this, "tiny-island");

    this.spwanMyPlayer();
    this.listenLocalEvent();
    this.onMapResize(this.mapComponent.mapWidth, this.mapComponent.mapHeight);
    SoundManager.init(this).playBgm(STORE);

    this.ready();
  }

  update(time: number, delta: number): void {
    if (!this.player?.body) return;
    this.player.update(delta);
  }

  async spwanMyPlayer() {
    const userInfo = await this.getPlayerInfo();

    this.player = await controllablePlayerManager.spawnControllablePlayer(
      this,
      userInfo,
      this.mapComponent.centerOfMap.x,
      this.mapComponent.centerOfMap.y,
      this.inputManager
    );
  }

  listenLocalEvent() {
    EventWrapper.onGameEvent("changeAvatarColor", (color) => {
      if (this.player instanceof Pawn) {
        this.player.setColor(color);
      }
    });

    EventWrapper.onGameEvent("changeToLoby", () => {
      changeScene(this, LOBY_SCENE, this.clearBeforeLeft);
    });
  }

  clearBeforeLeft() {
    EventWrapper.offGameEvent("changeAvatarColor");
    EventWrapper.offGameEvent("changeToLoby");
  }
}
