import { PAWN, PawnColor } from "@/constants/game/entities";
import { HIT, JUMP, STRONG_HIT } from "@/constants/game/sounds/sfx/sfxs";
import {
  PAWN_ATTACK,
  PAWN_IDLE,
  PAWN_JUMP,
  PAWN_STRONG_ATTACK,
  PAWN_WALK,
} from "@/game/animations/keys/pawn";
import { EquipmentState } from "@/game/components/equipment-state";
import { NameLabel } from "@/game/components/name-label";
import { Renderer } from "@/game/components/renderer";
import { Player, PlayerOptions } from "@/game/entities/players/player";
import { SoundManager } from "@/game/managers/sound-manager";
import { AttackType } from "@/types/game/enum/state";
import { AttackRangeSensorComponent } from "@/game/components/attack-range-sensor";

interface PawnOptions extends PlayerOptions {
  color: PawnColor;
}

export class Pawn extends Player {
  private color: PawnColor;

  constructor(options: PawnOptions) {
    super({
      ...options,
      texture: PAWN(options.color),
      nameLabelGap: 42,
      speechBubbleGap: 55,
    });

    this.isBeingBorn = false;
    this.color = options.color;
    const isDebug = !!this.scene.game.config.physics.matter?.debug;

    this.addComponent(new EquipmentState(options.equipment.AURA));
    // 디버깅용 공격 범위 센서 컴포넌트
    this.addComponent(
      new AttackRangeSensorComponent(this, {
        shape: "rectangle",
        width: 40,
        height: 30,
        alpha: 0.3,
        showText: true,
        enabled: isDebug,
      })
    );
  }

  public update(delta: number): void {
    if (this.isBeingBorn) return;

    super.update(delta);
  }

  public walk(side: "right" | "left" | "none"): void {
    this.awake();

    const renderer = this.getComponent(Renderer);
    renderer?.play(PAWN_WALK(this.color), true);

    if (side === "right") {
      renderer?.setFlipX(false);
    }

    if (side === "left") {
      renderer?.setFlipX(true);
    }
  }

  public idle(): void {
    this.getComponent(Renderer)?.play(PAWN_IDLE(this.color), true);
  }

  public attack(attackType: AttackType): void {
    this.awake();

    const renderer = this.getComponent(Renderer);
    renderer?.play(
      attackType === AttackType.STRONG_ATTACK
        ? PAWN_STRONG_ATTACK(this.color)
        : PAWN_ATTACK(this.color),
      true
    );

    // 공격 범위 센서 하이라이트
    const attackSensor = this.getComponent(AttackRangeSensorComponent);
    attackSensor?.highlight(500, 0xffff00);

    this.scene.time.delayedCall(240, () => {
      SoundManager.getInstance().playSfx(
        attackType === AttackType.STRONG_ATTACK ? STRONG_HIT : HIT,
        0.3
      );
    });
  }

  public jump(side: "right" | "left" | "none"): void {
    this.awake();

    const renderer = this.getComponent(Renderer);
    if (!renderer) return;

    renderer.play(PAWN_JUMP(this.color), true);

    SoundManager.getInstance().playSfx(JUMP, 0.05);

    if (side === "right") {
      renderer.setFlipX(false);
    }

    if (side === "left") {
      renderer.setFlipX(true);
    }
  }

  public getColor() {
    return this.color;
  }

  public setColor(newColor: PawnColor) {
    this.color = newColor;
    this.setTexture(PAWN(newColor));
    this.idle();
  }

  public setNicknameLabel(newNickname: string) {
    this.getComponent(NameLabel)?.setText(newNickname);
  }
}
