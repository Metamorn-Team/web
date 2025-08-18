import React from "react";
import { FiMenu } from "react-icons/fi";
import RetroHeaderButton from "@/components/common/header/RetroHeaderButton";

export default function MenuButton({ onClick }: { onClick: () => void }) {
  return (
    <RetroHeaderButton
      icon={<FiMenu size={20} />}
      label="메뉴"
      onClick={onClick}
    />
  );
}
