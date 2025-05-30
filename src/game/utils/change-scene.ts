import { EventWrapper } from "@/game/event/EventBus";
import { MetamornScene } from "@/game/scenes/metamorn-scene";
import { removeItem } from "@/utils/session-storage";

export const changeScene = (
  scene: MetamornScene,
  sceneKey: string,
  cleanupBeforeLeft: () => void
) => {
  if (scene.isChangingScene) return;
  scene.isChangingScene = true;

  removeItem("current_island_id");
  removeItem("current_island_type");
  scene.isIntentionalDisconnect = true;
  scene.cameras.main.fadeOut(500, 0, 0, 0);

  scene.time.delayedCall(500, () => {
    EventWrapper.emitToUi("start-change-scene");

    cleanupBeforeLeft();
    scene.scene.stop(scene.scene.key);
    scene.scene.start(sceneKey);
    scene.isChangingScene = false;
  });
};
