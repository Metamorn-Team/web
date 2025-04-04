import { COLLISION_CATEGORIES } from "@/constants/collision-categories";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket-io";
import { UserInfo } from "@/types/socket-io/response";
import * as Phaser from "phaser";
import type { Socket } from "socket.io-client";

export abstract class Player extends Phaser.Physics.Matter.Sprite {
  private userInfo: UserInfo;

  private isControllable: boolean;
  protected isAttack = false;

  private playerNameText: Phaser.GameObjects.Text;
  private cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
  protected speed = 1;
  protected effect: Phaser.FX.Controller | undefined;

  public targetPosition: { x: number; y: number } = { x: 0, y: 0 };

  protected currentMove = 0;
  io?: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    userInfo: UserInfo,
    isControllable = false,
    io?: Socket
  ) {
    super(scene.matter.world, x, y, texture);

    scene.add.existing(this);

    this.isControllable = isControllable;
    this.io = io;
    this.targetPosition.x = x;
    this.targetPosition.y = y;
    this.userInfo = userInfo;
    this.setNickname(scene);
    this.cursor = scene.input.keyboard?.createCursorKeys();

    this.setInteractive();
    this.on("pointerover", () => {
      this.effect = this.preFX?.addGlow();
      console.log(this.userInfo);
    });

    this.on("pointerout", () => {
      if (this.effect) {
        this.preFX?.remove(this.effect);
        this.effect = undefined;
      }
    });

    this.setBodyConfig();
    this.playerCommonBodyConfig();
  }

  private playerCommonBodyConfig() {
    this.setCollisionCategory(COLLISION_CATEGORIES.PLAYER);
    this.setCollidesWith(COLLISION_CATEGORIES.WORLD);

    this.setFixedRotation();
  }

  protected abstract setBodyConfig(): void;

  update(): void {
    if (this.isControllable) {
      this.move();
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

    this.setNicknamePosition(this.x, this.y);
    this.setDepth(this.y);
  }

  move() {
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
      velocityX = this.walk("left");
    }
    if (this.cursor?.right.isDown) {
      velocityX = this.walk("right");
    }
    if (this.cursor?.up.isDown) {
      velocityY = this.walk("up");
    }
    if (this.cursor?.down.isDown) {
      velocityY = this.walk("down");
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

  setNicknamePosition(x: number, y: number) {
    this.playerNameText.setPosition(x, y - 45);
  }

  private setNickname(scene: Phaser.Scene) {
    this.playerNameText = scene.add
      .text(this.x, this.y - 45, this.userInfo.nickname, {
        fontFamily: "CookieRun",
        fontSize: "16px",
        resolution: 2,
        color: "#FFFFFF",
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setScale(1)
      .setDepth(999999);
    this.playerNameText.setOrigin(0.5, 0.5);
  }

  destroy(fromScene?: boolean): void {
    if (this.playerNameText) {
      this.playerNameText.destroy();
    }
    super.destroy(fromScene);
  }
}
