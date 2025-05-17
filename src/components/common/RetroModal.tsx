"use client";

import classNames from "classnames";
import { useEffect } from "react";

interface RetroModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const RetroModal = ({
  isOpen,
  onClose,
  children,
  className,
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
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center sm:p-4 p-0"
      onClick={handleModalClick}
    >
      <div
        className={classNames(
          `
          bg-[#fdf8ef] border border-[#bfae96]
          shadow-[6px_6px_0_#8c7a5c] 
          rounded-none sm:rounded-[8px]
          w-full h-auto
          max-w-full sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px]
          animate-fadeIn duration-200 relative
          overflow-y-auto
        `,
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모바일 전용 닫기 버튼 */}
        <button
          className="absolute top-3 right-3 text-[#8c7a5c] font-bold text-xl sm:hidden"
          onClick={onClose}
        >
          ×
        </button>

        <div className="w-full p-6">{children}</div>
      </div>
    </div>
  );
};

export default RetroModal;
