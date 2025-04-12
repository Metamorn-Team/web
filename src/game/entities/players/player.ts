import * as Phaser from "phaser";
import type { Socket } from "socket.io-client";
import { COLLISION_CATEGORIES } from "@/constants/collision-categories";
import { EventBus } from "@/game/event/EventBus";
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
  protected speed = 0.12; // 픽셀/초 (모든 플레이어 동일)
  private velocityX = 0;
  private velocityY = 0;

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

    if (this.playerInfo.id === "b3e8da90-bd3c-44a8-9d1a-5aa9dc6f336b") {
      this.effect = this.preFX?.addGlow(0x181818);
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

      if (keys.includes(Keys.UP)) {
        this.move(delta, MoveDirection.UP);
      }
      if (keys.includes(Keys.DOWN)) {
        this.move(delta, MoveDirection.DOWN);
      }
      if (keys.includes(Keys.LEFT)) {
        this.move(delta, MoveDirection.LEFT);
      }
      if (keys.includes(Keys.RIGHT)) {
        this.move(delta, MoveDirection.RIGHT);
      }
    } else {
      if (this.targetPosition) {
        if (
          Math.abs(this.x - this.targetPosition.x) < 1 &&
          Math.abs(this.y - this.targetPosition.y) < 1
        ) {
          this.idle();
        }
        this.x = Phaser.Math.Linear(this.x, this.targetPosition.x, 0.1);
        this.y = Phaser.Math.Linear(this.y, this.targetPosition.y, 0.1);
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

    if (direaction === MoveDirection.LEFT) {
      this.velocityX = this.walk("left") * delta;
    }
    if (direaction === MoveDirection.RIGHT) {
      this.velocityX = this.walk("right") * delta;
    }
    if (direaction === MoveDirection.UP) {
      this.velocityY = this.walk("up") * delta;
    }
    if (direaction === MoveDirection.DOWN) {
      this.velocityY = this.walk("down") * delta;
    }

    if (this.velocityX !== 0 && this.velocityY !== 0) {
      const factor =
        (this.speed * delta) /
        Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2);
      this.velocityX *= factor;
      this.velocityY *= factor;
    }

    this.x += this.velocityX;
    this.y += this.velocityY;

    if (!this.io) {
      this.velocityX = 0;
      this.velocityY = 0;
      return;
    }

    if (Date.now() - this.currentMove > 100) {
      if (this.io) {
        this.io.emit("playerMoved", { x: this.x, y: this.y });
      }
      this.currentMove = Date.now();
    }
    this.velocityX = 0;
    this.velocityY = 0;
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
        from: originalX - 1,
        to: originalX + 1,
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
        color: "#FFFFFF",
        stroke: "#000000",
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
      EventBus.emit("player-click", {
        ...this.playerInfo,
        texture: this.texture.key,
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
