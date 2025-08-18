import React from "react";
import { BsMusicNoteBeamed } from "react-icons/bs";
import RetroHeaderButton from "@/components/common/header/RetroHeaderButton";

export default function BgmToggleButton({
  isPlayBgm,
  onClick,
}: {
  isPlayBgm: boolean;
  onClick: () => void;
}) {
  return (
    <RetroHeaderButton
      icon={
        isPlayBgm ? (
          <BsMusicNoteBeamed size={20} />
        ) : (
          <BsMusicNoteBeamed size={20} className="opacity-40" />
        )
      }
      label="BGM"
      onClick={onClick}
    />
  );
}
