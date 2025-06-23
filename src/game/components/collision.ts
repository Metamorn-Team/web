import { Component } from "@/game/components/interface/component";
import { BaseEntity } from "@/game/entities/common/base-entity";
import { Phaser } from "@/game/phaser";

interface CollisionOptions {
  shape: "circle" | "rectangle";
  label: string;
  category: number;
  collidesGroup?: number;
  collidesWith?: number[];
  width?: number;
  height?: number;
  radius?: number;
}

/**
 * Matter.js의 collisionFilter.group 사용 규칙:
 *
 * 1. group === 0 (기본값)
 *    - 충돌 여부는 category & mask 로 결정됨
 *
 * 2. group > 0 (양수 그룹)
 *    - 같은 group 값을 가진 바디끼리는 **무조건 충돌함**
 *    - category/mask 무시됨
 *
 * 3. group < 0 (음수 그룹)
 *    - 같은 group 값을 가진 바디끼리는 **절대 충돌하지 않음**
 *    - category/mask 무시됨
 *
 * ✔️ 주로 사용하는 예:
 *    - group = -1: 플레이어끼리는 충돌하지 않도록 설정
 *    - group = 1: 파티클이나 연결된 오브젝트끼리 항상 충돌하게 설정
 */
export class CollisionComponent implements Component {
  private scene: Phaser.Scene;
  private host: BaseEntity;
  private body: MatterJS.BodyType;

  constructor(host: BaseEntity, options: CollisionOptions) {
    this.init(host, options);
  }

  init(host: BaseEntity, options: CollisionOptions): void {
    this.host = host;
    this.scene = host.scene;

    this.scene.matter.add.gameObject(host, {
      shape: {
        type: options.shape,
        width: options.width,
        height: options.height,
        radius: options.radius,
      },
    });

    const body = host.body as MatterJS.BodyType;
    body.label = options.label;

    this.body = body;
    this.body.collisionFilter.category = options.category;
    this.body.collisionFilter.group = options.collidesGroup ?? 0;
  }

  update(): void {
    this.body.position.x = this.host.x;
    this.body.position.y = this.host.y;
  }

  get name() {
    return CollisionComponent.name;
  }

  fixed(isStatic: boolean) {
    this.body.isStatic = isStatic;
    return this;
  }

  destroy(): void {
    if (this.body) {
      this.scene.matter.world.remove(this.body);
    }
  }
}
