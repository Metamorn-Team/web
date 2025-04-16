import * as Phaser from "phaser";
import type { Socket } from "socket.io-client";
import { COLLISION_CATEGORIES } from "@/constants/game/collision-categories";
import { EventWrapper } from "@/game/event/EventBus";
import { UserInfo } from "@/types/socket-io/response";
import { DEAD } from "@/game/animations/keys/common";
import { TypedSocket } from "@/types/socket-io";
import { AttackType } from "@/types/game/enum/state";
import { PlayerAnimationState } from "@/types/game/enum/animation";
import { InputManager } from "@/game/managers/input-manager";
import { Keys } from "@/types/game/enum/key";

enum MoveDirection {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export abstract class Player extends Phaser.Physics.Matter.Sprite {
  private inputManager?: InputManager;

  private playerInfo: UserInfo;
  private label = "PLAYER";
  protected speed = 0.12;

  protected currAnimationState: PlayerAnimationState =
    PlayerAnimationState.IDLE;
  protected isControllable: boolean;
  protected isAttack = false;
  protected isBeingBorn = true;

  private speechBubble: Phaser.GameObjects.Container | null = null;
  private playerNameText: Phaser.GameObjects.Text;
  protected effect: Phaser.FX.Controller | undefined;

  public targetPosition: { x: number; y: number } = { x: 0, y: 0 };

  protected currentMove = 0;

  private lastSentPosition = { x: 0, y: 0 };
  private readonly POSITION_CHANGE_THRESHOLD = 3;
  io?: TypedSocket;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    playerInfo: UserInfo,
    isControllable = false,
    inputManager?: InputManager,
    io?: Socket
  ) {
    super(scene.matter.world, x, y, texture);

    scene.add.existing(this);

    this.isControllable = isControllable;
    this.inputManager = inputManager;
    this.io = io;
    this.targetPosition.x = x;
    this.targetPosition.y = y;
    this.playerInfo = playerInfo;
    this.setNickname(scene);

    this.setBodyConfig();
    this.playerCommonBodyConfig();

    this.listenInteractionEvent();

    // 나
    if (this.playerInfo.id === "d1bb044d-e7a0-4159-93cf-754f490e7525") {
      this.effect = this.preFX?.addGlow(0x48aba9);
    }

    if (this.playerInfo.id === "b3e8da90-bd3c-44a8-9d1a-5aa9dc6f336b") {
      this.effect = this.preFX?.addGlow(0xfabb43);
    }
  }

  getCurrneAnimationState() {
    return this.currAnimationState;
  }

  getIsBeingBorn() {
    return this.isBeingBorn;
  }

  getPlayerInfo() {
    return this.playerInfo;
  }

  private playerCommonBodyConfig() {
    this.setCollisionCategory(COLLISION_CATEGORIES.PLAYER);
    this.setCollidesWith(COLLISION_CATEGORIES.WORLD);

    this.setFixedRotation();

    if (this.body) {
      (this.body as typeof this.body & { label: string }).label = this
        .isControllable
        ? "MY_PLAYER"
        : "PLAYER";
    }
  }

  protected abstract setBodyConfig(): void;

  private hasPositionChangedSignificantly(): boolean {
    const dx = Math.abs(this.x - this.lastSentPosition.x);
    const dy = Math.abs(this.y - this.lastSentPosition.y);
    return (
      dx >= this.POSITION_CHANGE_THRESHOLD ||
      dy >= this.POSITION_CHANGE_THRESHOLD
    );
  }

  update(delta: number): void {
    if (this.currAnimationState === PlayerAnimationState.ATTACK) {
      return;
    }

    if (this.isControllable) {
      const keys = this.inputManager?.getPressedKeys() ?? [];

      if (keys.length === 0) {
        this.idle();
      }

      if (keys.includes(Keys.SPACE)) {
        this.attack();
      }

      if (keys.includes(Keys.UP) || keys.includes(Keys.W)) {
        this.move(delta, MoveDirection.UP);
      }
      if (keys.includes(Keys.DOWN) || keys.includes(Keys.S)) {
        this.move(delta, MoveDirection.DOWN);
      }
      if (keys.includes(Keys.LEFT) || keys.includes(Keys.A)) {
        this.move(delta, MoveDirection.LEFT);
      }
      if (keys.includes(Keys.RIGHT) || keys.includes(Keys.D)) {
        this.move(delta, MoveDirection.RIGHT);
      }

      if (this.io && this.hasPositionChangedSignificantly()) {
        this.io.emit("playerMoved", { x: this.x, y: this.y });
        this.lastSentPosition.x = this.x;
        this.lastSentPosition.y = this.y;
      }
    } else {
      const dx = this.x - this.targetPosition.x;
      const dy = this.y - this.targetPosition.y;

      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.targetPosition.x,
        this.targetPosition.y
      );

      if (distance > 0.5) {
        if (dx > 0) {
          this.walk("left");
        } else if (dx < 0) {
          this.walk("right");
        } else if (dy > 0) {
          this.walk("up");
        } else if (dy < 0) {
          this.walk("down");
        } else {
          this.idle();
        }

        this.x = Phaser.Math.Linear(this.x, this.targetPosition.x, 0.1);
        this.y = Phaser.Math.Linear(this.y, this.targetPosition.y, 0.1);
      } else {
        this.idle();
      }
    }

