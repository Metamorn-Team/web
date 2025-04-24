import { EventWrapper } from "@/game/event/EventBus";
import { controllablePlayerManager } from "@/game/managers/controllable-player-manager";
import { SoundManager } from "@/game/managers/sound-manager";
import { Phaser } from "@/game/phaser";
import { MetamornScene } from "@/game/scenes/metamorn-scene";

export default class PhotoScene extends MetamornScene {
  private auraImage?: Phaser.GameObjects.Image;
  private captureBox?: Phaser.GameObjects.Rectangle;
  private boxSize = 64;

  constructor() {
    super("PhotoScene");
  }

  async create() {
    this.cameras.main.setBackgroundColor(0xffffff);

    // 클릭 시 해당 영역 캡처
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      const { x, y } = pointer;
      this.captureArea(x, y);
    });

    this.matter.world.setBounds(0, 0, 200, 200);
    this.cameras.main.setBounds(0, 0, 200, 200);
    this.cameras.main.setZoom(1.3);

    this.player = await controllablePlayerManager.spawnControllablePlayer(
      this,
      {
        avatarKey: "red_pawn",
        id: "1",
        nickname: "",
        tag: "",
      },
      100,
      100,
      this.inputManager
    );

    SoundManager.init(this);

    EventWrapper.emitToUi("current-scene-ready", { scene: this });

    this.player.off("pointerdown");
    this.showAura();
  }

  showAura() {
    // const auraColors: Record<string, number> = {
    //   "gold-yellow": 0xfabb43,
    //   "magic-purple": 0xb46dff,
    //   "ice-blue": 0x5fe7f2,
    //   "toxic-green": 0x96f55a,
    //   "rose-pink": 0xff87b3,
    //   "shadow-black": 0x2d2d2d,
    //   lavender: 0xe6e6fa,
    //   mint: 0x40e0d0,
    // };

    // this.player.preFX?.addGlow(auraColors["mint"]);
    // this.player.preFX?.addGlow(0xfabb43);
    // this.player.preFX?.addGlow(0x40e0d0);
    this.player.preFX?.addGlow(0xff6f61);
  }

  captureArea(x: number, y: number) {
    // 캡처 중심 좌표 기준 좌표 보정
    const startX = Math.floor(x - this.boxSize / 2);
    const startY = Math.floor(y - this.boxSize / 2);

    this.game.renderer.snapshotArea(
      startX,
      startY,
      this.boxSize,
      this.boxSize,
      (image) => {
        const link = document.createElement("a");
        link.href = image.src;
        link.download = "aura_capture.png";
        link.click();
      }
    );
  }
}
