import { TORCH_GOBLIN, TorchGoblinColor } from "@/constants/game/entities";
import { TORCH_GOBLIN_IDLE } from "@/game/animations/keys/torch-goblin";
import { Npc } from "@/game/entities/npc/npc";
import { EventWrapper } from "@/game/event/EventBus";

export class TorchGoblin extends Npc {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    color: TorchGoblinColor
  ) {
    super(scene, x, y, TORCH_GOBLIN(color));

    scene.add.existing(this);
    this.play(TORCH_GOBLIN_IDLE(color), true);
  }

  protected setBodyConfig(): void {
    this.setRectangle(35, 10);
    this.displayOriginY += 5;
    this.setDepth(this.y + 5);
    this.setStatic(true);
  }

  public startInteraction(): void {
    EventWrapper.emitToUi("npc-interaction-started", {
      npc: this,
      type: "guide",
    });
  }

  createSpeechBubble(
    x: number,
    y: number,
    width: number,
    height: number,
    quote: string
  ) {
    // 말풍선 위치 조정 (캐릭터 머리 위 중앙)
    const bubbleX = x - width / 2; // x를 중심으로 너비의 절반만큼 왼쪽으로 이동
    const bubbleY = y - height - 20; // y에서 높이만큼 위로 이동 (추가 여백 30px)

    const bubble = this.scene.add.graphics({ x: bubbleX, y: bubbleY });

    // 말풍선 스타일 설정
    bubble.fillStyle(0xffffff, 1);
    bubble.lineStyle(2, 0x565656, 1);
    bubble.fillRoundedRect(0, 0, width, height, 16);

    // 말풍선 꼬리 추가
    const tailWidth = 20;
    const tailHeight = 15;
    const tailX = width / 2 - tailWidth / 2;
    const tailY = height;

    bubble.beginPath();
    bubble.moveTo(tailX, tailY);
    bubble.lineTo(tailX + tailWidth / 2, tailY + tailHeight);
    bubble.lineTo(tailX + tailWidth, tailY);
    bubble.closePath();
    bubble.fillPath();

    // 텍스트 내용 추가
    const content = this.scene.add.text(0, 0, quote, {
      fontFamily: "CookieRun",
      fontSize: "14px",
      resolution: 2,
      color: "#000000",
      align: "center",
      wordWrap: { width: width - 20 },
    });

    // 텍스트 중앙 정렬
    const textWidth = content.width;
    const textHeight = content.height;
    content.setPosition(
      bubbleX + width / 2 - textWidth / 2,
      bubbleY + height / 2 - textHeight / 2
    );
  }
}
