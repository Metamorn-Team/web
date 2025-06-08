import { Renderer } from "@/game/components/renderer";
import { PlayerFSM } from "@/game/fsm/machine/player/player-fsm";
import { PlayerState } from "@/game/fsm/states/enum/player/player-state";
import { State } from "@/game/fsm/states/interface/state";
import { Keys } from "@/types/game/enum/key";

export class JumpState implements State<PlayerState> {
  protected parent: PlayerFSM;
  private isJump = false;

  constructor(parent: PlayerFSM) {
    this.parent = parent;
  }

  enter() {
    this.isJump = true;
  }

  update(delta: number, input: Keys[]) {
    let velocityX = 0;
    let velocityY = 0;

    if (input.includes(Keys.UP) || input.includes(Keys.W)) {
      velocityY = -1;
    }
    if (input.includes(Keys.DOWN) || input.includes(Keys.S)) {
      velocityY = 1;
    }
    if (input.includes(Keys.LEFT) || input.includes(Keys.A)) {
      velocityX = -1;
    }
    if (input.includes(Keys.RIGHT) || input.includes(Keys.D)) {
      velocityX = 1;
    }

    if (velocityX !== 0 && velocityY !== 0) {
      const length = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
      velocityX /= length;
      velocityY /= length;
    }

    const speed = this.parent.gameObject.speed;
    const dt = delta / 1000;

    this.parent.gameObject.x =
      this.parent.gameObject.x + velocityX * speed * dt;
    this.parent.gameObject.y =
      this.parent.gameObject.y + velocityY * speed * dt;

    const side = velocityX > 0 ? "right" : velocityX < 0 ? "left" : "none";

    const renderer = this.parent.gameObject.getComponent(Renderer);
    if (side === "right") {
      renderer?.setFlipX(false);
    }

    if (side === "left") {
      renderer?.setFlipX(true);
    }

    if (this.isJump) {
      this.parent.gameObject.onJump(side);
      renderer?.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        if (velocityX !== 0 || velocityY !== 0) {
          this.parent.setState(PlayerState.WALK);
          return;
        }

        if (velocityX === 0 || velocityY === 0) {
          this.parent.setState(PlayerState.IDLE);
        }
      });
      this.isJump = false;
    }
  }

  exit() {
    this.isJump = false;
  }

  get name() {
    return PlayerState.JUMP;
  }
}
