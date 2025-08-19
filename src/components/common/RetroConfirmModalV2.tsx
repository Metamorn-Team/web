"use client";

import RetroButton from "@/components/common/RetroButton";
import RetroModal from "@/components/common/RetroModal";
import React from "react";

interface RetroConfirmModalV2Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  modalClassName?: string;
}

const RetroConfirmModalV2 = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "네",
  cancelText = "아니요",
  modalClassName,
}: RetroConfirmModalV2Props) => {
  if (!isOpen) return null;

  return (
    <RetroModal isOpen={isOpen} onClose={onClose} className={modalClassName}>
      <div className="flex flex-col items-center gap-2 p-4 min-w-[220px]">
        <div className="text-3xl mb-1 select-none">🏝️</div>
        <h3 className="text-lg font-extrabold text-center mb-2 drop-shadow">
          {title}
        </h3>
        <div className="mb-2 text-center text-sm text-[#6d4c41] w-full max-h-[180px] overflow-y-auto">
          {children}
        </div>
        <div className="flex justify-center gap-3 mt-2 w-full">
          <RetroButton variant="ghost" onClick={onClose}>
            {cancelText}
          </RetroButton>
          <RetroButton variant="primary" onClick={onConfirm}>
            {confirmText}
          </RetroButton>
        </div>
      </div>
    </RetroModal>
  );
};

export default RetroConfirmModalV2;
