import { useEffect, useMemo } from "react";
import { EventWrapper } from "@/game/event/EventBus";

export const useDisableGameInputWhenOpen = (...modalStates: boolean[]) => {
  const isAnyModalOpen = useMemo(
    () => modalStates.some(Boolean),
    [modalStates]
  );

  useEffect(() => {
    if (isAnyModalOpen) {
      EventWrapper.emitToGame("disableGameInput");
    } else {
      EventWrapper.emitToGame("enableGameKeyboardInput");
    }
  }, [isAnyModalOpen]);
};
