import * as Phaser from "phaser";
import type { Socket } from "socket.io-client";
import { EventWrapper } from "@/game/event/EventBus";
import { UserInfo } from "@/types/socket-io/response";
import { DEAD } from "@/game/animations/keys/common";
import { TypedSocket } from "@/types/socket-io";
import { AttackType } from "@/types/game/enum/state";
import { PlayerState } from "@/game/fsm/states/enum/player/player-state";
import { FiniteStateMachine } from "@/game/fsm/machine/interface/finite-state-machine";
import { InputManager } from "@/game/managers/input/input-manager";
import { AuraEffect } from "@/game/components/aura-effect";
import { EquipmentState } from "@/game/components/equipment-state";
import { BaseEntity } from "@/game/entities/common/base-entity";
import { Position } from "@/types/game/game";
import { Equipment } from "@/types/game/equipment";
import { Renderer } from "@/game/components/renderer";
import { CollisionComponent } from "@/game/components/collision";
import { NameLabel } from "@/game/components/name-label";
import { PointerInteractionComponent } from "@/game/components/pointer-interaction-component";
import { SleepParticle } from "@/game/components/sleep-particle";
import { SpeechBubble } from "@/game/components/speech-bubble";
import { COLLISION_CATEGORIES } from "@/constants/game/collision-categories";
import { COLLISION_LABEL } from "@/constants/game/collision-label";

export interface PlayerOptions {
  scene: Phaser.Scene;
  position: Position;
  texture: string;
  playerInfo: UserInfo;
  equipment: Equipment;
  nameLabelGap?: number;
  speechBubbleGap?: number;
  radius?: number;
  inputManager?: InputManager;
  io?: Socket;
}

export abstract class Player extends BaseEntity {
  private inputManager?: InputManager;
  protected fsm: FiniteStateMachine<PlayerState> | null = null;
  protected equipmentState: EquipmentState;

  private playerInfo: UserInfo;
  public speed = 150;

  protected isBeingBorn = true;
  protected isMyPlayer: boolean;

  public targetPosition: Position = { x: 0, y: 0 };
  public lastSentPosition: Position = { x: 0, y: 0 };
  public io?: TypedSocket;

  constructor(options: PlayerOptions) {
    super(options.scene, options.position.x, options.position.y);

    options.scene.add.existing(this);
    this.inputManager = options.inputManager;
    this.isMyPlayer = !!options.inputManager;
    this.io = options.io;
    this.targetPosition = options.position;
    this.playerInfo = options.playerInfo;

    // -- 필수 컴포넌트 등록 --
    this.registerComponents(options);
    this.listenInteractionEvent();
    this.setInteractive(
      new Phaser.Geom.Circle(this.width / 2, this.height / 2, options.radius),
      Phaser.Geom.Circle.Contains
    );
  }

  registerComponents(options: PlayerOptions) {
    const renderer = new Renderer(this, options.texture).setScale(0.7);
    const components = [
      renderer,
      new CollisionComponent(this, {
        label: this.isMyPlayer
          ? COLLISION_LABEL.MY_PLAYER
          : COLLISION_LABEL.PLAYER,
        shape: "circle",
        radius: options.radius,
        category: COLLISION_CATEGORIES.PLAYER,
      }),
      new NameLabel(this, {
        text: options.playerInfo.nickname,
        gap: options.nameLabelGap ?? 30,
        color: this.isMyPlayer ? "#81D4FA" : "#FFFFFF",
        isMine: this.isMyPlayer,
      }),
      new PointerInteractionComponent(this),
      new SleepParticle(this),
      new AuraEffect(renderer.sprite, options.equipment.AURA),
      new SpeechBubble(this, {
        gap: options.speechBubbleGap ?? 55,
        bubbleTexture: options.equipment.SPEECH_BUBBLE?.key,
      }),
    ];

    components.forEach((c) => this.addComponent(c));
  }

  public abstract walk(side: "right" | "left" | "none"): void;
  public abstract idle(): void;
  public abstract attack(attackTtype?: AttackType): void;
  public abstract jump(side: "right" | "left" | "none"): void;

