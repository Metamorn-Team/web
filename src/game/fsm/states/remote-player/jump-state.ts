import { Renderer } from "@/game/components/renderer";
import { RemotePlayerFSM } from "@/game/fsm/machine/player/remote-player-fsm";
import { PlayerState } from "@/game/fsm/states/enum/player/player-state";
import { State } from "@/game/fsm/states/interface/state";
import { Phaser } from "@/game/phaser";

export class JumpState implements State<PlayerState> {
  protected parent: RemotePlayerFSM;
  private isJump = false;

  constructor(parent: RemotePlayerFSM) {
    this.parent = parent;
  }

  get name(): PlayerState {
    return PlayerState.WALK;
  }

  enter(): void {
    this.isJump = true;
  }

  update(): void {
    const x = this.parent.gameObject.x;
    const y = this.parent.gameObject.y;
    const targetPosition = this.parent.gameObject.targetPosition;

    const dx = x - targetPosition.x;

    this.parent.gameObject.x = Phaser.Math.Linear(x, targetPosition.x, 0.1);
    this.parent.gameObject.y = Phaser.Math.Linear(y, targetPosition.y, 0.1);

    const side = dx > 0 ? "left" : dx < 0 ? "right" : "none";

    const renderer = this.parent.gameObject.getComponent(Renderer);

    if (side === "right") {
      renderer?.setFlipX(false);
    }
    if (side === "left") {
      renderer?.setFlipX(true);
    }

    if (this.isJump) {
      this.parent.gameObject.jump(side);
      renderer?.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.parent.setState(PlayerState.IDLE);
      });
      this.isJump = false;
    }
  }

  exit(): void {
    this.isJump = false;
  }
}
