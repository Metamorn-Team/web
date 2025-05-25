import { PlayerFSM } from "@/game/fsm/machine/player/player-fsm";
import { PlayerState } from "@/game/fsm/states/enum/player/player-state";
import { State } from "@/game/fsm/states/interface/state";
import { Keys } from "@/types/game/enum/key";

export class WalkState implements State<PlayerState> {
  protected parent: PlayerFSM;

  constructor(parent: PlayerFSM) {
    this.parent = parent;
  }

  enter() {}

  update(delta: number, input: Keys[]) {
    if (input.includes(Keys.Z)) {
      this.parent.setState(PlayerState.ATTACK);
      this.parent.gameObject.setVelocity(0, 0);
      return;
    }

    if (input.includes(Keys.X)) {
      this.parent.setState(PlayerState.STRONG_ATTACK);
      this.parent.gameObject.setVelocity(0, 0);
      return;
    }

    if (input.includes(Keys.SPACE)) {
      this.parent.setState(PlayerState.JUMP);
      return;
    }

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

    if (velocityX === 0 && velocityY === 0) {
      this.parent.setState(PlayerState.IDLE);
      return;
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

    this.parent.gameObject.walk(
      velocityX > 0 ? "right" : velocityX < 0 ? "left" : "none"
    );
  }

  exit() {}

  get name() {
    return PlayerState.WALK;
  }
}
