"use client";

import classNames from "classnames";
import { ReactNode } from "react";

interface RetroSideModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  position?: "right" | "left" | "bottom"; // 확장 가능
}

export default function RetroSideModal({
  isOpen,
  onClose,
  children,
  className,
  position = "right",
}: RetroSideModalProps) {
  if (!isOpen) return null;

  const positionClasses = {
    right: "top-16 sm:top-20 right-0 sm:right-4",
    left: "top-20 sm:top-24 left-0 sm:left-4",
    bottom: "bottom-4 right-4",
  };

  return (
    <div
      className={classNames("fixed z-50", positionClasses[position], className)}
    >
      <div
        className={classNames(
          `
    bg-[#fdf8ef] border border-[#bfae96]
    shadow-[6px_6px_0_#8c7a5c]
    rounded-[12px] w-full sm:w-auto max-w-[90vw] sm:max-w-[500px] max-h-[90vh]
    overflow-y-auto animate-fadeIn duration-200 relative
  `
        )}
      >
        <button
          className="absolute top-2 right-2 text-[#8c7a5c] font-bold text-lg"
          onClick={onClose}
        >
          ×
        </button>

        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
