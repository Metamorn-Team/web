import { INITIAL_PROFILE } from "@/constants/game/initial-profile";
import { NPC_INTERACTABLE_DISTANCE } from "@/constants/game/threshold";
import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import { Npc } from "@/game/entities/npc/npc";
import { TorchGoblin } from "@/game/entities/npc/torch-goblin";
import { EventWrapper } from "@/game/event/EventBus";
import { controllablePlayerManager } from "@/game/managers/controllable-player-manager";
import { socketManager } from "@/game/managers/socket-manager";
import { SoundManager } from "@/game/managers/sound-manager";
import { tileMapManager } from "@/game/managers/tile-map-manager";
import { Mine } from "@/game/objects/mine";
import { Phaser } from "@/game/phaser";
import { MetamornScene } from "@/game/scenes/metamorn-scene";
import { Keys } from "@/types/game/enum/key";
import { UserInfo } from "@/types/socket-io/response";
import Alert from "@/utils/alert";
import {
  CanJoinIslandResponse,
  ClientToServer,
  ServerToClient,
} from "mmorntype";
import { Socket } from "socket.io-client";

export class LobyScene extends MetamornScene {
  private bgmKey = "woodland-fantasy";
  private npcGoblin: TorchGoblin;
  private mine: Mine;

  private npcs: Npc[] = [];

  private map: Phaser.Tilemaps.Tilemap;
  private mapWidth: number;
  private mapHeight: number;
  private centerOfMap: { x: number; y: number };

  public updateLoadingState: (state: boolean) => void;

  private socketNsp = SOCKET_NAMESPACES.ISLAND;
  private io: Socket<ServerToClient, ClientToServer>;

  constructor() {
    super("LobyScene");
  }

  preload() {}

  create() {
    super.create();
    this.initWorld();

    this.io = socketManager.connect(this.socketNsp)!;
    console.log(this.io);

    this.spwanMyPlayer();
    this.spawnNpcs();

    this.mine = new Mine(
      this,
      this.centerOfMap.x,
      this.centerOfMap.y - 200,
      "dev"
    );

    this.listenEvents();

    SoundManager.init(this);
    SoundManager.getInstance().playBgm(this.bgmKey);
  }

  update(): void {
    if (this.player) {
      this.player.update();

      this.checkNearNpc();
      if (this.inputManager.isKeyJustDown(Keys.E)) {
        this.inputManager.resetKeyAll();

        this.npcs.forEach((npc) => {
          if (npc.isInteractivePromptVisible) {
            this.setEnabledKeyboardInput(false);
            npc.startInteraction();
          }
        });
      }
    }
  }

  checkNearNpc() {
    return this.npcs.forEach((npc) => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        npc.x,
        npc.y
      );

      if (distance < NPC_INTERACTABLE_DISTANCE) {
        npc.showInteractionPrompt();
      } else {
        npc.hideInteractionPrompt();
      }
    });
  }

  initWorld() {
    this.map = tileMapManager.registerTileMap(this, "loby");

    this.mapWidth = this.map.widthInPixels;
    this.mapHeight = this.map.heightInPixels;
    this.centerOfMap = {
      x: this.mapWidth / 2,
      y: this.mapHeight / 2,
    };

    this.matter.world.setBounds(0, 0, this.mapWidth, this.mapHeight);

    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.setZoom(1.1);

    this.add.image(520, 600, "ship").setScale(0.6);

    EventWrapper.emitToUi("current-scene-ready", {
      scene: this,
      socketNsp: this.socketNsp,
    });
  }

  async spwanMyPlayer() {
    let userInfo: UserInfo;

    try {
      userInfo = await this.getPlayerInfo();
    } catch (e: unknown) {
      console.log(e);
      userInfo = INITIAL_PROFILE;
    }

    this.player = await controllablePlayerManager.spawnControllablePlayer(
      this,
      userInfo,
      this.centerOfMap.x,
      this.centerOfMap.y,
      this.inputManager
    );
  }

  listenEvents() {
    EventWrapper.onGameEvent("joinDesertedIsland", () => {
      this.changeToIsland({ type: "DESERTED" });
    });

    EventWrapper.onGameEvent("joinNormalIsland", (islandId?: string) => {
      this.io.emit("canJoinIsland", { islandId });
    });

    EventWrapper.onGameEvent("createdIsland", (islandId: string) => {
      this.changeToIsland({ islandId, type: "NORMAL" });
    });

    this.io.on("canJoinIsland", (data: CanJoinIslandResponse) => {
      const { islandId, canJoin, reason } = data;

      if (canJoin && islandId) {
        this.changeToIsland({ islandId, type: "NORMAL" });
        return;
      }
      Alert.error(reason || "섬에 참여하지 못했어요..");
    });
  }

  private changeToIsland(data: {
    islandId?: string;
    type: "NORMAL" | "DESERTED";
  }) {
    this.cameras.main.fadeOut(500, 0, 0, 0);

    this.time.delayedCall(500, () => {
      EventWrapper.emitToUi("start-change-scene");

      this.cleanupBeforeLeft();

      this.scene.start("IslandScene", data);
    });
  }

  private cleanupBeforeLeft() {
    this.npcGoblin?.destroy();
    this.npcs = [];
    this.mine?.destroy();
    this.sound.stopAll();
    this.map.destroy();

    EventWrapper.offGameEvent("joinNormalIsland");
    EventWrapper.offGameEvent("createdIsland");
    EventWrapper.offGameEvent("joinDesertedIsland");
  }

  spawnNpcs() {
    const goblin = new TorchGoblin(
      this,
      this.centerOfMap.x - 200,
      this.centerOfMap.y,
      "red"
    );

    this.npcs.push(goblin);
  }
}
