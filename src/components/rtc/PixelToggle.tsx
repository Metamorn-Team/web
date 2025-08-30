"use client";

import React from "react";
import classNames from "classnames";

interface PixelToggleProps {
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export default function PixelToggle({
  active,
  onClick,
  children,
  className,
}: PixelToggleProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "px-3 py-2 border rounded-[8px] text-xs font-bold transition-colors shadow-[3px_3px_0_#8c7a5c]",
        active
          ? "bg-[#b7e4c7] border-[#7ec8a0] text-[#1b5e20] hover:bg-[#a1dbb9]"
          : "bg-[#f5f1e6] border-[#bfae96] text-[#3d2c1b] hover:bg-[#efe6d6]",
        className
      )}
      type="button"
    >
      {children}
    </button>
  );
}





