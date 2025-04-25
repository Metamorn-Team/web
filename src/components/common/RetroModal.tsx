"use client";

import { useEffect } from "react";
import RetroButton from "@/components/common/RetroButton";

interface RetroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
}

const RetroModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "확인",
  cancelText = "취소",
}: RetroModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={handleModalClick}
    >
      <div
        className="bg-[#f9f5ec] p-6 rounded-lg w-[90%] sm:w-[500px] shadow-lg animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-[#2a1f14] mb-4">{title}</h3>

        <div className="mb-4 overflow-y-auto max-h-[400px]">{children}</div>

        <div className="flex justify-end gap-4">
          <RetroButton variant="ghost" onClick={onClose} className="w-28">
            {cancelText}
          </RetroButton>
          <RetroButton variant="primary" onClick={onConfirm} className="w-28">
            {confirmText}
          </RetroButton>
        </div>
      </div>
    </div>
  );
};

export default RetroModal;
