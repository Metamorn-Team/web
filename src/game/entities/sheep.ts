import { SHEEP } from "@/game/animations/keys/creatures/sheep/sheep";
import { SheepFSM } from "@/game/fsm/creatures/sheep/sheep-fsm";

export class Sheep extends Phaser.Physics.Matter.Sprite {
  public speed = 75;
  private fsm: SheepFSM;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, "sheep");
    scene.add.existing(this);
    this.setCircle(10);
    this.setFixedRotation();

    this.fsm = new SheepFSM(this);

    this.play(SHEEP.IDLE);
  }

  update(delta: number): void {
    this.setDepth(this.y);
    this.fsm.update(delta);
  }

  onIdle() {
    this.play(SHEEP.IDLE, true);
  }

  onMove() {
    this.play(SHEEP.JUMP, true);
  }

  onJump() {
    this.play(SHEEP.JUMP, true);
  }
}
