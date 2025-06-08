import { SheepFSM } from "@/game/fsm/creatures/sheep/sheep-fsm";
import { SheepState } from "@/game/fsm/states/enum/creatures/sheep/sheep-state";
import { State } from "@/game/fsm/states/interface/state";

export class MoveState implements State<SheepState> {
  protected parent: SheepFSM;
  private timer = 0;
  private moveDuration = 0;
  private direction: Phaser.Math.Vector2;
  private speed = 75;

  constructor(parent: SheepFSM) {
    this.parent = parent;
  }

  get name(): SheepState {
    return SheepState.MOVE;
  }

  enter(): void {
    this.speed = this.parent.gameObject.speed;
    this.timer = 0;
    this.moveDuration = Phaser.Math.Between(1000, 3000);
    // 방향: 대각선 포함, 정규화된 벡터
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    this.direction = new Phaser.Math.Vector2(
      Math.cos(angle),
      Math.sin(angle)
    ).normalize();

    this.parent.gameObject.flipX(this.direction.x < 0);
    this.parent.gameObject.onMove();
  }

  update(delta: number): void {
    this.timer += delta;

    if (this.timer >= this.moveDuration) {
      this.parent.setState(SheepState.IDLE);
      return;
    }

    const dt = delta / 1000;
    this.parent.gameObject.x += this.direction.x * this.speed * dt;
    this.parent.gameObject.y += this.direction.y * this.speed * dt;
  }

  exit(): void {}
}
