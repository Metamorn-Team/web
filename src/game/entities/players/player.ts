import * as Phaser from "phaser";
import type { Socket } from "socket.io-client";
import { COLLISION_CATEGORIES } from "@/constants/game/collision-categories";
import { EventWrapper } from "@/game/event/EventBus";
import { UserInfo } from "@/types/socket-io/response";
import { DEAD } from "@/game/animations/keys/common";
import { TypedSocket } from "@/types/socket-io";
import { AttackType } from "@/types/game/enum/state";
import { InputManager } from "@/game/managers/input-manager";
import { PlayerState } from "@/game/fsm/states/enum/player/player-state";
import { FiniteStateMachine } from "@/game/fsm/machine/interface/finite-state-machine";

export abstract class Player extends Phaser.Physics.Matter.Sprite {
  private inputManager?: InputManager;
  protected fsm: FiniteStateMachine<PlayerState> | null = null;

  private playerInfo: UserInfo;
  private label = "PLAYER";
  public speed = 2;

  protected isControllable: boolean;
  protected isBeingBorn = true;
  protected isSleep = false;

  protected sleepParticle: Phaser.GameObjects.Sprite | null = null;
  private speechBubble: Phaser.GameObjects.Container | null = null;
  private playerNameText: Phaser.GameObjects.Text;
  protected effect: Phaser.FX.Controller | undefined;

  public targetPosition: { x: number; y: number } = { x: 0, y: 0 };

  private lastSentPosition = { x: 0, y: 0 };
  private readonly POSITION_CHANGE_THRESHOLD = 3;
  public io?: TypedSocket;

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
    if (this.playerInfo.id === "ebf2f847-01fd-4a5b-8e1e-79e3a94175fa") {
      const phantom = 0xb68df4;
      this.preFX?.addGlow(phantom, 3);
      this.scene.tweens.add({
        targets: this,
        alpha: { from: 1, to: 0.5 },
        duration: 900,
        yoyo: true,
        repeat: -1,
      });
    }

    if (this.playerInfo.id === "601ecbae-ee0e-4a75-9fb1-61d068668046") {
    }
  }

  getSpeed() {
    return this.speed;
  }

  setSpeed(speed: number) {
    this.speed = speed;
  }

  getIsBeingBorn() {
    return this.isBeingBorn;
  }

  getPlayerInfo() {
    return this.playerInfo;
  }

  setFsm(fsm: FiniteStateMachine<PlayerState>) {
    this.fsm = fsm;
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

  update(): void {
    if (this.isControllable) {
      const keys = this.inputManager?.getPressedKeys() ?? [];

      if (this.fsm) {
        this.fsm.update(keys);
      }

      if (this.io && this.hasPositionChangedSignificantly()) {
        this.io.emit("playerMoved", { x: this.x, y: this.y });
        this.lastSentPosition.x = this.x;
        this.lastSentPosition.y = this.y;
      }
    } else {
      if (this.fsm) {
        this.fsm.update();
      }
    }

    this.setSpeechBubblePosition();
    this.setNicknamePosition();
    this.setDepth(this.y);
  }

  public abstract walk(side: "right" | "left" | "none"): void;
  public abstract idle(): void;
  public abstract attack(attackTtype?: AttackType): void;

  hit() {
    this.setTintFill(0xffffff);

    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });

    const originalX = this.x;

    this.scene.sound.play("hit");
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

  sleep() {
    if (this.isSleep) return;

    this.isSleep = true;
    this.sleepParticle = this.scene.add.sprite(this.x, this.y, "sleep");
    this.sleepParticle.play("sleep");
  }

  awake() {
    if (!this.isSleep) return;

    this.isSleep = false;
    this.sleepParticle?.destroy();
    this.sleepParticle = null;
  }

  setNicknamePosition() {
    if (this.playerNameText) {
      this.playerNameText.setPosition(
        this.x,
        this.y - this.displayHeight / 2 + 20
      );
    }
  }

  setVisibleNickname(visible: boolean) {
    this.playerNameText.setVisible(visible);
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

  protected listenInteractionEvent(radius?: number) {
    this.setInteractive(
      new Phaser.Geom.Circle(this.width / 2, this.height / 2, radius || 30),
      Phaser.Geom.Circle.Contains
    );

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
    if (this.effect) {
      this.preFX?.remove(this.effect);
      this.effect.destroy();
    }

    this.playerNameText.destroy(fromScene);
    this.preFX?.destroy();
    this.sleepParticle?.destroy(fromScene);

    super.destroy(fromScene);
  }

  onWalk(x: number, y: number) {
    this.targetPosition.x = x;
    this.targetPosition.y = y;
    console.log(this.targetPosition);
  }

  onAttack() {
    if (this.isControllable) {
      this.attack();
      this.io?.emit("attack");
      return;
    }

    if (this.fsm) {
      this.fsm.setState(PlayerState.ATTACK);
    }
  }
}
