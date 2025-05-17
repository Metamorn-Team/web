import { InteractiveObject } from "@/game/entities/interactive-object";
import { EventWrapper } from "@/game/event/EventBus";
import { CollisionBody } from "@/types/game/matter";

export class Mine extends InteractiveObject {
  private interactionSensor: MatterJS.BodyType;
  private isPlayerInRange = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "mine", "[E] 입장하기", -35);

    this.setRectangle(150, 80);
    this.setStatic(true);

    this.interactionSensor = scene.matter.add.rectangle(x, y + 30, 40, 50, {
      isSensor: true,
      label: "PORTAL_INTERACTION",
    });

    this.setupSensorCollision();
  }

  private setupSensorCollision() {
    this.scene.matter.world.on(
      "collisionstart",
      (_: unknown, bodyA: CollisionBody, bodyB: CollisionBody) => {
        if (this.isInteractionPair(bodyA.label, bodyB.label)) {
          this.isPlayerInRange = true;
          this.showInteractionPrompt();
        }
      }
    );

    this.scene.matter.world.on(
      "collisionend",
      (_: unknown, bodyA: CollisionBody, bodyB: CollisionBody) => {
        if (this.isInteractionPair(bodyA.label, bodyB.label)) {
          this.isPlayerInRange = false;
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

  public startInteraction(): void {
    if (this.isPlayerInRange) {
      EventWrapper.emitToUi("requestJoinIsland");
    }
  }
}
