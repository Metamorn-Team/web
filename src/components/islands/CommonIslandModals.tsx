import React from "react";
import ChatPanel from "@/components/chat/ChatPanel";
import ControlGuide from "@/components/ControlGuide";
import FriendModal from "@/components/FriendModal";
import HelpModal from "@/components/HelpModal";
import IslandInfoModal from "@/components/IslandInfoModal";
import ParticipantPanel from "@/components/ParticipantsPanel";
import PlayerInfoModal from "@/components/PlayerInfoModal";
import SettingsModal from "@/components/SettingsModal";
import UpdateNoteModal from "@/components/UpdateNoteModal";
import { UserInfo } from "@/types/socket-io/response";

interface CommonIslandModalsProps {
  playerInfo: UserInfo;
  isVisibleChat: boolean;
  isFriendModalOpen: boolean;
  isIslandInfoModalOpen: boolean;
  isPlayerModalOpen: boolean;
  isSettingsModalOpen: boolean;
  isDevModalOpen: boolean;
  isUpdateModalOpen: boolean;
  onFriendClose: () => void;
  onIslandInfoModalClose: () => void;
  onPlayerModalClose: () => void;
  onSettingsModalClose: () => void;
  onDevClose: () => void;
  onUpdateClose: () => void;
}

const CommonIslandModals = ({
  playerInfo,
  isVisibleChat,
  isFriendModalOpen,
  isIslandInfoModalOpen,
  isPlayerModalOpen,
  isSettingsModalOpen,
  isDevModalOpen,
  isUpdateModalOpen,
  onFriendClose,
  onIslandInfoModalClose,
  onPlayerModalClose,
  onSettingsModalClose,
  onDevClose,
  onUpdateClose,
}: CommonIslandModalsProps) => {
  return (
    <>
      {isFriendModalOpen ? <FriendModal onClose={onFriendClose} /> : null}
      <IslandInfoModal
        isOpen={isIslandInfoModalOpen}
        onClose={onIslandInfoModalClose}
      />
      {isPlayerModalOpen ? (
        <PlayerInfoModal onClose={onPlayerModalClose} playerInfo={playerInfo} />
      ) : null}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={onSettingsModalClose}
      />
      {isVisibleChat ? <ChatPanel /> : null}
      {isVisibleChat ? <ParticipantPanel /> : null}
      {<ControlGuide />}
      {isDevModalOpen ? (
        <HelpModal isOpen={isDevModalOpen} onClose={onDevClose} />
      ) : null}
      {isUpdateModalOpen ? (
        <UpdateNoteModal isOpen={isUpdateModalOpen} onClose={onUpdateClose} />
      ) : null}
    </>
  );
};

export default CommonIslandModals;
