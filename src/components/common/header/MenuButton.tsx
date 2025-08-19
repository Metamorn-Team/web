import React from "react";
import { FiMenu } from "react-icons/fi";
import RetroHeaderButton from "@/components/common/header/RetroHeaderButton";

export default function MenuButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <RetroHeaderButton
      icon={<FiMenu size={20} />}
      label={label}
      onClick={onClick}
    />
  );
}
