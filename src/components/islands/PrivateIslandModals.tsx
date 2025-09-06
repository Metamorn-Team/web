import RetroConfirmModalV2 from "@/components/common/RetroConfirmModalV2";
import InviteModal from "@/components/islands/InviteModal";
import PermissionModal from "@/components/rtc/PermissionModal";
import RtcSettingsModal from "@/components/rtc/RtcSettingsModal";
import React from "react";

interface PrivateIslandModalsProps {
  isInviteModalOpen: boolean;
  onInviteModalClose: () => void;
  isExitModalOpen: boolean;
  onExitModalClose: () => void;
  handleExitIsland: () => void;
  isPermissionModalOpen: boolean;
  onPermissionModalClose: () => void;
  isRtcSettingModalOpen: boolean;
  onRtcSettingModalClose: () => void;
  selectedCamId: string | undefined;
  selectedMicId: string | undefined;
  changeMicDevice: (deviceId: string | undefined) => Promise<void>;
  changeCamDevice: (deviceId: string | undefined) => Promise<void>;
}

const PrivateIslandModals = ({
  isInviteModalOpen,
  onInviteModalClose,
  isExitModalOpen,
  onExitModalClose,
  handleExitIsland,
  isPermissionModalOpen,
  onPermissionModalClose,
  isRtcSettingModalOpen,
  onRtcSettingModalClose,
  selectedCamId,
  selectedMicId,
  changeMicDevice,
  changeCamDevice,
}: PrivateIslandModalsProps) => {
  return (
    <>
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={onInviteModalClose}
        inviteUrl={typeof window !== "undefined" ? window.location.href : ""}
      />
      {isExitModalOpen ? (
        <RetroConfirmModalV2
          isOpen={isExitModalOpen}
          onClose={onExitModalClose}
          onConfirm={handleExitIsland}
          title="섬을 떠나시겠어요?"
          modalClassName="!max-w-[320px]"
        />
      ) : null}
      {isPermissionModalOpen ? (
        <PermissionModal
          isOpen={isPermissionModalOpen}
          onClose={onPermissionModalClose}
        />
      ) : null}

      {isRtcSettingModalOpen ? (
        <RtcSettingsModal
          selectedCamId={selectedCamId}
          selectedMicId={selectedMicId}
          isOpen={isRtcSettingModalOpen}
          onClose={onRtcSettingModalClose}
          changeMicDevice={changeMicDevice}
          changeCamDevice={changeCamDevice}
        />
      ) : null}
    </>
  );
};

export default PrivateIslandModals;
