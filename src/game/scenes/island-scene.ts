import { Socket } from "socket.io-client";
import {
  ActivePlayer,
  ActivePlayerResponse,
  ClientToServer,
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
import { playerSpawner } from "@/game/managers/spawners/player-spawner";
import { IslandNetworkHandler } from "@/game/components/island-network-handler";

export class IslandScene extends MetamornScene {
  public override player: Player;

  private bgmKey = TOWN;

  public mapComponent: TilemapComponent;
  private socketHandler: IslandNetworkHandler;

  private io: Socket<ServerToClient, ClientToServer>;
  public socketNsp = SOCKET_NAMESPACES.ISLAND;
  public currentIslandId?: string;

  private isActiveChat = false;
  public islandType: "NORMAL" | "DESERTED";

  constructor() {
    super(ISLAND_SCENE);
  }

  init(data?: { islandId?: string; type: "NORMAL" | "DESERTED" }) {
    this.isChangingScene = false;

    if (data && "islandId" in data && "type" in data) {
      if (data.type === "NORMAL" && data.islandId) {
        setItem("current_island_id", data.islandId);
        setItem("current_island_type", data.type);
        useIslandStore.getState().setIsland(data.islandId);
        this.currentIslandId = data.islandId;
        this.islandType = data.type;
        return;
      }

      return this.joinFailed();
    }
    const islandId = getItem("current_island_id");
    const type = getItem("current_island_type");

    useIslandStore.getState().setIsland(islandId);
    this.currentIslandId = islandId;
    this.islandType = type;
  }

  create() {
    super.create();

    this.listenLocalEvents();

    this.initConnection();

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
  }

  spawnActiveUsers(activeUsers: ActivePlayerResponse) {
    activeUsers.forEach((activeUser) => {
      this.addPlayer(activeUser);
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
    const player =
      this.player.getPlayerInfo().id === playerId
        ? this.player
        : playerStore.getPlayer(playerId);

    if (!player) return;

    player.setLastActivity(newLastActivity);

    const { lastActivity } = player.getPlayerInfo();
    const now = Date.now();

    const INACTIVITY_THRESHOLD = 1000 * 60 * 5;
    if (now - (lastActivity || now) > INACTIVITY_THRESHOLD) {
      player.sleep();
    }
  }

  handleAttacked(attackerId: string, attackedPlayerIds: string[]) {
    const player = playerStore.getPlayer(attackerId);
    if (!player && attackerId !== this.player.getPlayerInfo().id) return;

    player?.onAttack();

    this.time.delayedCall(200, () => {
      if (attackedPlayerIds.includes(this.player.getPlayerInfo().id)) {
        // EventWrapper.emitToUi("attacked");
        this.player.hit();
      }

      attackedPlayerIds
        .map((id) => playerStore.getPlayer(id))
        .forEach((player) => player?.hit());
    });
  }

  // TODO 오브젝트 공격 추가되면 수정
  handleStrongAttacked(attackerId: string, attackedPlayerIds: string[]) {
    const player = playerStore.getPlayer(attackerId);
    if (!player && attackerId !== this.player.getPlayerInfo().id) return;

    player?.onStrongAttack();

    this.time.delayedCall(200, () => {
      if (attackedPlayerIds.includes(this.player.getPlayerInfo().id)) {
        // EventWrapper.emitToUi("attacked");
        this.player.hit();
      }

      attackedPlayerIds
        .map((id) => playerStore.getPlayer(id))
        .forEach((player) => player?.hit());
    });
  }

  handleJump(userId: string) {
    const player = playerStore.getPlayer(userId);
    if (!player) return;

    player.onJump();
  }

  handleSetTargetPosition(playerId: string, x: number, y: number) {
    const player = playerStore.getPlayer(playerId);
    const isBeingBorn = player?.getIsBeingBorn();

    if (player && !isBeingBorn) {
      player.onWalk(x, y);
    }
  }

  clearAllPlayer() {
    playerStore
      .getAllPlayers()
      .values()
      .forEach((player) => {
        player.destroy();
      });
    playerStore.clear();
  }

  destroyPlayer(playerId: string) {
    const player = playerStore.getPlayer(playerId);
    player?.destroyWithAnimation(true);
    playerStore.deletePlayer(playerId);
  }

  addPlayer(data: ActivePlayer) {
    const { x, y, ...playerInfo } = data;
    if (playerStore.has(playerInfo.id)) return;

    const player = playerSpawner.spawnPlayer({
      scene: this,
      equipment: data.equipmentState,
      playerInfo: playerInfo,
      position: { x, y },
      texture: playerInfo.avatarKey,
    });
    playerStore.addPlayer(playerInfo.id, player);
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
