"use client";

import RetroButton from "@/components/common/RetroButton";
import RetroModal from "./RetroModal";

interface ForceReloadModalProps {
  isOpen: boolean;
  message: string;
}

export default function ForceReloadModal({
  isOpen,
  message,
}: ForceReloadModalProps) {
  const handleReload = () => {
    window.location.reload();
  };

  if (isOpen && typeof window !== "undefined") {
    import("@/game/event/EventBus").then((mod) => {
      mod.EventWrapper.emitToGame("disableGameInput");
    });
  }

  return (
    <RetroModal
      isOpen={isOpen}
      onClose={() => {}}
      className="!max-w-[400px] text-center"
    >
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-[#3d2c1b] mb-4">{message}</p>
        <RetroButton variant={"ghost"} onClick={handleReload}>
          🔄 새로고침
        </RetroButton>
      </div>
    </RetroModal>
  );
}
