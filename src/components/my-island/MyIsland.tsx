"use client";

import React, { useEffect } from "react";
import { FaPalette, FaTag, FaUserEdit } from "react-icons/fa";
import { GiSparkles } from "react-icons/gi";
import { BsChatSquareQuote } from "react-icons/bs";
import RetroButton from "@/components/common/RetroButton";
import { useModal } from "@/hook/useModal";
import OutfitChangeModal from "@/components/my-island/OutfiltChangeModal";
import AuraEquipModal from "@/components/my-island/AuraEquipModal";
import TagChangeModal from "@/components/my-island/TagChangeModal";
import { useGetMyProfile } from "@/hook/queries/useGetMyProfile";
import { EventWrapper } from "@/game/event/EventBus";
import NicknameChangeModal from "@/components/my-island/NicknameChangeModal";
import SpeechBubbleEquipModal from "@/components/my-island/SpeechBubbleEquipModal";

export default function MyIsland() {
  const { data: profile } = useGetMyProfile();
  const {
    isModalOpen: isOutfitOpen,
    onOpen: onOutfitOpen,
    onClose: onOutfitClose,
  } = useModal();
  const {
    isModalOpen: isAuraOpen,
    onOpen: onAuraOpen,
    onClose: onAuraClose,
  } = useModal();
  const {
    isModalOpen: isSpeechBubbleOpen,
    onOpen: onSpeechBubbleOpen,
    onClose: onSpeechBubbleClose,
  } = useModal();
  const {
    isModalOpen: isTagOpen,
    onOpen: onTagOpen,
    onClose: onTagClose,
  } = useModal();
  const {
    isModalOpen: isNicknameOpen,
    onOpen: onNicknameOpen,
    onClose: onNicknameClose,
  } = useModal();

  useEffect(() => {
    if (isOutfitOpen || isTagOpen || isNicknameOpen) {
      EventWrapper.emitToGame("disableGameInput");
    } else {
      EventWrapper.emitToGame("enableGameKeyboardInput");
    }
  }, [isOutfitOpen, isTagOpen, isNicknameOpen]);

  return (
    <div className="absolute top-20 sm:top-24 right-2 sm:right-6 flex flex-col items-end space-y-2">
      <RetroButton onClick={() => onOutfitOpen()} className={buttonStyle}>
        <FaPalette className="mr-1" />
        <p>옷</p>
      </RetroButton>
      <RetroButton onClick={() => onAuraOpen()} className={buttonStyle}>
        <GiSparkles />
        <p>오라</p>
      </RetroButton>
      <RetroButton onClick={() => onSpeechBubbleOpen()} className={buttonStyle}>
        <BsChatSquareQuote className="mr-1" />
        <p>말풍선</p>
      </RetroButton>
      <RetroButton onClick={() => onTagOpen()} className={buttonStyle}>
        <FaTag className="mr-1" />
        <p>태그 변경</p>
      </RetroButton>
      <RetroButton onClick={() => onNicknameOpen()} className={buttonStyle}>
        <FaUserEdit className="mr-1" />
        <p>닉네임 변경</p>
      </RetroButton>

      {isOutfitOpen ? (
        <OutfitChangeModal isOpen={isOutfitOpen} onClose={onOutfitClose} />
      ) : null}

      {isAuraOpen ? (
        <AuraEquipModal isOpen={isAuraOpen} onClose={onAuraClose} />
      ) : null}

      {isSpeechBubbleOpen ? (
        <SpeechBubbleEquipModal
          isOpen={isSpeechBubbleOpen}
          onClose={onSpeechBubbleClose}
        />
      ) : null}

      {isTagOpen ? (
        <TagChangeModal
          isOpen={isTagOpen}
          onClose={onTagClose}
          currentTag={profile?.tag || ""}
        />
      ) : null}

      {isNicknameOpen ? (
        <NicknameChangeModal
          isOpen={isNicknameOpen}
          onClose={onNicknameClose}
          currentNickname={profile?.nickname || ""}
        />
      ) : null}
    </div>
  );
}

const buttonStyle = "flex items-center gap-1";
