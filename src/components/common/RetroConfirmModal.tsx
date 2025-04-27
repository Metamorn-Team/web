"use client";

import RetroButton from "@/components/common/RetroButton";
import RetroModal from "@/components/common/RetroModal";

interface RetroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
}

const RetroConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "확인",
  cancelText = "취소",
}: RetroModalProps) => {
  if (!isOpen) return null;

  return (
    <RetroModal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-bold text-[#2a1f14] mb-4">{title}</h3>

      <div className="mb-4 overflow-y-auto max-h-[400px]">{children}</div>

      <div className="flex justify-end gap-4 mt-4">
        <RetroButton variant="ghost" onClick={onClose} className="w-28">
          {cancelText}
        </RetroButton>
        <RetroButton variant="primary" onClick={onConfirm} className="w-28">
          {confirmText}
        </RetroButton>
      </div>
    </RetroModal>
  );
};

export default RetroConfirmModal;
