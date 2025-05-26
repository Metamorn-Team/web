import { Phaser } from "@/game/phaser";

export abstract class InteractiveObject extends Phaser.Physics.Matter.Sprite {
  protected interactionIndicator: Phaser.GameObjects.Text;
  public isInteractivePromptVisible = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    protected promptText: string,
    protected promptOffsetY: number
  ) {
    super(scene.matter.world, x, y, texture);
    scene.add.existing(this);
    this.createInteractionUI();
  }

  private createInteractionUI() {
    this.interactionIndicator = this.scene.add
      .text(this.x, this.y + this.promptOffsetY, this.promptText, {
        fontFamily: "MapleStory",
        fontStyle: "bold",
        fontSize: "18px",
        resolution: this.scene.cameras.main.zoom,
        color: "#FFFFFF",
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
        stroke: "#000000",
        strokeThickness: 3,
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

  override destroy(fromScene?: boolean): void {
    this.interactionIndicator?.destroy();
    super.destroy(fromScene);
  }

  public abstract startInteraction(): void;
}
