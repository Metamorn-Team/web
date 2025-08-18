import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import RetroHeaderButton from "@/components/common/header/RetroHeaderButton";

export default function StoreButton() {
  const onClickStore = () => {
    window.open("/store", "_blank");
  };
  return (
    <RetroHeaderButton
      icon={<FiShoppingBag size={20} />}
      label="상점"
      onClick={onClickStore}
    />
  );
}
