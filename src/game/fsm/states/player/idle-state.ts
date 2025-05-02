import { PlayerFSM } from "@/game/fsm/machine/player/player-fsm";
import { PlayerState } from "@/game/fsm/states/enum/player/player-state";
import { State } from "@/game/fsm/states/interface/state";
import { Keys } from "@/types/game/enum/key";

export class IdleState implements State<PlayerState> {
  protected parent: PlayerFSM;
  private spaceKeyJustPressed = false;

  constructor(parent: PlayerFSM) {
    this.parent = parent;
  }

  enter() {
    this.parent.gameObject.idle();
    this.spaceKeyJustPressed = false;
  }

  update(input: Keys[]) {
    if (input.includes(Keys.SPACE) && !this.spaceKeyJustPressed) {
      this.spaceKeyJustPressed = true;
      this.parent.setState(PlayerState.ATTACK);
      return;
    }

    if (
      input.includes(Keys.UP) ||
      input.includes(Keys.W) ||
      input.includes(Keys.DOWN) ||
      input.includes(Keys.S) ||
      input.includes(Keys.LEFT) ||
      input.includes(Keys.A) ||
      input.includes(Keys.RIGHT) ||
      input.includes(Keys.D)
    ) {
      this.parent.setState(PlayerState.WALK);
    }
  }

  exit() {}

  get name() {
    return PlayerState.IDLE;
  }
}
