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
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4"
      onClick={handleModalClick}
    >
      <div
        className={classNames(
          "bg-[#fdf8ef] border border-[#bfae96] shadow-[6px_6px_0_#8c7a5c] rounded-[8px] w-full max-w-[500px] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] xl:max-w-[900px] h-auto animate-fadeIn duration-200",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden w-full max-h-[90vh] p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default RetroModal;
