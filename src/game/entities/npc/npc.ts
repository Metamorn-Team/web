import { Phaser } from "@/game/phaser";

export abstract class Npc extends Phaser.Physics.Matter.Sprite {
  private interactionIndicator: Phaser.GameObjects.Text;
  public isInteractivePromptVisible = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene.matter.world, x, y, texture);

    scene.add.existing(this);
    this.setBodyConfig();
    this.setDepth(this.y);
    this.setStatic(true);
    this.createInteractionUI();
  }

  private createInteractionUI() {
    this.interactionIndicator = this.scene.add
      .text(this.x, this.y + 40, "[E] 대화하기", {
        fontFamily: "CookieRun",
        fontSize: "18px",
        resolution: 2,
        color: "#FFFFFF",
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5, 0)
      .setVisible(false);
  }

  showInteractionPrompt() {
    if (this.isInteractivePromptVisible) return;

    this.isInteractivePromptVisible = true;
    this.interactionIndicator.setVisible(true);

    this.scene.tweens.add({
      targets: [this.interactionIndicator],
      scale: { from: 0.5, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 200,
      ease: "Back.out",
    });
  }

  hideInteractionPrompt() {
    if (!this.isInteractivePromptVisible) return;

    this.isInteractivePromptVisible = false;
    this.scene.tweens.add({
      targets: this.interactionIndicator,
      scale: 0.5,
      alpha: 0,
      duration: 200,
      onComplete: () => this.interactionIndicator.setVisible(false),
    });
  }

  public abstract startInteraction(): void;

  protected abstract setBodyConfig(): void;
}
