"use client";

import { useEffect } from "react";

interface RetroModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const RetroModal = ({ isOpen, onClose, children }: RetroModalProps) => {
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
        className="bg-[#fdf8ef] border border-[#bfae96] shadow-[6px_6px_0_#8c7a5c] rounded-[8px] w-[90%] h-auto sm:w-[500px] animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden max-h-[80%] p-6">{children}</div>
      </div>
    </div>
  );
};

export default RetroModal;
