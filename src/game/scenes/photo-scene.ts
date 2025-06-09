import { Renderer } from "@/game/components/renderer";
import { EventWrapper } from "@/game/event/EventBus";
import { SoundManager } from "@/game/managers/sound-manager";
import { playerSpawner } from "@/game/managers/spawners/player-spawner";
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

    this.matter.world.setBounds(0, 0, 400, 400);
    this.cameras.main.setBounds(0, 0, 400, 400);
    this.cameras.main.setZoom(1.3);

    const playerInfo = {
      avatarKey: "blue_pawn",
      id: "1",
      nickname: "",
      tag: "",
    };
    this.player = playerSpawner.spawnPlayer({
      equipment: {
        AURA: { key: "arcane-blue", name: "" },
        SPEECH_BUBBLE: null,
      },
      playerInfo,
      position: { x: 100, y: 130 },
      scene: this,
      texture: playerInfo.avatarKey,
      inputManager: this.inputManager,
    });
    this.followPlayerCamera();
    const renderer = this.player.getComponent(Renderer);
    renderer?.sprite.anims.stop();

    SoundManager.init(this);

    EventWrapper.emitToUi("current-scene-ready", { scene: this });

    this.player.off("pointerdown");
    this.showAura();
  }

  update(time: number, delta: number): void {
    if (this.player) {
      this.player.update(delta);
    }
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

    //   "sunset-orange": 0xff6f61,
    //   "neon-cyan": 0x00fff7,
    //   "deep-sky": 0x0099ff,
    //   bubblegum: 0xffc1cc,
    //   "slime-green": 0xbaff29,
    //   "glitch-pink": 0xff1aff,
    //   "celestial-blue": 0x6cb4ee,
    //   "coral-red": 0xff4040,
    //   "plasma-purple": 0xb100e8,
    //   "aqua-lime": 0x00ff99,
    //   "sunrise-gold": 0xffcf48,
    //   "electric-indigo": 0x6f00ff,
    //   "cotton-candy": 0xffb7ee,
    //   "midnight-teal": 0x005f6a,
    //   "ghost-white": 0xf8f8ff,
    // };

    // this.player.preFX?.addGlow(auraColors["mint"]);
    // this.player.preFX?.addGlow(0xfabb43);
    // this.player.preFX?.addGlow(0x40e0d0);
    // this.player.preFX?.addGlow(auraColors["bubblegum"]);

    // 약간 유령 같음
    const voidPurple = 0x6b32a8;
    this.player.preFX?.addGlow(voidPurple, 1.2);
    this.player.preFX?.addBloom(0.5);

    // rgb shift
    // const rgbColors = [0xff0040, 0x40ff00, 0x0080ff];
    // let i = 0;

    // this.time.addEvent({
    //   delay: 300, // 0.3초마다 색 전환
    //   loop: true,
    //   callback: () => {
    //     this.player.preFX?.clear(); // 이전 FX 제거
    //     this.player.preFX?.addGlow(rgbColors[i % rgbColors.length], 1.4);
    //     i++;
    //   },
    // });

    // 투명도 깜빡임 효과
    // const grey = 0x5a5a5a;
    // this.player.preFX?.addGlow(grey, 0.7);
    // this.tweens.add({
    //   targets: this.player,
    //   alpha: { from: 1, to: 0.6 },
    //   duration: 800,
    //   yoyo: true,
    //   repeat: -1,
    //   ease: "Sine.easeInOut",
    // });

    // 어둠 기사 같은 느낌
    // const necro = 0x4a0033;
    // this.player.preFX?.addGlow(necro, 1.5);

    // 커졌다 작아졌다
    // const poisonMint = 0x5fffcf;
    // this.player.preFX?.addGlow(poisonMint, 1.4);

    // this.tweens.add({
    //   targets: this.player,
    //   scale: { from: 1, to: 1.05 },
    //   duration: 1000,
    //   yoyo: true,
    //   repeat: -1,
    //   ease: "Sine.easeInOut",
    // });

    // const silver = 0xdedede;
    // this.player.preFX?.addGlow(silver, 0.9);

    // this.tweens.add({
    //   targets: this.player,
    //   alpha: { from: 1, to: 0.7 },
    //   duration: 1000,
    //   yoyo: true,
    //   repeat: -1,
    // });

    // 유령 느낌
    const phantom = 0xb68df4;
    this.player.preFX?.addGlow(phantom, 1.1);
    this.tweens.add({
      targets: this.player,
      alpha: { from: 1, to: 0.5 },
      duration: 900,
      yoyo: true,
      repeat: -1,
    });

    // 엄청 빛나는 바다 느낌
    // this.player.preFX?.addGlow(0x00b4d8);
    // this.player.preFX?.addShine(0x90e0ef, 0.6, 0.5);

    // this.player.preFX?.addGlow(0x111111);
    // this.player.preFX?.addShine(0x333333, 0.7, 0.3);

    // this.player.preFX?.addGlow(0x4b0082);
    // this.player.preFX?.addShine(0x6a0dad);

    // 불꽃 같은 느낌
    // this.player.preFX?.addGlow(0xff6f00);
    // this.player.preFX?.addShine(0xffca3a, 0.5, 0.3);
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
        link.href = (image as { src: string }).src;
        link.download = "aura_capture.png";
        link.click();
      }
    );
  }
}
