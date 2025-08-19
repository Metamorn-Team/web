import { Socket } from "socket.io-client";
import {
  ActivePlayer,
  ActivePlayerResponse,
  AttackedObject,
  ClientToServer,
  IslandActiveObject,
  MessageSent,
  ReceiveMessage,
  ServerToClient,
} from "mmorntype";
import { EventWrapper } from "@/game/event/EventBus";
import { MetamornScene } from "@/game/scenes/metamorn-scene";
import { Player } from "@/game/entities/players/player";
import { socketManager } from "@/game/managers/socket-manager";
import { getItem, removeItem, setItem } from "@/utils/session-storage";
import { playerStore } from "@/game/managers/player-store";
import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import Alert from "@/utils/alert";
import { Keys } from "@/types/game/enum/key";
import { SoundManager } from "@/game/managers/sound-manager";
import { POSITION_CHANGE_THRESHOLD } from "@/constants/game/threshold";
import { ISLAND_SCENE, LOBY_SCENE } from "@/constants/game/islands/island";
import { useIslandStore } from "@/stores/useIslandStore";
import { TOWN } from "@/constants/game/sounds/bgm/bgms";
import { TilemapComponent } from "@/game/components/tile-map.component";
import { IslandNetworkHandler } from "@/game/components/island-network-handler";
import { natureObjectStore } from "@/game/managers/nature-object-store";
import { IslandHandlerComponent } from "@/game/components/island-handler-component";

export class IslandScene extends MetamornScene {
  public override player: Player;

  private bgmKey = TOWN;

  public mapComponent: TilemapComponent;
  private socketHandler: IslandNetworkHandler;
  private islandHandler: IslandHandlerComponent;

  private io: Socket<ServerToClient, ClientToServer>;
  public socketNsp = SOCKET_NAMESPACES.ISLAND;

  // currentIslandId 값을 기반으로 socket 연결 시 즉시 참여 요청
  public currentIslandId?: string;

  private isInvalidIsland = false;
  private isActiveChat = false;
  public islandType: "NORMAL" | "DESERTED" | "PRIVATE";

  constructor() {
    super(ISLAND_SCENE);
  }

  async init(data?: {
    islandId?: string;
    type: "NORMAL" | "DESERTED" | "PRIVATE";
    path?: string;
  }) {
    this.isChangingScene = false;

    // data에 정보가 있으면 NORMAL
    if (data?.type === "NORMAL" && data?.islandId) {
      setItem("current_island_id", data.islandId);
      setItem("current_island_type", data.type);
      useIslandStore.getState().setIsland(data.islandId);
      this.currentIslandId = data.islandId;
      this.islandType = data.type;
      return;
    }

    // store에 정보가 있으면 PRIVATE
    const { id, type } = useIslandStore.getState();

    if (type === "PRIVATE" && id) {
      this.currentIslandId = id;
      this.islandType = type;
      return;
    }

    /**
     * 둘 다 아니라면 세션 스토리지에서 꺼내옴
     * NORMAL에 참여했다가 새로고침한 케이스
     */
    const islandId = getItem("current_island_id");
    const islandType = getItem("current_island_type");

    useIslandStore.getState().setIsland(islandId);
    this.currentIslandId = islandId;
    this.islandType = islandType;
  }

  create() {
    if (this.isInvalidIsland) {
      Alert.error("섬 정보를 찾을 수 없어요..");
      this.changeToLoby();
      return;
    }

    super.create();

    this.listenLocalEvents();
    this.initConnection();

    this.islandHandler = new IslandHandlerComponent(this);

    this.socketHandler = new IslandNetworkHandler(this, this.io);
    this.socketHandler.listenSocketEvents();
    this.socketHandler.listenSocketErrorEvents();

    this.registerHearbeatCheck();
    this.isIntentionalDisconnect = false;

    SoundManager.init(this);
    SoundManager.getInstance().playBgm(this.bgmKey);
  }

  private hasPositionChangedSignificantly(): boolean {
    const dx = Math.abs(this.player.x - this.player.lastSentPosition.x);
    const dy = Math.abs(this.player.y - this.player.lastSentPosition.y);
    return dx >= POSITION_CHANGE_THRESHOLD || dy >= POSITION_CHANGE_THRESHOLD;
  }