    this.setSpeechBubblePosition();
    this.setNicknamePosition();
    this.setDepth(this.y);
  }

  move(delta: number, direaction: MoveDirection) {
    if (this.currAnimationState === PlayerAnimationState.ATTACK) {
      this.setVelocity(0, 0);
      return;
    }

    let velocityX = 0;
    let velocityY = 0;

    if (direaction === MoveDirection.LEFT) {
      velocityX = this.walk("left") * delta;
    }
    if (direaction === MoveDirection.RIGHT) {
      velocityX = this.walk("right") * delta;
    }
    if (direaction === MoveDirection.UP) {
      velocityY = this.walk("up") * delta;
    }
    if (direaction === MoveDirection.DOWN) {
      velocityY = this.walk("down") * delta;
    }

    if (velocityX !== 0 && velocityY !== 0) {
      const factor =
        (this.speed * delta) / Math.sqrt(velocityX ** 2 + velocityY ** 2);
      velocityX *= factor;
      velocityY *= factor;
    }

    this.x = this.x + velocityX;
    this.y = this.y + velocityY;
  }

  abstract walk(side: "right" | "left" | "up" | "down"): number;
  abstract idle(): void;
  abstract attack(attackTtype?: AttackType): void;

  hit() {
    this.setTintFill(0xffffff);

    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });

    const originalX = this.x;

    this.scene.tweens.add({
      targets: this,
      x: {
        from: originalX - 0.8,
        to: originalX + 0.8,
      },
      duration: 50,
      yoyo: true,
      repeat: 2,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.x = originalX;
      },
    });
  }

  setNicknamePosition() {
    if (this.playerNameText) {
      this.playerNameText.setPosition(
        this.x,
        this.y - this.displayHeight / 2 + 20
      );
    }
  }

  private setNickname(scene: Phaser.Scene) {
    this.playerNameText = scene.add
      .text(this.x, this.y - this.displayHeight / 2, this.playerInfo.nickname, {
        fontFamily: "CookieRun",
        fontSize: "16px",
        padding: { bottom: 14 },
        color: this.isControllable ? "#000000" : "#FFFFFF",
        stroke: this.isControllable ? "#FFFFFF" : "#000000",
        strokeThickness: 2,
        resolution: 10,
      })
      .setScale(1)
      .setDepth(999999);
    this.playerNameText.setOrigin(0.5, 0.5);
  }

  destroy(fromScene?: boolean): void {
    this.free(fromScene);
  }

  destroyWithAnimation(fromScene?: boolean) {
    this.play(DEAD);
    this.once("animationcomplete", () => {
      this.destroy(fromScene);
    });
  }

  free(fromScene?: boolean) {
    if (this.playerNameText) {
      this.playerNameText.destroy(fromScene);
    }
    if (this.effect) {
      this.preFX?.remove(this.effect);
      this.effect.destroy();
    }
    if (this.preFX) {
      this.preFX.destroy();
    }
    super.destroy(fromScene);
  }

  listenInteractionEvent() {
    this.setInteractive();
    this.on("pointerover", () => {
      this.effect = this.preFX?.addGlow();
      console.log(this.playerInfo);
    });

    this.on("pointerout", () => {
      if (this.effect) {
        this.preFX?.remove(this.effect);
        this.effect = undefined;
      }
    });

    this.on("pointerdown", () => {
      EventWrapper.emitToUi("player-click", {
        ...this.playerInfo,
      });
    });
  }

  private setSpeechBubblePosition() {
    if (this.speechBubble && this.speechBubble.active) {
      this.speechBubble.setPosition(this.x, this.y - this.displayHeight / 2);
    }
  }

  getSpeechBubble() {
    return this.speechBubble;
  }

  setSpeechBubble(bubble: Phaser.GameObjects.Container | null) {
    this.speechBubble = bubble;
  }
}
