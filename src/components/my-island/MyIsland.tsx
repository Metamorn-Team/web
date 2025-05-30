"use client";

import React from "react";
import { FaPalette, FaTag } from "react-icons/fa";
import { GiSparkles } from "react-icons/gi";
import { BsChatSquareQuote } from "react-icons/bs";
import RetroButton from "@/components/common/RetroButton";
import { useModal } from "@/hook/useModal";
import OutfitChangeModal from "@/components/my-island/OutfiltChangeModal";
import AuraEquipModal from "@/components/my-island/AuraEquipModal";

export default function MyIsland() {
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
      <RetroButton onClick={() => {}} className={buttonStyle}>
        <BsChatSquareQuote className="mr-1" />
        <p>말풍선</p>
      </RetroButton>
      <RetroButton
        onClick={() => console.log("태그 변경")}
        className={buttonStyle}
      >
        <FaTag className="mr-1" />
        <p>태그 변경</p>
      </RetroButton>

      {isOutfitOpen ? (
        <OutfitChangeModal isOpen={isOutfitOpen} onClose={onOutfitClose} />
      ) : null}

      {isAuraOpen ? (
        <AuraEquipModal isOpen={isAuraOpen} onClose={onAuraClose} />
      ) : null}
    </div>
  );
}

const buttonStyle = "flex items-center gap-1";