  update(delta: number): void {
    if (this.fsm) {
      const keys = this.isMyPlayer
        ? this.inputManager?.getPressedKeys() || []
        : undefined;

      this.fsm.update(delta, keys);
    }

    super.update(delta);
    this.setDepth(this.y);
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

  setLastActivity(time: number) {
    this.playerInfo.lastActivity = time;
  }

  setFsm(fsm: FiniteStateMachine<PlayerState>) {
    this.fsm = fsm;
  }

  hit() {
    const renderer = this.getComponent(Renderer);

    renderer?.setTint(0xffffff);
    this.scene.time.delayedCall(100, () => {
      renderer?.clearTint();
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

  sleep() {
    const sleepParticle = this.getComponent(SleepParticle);
    if (!sleepParticle) return;

    sleepParticle.sleep();
  }

  awake() {
    this.getComponent(SleepParticle)?.awake();
  }

  setAura(key: string) {
    const aura = this.getComponent(AuraEffect);
    aura?.changeAura(key);
  }

  setSpeechBubble(key: string) {
    const bubble = this.getComponent(SpeechBubble);
    bubble?.setTexture(key);
  }

  setNameLabel(newNickname: string) {
    this.getComponent(NameLabel)?.setText(newNickname);
  }

  onPointerover() {
    const renderer = this.getComponent(Renderer);
    if (!renderer) return;

    this.scene.tweens.add({
      targets: [renderer.sprite],
      scale: 0.8,
      duration: 100,
      ease: "Power2",
    });
  }

  onPointerout() {
    const renderer = this.getComponent(Renderer);
    if (!renderer) return;

    this.scene.tweens.add({
      targets: [renderer.sprite],
      scale: 0.7,
      duration: 100,
      ease: "Power2",
    });
  }

  onPointerdown() {
    EventWrapper.emitToUi("player-click", {
      ...this.playerInfo,
    });
  }

  protected listenInteractionEvent() {
    const pointerInteraction = this.getComponent(PointerInteractionComponent);

    pointerInteraction?.registerPointerover(this.onPointerover);
    pointerInteraction?.registerPointerout(this.onPointerout);
    pointerInteraction?.registerPointerdown(this.onPointerdown);
  }

  onWalk(x: number, y: number) {
    this.targetPosition.x = x;
    this.targetPosition.y = y;
  }

  onAttack() {
    if (this.inputManager) {
      this.attack(AttackType.ATTACK);
      this.io?.emit("attack");
      return;
    }

    if (this.fsm) {
      this.fsm.setState(PlayerState.ATTACK);
    }
  }

  onStrongAttack() {
    if (this.inputManager) {
      this.attack(AttackType.STRONG_ATTACK);
      this.io?.emit("strongAttack");
      return;
    }

    if (this.fsm) {
      this.fsm.setState(PlayerState.STRONG_ATTACK);
    }
  }

  onJump(side?: "right" | "left" | "none") {
    if (this.inputManager) {
      if (side) {
        this.jump(side);
        this.io?.emit("jump");
      }
      return;
    }

    if (this.fsm) {
      this.fsm.setState(PlayerState.JUMP);
    }
  }

  spriteOnce(event: string, callback: () => void) {
    const render = this.getComponent(Renderer);
    render?.once(event, callback);
  }

  public setTexture(key: string) {
    this.getComponent(Renderer)?.setTexture(key);
  }

  public speech(text: string) {
    this.getComponent(SpeechBubble)?.show(text);
  }

  play(key: string, isIgnoreIfPlaying?: boolean) {
    this.getComponent(Renderer)?.play(key, isIgnoreIfPlaying);
  }

  destroy(fromScene?: boolean): void {
    super.destroy(fromScene);
  }

  destroyWithAnimation(fromScene?: boolean) {
    const renderer = this.getComponent(Renderer);
    renderer?.play(DEAD);
    renderer?.once("animationcomplete", () => {
      this.destroy(fromScene);
    });
  }
}
