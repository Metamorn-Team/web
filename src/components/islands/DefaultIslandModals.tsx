import React from "react";
import GoblinTorch from "@/components/common/GoblinTorch";
import TalkModal from "@/components/common/TalkModal";
import IslandListModal from "@/components/islands/IslandListModal";
import LoginModal from "@/components/login/LoginModal";
import { 지친_토치_고블린 } from "@/constants/game/talk-scripts";
import { EventWrapper } from "@/game/event/EventBus";

interface DefaultIslandModalsProps {
  isHelpModalOpen: boolean;
  isLoginModalOpen: boolean;
  isIslandListModalOpen: boolean;

  onHelpClose: () => void;
  onLoginModalClose: () => void;
  onIslandListModalClose: () => void;
}

const DefaultIslandModals = ({
  isHelpModalOpen,
  isLoginModalOpen,
  isIslandListModalOpen,

  onHelpClose,
  onLoginModalClose,
  onIslandListModalClose,
}: DefaultIslandModalsProps) => {
  return (
    <>
      {isHelpModalOpen ? (
        <TalkModal
          onClose={onHelpClose}
          avatar={<GoblinTorch />}
          name="토치 고블린"
          comments={지친_토치_고블린}
        />
      ) : null}
      <LoginModal isOpen={isLoginModalOpen} onClose={onLoginModalClose} />
      {isIslandListModalOpen ? (
        <IslandListModal
          isOpen={isIslandListModalOpen}
          onClose={onIslandListModalClose}
          onSelectIsland={() => {}}
          onCreateIsland={() => {}}
          onJoinRandomIsland={() => {
            EventWrapper.emitToGame("joinDesertedIsland");
            onIslandListModalClose();
          }}
        />
      ) : null}
    </>
  );
};

export default DefaultIslandModals;
