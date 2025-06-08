import { COLLISION_CATEGORIES } from "@/constants/game/collision-categories";
import { COLLISION_LABEL } from "@/constants/game/collision-label";
import { SHEEP } from "@/constants/game/entities";
import { SHEEP as SHEEP_ANIMATION } from "@/game/animations/keys/creatures/sheep/sheep";
import { CollisionComponent } from "@/game/components/collision";
import { Renderer } from "@/game/components/renderer";
import { BaseEntity } from "@/game/entities/common/base-entity";
import { SheepFSM } from "@/game/fsm/creatures/sheep/sheep-fsm";

export class Sheep extends BaseEntity {
  private _speed = 75;
  private fsm: SheepFSM;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.fsm = new SheepFSM(this);

    this.registerComponent();
    this.getComponent(Renderer)?.play(SHEEP_ANIMATION.IDLE);
  }

  registerComponent() {
    const components = [
      new Renderer(this, SHEEP),
      new CollisionComponent(this, {
        label: COLLISION_LABEL.ANIMAL,
        category: COLLISION_CATEGORIES.ANIMAL,
        shape: "circle",
        radius: 10,
        collidesGroup: 1,
      }),
    ];

    components.forEach((c) => this.addComponent(c));
  }

  update(delta: number): void {
    this.setDepth(this.y);
    this.fsm.update(delta);
    super.update(delta);
  }

  get speed() {
    return this._speed;
  }

  onIdle() {
    this.getComponent(Renderer)?.play(SHEEP_ANIMATION.IDLE, true);
  }

  onMove() {
    this.getComponent(Renderer)?.play(SHEEP_ANIMATION.JUMP, true);
  }

  onJump() {
    this.getComponent(Renderer)?.play(SHEEP_ANIMATION.JUMP, true);
  }

  flipX(isRight: boolean) {
    this.getComponent(Renderer)?.setFlipX(isRight);
  }
}
