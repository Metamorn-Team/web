import * as Phaser from "phaser";
import type { Socket } from "socket.io-client";
import { COLLISION_CATEGORIES } from "@/constants/collision-categories";
import { EventBus } from "@/game/event/EventBus";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket-io";
import { UserInfo } from "@/types/socket-io/response";
import { DEAD } from "@/game/animations/keys/common";

export abstract class Player extends Phaser.Physics.Matter.Sprite {
  private playerInfo: UserInfo;
  private label = "PLAYER";
  protected speed = 0.12; // 픽셀/초 (모든 플레이어 동일)

  protected isControllable: boolean;
  protected isAttack = false;
  protected isBeingBorn = true;

  private speechBubble: Phaser.GameObjects.Container | null = null;
  private playerNameText: Phaser.GameObjects.Text;
  private cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
  protected effect: Phaser.FX.Controller | undefined;

  public targetPosition: { x: number; y: number } = { x: 0, y: 0 };

  protected currentMove = 0;
  io?: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    playerInfo: UserInfo,
    isControllable = false,
    io?: Socket
  ) {
    super(scene.matter.world, x, y, texture);

    scene.add.existing(this);

    this.isControllable = isControllable;
    this.io = io;
    this.targetPosition.x = x;
    this.targetPosition.y = y;
    this.playerInfo = playerInfo;
    this.setNickname(scene);
    this.cursor = scene.input.keyboard?.createCursorKeys();

    this.setBodyConfig();
    this.playerCommonBodyConfig();

    this.listenInteractionEvent();

    // if (this.playerInfo.id === "b3e8da90-bd3c-44a8-9d1a-5aa9dc6f336b") {
    //   this.effect = this.preFX?.addGlow(0x181818);
    // }
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
    if (this.isControllable) {
      this.move(delta);
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

  move(delta: number) {
    let velocityX = 0;
    let velocityY = 0;

    if (this.cursor?.space.isDown) {
      this.attack();
    }

    if (this.isAttack) {
      this.setVelocity(0, 0);
      return;
    }

    if (this.cursor?.left.isDown) {
      velocityX = this.walk("left") * delta;
    }
    if (this.cursor?.right.isDown) {
      velocityX = this.walk("right") * delta;
    }
    if (this.cursor?.up.isDown) {
      velocityY = this.walk("up") * delta;
    }
    if (this.cursor?.down.isDown) {
      velocityY = this.walk("down") * delta;
    }

    if (velocityX !== 0 && velocityY !== 0) {
      const factor =
        (this.speed * delta) / Math.sqrt(velocityX ** 2 + velocityY ** 2);
      velocityX *= factor;
      velocityY *= factor;
    }

    // 자신의 좌표도 서버 기반으로
    // if (velocityX === 0 && velocityY === 0) {
    //   return;
    // }

    // const x = this.x + velocityX;
    // const y = this.y + velocityY;

    // if (Date.now() - this.currentMove > 100) {
    //   if (this.io) {
    //     this.io.emit("playerMoved", {
    //       x,
    //       y,
    //     });
    //   }
    //   this.currentMove = Date.now();
    // }

    // 자신의 좌표는 클라이언트 기반으로
    this.x += velocityX;
    this.y += velocityY;

    if (velocityX === 0 && velocityY === 0) {
      this.idle();
      return;
    }

    if (!this.io) {
      return;
    }

    if (Date.now() - this.currentMove > 100) {
      if (this.io) {
        this.io.emit("playerMoved", { x: this.x, y: this.y });
      }
      this.currentMove = Date.now();
    }
  }

  abstract walk(side: "right" | "left" | "up" | "down"): number;
  abstract idle(): void;
  abstract attack(): void;

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
