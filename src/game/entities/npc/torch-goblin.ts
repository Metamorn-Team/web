import { TORCH_GOBLIN, TorchGoblinColor } from "@/constants/entities";
import { TORCH_GOBLIN_IDLE } from "@/game/animations/keys/torch-goblin";
import { Npc } from "@/game/entities/npc/npc";
import { EventBus } from "@/game/event/EventBus";

export class TorchGoblin extends Npc {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    color: TorchGoblinColor
  ) {
    super(scene, x, y, TORCH_GOBLIN(color));

    scene.add.existing(this);
    this.play(TORCH_GOBLIN_IDLE(color), true);
  }

  protected setBodyConfig(): void {
    this.setRectangle(55, 75);
  }

  protected startInteraction(): void {
    EventBus.emit("npc-interaction-started", { npc: this, type: "guide" });
  }
}
