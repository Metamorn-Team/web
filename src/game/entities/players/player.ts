import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket-io";
import * as Phaser from "phaser";
import type { Socket } from "socket.io-client";

export abstract class Player extends Phaser.Physics.Matter.Sprite {
  private playerNameText: Phaser.GameObjects.Text;
  private cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
  protected speed = 1;
  protected isAttack: boolean = false;
  private nickname: string;

  public targetPosition: { x: number; y: number } = { x: 0, y: 0 };

  protected currentMove = 0;
  io?: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    nickname: string,
    io?: Socket
  ) {
    super(scene.matter.world, x, y, texture);

    scene.add.existing(this);

    this.io = io;
    this.targetPosition.x = x;
    this.targetPosition.y = y;
    this.nickname = nickname;
    this.setNickname(scene);

    this.setCollisionCategory(0x0001);
    this.setCollidesWith(0);

    // if (io) {
    //   this.io = io;
    //   this.io.emit("playerJoin");
    // }

    this.cursor = scene.input.keyboard?.createCursorKeys();
  }

  update(): void {
    if (this.io) {
      this.move();
    }
    this.setNicknamePosition(this.x, this.y);
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

    // if (Date.now() - this.currentMove > 100) {
    //   if (this.io) {
    //     this.io.emit("playerMoved", {
    //       x: this.x + velocityX,
    //       y: this.y + velocityY,
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
    this.playerNameText = scene.add.text(this.x, this.y - 45, this.nickname, {
      fontSize: "14px",
      color: "#000000",
      strokeThickness: 3,
    });
    this.playerNameText.setOrigin(0.5, 0.5);
  }

  destroy(fromScene?: boolean): void {
    if (this.playerNameText) {
      this.playerNameText.destroy();
    }
    super.destroy(fromScene);
  }
}
