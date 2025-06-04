import { LOBY_SCENE, MY_ISLAND_SCENE } from "@/constants/game/islands/island";
import { STORE } from "@/constants/game/sounds/bgm/bgms";
import { EquipmentState } from "@/game/components/equipment-state";
import { TilemapComponent } from "@/game/components/tile-map.component";
import { Pawn } from "@/game/entities/players/pawn";
import { Sheep } from "@/game/entities/sheep";
import { EventWrapper } from "@/game/event/EventBus";
import { controllablePlayerManager } from "@/game/managers/controllable-player-manager";
import { SoundManager } from "@/game/managers/sound-manager";
import { MetamornScene } from "@/game/scenes/metamorn-scene";
import { changeScene } from "@/game/utils/change-scene";

export class MyIslandScene extends MetamornScene {
  private mapComponent: TilemapComponent;
  private sheeps: Sheep[] = [];

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

    this.spawnSheeps();

    this.ready();
  }

  update(time: number, delta: number): void {
    if (!this.player?.body) return;
    this.player.update(delta);

    if (this.sheeps.length) {
      this.sheeps.forEach((sheep) => {
        if (sheep.body) {
          sheep.update(delta);
        }
      });
    }
  }

  async spawnSheeps() {
    const centerX = this.mapComponent.centerOfMap.x;
    const centerY = this.mapComponent.centerOfMap.y;

    for (let i = 0; i < 3; i++) {
      const offsetX = Phaser.Math.Between(-100, 100);
      const offsetY = Phaser.Math.Between(-100, 100);
      const sheep = new Sheep(this, centerX + offsetX, centerY + offsetY);
      this.sheeps.push(sheep);
    }
  }

  async spwanMyPlayer() {
    const { equipmentState: equipmentStateProto, ...userInfo } =
      await this.getPlayerInfo();
    const equipmentState = new EquipmentState(equipmentStateProto.AURA);
    this.player = await controllablePlayerManager.spawnControllablePlayer(
      this,
      userInfo,
      {
        x: this.mapComponent.centerOfMap.x,
        y: this.mapComponent.centerOfMap.y,
      },
      this.inputManager,
      equipmentState
    );
  }

  listenLocalEvent() {
    EventWrapper.onGameEvent("changeAvatarColor", (color) => {
      if (this.player instanceof Pawn) {
        this.player.setColor(color);
      }
    });

    EventWrapper.onGameEvent("changeNickname", (nickname) => {
      this.player.setNicknameText(nickname);
    });

    EventWrapper.onGameEvent("changeToLoby", () => {
      changeScene(this, LOBY_SCENE, this.clearBeforeLeft);
    });

    EventWrapper.onGameEvent("changeAura", (key) => {
      this.player.setAura(key);
    });
  }

  clearBeforeLeft() {
    EventWrapper.offGameEvent("changeAvatarColor");
    EventWrapper.offGameEvent("changeToLoby");
    SoundManager.getInstance().stopAll();
  }
}