  update(time: number, delta: number): void {
    if (!this.player?.body) return;

    this.player.update(delta);

    if (
      this.isActiveChat === false &&
      this.inputManager.isKeyJustDown(Keys.ENTER)
    ) {
      EventWrapper.emitToUi("activeChatInput");
      this.isActiveChat = true;
    }

    if (this.io && this.hasPositionChangedSignificantly()) {
      const x = Math.round(this.player.x * 100) / 100;
      const y = Math.round(this.player.y * 100) / 100;

      this.io.emit("playerMoved", { x, y });

      this.player.lastSentPosition.x = x;
      this.player.lastSentPosition.y = y;
    }

    for (const player of playerStore.getAllPlayers().values()) {
      player.update(delta);
    }

    for (const object of natureObjectStore.getNatureObjects().values()) {
      object.update(delta);
    }
  }

  spawnActiveUsers(activeUsers: ActivePlayerResponse) {
    activeUsers.forEach((activeUser) => {
      this.handleAddPlayer(activeUser);
    });
  }

  listenLocalEvents() {
    this.input.on("pointerdown", () => {
      if (!this.getEnabledKeyboardInput()) {
        EventWrapper.emitToUi("blurChatInput");
        this.setEnabledKeyboardInput(true);
      }
    });

    EventWrapper.onGameEvent("mySpeechBubble", async (data: MessageSent) => {
      this.player.speech(data.message);
    });

    EventWrapper.onGameEvent(
      "otherSpeechBubble",
      async (data: ReceiveMessage) => {
        const { senderId, message } = data;

        const player = playerStore.getPlayer(senderId);
        player?.speech(message);
      }
    );

    EventWrapper.onGameEvent("left-island", () => {
      this.io.emit("playerLeft");
    });

    EventWrapper.offGameEvent("enableGameKeyboardInput");

    EventWrapper.onGameEvent("enableGameKeyboardInput", () => {
      this.time.delayedCall(100, () => {
        this.setEnabledKeyboardInput(true);
        this.setEnabledMouseInput(true);
        this.isActiveChat = false;
      });
    });
  }

  handleHeartbeat(playerId: string, newLastActivity: number) {
    this.islandHandler.handleHeartbeat(playerId, newLastActivity);
  }

  handleAttacked(attackerId: string, attackedPlayerIds: string[]) {
    this.islandHandler.handleAttacked(attackerId, attackedPlayerIds);
  }

  handleStrongAttacked(attackerId: string, attackedObjects: AttackedObject[]) {
    this.islandHandler.handleStrongAttacked(attackerId, attackedObjects);
  }

  handleJump(userId: string) {
    this.islandHandler.handleJump(userId);
  }

  handleSetTargetPosition(playerId: string, x: number, y: number) {
    this.islandHandler.handleSetTargetPosition(playerId, x, y);
  }

  handleRespawnObjects(objects: IslandActiveObject[]) {
    this.islandHandler.handleRespawnObjects(objects);
  }

  handleClearAllPlayer() {
    this.islandHandler.handleClearAllPlayer();
  }

  handleDestroyPlayer(playerId: string) {
    this.islandHandler.handleDestroyPlayer(playerId);
  }

  handleAddPlayer(data: ActivePlayer) {
    this.islandHandler.handleAddPlayer(data);
  }

  public changeToLoby() {
    if (this.isChangingScene) return;
    this.isChangingScene = true;

    removeItem("current_island_id");
    removeItem("current_island_type");
    this.isIntentionalDisconnect = true;
    this.cameras.main.fadeOut(500, 0, 0, 0);

    this.time.delayedCall(500, () => {
      EventWrapper.emitToUi("start-change-scene");

      this.scene.stop(ISLAND_SCENE);
      this.cleanupBeforeLeft();
      this.scene.start(LOBY_SCENE);
    });
  }

  private cleanupBeforeLeft(): void {
    this.socketHandler.cleanup();
    this.removeLocalEvents();

    playerStore.clear();

    this.mapComponent.destroy();
    this.matter.world.setBounds(0, 0, 0, 0);

    this.sound.stopAll();
    this.tweens.killAll();

    this.children.each((child) => child.destroy());
    this.free();
  }

  private removeLocalEvents() {
    EventWrapper.offGameEvent("mySpeechBubble");
    EventWrapper.offGameEvent("otherSpeechBubble");
    EventWrapper.offGameEvent("left-island");
    EventWrapper.offGameEvent("enableGameKeyboardInput");
  }

  private registerHearbeatCheck() {
    this.time.addEvent({
      delay: 1000 * 30,
      loop: true,
      callback: () => {
        this.io.emit("islandHearbeat");
      },
    });
  }

  initConnection() {
    const socket = socketManager.connect(this.socketNsp);
    if (socket) {
      this.io = socket;
    }

    if (!this.io) {
      EventWrapper.emitToGame("left-island");
      Alert.error("섬에 도착하지 못 했어요..");
    }
  }

  joinFailed() {
    Alert.error("섬 참여 실패..");
    this.changeToLoby();
  }
}
