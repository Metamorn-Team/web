export class SoundManager {
  private static instance: SoundManager;
  private currentScene: Phaser.Scene;
  private sound: Phaser.Sound.BaseSoundManager;
  private bgm: Phaser.Sound.BaseSound | null = null;

  private constructor(scene: Phaser.Scene) {
    this.currentScene = scene;
    this.sound = scene.sound;
  }

  public static init(scene: Phaser.Scene) {
    // 씬이 다르면 새로 초기화
    if (!this.instance || this.instance.currentScene !== scene) {
      this.instance = new SoundManager(scene);
    }
    return this.instance;
  }

  public static getInstance(): SoundManager {
    if (!this.instance) {
      throw new Error("SoundManager not initialized");
    }
    return this.instance;
  }

  public playBgm(key: string, volume = 0.15, loop = true) {
    if (this.bgm?.isPlaying) {
      this.bgm.stop();
    }
    this.bgm = this.sound.add(key, { loop, volume });
    this.bgm.play();
  }

  public pauseBgm() {
    if (this.bgm?.isPlaying) {
      this.bgm.pause();
    }
  }

  public resumeBgm() {
    if (this.bgm?.isPaused) {
      this.bgm.resume();
    }
  }

  public stopBgm() {
    this.bgm?.pause();
    // this.bgm = null;
  }

  public playSfx(key: string, volume = 1) {
    this.sound.play(key, { volume });
  }

  public stopAll() {
    this.sound.stopAll();
  }
}
