import { EventWrapper } from "@/game/event/EventBus";
import { CollisionBody } from "@/types/game/matter";

export class Mine extends Phaser.Physics.Matter.Sprite {
  private interactionSensor: MatterJS.BodyType; // free 대상
  private interactionIndicator: Phaser.GameObjects.Text; // free 대상
  private isPlayerInRange = false;
  private interactKey: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, "mine");
    scene.add.existing(this);
    this.setRectangle(150, 80);
    this.setStatic(true);

    this.interactionSensor = scene.matter.add.rectangle(x, y + 30, 40, 50, {
      isSensor: true,
      label: "PORTAL_INTERACTION",
    });

    this.createInteractionUI();
    this.setupInput();
    this.setupSensorCollision();
  }

  private createInteractionUI() {
    this.interactionIndicator = this.scene.add
      .text(this.x, this.y - 35, "[E] 입장하기", {
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
    this.isPlayerInRange = true;
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
    this.isPlayerInRange = false;
    this.scene.tweens.add({
      targets: this.interactionIndicator,
      scale: 0.5,
      alpha: 0,
      duration: 200,
      onComplete: () => this.interactionIndicator.setVisible(false),
    });
  }

  private setupSensorCollision() {
    const scene = this.scene;

    scene.matter.world.on(
      "collisionstart",
      (_: unknown, bodyA: CollisionBody, bodyB: CollisionBody) => {
        console.log(this.isInteractionPair(bodyA.label, bodyB.label));
        if (this.isInteractionPair(bodyA.label, bodyB.label)) {
          this.showInteractionPrompt();
        }
      }
    );

    scene.matter.world.on(
      "collisionend",
      (_: unknown, bodyA: CollisionBody, bodyB: CollisionBody) => {
        if (this.isInteractionPair(bodyA.label, bodyB.label)) {
          this.hideInteractionPrompt();
        }
      }
    );
  }

  private isInteractionPair(labelA: string, labelB: string): boolean {
    return (
      (labelA === "MY_PLAYER" && labelB === "PORTAL_INTERACTION") ||
      (labelA === "PORTAL_INTERACTION" && labelB === "MY_PLAYER")
    );
  }

  private setupInput() {
    if (this.scene.input.keyboard) {
      this.interactKey = this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.E
      );
    }

    this.scene.events.on("update", this.handleKeyInput, this);
  }

  private handleKeyInput() {
    if (
      this.isPlayerInRange &&
      Phaser.Input.Keyboard.JustDown(this.interactKey)
    ) {
      this.startInteraction();
    }
  }

  protected startInteraction() {
    EventWrapper.emitToUi("request-join-island");
  }

  destroy(fromScene?: boolean): void {
    this.interactionIndicator.destroy();
    super.destroy(fromScene);
  }
}
