import { LOBY_SCENE, MY_ISLAND_SCENE } from "@/constants/game/islands/island";
import { STORE } from "@/constants/game/sounds/bgm/bgms";
import { TilemapComponent } from "@/game/components/tile-map.component";
import { Pawn } from "@/game/entities/players/pawn";
import { Sheep } from "@/game/entities/sheep";
import { EventWrapper } from "@/game/event/EventBus";
import { SoundManager } from "@/game/managers/sound-manager";
import { playerSpawner } from "@/game/managers/spawners/player-spawner";
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

  update(_: number, delta: number): void {
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

    for (let i = 0; i < 1; i++) {
      const offsetX = Phaser.Math.Between(-100, 100);
      const offsetY = Phaser.Math.Between(-100, 100);
      const sheep = new Sheep(this, centerX + offsetX, centerY + offsetY);
      this.sheeps.push(sheep);
    }
  }

  async spwanMyPlayer() {
    const { equipmentState: equipment, ...playerInfo } =
      await this.getPlayerInfo();

    this.player = playerSpawner.spawnPlayer({
      equipment,
      playerInfo,
      position: {
        x: this.mapComponent.centerOfMap.x,
        y: this.mapComponent.centerOfMap.y,
      },
      scene: this,
      texture: playerInfo.avatarKey,
      inputManager: this.inputManager,
    });
    this.followPlayerCamera();
  }

  listenLocalEvent() {
    EventWrapper.onGameEvent("changeAvatarColor", (color) => {
      if (this.player instanceof Pawn) {
        console.log("난 폰이야");
        this.player.setColor(color);
      }
    });

    EventWrapper.onGameEvent("changeNickname", (nickname) => {
      this.player.setNameLabel(nickname);
    });

    EventWrapper.onGameEvent("changeToLoby", () => {
      changeScene(this, LOBY_SCENE, this.clearBeforeLeft);
    });

    EventWrapper.onGameEvent("changeAura", (key) => {
      this.player.setAura(key);
    });

    EventWrapper.onGameEvent("changeSpeechBubble", (key) => {
      this.player.setSpeechBubble(key);
      this.player.speech("장착 완료!");
    });
  }

  clearBeforeLeft() {
    EventWrapper.offGameEvent("changeAvatarColor");
    EventWrapper.offGameEvent("changeToLoby");
    SoundManager.getInstance().stopAll();
  }
}
